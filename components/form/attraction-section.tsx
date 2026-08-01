import { Field } from "@/components/form/field";
import { Textarea } from "@/components/ui/textarea";
import type { RoleAttraction } from "@/lib/types";

interface AttractionSectionProps {
  attraction: RoleAttraction;
  onChange: (patch: Partial<RoleAttraction>) => void;
}

export function AttractionSection({ attraction, onChange }: AttractionSectionProps) {
  return (
    <div className="space-y-6">
      <Field label="Why would a strong candidate join?" htmlFor="why-join">
        <Textarea
          id="why-join"
          value={attraction.whyJoin}
          onChange={(e) => onChange({ whyJoin: e.target.value })}
        />
      </Field>
      <Field label="What will the person own?" htmlFor="what-own">
        <Textarea
          id="what-own"
          value={attraction.whatTheyWillOwn}
          onChange={(e) => onChange({ whatTheyWillOwn: e.target.value })}
        />
      </Field>
      <Field label="What will success look like after 12 months?" htmlFor="success-12mo">
        <Textarea
          id="success-12mo"
          value={attraction.successAfter12Months}
          onChange={(e) => onChange({ successAfter12Months: e.target.value })}
        />
      </Field>
      <Field label="What is genuinely distinctive about the role?" htmlFor="distinctive">
        <Textarea
          id="distinctive"
          value={attraction.distinctiveFactor}
          onChange={(e) => onChange({ distinctiveFactor: e.target.value })}
        />
      </Field>
      <Field label="What might make a candidate hesitate?" htmlFor="hesitation">
        <Textarea
          id="hesitation"
          value={attraction.hesitationFactors}
          onChange={(e) => onChange({ hesitationFactors: e.target.value })}
        />
      </Field>
      <Field label="What are the absolute non-negotiables?" htmlFor="non-negotiables">
        <Textarea
          id="non-negotiables"
          value={attraction.nonNegotiables}
          onChange={(e) => onChange({ nonNegotiables: e.target.value })}
        />
      </Field>
      <Field label="Which requirements are flexible?" htmlFor="flexible">
        <Textarea
          id="flexible"
          value={attraction.flexibleRequirements}
          onChange={(e) => onChange({ flexibleRequirements: e.target.value })}
        />
      </Field>
    </div>
  );
}
