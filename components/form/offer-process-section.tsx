import { Field, FieldGrid } from "@/components/form/field";
import { YesNoField } from "@/components/form/yes-no-field";
import { Input } from "@/components/ui/input";
import type { OfferProcess } from "@/lib/types";

interface OfferProcessSectionProps {
  offer: OfferProcess;
  onChange: (patch: Partial<OfferProcess>) => void;
  errors: Record<string, string>;
}

export function OfferProcessSection({ offer, onChange, errors }: OfferProcessSectionProps) {
  return (
    <div className="space-y-6">
      <FieldGrid>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Compensation min (₹L)" htmlFor="comp-min" error={errors.compensation}>
            <Input
              id="comp-min"
              type="number"
              min={0}
              value={offer.compMinLakh}
              onChange={(e) => onChange({ compMinLakh: Number(e.target.value) })}
            />
          </Field>
          <Field label="Compensation max (₹L)" htmlFor="comp-max">
            <Input
              id="comp-max"
              type="number"
              min={0}
              value={offer.compMaxLakh}
              onChange={(e) => onChange({ compMaxLakh: Number(e.target.value) })}
            />
          </Field>
        </div>
        <Field label="Fixed : variable split" htmlFor="split">
          <Input
            id="split"
            value={offer.fixedVariableSplit}
            onChange={(e) => onChange({ fixedVariableSplit: e.target.value })}
            placeholder="e.g. 80 : 20"
          />
        </Field>
      </FieldGrid>

      <FieldGrid>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Interview rounds" htmlFor="rounds" error={errors.interviewRounds}>
            <Input
              id="rounds"
              type="number"
              min={1}
              value={offer.interviewRounds}
              onChange={(e) => onChange({ interviewRounds: Number(e.target.value) })}
            />
          </Field>
          <Field label="Avg. days between rounds" htmlFor="days-between">
            <Input
              id="days-between"
              type="number"
              min={0}
              value={offer.avgDaysBetweenRounds}
              onChange={(e) => onChange({ avgDaysBetweenRounds: Number(e.target.value) })}
            />
          </Field>
        </div>
        <Field label="Final decision maker" htmlFor="decision-maker">
          <Input
            id="decision-maker"
            value={offer.finalDecisionMaker}
            onChange={(e) => onChange({ finalDecisionMaker: e.target.value })}
            placeholder="e.g. VP Engineering"
          />
        </Field>
      </FieldGrid>

      <Field label="Expected notice period (days)" htmlFor="notice-period" className="sm:w-1/2 sm:pr-2.5">
        <Input
          id="notice-period"
          type="number"
          min={0}
          value={offer.noticePeriodDays}
          onChange={(e) => onChange({ noticePeriodDays: Number(e.target.value) })}
        />
      </Field>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <YesNoField
          id="equity"
          label="Equity available"
          checked={offer.equityAvailable}
          onChange={(v) => onChange({ equityAvailable: v })}
        />
        <YesNoField
          id="buyout"
          label="Buyout available"
          checked={offer.buyoutAvailable}
          onChange={(v) => onChange({ buyoutAvailable: v })}
        />
        <YesNoField
          id="joining-bonus"
          label="Joining bonus available"
          checked={offer.joiningBonusAvailable}
          onChange={(v) => onChange({ joiningBonusAvailable: v })}
        />
      </div>
    </div>
  );
}
