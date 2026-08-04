import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface VolumeStepProps {
  hiresNeeded: number;
  onChange: (value: number) => void;
}

export function VolumeStep({ hiresNeeded, onChange }: VolumeStepProps) {
  return (
    <div className="max-w-md">
      <div className="flex items-center justify-between">
        <Label htmlFor="hires-slider" className="mb-0">
          How many people are you hiring?
        </Label>
        <span className="numeric font-serif-display text-2xl text-accent-strong">{hiresNeeded}</span>
      </div>
      <Slider
        id="hires-slider"
        className="mt-4"
        min={1}
        max={20}
        step={1}
        value={[hiresNeeded]}
        onValueChange={([v]) => onChange(v)}
      />
      <div className="mt-1.5 flex justify-between text-[11px] text-slate-light">
        <span>1</span>
        <span>20</span>
      </div>
    </div>
  );
}
