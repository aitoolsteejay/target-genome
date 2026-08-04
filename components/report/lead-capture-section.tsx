"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { Field } from "@/components/calculator/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LeadFormState {
  name: string;
  email: string;
  company: string;
  roleHiringFor: string;
}

const EMPTY: LeadFormState = { name: "", email: "", company: "", roleHiringFor: "" };

export function LeadCaptureSection({ defaultRole }: { defaultRole: string }) {
  const [form, setForm] = useState<LeadFormState>({ ...EMPTY, roleHiringFor: defaultRole });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  function patch(key: keyof LeadFormState, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate() {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid work email.";
    if (!form.company.trim()) next.company = "Company is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <section className="border-t border-border bg-charcoal py-20">
        <div className="mx-auto max-w-xl px-5 text-center sm:px-8">
          <CheckCircle2 className="mx-auto h-8 w-8 text-accent" aria-hidden />
          <h2 className="mt-4 font-serif-display text-2xl text-paper">Request received.</h2>
          <p className="mt-3 text-[14.5px] leading-relaxed text-stone-100/70">
            Someone from our search team will review the process behind this report and follow up
            at the email you provided.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-border bg-charcoal py-20">
      <div className="mx-auto max-w-xl px-5 sm:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-label text-stone-100/50">
          Want to reclaim these hours?
        </p>
        <h2 className="mt-3 font-serif-display text-[26px] leading-tight text-paper sm:text-[30px]">
          Share one live role with our specialist recruiters.
        </h2>
        <p className="mt-3 text-[14.5px] leading-relaxed text-stone-100/70">
          We&apos;ll review your hiring process and identify where leadership time can be reduced.
        </p>

        <form className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2" onSubmit={handleSubmit}>
          <Field label="Name" htmlFor="lead-name">
            <Input
              id="lead-name"
              value={form.name}
              onChange={(e) => patch("name", e.target.value)}
              className="!bg-white/5 !border-white/15 !text-paper placeholder:!text-stone-100/40"
            />
            {errors.name && <p className="mt-1.5 text-[12px] text-orange">{errors.name}</p>}
          </Field>
          <Field label="Email" htmlFor="lead-email">
            <Input
              id="lead-email"
              type="email"
              value={form.email}
              onChange={(e) => patch("email", e.target.value)}
              className="!bg-white/5 !border-white/15 !text-paper placeholder:!text-stone-100/40"
            />
            {errors.email && <p className="mt-1.5 text-[12px] text-orange">{errors.email}</p>}
          </Field>
          <Field label="Company" htmlFor="lead-company">
            <Input
              id="lead-company"
              value={form.company}
              onChange={(e) => patch("company", e.target.value)}
              className="!bg-white/5 !border-white/15 !text-paper placeholder:!text-stone-100/40"
            />
            {errors.company && <p className="mt-1.5 text-[12px] text-orange">{errors.company}</p>}
          </Field>
          <Field label="Role Hiring For" htmlFor="lead-role">
            <Input
              id="lead-role"
              value={form.roleHiringFor}
              onChange={(e) => patch("roleHiringFor", e.target.value)}
              className="!bg-white/5 !border-white/15 !text-paper placeholder:!text-stone-100/40"
            />
          </Field>

          <div className="col-span-full pt-2">
            <Button type="submit" variant="accent" size="lg">
              Request a Hiring Efficiency Review
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
