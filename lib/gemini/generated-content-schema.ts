import { z } from "zod";

/**
 * What Gemini generates per submission: pure narrative text, grounded in
 * the real, already-computed numbers (see lib/gemini/prompt.ts). Gemini
 * never invents hours, percentages, or totals — every number in the report
 * still comes from lib/calculations.ts, so the math is always guaranteed
 * to add up regardless of what the model returns here.
 *
 * IMPORTANT: this Zod schema and GENERATED_CONTENT_GEMINI_SCHEMA below must
 * describe the same shape. Zod validates what comes back from Gemini; the
 * Gemini schema is what we ask the model to produce. Update both together.
 */

const LOSS_ITEM_IDS = ["unsuitable-technical", "leadership-too-early", "stage-count", "offer-fallout"] as const;

export const GeneratedLossItemSchema = z.object({
  id: z.enum(LOSS_ITEM_IDS),
  title: z.string().min(1).max(80),
  recommendation: z.string().min(1).max(220),
});

export const GeneratedReportContentSchema = z.object({
  executiveSummary: z.string().min(1).max(420),
  lossItems: z.array(GeneratedLossItemSchema).length(4),
});

export type GeneratedReportContent = z.infer<typeof GeneratedReportContentSchema>;
export type GeneratedLossItem = z.infer<typeof GeneratedLossItemSchema>;

// ---------------------------------------------------------------------------
// Gemini structured-output schema (Gemini API "Schema" object — an
// OpenAPI 3.0 subset with UPPERCASE type names, no $ref/definitions support).
// Hand-mirrored from the Zod schema above.
// ---------------------------------------------------------------------------

export const GENERATED_CONTENT_GEMINI_SCHEMA = {
  type: "OBJECT",
  properties: {
    executiveSummary: { type: "STRING" },
    lossItems: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          id: { type: "STRING", enum: [...LOSS_ITEM_IDS] },
          title: { type: "STRING" },
          recommendation: { type: "STRING" },
        },
        required: ["id", "title", "recommendation"],
      },
    },
  },
  required: ["executiveSummary", "lossItems"],
} as const;
