"use client";

import Link from "next/link";
import { useState } from "react";
import { site, nav } from "@/lib/site";
import { Icon } from "@/components/Icons";
import { cn } from "@/lib/cn";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-panel/95 backdrop-blur">
      {/* Investigation banner */}
      <div className="bg-orange text-night">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em]">
          <span className="hidden sm:block">A Texas Landowner Investigation</span>
          <a href={site.phoneHref} className="ml-auto inline-flex items-center gap-1.5 hover:underline">
            <Icon name="phone" width={13} height={13} />
            Tip line / free consult: {site.phone}
          </a>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
        <Link href="/" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="grid h-10 w-10 place-items-center rounded-sm border border-orange/60 bg-panel text-orange">
            <Icon name="shield" width={20} height={20} />
          </span>
          <span className="leading-none">
            <span className="block font-display text-xl font-bold tracking-tight text-fg">
              BIG DATA <span className="text-orange">DAMAGE</span>
            </span>
            <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.22em] text-fg-dim">
              The Texas Data Center Watchdog
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-fg/80 transition-colors hover:text-orange"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={site.phoneHref}
            className="inline-flex items-center gap-2 rounded-sm bg-orange px-4 py-2 text-sm font-bold text-night transition-colors hover:bg-orange-bright"
          >
            <Icon name="phone" width={16} height={16} />
            Call Now
          </a>
        </nav>

        <button aria-label="Toggle menu" className="lg:hidden" onClick={() => setOpen((v) => !v)}>
          <div className="space-y-1.5">
            <span className={cn("block h-0.5 w-6 bg-fg transition", open && "translate-y-2 rotate-45")} />
            <span className={cn("block h-0.5 w-6 bg-fg transition", open && "opacity-0")} />
            <span className={cn("block h-0.5 w-6 bg-fg transition", open && "-translate-y-2 -rotate-45")} />
          </div>
        </button>
      </div>

      {open && (
        <nav className="border-t border-line bg-panel px-4 py-3 lg:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block py-2 text-base font-semibold text-fg/90"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={site.phoneHref}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-orange px-4 py-2.5 font-bold text-night"
          >
            <Icon name="phone" width={16} height={16} />
            Call {site.phone}
          </a>
        </nav>
      )}
    </header>
  );
}
