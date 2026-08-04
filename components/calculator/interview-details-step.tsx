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
      <Field
        label="Average interview duration"
        hint="How long each interview round usually runs, start to finish."
        tooltip="The typical length of one interview round, such as a technical round or a leadership round. This is the biggest driver of total hours, since it's multiplied by every round in your process."
      >
        <PillSelect
          ariaLabel="Average interview duration"
          options={[15, 20, 30, 45, 60, 75, 90, 120]}
          suffix=" min"
          value={input.avgInterviewDurationMins}
          onChange={(v) => onChange({ avgInterviewDurationMins: v })}
        />
      </Field>
      <Field
        label="Average preparation time"
        hint="Time an interviewer spends reading the resume and planning questions, per round."
        tooltip="How long one interviewer spends getting ready before a round: reading the resume, reviewing notes from earlier rounds, and preparing questions."
      >
        <PillSelect
          ariaLabel="Average preparation time"
          options={[0, 5, 10, 15, 20, 30, 45]}
          suffix=" min"
          value={input.avgPrepTimeMins}
          onChange={(v) => onChange({ avgPrepTimeMins: v })}
        />
      </Field>
      <Field
        label="Average feedback writing"
        hint="Time spent writing notes or a scorecard right after the round."
        tooltip="How long one interviewer spends afterward writing feedback, filling out a scorecard, or discussing the candidate with the rest of the panel."
      >
        <PillSelect
          ariaLabel="Average feedback writing time"
          options={[0, 5, 10, 15, 20, 30]}
          suffix=" min"
          value={input.avgFeedbackTimeMins}
          onChange={(v) => onChange({ avgFeedbackTimeMins: v })}
        />
      </Field>
      <Field
        label="Average scheduling overhead"
        hint="Time spent finding a slot, sending invites, and handling reschedules."
        tooltip="The coordination time it takes to actually get a round on the calendar: checking availability, sending the invite, and handling any reschedules."
      >
        <PillSelect
          ariaLabel="Average scheduling overhead"
          options={[0, 5, 10, 15, 20, 30]}
          suffix=" min"
          value={input.avgSchedulingOverheadMins}
          onChange={(v) => onChange({ avgSchedulingOverheadMins: v })}
        />
      </Field>
    </div>
  );
}
