import { supabaseAdmin } from "../db/supabase";

export async function uploadAdvisoryImage(
  requestId: string,
  fileBuffer: Buffer,
  originalName: string,
  mimeType: string
): Promise<{ storagePath: string; mimeType: string }> {
  try {
    const fileExt = originalName.split(".").pop() || "jpg";
    const fileName = `${requestId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const bucketName = "advisory-images";

    const { data, error } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(fileName, fileBuffer, {
        contentType: mimeType,
        upsert: true,
      });

    if (error) {
      console.warn("Storage upload warning (bucket may need creation in Supabase):", error.message);
      // Fallback path if storage bucket isn't initialized yet
      return {
        storagePath: `local-uploads/${fileName}`,
        mimeType,
      };
    }

    return {
      storagePath: data.path,
      mimeType,
    };
  } catch (err) {
    console.error("Storage service upload error:", err);
    return {
      storagePath: `local-uploads/${requestId}-${Date.now()}.jpg`,
      mimeType,
    };
  }
}

export function getPublicImageUrl(storagePath: string): string {
  if (storagePath.startsWith("local-uploads/")) {
    return "";
  }
  const { data } = supabaseAdmin.storage.from("advisory-images").getPublicUrl(storagePath);
  return data.publicUrl;
}
