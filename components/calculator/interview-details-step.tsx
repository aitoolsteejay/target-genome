import { Field } from "@/components/calculator/field";
import { PillSelect } from "@/components/calculator/pill-select";
import type { CalculatorInput } from "@/lib/types";

interface InterviewDetailsStepProps {
  input: CalculatorInput;
  onChange: (patch: Partial<CalculatorInput>) => void;
}

export function InterviewDetailsStep({ input, onChange }: InterviewDetailsStepProps) {
  return (
    <div className="space-y-8">
      <Field label="Average interview duration" hint="Minutes per interview round">
        <PillSelect
          ariaLabel="Average interview duration"
          options={[30, 45, 60, 90]}
          suffix=" min"
          value={input.avgInterviewDurationMins}
          onChange={(v) => onChange({ avgInterviewDurationMins: v })}
        />
      </Field>
      <Field label="Average preparation time" hint="Per interviewer, per round">
        <PillSelect
          ariaLabel="Average preparation time"
          options={[5, 10, 15, 20]}
          suffix=" min"
          value={input.avgPrepTimeMins}
          onChange={(v) => onChange({ avgPrepTimeMins: v })}
        />
      </Field>
      <Field label="Average feedback writing" hint="Per interviewer, per round">
        <PillSelect
          ariaLabel="Average feedback writing time"
          options={[5, 10, 15]}
          suffix=" min"
          value={input.avgFeedbackTimeMins}
          onChange={(v) => onChange({ avgFeedbackTimeMins: v })}
        />
      </Field>
      <Field label="Average scheduling overhead" hint="Per interview round">
        <PillSelect
          ariaLabel="Average scheduling overhead"
          options={[5, 10]}
          suffix=" min"
          value={input.avgSchedulingOverheadMins}
          onChange={(v) => onChange({ avgSchedulingOverheadMins: v })}
        />
      </Field>
    </div>
  );
}
