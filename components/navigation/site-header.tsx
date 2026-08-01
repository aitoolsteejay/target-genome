"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/sample/principal-backend-engineer", label: "Sample Report" },
  { href: "/#intelligence", label: "About the Intelligence" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="print-hide sticky top-0 z-40 border-b border-border bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex h-7 w-7 items-center justify-center border border-ink text-[11px] font-serif-display font-semibold">
            TG
          </span>
          <span className="font-serif-display text-[17px] tracking-tight text-ink">
            Talent Genome
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[13.5px] font-medium text-ink-soft transition-colors hover:text-accent-strong"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button asChild size="sm" variant="accent">
            <Link href="/generate">Generate a Genome</Link>
          </Button>
        </div>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center text-ink md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={cn(
          "md:hidden overflow-hidden border-t border-border transition-[max-height] duration-200",
          open ? "max-h-64" : "max-h-0 border-t-0"
        )}
      >
        <nav className="flex flex-col gap-1 px-5 py-4" aria-label="Mobile">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="py-2.5 text-sm font-medium text-ink-soft"
            >
              {link.label}
            </Link>
          ))}
          <Button asChild size="sm" variant="accent" className="mt-2 w-full">
            <Link href="/generate" onClick={() => setOpen(false)}>
              Generate a Genome
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
