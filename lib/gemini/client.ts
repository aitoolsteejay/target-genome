import { GoogleGenAI } from "@google/genai";
import type { CalculatorInput, LossItem, TimeCategory } from "@/lib/types";
import { buildPrompt } from "./prompt";
import {
  GENERATED_CONTENT_GEMINI_SCHEMA,
  GeneratedReportContentSchema,
  type GeneratedReportContent,
} from "./generated-content-schema";

/**
 * "gemini-flash-latest" is a Google-maintained alias that always points at
 * the current recommended Flash model, so this default doesn't go stale the
 * way a pinned version (e.g. "gemini-2.5-flash") eventually does. Override
 * with GEMINI_MODEL if you want to pin a specific version.
 */
const DEFAULT_MODEL = "gemini-flash-latest";

export class GeminiGenerationError extends Error {}

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

/**
 * Calls Gemini to write the executive summary and the four loss-item
 * titles/recommendations, grounded in numbers that are already computed by
 * lib/calculations.ts. Validates the response with Zod and retries once
 * (with a stricter reminder) on a schema mismatch. Throws
 * GeminiGenerationError if the key is missing or both attempts fail, the
 * caller (the /api/generate-report route) falls back to the deterministic
 * template text in that case.
 */
export async function generateReportNarrativeWithGemini(
  input: CalculatorInput,
  totalHours: number,
  categories: TimeCategory[],
  lossItems: LossItem[]
): Promise<GeneratedReportContent> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new GeminiGenerationError("GEMINI_API_KEY is not configured");
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const basePrompt = buildPrompt(input, totalHours, categories, lossItems);

  let lastError: unknown = null;

  for (let attempt = 0; attempt < 2; attempt++) {
    const prompt =
      attempt === 0
        ? basePrompt
        : `${basePrompt}\n\nYour previous response did not exactly match the required schema (missing a loss item id, wrong field name, or invalid JSON). Return all 4 loss item ids exactly as listed, and valid JSON only.`;

    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: GENERATED_CONTENT_GEMINI_SCHEMA,
          temperature: 0.8,
          maxOutputTokens: 2048,
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
    `Gemini narrative generation failed after retries: ${
      lastError instanceof Error ? lastError.message : String(lastError)
    }`
  );
}
