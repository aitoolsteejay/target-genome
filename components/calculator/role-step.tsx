"use client";

import { useState } from "react";
import { Field } from "@/components/calculator/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ROLE_OPTIONS } from "@/data/role-options";

const CUSTOM_VALUE = "__custom__";

interface RoleStepProps {
  role: string;
  onChange: (role: string) => void;
}

export function RoleStep({ role, onChange }: RoleStepProps) {
  const matchesPreset = ROLE_OPTIONS.some((o) => o.label === role);
  const [customMode, setCustomMode] = useState(!matchesPreset && role.length > 0);

  return (
    <div className="space-y-6">
      <Field label="Which role are you hiring for?" htmlFor="role-select" required>
        <Select
          value={customMode ? CUSTOM_VALUE : role}
          onValueChange={(v) => {
            if (v === CUSTOM_VALUE) {
              setCustomMode(true);
              onChange("");
            } else {
              setCustomMode(false);
              onChange(v);
            }
          }}
        >
          <SelectTrigger id="role-select" className="sm:w-2/3">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            {ROLE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.label}>
                {option.label}
              </SelectItem>
            ))}
            <SelectItem value={CUSTOM_VALUE}>Custom role…</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      {customMode && (
        <Field label="Custom role title" htmlFor="role-custom">
          <Input
            id="role-custom"
            value={role}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g. Staff Data Scientist"
            className="sm:w-2/3"
          />
        </Field>
      )}
    </div>
  );
}
