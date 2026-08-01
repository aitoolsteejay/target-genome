import { GoogleGenAI } from "@google/genai";
import type { SearchBrief } from "@/lib/types";
import { buildPrompt } from "./prompt";
import {
  GENERATED_CONTENT_GEMINI_SCHEMA,
  GeneratedReportContentSchema,
  type GeneratedReportContent,
} from "./generated-content-schema";

const DEFAULT_MODEL = "gemini-2.5-flash";

export class GeminiGenerationError extends Error {}

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

/**
 * Calls Gemini to generate the full analytical content for a Talent Genome
 * report, validates the response against GeneratedReportContentSchema, and
 * retries once (with a stricter reminder) if validation fails. Throws
 * GeminiGenerationError if the key is missing or both attempts fail — the
 * caller (the /api/generate-report route) is expected to fall back to the
 * heuristic sample-matching generator in that case.
 */
export async function generateReportContentWithGemini(
  brief: SearchBrief
): Promise<GeneratedReportContent> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new GeminiGenerationError("GEMINI_API_KEY is not configured");
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const basePrompt = buildPrompt(brief);

  let lastError: unknown = null;

  for (let attempt = 0; attempt < 2; attempt++) {
    const prompt =
      attempt === 0
        ? basePrompt
        : `${basePrompt}\n\nYour previous response did not exactly match the required schema (wrong array length, missing required field, or an enum value outside the allowed set). Re-read the numeric consistency rules and the schema, and return a fully compliant JSON object this time.`;

    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: GENERATED_CONTENT_GEMINI_SCHEMA,
          temperature: 0.85,
          maxOutputTokens: 8192,
        },
      });

      const text = response.text;
      if (!text) {
        lastError = new Error("Empty response from Gemini");
        continue;
      }

      const parsedJson = JSON.parse(text);
      const validated = GeneratedReportContentSchema.safeParse(parsedJson);

      if (!validated.success) {
        lastError = validated.error;
        continue;
      }

      return validated.data;
    } catch (err) {
      lastError = err;
    }
  }

  throw new GeminiGenerationError(
    `Gemini report generation failed after retries: ${
      lastError instanceof Error ? lastError.message : String(lastError)
    }`
  );
}
