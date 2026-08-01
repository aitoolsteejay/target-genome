"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Field } from "@/components/form/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface LeadFormState {
  name: string;
  email: string;
  company: string;
  roleBeingHired: string;
  phone: string;
  message: string;
}

const EMPTY: LeadFormState = { name: "", email: "", company: "", roleBeingHired: "", phone: "", message: "" };

export function LeadCaptureSection({ defaultRole }: { defaultRole: string }) {
  const [form, setForm] = useState<LeadFormState>({ ...EMPTY, roleBeingHired: defaultRole });
  const [submitted, setSubmitted] = useState<"review" | "brief" | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  function handleSubmit(e: FormEvent, intent: "review" | "brief") {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(intent);
  }

  if (submitted) {
    return (
      <section id="expert-review" className="border-t border-border bg-charcoal py-20">
        <div className="mx-auto max-w-xl px-5 text-center sm:px-8">
          <CheckCircle2 className="mx-auto h-8 w-8 text-accent" aria-hidden />
          <h2 className="mt-4 font-serif-display text-2xl text-paper">
            {submitted === "review" ? "Request received." : "Brief on its way."}
          </h2>
          <p className="mt-3 text-[14.5px] leading-relaxed text-stone-100/70">
            {submitted === "review"
              ? "Someone from our search team will review the assumptions behind this brief and follow up at the email you provided."
              : "In this prototype, no email is actually sent — open the one-page brief directly below."}
          </p>
          <Button asChild variant="outline" className="mt-6 !border-white/20 !text-paper hover:!bg-white/10">
            <Link href="/report/brief" target="_blank">
              Open the one-page brief
            </Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section id="expert-review" className="border-t border-border bg-charcoal py-20">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-label text-stone-100/50">
          Want the intelligence reviewed by a specialist?
        </p>
        <h2 className="mt-3 font-serif-display text-[26px] leading-tight text-paper sm:text-[30px]">
          Share the live role with our search team.
        </h2>
        <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-stone-100/70">
          We will review the assumptions, target market, and likely search risks and return with a
          confidential perspective.
        </p>

        <form className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2" onSubmit={(e) => handleSubmit(e, "review")}>
          <Field label="Name" htmlFor="lead-name" required error={errors.name}>
            <Input
              id="lead-name"
              value={form.name}
              onChange={(e) => patch("name", e.target.value)}
              className="!bg-white/5 !border-white/15 !text-paper placeholder:!text-stone-100/40"
            />
          </Field>
          <Field label="Work email" htmlFor="lead-email" required error={errors.email}>
            <Input
              id="lead-email"
              type="email"
              value={form.email}
              onChange={(e) => patch("email", e.target.value)}
              className="!bg-white/5 !border-white/15 !text-paper placeholder:!text-stone-100/40"
            />
          </Field>
          <Field label="Company" htmlFor="lead-company" required error={errors.company}>
            <Input
              id="lead-company"
              value={form.company}
              onChange={(e) => patch("company", e.target.value)}
              className="!bg-white/5 !border-white/15 !text-paper placeholder:!text-stone-100/40"
            />
          </Field>
          <Field label="Role being hired" htmlFor="lead-role">
            <Input
              id="lead-role"
              value={form.roleBeingHired}
              onChange={(e) => patch("roleBeingHired", e.target.value)}
              className="!bg-white/5 !border-white/15 !text-paper placeholder:!text-stone-100/40"
            />
          </Field>
          <Field label="Phone (optional)" htmlFor="lead-phone">
            <Input
              id="lead-phone"
              value={form.phone}
              onChange={(e) => patch("phone", e.target.value)}
              className="!bg-white/5 !border-white/15 !text-paper placeholder:!text-stone-100/40"
            />
          </Field>
          <Field label="Message (optional)" htmlFor="lead-message" className="sm:col-span-2">
            <Textarea
              id="lead-message"
              value={form.message}
              onChange={(e) => patch("message", e.target.value)}
              className="!bg-white/5 !border-white/15 !text-paper placeholder:!text-stone-100/40"
            />
          </Field>

          <div className="col-span-full flex flex-wrap gap-3 pt-2">
            <Button type="submit" variant="accent" size="lg">
              Request a Confidential Review
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="!border-white/20 !text-paper hover:!bg-white/10"
              onClick={(e) => handleSubmit(e, "brief")}
            >
              Send Me the One-Page CHRO Brief
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
