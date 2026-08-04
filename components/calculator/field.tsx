import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FieldProps {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
  required?: boolean;
}

export function Field({ label, htmlFor, hint, children, className, required }: FieldProps) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor}>
        {label}
        {required && <span className="text-red"> *</span>}
      </Label>
      {children}
      {hint && <p className="mt-1.5 text-[12px] leading-snug text-slate-light">{hint}</p>}
    </div>
  );
}

export function FieldGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("grid grid-cols-1 gap-5 sm:grid-cols-2", className)}>{children}</div>;
}
