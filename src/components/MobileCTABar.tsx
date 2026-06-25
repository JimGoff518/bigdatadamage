import Link from "next/link";
import { site } from "@/lib/site";
import { Icon } from "@/components/Icons";

// Sticky bottom action bar, mobile only.
export function MobileCTABar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-px border-t border-line bg-line md:hidden">
      <a
        href={site.phoneHref}
        className="flex items-center justify-center gap-2 bg-panel py-3.5 text-sm font-bold text-fg"
        aria-label={`Call ${site.phone}`}
      >
        <Icon name="phone" width={16} height={16} className="text-orange" />
        Call Now
      </a>
      <Link
        href="/contact"
        className="flex items-center justify-center gap-2 bg-orange py-3.5 text-sm font-bold text-paper"
      >
        Free Review
        <Icon name="arrow" width={16} height={16} />
      </Link>
    </div>
  );
}
