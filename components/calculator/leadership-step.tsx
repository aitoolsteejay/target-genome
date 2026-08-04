import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
        Which people usually interview candidates? Select everyone who typically sits in a
        round — this shapes how much of the process depends on senior time.
      </p>
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
