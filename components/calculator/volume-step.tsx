import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { InfoTooltip } from "@/components/shared/info-tooltip";

interface VolumeStepProps {
  hiresNeeded: number;
  onChange: (value: number) => void;
}

export function VolumeStep({ hiresNeeded, onChange }: VolumeStepProps) {
  return (
    <div className="max-w-xs">
      <div className="flex items-center gap-2">
        <Label htmlFor="hires-input" className="mb-0">
          How many people are you hiring for this role?
        </Label>
        <InfoTooltip>
          The number of people you plan to hire for this exact role. We use this to show the
          total time cost across all of those hires, not just one.
        </InfoTooltip>
      </div>
      <Input
        id="hires-input"
        type="number"
        min={1}
        value={hiresNeeded}
        onChange={(e) => onChange(Math.max(1, Number(e.target.value) || 1))}
        className="mt-3"
      />
    </div>
  );
}
