"use client";

import { useState } from "react";
import { site } from "@/lib/site";
import { Icon } from "@/components/Icons";

const concerns = [
  "My water / well is affected",
  "Air quality / diesel emissions",
  "Noise from cooling fans",
  "My property value dropped",
  "Something else",
];

export function LeadForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("done");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-md border border-line bg-panel p-8 text-center shadow-card">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-orange/15 text-orange">
          <Icon name="shield" width={26} height={26} />
        </div>
        <h3 className="mt-4 text-xl font-bold text-fg">Thank you — we received it.</h3>
        <p className="mt-2 text-sm text-fg/70">
          Someone will review what&apos;s happening near you and reach out. For anything urgent,
          call <a className="font-semibold text-orange" href={site.phoneHref}>{site.phone}</a>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-md border border-line bg-panel p-6 shadow-card sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" name="name" required />
        <Field label="Phone" name="phone" type="tel" required />
        <Field label="Email" name="email" type="email" />
        <Field label="County / city" name="county" placeholder="e.g. Hood County" />
      </div>

      <label className="mt-4 block">
        <span className="text-sm font-semibold text-fg">What are you experiencing?</span>
        <select
          name="concern"
          className="mt-1 w-full rounded-sm border border-line bg-night px-3 py-2.5 text-sm text-fg outline-none focus:border-orange"
          defaultValue=""
        >
          <option value="" disabled>Select what fits best…</option>
          {concerns.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </label>

      <label className="mt-4 block">
        <span className="text-sm font-semibold text-fg">Tell us what&apos;s happening</span>
        <textarea
          name="message"
          rows={4}
          placeholder="When did it start? What have you noticed near your property?"
          className="mt-1 w-full rounded-sm border border-line bg-night px-3 py-2.5 text-sm text-fg outline-none focus:border-orange"
        />
      </label>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-orange px-5 py-3 font-bold text-night transition-colors hover:bg-orange-bright disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Get a free, confidential review"}
        {status !== "submitting" && <Icon name="arrow" width={18} height={18} />}
      </button>

      {status === "error" && (
        <p className="mt-3 text-sm text-hazard">
          Something went wrong. Please call {site.phone} instead.
        </p>
      )}

      <p className="mt-3 text-center text-xs text-fg-dim">
        Submitting this form does not create an attorney-client relationship.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-fg">
        {label} {required && <span className="text-orange">*</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-1 w-full rounded-sm border border-line bg-night px-3 py-2.5 text-sm text-fg outline-none focus:border-orange"
      />
    </label>
  );
}
