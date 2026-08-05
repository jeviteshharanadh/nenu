import { z } from "zod";

export const advisoryDomainEnum = z.enum([
  "crop_selection",
  "disease_pest_diagnosis",
  "fertilizer_nutrition",
  "irrigation_water_management",
  "soil_health",
  "weather_risk_advisory",
  "market_post_harvest",
]);

export type AdvisoryDomain = z.infer<typeof advisoryDomainEnum>;

export const urgencyLevelEnum = z.enum(["low", "medium", "high"]);
export const growthStageEnum = z.enum(["seedling", "vegetative", "flowering", "fruiting", "maturity"]);
export const irrigationMethodEnum = z.enum(["drip", "sprinkler", "flood", "rainfed", "manual"]);
export const userRoleEnum = z.enum(["farmer", "admin"]);

// Profile Schemas
export const profileSchema = z.object({
  full_name: z.string().min(1, "Full name is required").max(120),
  phone: z.string().optional().nullable(),
  preferred_language: z.string().default("en"),
  default_region: z.string().optional().nullable(),
});

export const updateProfileSchema = profileSchema.partial();

// Farm Schemas
export const farmSchema = z.object({
  name: z.string().min(1, "Farm name is required").max(120),
  region: z.string().min(1, "Region is required").max(120),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  area_acres: z.number().positive("Area must be greater than 0"),
  soil_type: z.string().min(1, "Soil type is required"),
  irrigation_source: z.string().optional().nullable(),
  primary_crops: z.array(z.string()).max(20).default([]),
});

export const updateFarmSchema = farmSchema.partial();

// Advisory Request Schema
export const createAdvisoryRequestSchema = z.object({
  farm_id: z.string().uuid("Invalid farm ID"),
  advisory_domain: advisoryDomainEnum,
  title: z.string().min(1, "Title is required").max(120),
  description: z.string().min(20, "Description must be at least 20 characters").max(2000),
  urgency: urgencyLevelEnum.default("medium"),
  crop_type: z.string().optional().nullable(),
  growth_stage: growthStageEnum.optional().nullable(),
  target_season: z.enum(["kharif", "rabi", "zaid", "year-round"]).optional().nullable(),
  available_water_source: z.string().optional().nullable(),
  symptoms_observed: z.array(z.string()).max(15).optional().nullable(),
  first_noticed_days_ago: z.number().int().min(0).max(3650).optional().nullable(),
  last_fertilizer_applied: z.string().optional().nullable(),
  last_applied_days_ago: z.number().int().min(0).max(3650).optional().nullable(),
  current_irrigation_method: irrigationMethodEnum.optional().nullable(),
  soil_test_available: z.boolean().optional().nullable(),
  soil_ph: z.number().min(0).max(14).optional().nullable(),
  visible_soil_issues: z.array(z.string()).max(15).optional().nullable(),
  expected_harvest_date: z.string().optional().nullable(),
  quantity_estimate_kg: z.number().positive().optional().nullable(),
});

// Market Price Schema
export const marketPriceSchema = z.object({
  crop_name: z.string().min(1, "Crop name is required"),
  region: z.string().min(1, "Region is required"),
  price_per_kg: z.number().nonnegative("Price must be 0 or positive"),
  unit: z.string().default("kg"),
  recorded_date: z.string().optional(),
});

// =========================================================
// AI OUTPUT ZOD SCHEMAS (DOMAINS 1 - 7)
// =========================================================

// 1. Disease & Pest Diagnosis
export const diseasePestDiagnosisSchema = z.object({
  likely_issue: z.string(),
  confidence: z.enum(["low", "medium", "high"]),
  severity: z.enum(["mild", "moderate", "severe"]),
  explanation: z.string(),
  treatment_steps: z.array(
    z.object({
      step: z.number().int(),
      action: z.string(),
      timeframe: z.string(),
    })
  ),
  prevention_tips: z.array(z.string()),
  additional_info_needed: z.array(z.string()),
});

// 2. Crop Selection
export const cropSelectionSchema = z.object({
  recommended_crops: z.array(
    z.object({
      crop_name: z.string(),
      suitability_score: z.number().int(),
      notes: z.string(),
    })
  ),
  reasoning: z.string(),
  risks: z.array(z.string()),
  additional_info_needed: z.array(z.string()),
});

// 3. Fertilizer & Nutrition
export const fertilizerAdvisorySchema = z.object({
  diagnosis: z.string(),
  fertilizer_plan: z.array(
    z.object({
      product_type: z.string(),
      dosage: z.string(),
      application_method: z.string(),
      timing: z.string(),
    })
  ),
  safety_notes: z.array(z.string()),
  additional_info_needed: z.array(z.string()),
});

// 4. Irrigation & Water Management
export const irrigationAdvisorySchema = z.object({
  recommended_schedule: z.array(
    z.object({
      frequency: z.string(),
      duration_minutes: z.number().int(),
      notes: z.string(),
    })
  ),
  recommended_method: z.string(),
  reasoning: z.string(),
  risk_flags: z.array(z.string()),
});

// 5. Soil Health
export const soilHealthAdvisorySchema = z.object({
  assessment: z.string(),
  improvement_plan: z.array(
    z.object({
      action: z.string(),
      timeframe: z.string(),
    })
  ),
  recommended_tests: z.array(z.string()),
  additional_info_needed: z.array(z.string()),
});

// 6. Weather Risk Advisory
export const weatherRiskAdvisorySchema = z.object({
  risk_summary: z.string(),
  risk_level: z.enum(["low", "medium", "high"]),
  protective_actions: z.array(z.string()),
  monitoring_window: z.string(),
});

// 7. Market & Post-Harvest
export const marketAdvisorySchema = z.object({
  sell_or_hold_recommendation: z.enum(["sell_now", "hold", "sell_partial"]),
  reasoning: z.string(),
  storage_tips: z.array(z.string()),
  estimated_revenue_range: z.object({
    low: z.number(),
    high: z.number(),
    currency: z.string(),
  }),
});
