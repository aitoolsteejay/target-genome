import { Field, FieldGrid } from "@/components/calculator/field";
import { Input } from "@/components/ui/input";
import type { CalculatorInput } from "@/lib/types";

type ProcessKeys =
  | "resumesReviewedByManager"
  | "recruiterScreens"
  | "technicalInterviews"
  | "hiringManagerInterviews"
  | "leadershipInterviews"
  | "finalInterviews"
  | "offers"
  | "joins";

interface ProcessStepProps {
  input: CalculatorInput;
  onChange: (patch: Partial<CalculatorInput>) => void;
}

const FIELDS: { key: ProcessKeys; label: string; tooltip: string }[] = [
  {
    key: "resumesReviewedByManager",
    label: "Resumes the Hiring Manager personally reviews",
    tooltip: "How many resumes the Hiring Manager themselves reads before anyone gets a screening call. Not resumes a recruiter filters out earlier.",
  },
  {
    key: "recruiterScreens",
    label: "Recruiter screens",
    tooltip: "How many candidates a recruiter has a short call with, before any technical or Hiring Manager interview.",
  },
  {
    key: "technicalInterviews",
    label: "Technical interviews",
    tooltip: "How many candidates go through at least one technical interview round.",
  },
  {
    key: "hiringManagerInterviews",
    label: "Hiring Manager interviews",
    tooltip: "How many candidates are interviewed directly by the Hiring Manager.",
  },
  {
    key: "leadershipInterviews",
    label: "Leadership interviews",
    tooltip: "How many candidates are interviewed by someone above the Hiring Manager, such as a Director, VP, or CTO.",
  },
  {
    key: "finalInterviews",
    label: "Final interviews",
    tooltip: "How many candidates reach a final round, such as a panel or culture-fit interview, after the earlier stages.",
  },
  {
    key: "offers",
    label: "Offers made",
    tooltip: "How many candidates were actually sent an offer letter.",
  },
  {
    key: "joins",
    label: "Candidates who joined",
    tooltip: "How many of those offers turned into an accepted offer and an actual joiner.",
  },
];

export function ProcessStep({ input, onChange }: ProcessStepProps) {
  return (
    <FieldGrid>
      {FIELDS.map((field) => (
        <Field key={field.key} label={field.label} htmlFor={field.key} tooltip={field.tooltip}>
          <Input
            id={field.key}
            type="number"
            min={0}
            value={input[field.key]}
            onChange={(e) => onChange({ [field.key]: Number(e.target.value) } as Partial<CalculatorInput>)}
          />
        </Field>
      ))}
    </FieldGrid>
  );
}
