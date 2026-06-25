import Link from "next/link";
import { site, nav } from "@/lib/site";
import { topics } from "@/content/topics";
import { Icon } from "@/components/Icons";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-panel text-fg/70">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="font-display text-2xl font-bold text-fg">
              BIG DATA <span className="text-orange">DAMAGE</span>
            </div>
            <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-fg-dim">
              The Texas Data Center Watchdog
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed">
              An investigative resource documenting how the data center boom is draining Texas
              water, fouling our air, and crushing property values — and what landowners can do.
            </p>
            <a
              href={site.phoneHref}
              className="mt-5 inline-flex items-center gap-2 rounded-sm bg-orange px-4 py-2.5 font-bold text-paper transition-colors hover:bg-orange-bright"
            >
              <Icon name="phone" width={16} height={16} />
              {site.phone}
            </a>
          </div>

          <div>
            <h4 className="eyebrow text-xs text-fg">The Damage</h4>
            <ul className="mt-3 space-y-2 text-sm">
              {topics.map((t) => (
                <li key={t.slug}>
                  <Link href={`/damage/${t.slug}`} className="hover:text-orange">
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="eyebrow text-xs text-fg">Explore</h4>
            <ul className="mt-3 space-y-2 text-sm">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-orange">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-line pt-6 text-xs leading-relaxed text-fg-dim">
          <p>{site.disclaimer}</p>
          <p className="mt-3">
            © {new Date().getFullYear()} {site.name}. Advertising sponsored by {site.sponsor} ·
            Principal Office: {site.principalOffice}.
          </p>
        </div>
      </div>
    </footer>
  );
}
