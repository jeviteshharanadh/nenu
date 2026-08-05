import { GoogleGenAI } from "@google/genai";
import { config } from "../config/env";

if (!config.geminiApiKey) {
  console.warn("⚠️ Warning: GEMINI_API_KEY is missing in environment variables. Live AI generation will use fallback responses unless configured.");
}

export const genai = new GoogleGenAI({
  apiKey: config.geminiApiKey || "DUMMY_KEY_FOR_INITIALIZATION",
});

export const ADVISORY_MODEL = "gemini-2.5-flash";
