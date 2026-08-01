import { Field, FieldGrid } from "@/components/form/field";
import { YesNoField } from "@/components/form/yes-no-field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Criticality, HiringContext } from "@/lib/types";

const CRITICALITIES: Criticality[] = ["Standard", "Important", "Business-critical", "Mission-critical"];

interface HiringContextSectionProps {
  context: HiringContext;
  onChange: (patch: Partial<HiringContext>) => void;
}

export function HiringContextSection({ context, onChange }: HiringContextSectionProps) {
  return (
    <div className="space-y-6">
      <Field label="Is this a new role or a replacement?" htmlFor="new-role">
        <RadioGroup
          className="grid grid-cols-2 gap-3 sm:w-1/2"
          value={context.isNewRole ? "new" : "replacement"}
          onValueChange={(v) => onChange({ isNewRole: v === "new" })}
        >
          <label className="flex items-center gap-2.5 border border-border-strong px-4 py-3 text-sm cursor-pointer">
            <RadioGroupItem value="new" id="new-role" />
            New role
          </label>
          <label className="flex items-center gap-2.5 border border-border-strong px-4 py-3 text-sm cursor-pointer">
            <RadioGroupItem value="replacement" id="replacement-role" />
            Replacement
          </label>
        </RadioGroup>
      </Field>

      <FieldGrid>
        <Field label="How critical is the role?" htmlFor="criticality">
          <Select
            value={context.criticality}
            onValueChange={(v) => onChange({ criticality: v as Criticality })}
          >
            <SelectTrigger id="criticality">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CRITICALITIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Desired joining timeline (wks)" htmlFor="timeline">
            <Input
              id="timeline"
              type="number"
              min={0}
              value={context.desiredJoiningTimelineWeeks}
              onChange={(e) => onChange({ desiredJoiningTimelineWeeks: Number(e.target.value) })}
            />
          </Field>
          <Field label="Role open for (wks)" htmlFor="open-weeks">
            <Input
              id="open-weeks"
              type="number"
              min={0}
              value={context.roleOpenWeeks}
              onChange={(e) => onChange({ roleOpenWeeks: Number(e.target.value) })}
            />
          </Field>
        </div>
      </FieldGrid>

      <FieldGrid className="sm:grid-cols-3">
        <Field label="Profiles reviewed" htmlFor="profiles-reviewed">
          <Input
            id="profiles-reviewed"
            type="number"
            min={0}
            value={context.profilesReviewed}
            onChange={(e) => onChange({ profilesReviewed: Number(e.target.value) })}
          />
        </Field>
        <Field label="Candidates interviewed" htmlFor="candidates-interviewed">
          <Input
            id="candidates-interviewed"
            type="number"
            min={0}
            value={context.candidatesInterviewed}
            onChange={(e) => onChange({ candidatesInterviewed: Number(e.target.value) })}
          />
        </Field>
        <Field label="Offers extended" htmlFor="offers-extended">
          <Input
            id="offers-extended"
            type="number"
            min={0}
            value={context.offersExtended}
            onChange={(e) => onChange({ offersExtended: Number(e.target.value) })}
          />
        </Field>
      </FieldGrid>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <YesNoField
          id="failed-close"
          label="Role previously failed to close"
          checked={context.previouslyFailedToClose}
          onChange={(v) => onChange({ previouslyFailedToClose: v })}
        />
        <YesNoField
          id="candidate-declined"
          label="Has any candidate declined?"
          checked={context.candidateDeclined}
          onChange={(v) => onChange({ candidateDeclined: v })}
        />
        <YesNoField
          id="internal-ta"
          label="Currently with internal TA"
          checked={context.withInternalTA}
          onChange={(v) => onChange({ withInternalTA: v })}
        />
        <YesNoField
          id="with-agencies"
          label="Already assigned to agencies"
          checked={context.withAgencies}
          onChange={(v) => onChange({ withAgencies: v })}
        />
      </div>
    </div>
  );
}
