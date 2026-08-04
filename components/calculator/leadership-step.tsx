import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { InfoTooltip } from "@/components/shared/info-tooltip";
import { LEADERSHIP_ROLES } from "@/data/leadership-roles";
import { formatCurrency } from "@/lib/formatters";
import type { LeadershipRoleKey } from "@/lib/types";

interface LeadershipStepProps {
  involvedRoles: LeadershipRoleKey[];
  onChange: (roles: LeadershipRoleKey[]) => void;
}

export function LeadershipStep({ involvedRoles, onChange }: LeadershipStepProps) {
  function toggle(key: LeadershipRoleKey) {
    if (involvedRoles.includes(key)) {
      onChange(involvedRoles.filter((r) => r !== key));
    } else {
      onChange([...involvedRoles, key]);
    }
  }

  return (
    <div>
      <p className="text-[14px] leading-relaxed text-slate mb-5">
        Which people usually interview candidates? Select everyone who typically joins a round.
        This determines how much of the process depends on senior people&apos;s time.
      </p>
      <div className="mb-4 flex items-center gap-1.5 text-[12px] text-slate-light">
        <span>Each role shows an estimated hourly value.</span>
        <InfoTooltip>
          A rough, illustrative value for one hour of this person&apos;s time. We use it only to
          show a rupee estimate of the time cost. It never affects the hours themselves.
        </InfoTooltip>
      </div>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {LEADERSHIP_ROLES.map((role) => {
          const checked = involvedRoles.includes(role.key);
          return (
            <label
              key={role.key}
              className="flex items-center justify-between gap-3 border border-border px-4 py-3 cursor-pointer transition-colors hover:border-border-strong"
            >
              <div className="flex items-center gap-3">
                <Checkbox checked={checked} onCheckedChange={() => toggle(role.key)} />
                <Label className="mb-0 cursor-pointer">{role.label}</Label>
              </div>
              <span className="numeric text-[12px] text-slate-light">
                {formatCurrency(role.hourlyRateInr)}/hr
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
