import { Router, Request, Response } from "express";
import multer from "multer";
import { requireAuth } from "../middleware/requireAuth";
import { advisoryRateLimiter } from "../middleware/rateLimiter";
import { createAdvisoryRequestSchema } from "../schemas/advisory.schema";
import { supabaseAdmin } from "../db/supabase";
import { uploadAdvisoryImage } from "../services/storageService";
import { processAdvisoryRequest } from "../services/advisoryPipeline";

const router = Router();

// Multer memory storage configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max per file
    files: 3,                  // max 3 files
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid image format. Allowed formats: JPEG, PNG, WEBP."));
    }
  },
});

// POST /api/advisory-requests - Create request + trigger AI pipeline
router.post(
  "/",
  requireAuth,
  advisoryRateLimiter,
  upload.array("images", 3),
  async (req: Request, res: Response) => {
    try {
      const farmerId = req.user!.id;

      // Parse JSON fields from body (body might contain strings if sent as multipart form-data)
      const rawBody = { ...req.body };
      
      // Parse arrays/numbers from string if needed
      if (typeof rawBody.symptoms_observed === "string") {
        try { rawBody.symptoms_observed = JSON.parse(rawBody.symptoms_observed); } catch { rawBody.symptoms_observed = [rawBody.symptoms_observed]; }
      }
      if (typeof rawBody.visible_soil_issues === "string") {
        try { rawBody.visible_soil_issues = JSON.parse(rawBody.visible_soil_issues); } catch { rawBody.visible_soil_issues = [rawBody.visible_soil_issues]; }
      }
      if (typeof rawBody.soil_test_available === "string") {
        rawBody.soil_test_available = rawBody.soil_test_available === "true";
      }
      if (rawBody.first_noticed_days_ago) rawBody.first_noticed_days_ago = Number(rawBody.first_noticed_days_ago);
      if (rawBody.last_applied_days_ago) rawBody.last_applied_days_ago = Number(rawBody.last_applied_days_ago);
      if (rawBody.soil_ph) rawBody.soil_ph = Number(rawBody.soil_ph);
      if (rawBody.quantity_estimate_kg) rawBody.quantity_estimate_kg = Number(rawBody.quantity_estimate_kg);

      const validatedData = createAdvisoryRequestSchema.parse(rawBody);

      // Verify that the specified farm belongs to the farmer
      const { data: farm, error: farmErr } = await supabaseAdmin
        .from("farms")
        .select("id")
        .eq("id", validatedData.farm_id)
        .eq("owner_id", farmerId)
        .single();

      if (farmErr || !farm) {
        return res.status(403).json({ error: "Specified farm does not exist or does not belong to you." });
      }

      // Insert advisory_requests row
      const { data: newRequest, error: reqErr } = await supabaseAdmin
        .from("advisory_requests")
        .insert({
          farmer_id: farmerId,
          ...validatedData,
          status: "pending",
        })
        .select()
        .single();

      if (reqErr || !newRequest) {
        return res.status(500).json({ error: `Failed to create advisory request: ${reqErr?.message}` });
      }

      // Process image uploads if attached
      const files = (req.files as Express.Multer.File[]) || [];
      const uploadedImageRecords = [];

      for (const file of files) {
        const { storagePath, mimeType } = await uploadAdvisoryImage(
          newRequest.id,
          file.buffer,
          file.originalname,
          file.mimetype
        );

        const { data: imgRecord } = await supabaseAdmin
          .from("advisory_request_images")
          .insert({
            request_id: newRequest.id,
            storage_path: storagePath,
            mime_type: mimeType,
          })
          .select()
          .single();

        if (imgRecord) uploadedImageRecords.push(imgRecord);
      }

      // Trigger AI generation pipeline asynchronously in background
      processAdvisoryRequest(newRequest.id).catch((err) => {
        console.error(`Background AI processing error for request ${newRequest.id}:`, err);
      });

      return res.status(201).json({
        message: "Advisory request created successfully. AI generation processing.",
        request: newRequest,
        imagesCount: uploadedImageRecords.length,
      });
    } catch (err: any) {
      if (err.name === "ZodError") {
        return res.status(400).json({ error: "Validation failed", details: err.errors });
      }
      return res.status(500).json({ error: err.message || "Failed to submit advisory request" });
    }
  }
);

// GET /api/advisory-requests - List farmer's requests with optional filters
router.get("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const farmerId = req.user!.id;
    const { farmId, domain, status } = req.query;

    let query = supabaseAdmin
      .from("advisory_requests")
      .select("*, farm:farms(name, region), report:advisory_reports(summary, generated_at)")
      .eq("farmer_id", farmerId)
      .order("created_at", { ascending: false });

    if (farmId) query = query.eq("farm_id", farmId as string);
    if (domain) query = query.eq("advisory_domain", domain as string);
    if (status) query = query.eq("status", status as string);

    const { data: requests, error } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ requests: requests || [] });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to fetch advisory requests" });
  }
});

// GET /api/advisory-requests/:id - Get single request + details + report
router.get("/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const farmerId = req.user!.id;
    const { id } = req.params;

    const { data: request, error } = await supabaseAdmin
      .from("advisory_requests")
      .select("*, farm:farms(*), images:advisory_request_images(*), report:advisory_reports(*)")
      .eq("id", id)
      .eq("farmer_id", farmerId)
      .single();

    if (error || !request) {
      return res.status(404).json({ error: "Advisory request not found or access denied" });
    }

    return res.json({ request });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to fetch advisory request" });
  }
});

// POST /api/advisory-requests/:id/retry - Retry AI pipeline on failed request
router.post("/:id/retry", requireAuth, advisoryRateLimiter, async (req: Request, res: Response) => {
  try {
    const farmerId = req.user!.id;
    const { id } = req.params;

    const { data: request, error } = await supabaseAdmin
      .from("advisory_requests")
      .select("id, status")
      .eq("id", id)
      .eq("farmer_id", farmerId)
      .single();

    if (error || !request) {
      return res.status(404).json({ error: "Advisory request not found" });
    }

    if (request.status === "completed") {
      return res.status(400).json({ error: "Request is already completed" });
    }

    // Reset status to pending
    await supabaseAdmin
      .from("advisory_requests")
      .update({ status: "pending", failure_reason: null })
      .eq("id", id);

    // Trigger AI pipeline in background
    processAdvisoryRequest(id).catch((err) => {
      console.error(`Retry AI processing error for request ${id}:`, err);
    });

    return res.json({ message: "Advisory retry triggered successfully" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to retry advisory request" });
  }
});

export default router;
