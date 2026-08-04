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

const FIELDS: { key: ProcessKeys; label: string }[] = [
  { key: "resumesReviewedByManager", label: "Resumes the Hiring Manager personally reviews" },
  { key: "recruiterScreens", label: "Recruiter screens" },
  { key: "technicalInterviews", label: "Technical interviews" },
  { key: "hiringManagerInterviews", label: "Hiring Manager interviews" },
  { key: "leadershipInterviews", label: "Leadership interviews" },
  { key: "finalInterviews", label: "Final interviews" },
  { key: "offers", label: "Offers made" },
  { key: "joins", label: "Candidates who joined" },
];

export function ProcessStep({ input, onChange }: ProcessStepProps) {
  return (
    <FieldGrid>
      {FIELDS.map((field) => (
        <Field key={field.key} label={field.label} htmlFor={field.key}>
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
