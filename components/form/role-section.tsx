import { Field, FieldGrid } from "@/components/form/field";
import { YesNoField } from "@/components/form/yes-no-field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ManagementTrack, RemotePolicy, RoleProfile, Seniority } from "@/lib/types";

const SENIORITIES: Seniority[] = [
  "Mid-level",
  "Senior",
  "Lead",
  "Principal / Staff",
  "Director",
  "VP / Executive",
];

const REMOTE_POLICIES: RemotePolicy[] = [
  "Onsite",
  "Hybrid",
  "Remote — city only",
  "Remote — anywhere in country",
];

const MANAGEMENT_TRACKS: ManagementTrack[] = ["Individual contributor", "People manager"];

interface RoleSectionProps {
  role: RoleProfile;
  onChange: (patch: Partial<RoleProfile>) => void;
  errors: Record<string, string>;
}

export function RoleSection({ role, onChange, errors }: RoleSectionProps) {
  return (
    <div className="space-y-6">
      <FieldGrid>
        <Field label="Role title" htmlFor="role-title" required error={errors.title}>
          <Input
            id="role-title"
            value={role.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="e.g. Principal Backend Engineer"
          />
        </Field>
        <Field label="Function" htmlFor="role-function">
          <Input
            id="role-function"
            value={role.function}
            onChange={(e) => onChange({ function: e.target.value })}
            placeholder="e.g. Engineering"
          />
        </Field>
      </FieldGrid>

      <FieldGrid>
        <Field label="Primary skill" htmlFor="primary-skill" required error={errors.primarySkill}>
          <Input
            id="primary-skill"
            value={role.primarySkill}
            onChange={(e) => onChange({ primarySkill: e.target.value })}
            placeholder="e.g. Java"
          />
        </Field>
        <Field
          label="Secondary skills"
          htmlFor="secondary-skills"
          hint="Comma-separated"
        >
          <Input
            id="secondary-skills"
            value={role.secondarySkills.join(", ")}
            onChange={(e) =>
              onChange({
                secondarySkills: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
            placeholder="e.g. AWS, Distributed systems, Microservices"
          />
        </Field>
      </FieldGrid>

      <FieldGrid>
        <Field label="Seniority" htmlFor="seniority">
          <Select value={role.seniority} onValueChange={(v) => onChange({ seniority: v as Seniority })}>
            <SelectTrigger id="seniority">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SENIORITIES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Experience min (yrs)" htmlFor="exp-min" error={errors.experience}>
            <Input
              id="exp-min"
              type="number"
              min={0}
              value={role.experienceMin}
              onChange={(e) => onChange({ experienceMin: Number(e.target.value) })}
            />
          </Field>
          <Field label="Experience max (yrs)" htmlFor="exp-max">
            <Input
              id="exp-max"
              type="number"
              min={0}
              value={role.experienceMax}
              onChange={(e) => onChange({ experienceMax: Number(e.target.value) })}
            />
          </Field>
        </div>
      </FieldGrid>

      <FieldGrid>
        <Field label="Industry preference" htmlFor="industry-pref" hint="Use “Any” or “Open” for no preference">
          <Input
            id="industry-pref"
            value={role.industryPreference}
            onChange={(e) => onChange({ industryPreference: e.target.value })}
            placeholder="e.g. Product technology or fintech"
          />
        </Field>
        <Field label="Domain experience required" htmlFor="domain-exp" hint="Use “None” if not required">
          <Input
            id="domain-exp"
            value={role.domainExperienceRequired}
            onChange={(e) => onChange({ domainExperienceRequired: e.target.value })}
            placeholder="e.g. Payments platform experience"
          />
        </Field>
      </FieldGrid>

      <FieldGrid>
        <Field label="Location" htmlFor="location" error={errors.location} required={role.remotePolicy !== "Remote — anywhere in country"}>
          <Input
            id="location"
            value={role.location}
            onChange={(e) => onChange({ location: e.target.value })}
            placeholder="e.g. Bengaluru"
          />
        </Field>
        <Field label="Remote policy" htmlFor="remote-policy">
          <Select
            value={role.remotePolicy}
            onValueChange={(v) => onChange({ remotePolicy: v as RemotePolicy })}
          >
            <SelectTrigger id="remote-policy">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {REMOTE_POLICIES.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </FieldGrid>

      <Field label="Management track" htmlFor="management-track">
        <Select
          value={role.managementTrack}
          onValueChange={(v) => onChange({ managementTrack: v as ManagementTrack })}
        >
          <SelectTrigger id="management-track" className="sm:w-1/2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MANAGEMENT_TRACKS.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <YesNoField
          id="team-mgmt"
          label="Team management required"
          checked={role.teamManagementRequired}
          onChange={(v) => onChange({ teamManagementRequired: v })}
        />
        <YesNoField
          id="relocation"
          label="Relocation allowed"
          checked={role.relocationAllowed}
          onChange={(v) => onChange({ relocationAllowed: v })}
        />
      </div>
    </div>
  );
}
