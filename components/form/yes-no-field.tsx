import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface YesNoFieldProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  hint?: string;
}

export function YesNoField({ id, label, checked, onChange, hint }: YesNoFieldProps) {
  return (
    <div className="flex items-start justify-between gap-4 border border-border px-4 py-3.5">
      <div>
        <Label htmlFor={id} className="mb-0">
          {label}
        </Label>
        {hint && <p className="mt-1 text-[12px] leading-snug text-slate-light">{hint}</p>}
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} className="mt-0.5 shrink-0" />
    </div>
  );
}
