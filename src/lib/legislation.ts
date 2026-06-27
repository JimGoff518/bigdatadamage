import fs from "node:fs";
import path from "node:path";

// One JSON file per Texas legislative item we track, in src/content/legislation/.
// SCOPE IS STRICTLY LEGISLATION: bills, enacted statutes, and local ordinances —
// NOT court rulings or agency actions (those are a different branch of government
// and out of scope by design). State bills/statutes are written as reviewed PRs
// by the LegiScan n8n pipeline; local ordinances are curated. Like facilities.ts,
// getLegislation() refuses to render any entry that isn't titled, summarized, and
// backed by a public sourceUrl — the code-level "never assert unsourced" guard.

export type LegislationCategory = "bill" | "statute" | "ordinance";

export type LegislationStatus =
  | "filed"
  | "in-committee"
  | "passed"
  | "signed"
  | "enacted"
  | "in-effect"
  | "adopted"
  | "failed";

export type LegislationItem = {
  slug: string;
  category: LegislationCategory;
  title: string;
  billNumber?: string; // e.g. "SB 6" (bills/statutes)
  session?: string; // e.g. "89R (2025)"
  jurisdiction?: string; // "Texas" for state law; a county/city for ordinances
  status: LegislationStatus;
  chamber?: "house" | "senate";
  harm?: string[]; // reuses the site harm taxonomy: water | air | property
  summary: string; // plain-English, our own words
  whyItMatters?: string; // one or two factual sentences on landowner impact
  sourceUrl: string; // official record / reporting the entry links out to
  sourceName?: string;
  lastAction?: string; // e.g. "Signed by the governor"
  lastActionDate?: string; // ISO date of the last action
  legiscanId?: number; // bills — used by the pipeline to dedup/update on re-runs
  dateFound?: string; // ISO date the entry was added
};

const LEGISLATION_DIR = path.join(process.cwd(), "src", "content", "legislation");

const CATEGORIES: LegislationCategory[] = ["bill", "statute", "ordinance"];

const STATUSES: LegislationStatus[] = [
  "filed",
  "in-committee",
  "passed",
  "signed",
  "enacted",
  "in-effect",
  "adopted",
  "failed",
];

// Status -> label + the CSS color variable used for its badge. Mirrors
// FACILITY_STATUS_META so the two trackers feel consistent.
export const LEGISLATION_STATUS_META: Record<
  LegislationStatus,
  { label: string; colorVar: string }
> = {
  filed: { label: "Filed", colorVar: "var(--color-teal)" },
  "in-committee": { label: "In committee", colorVar: "var(--color-hazard)" },
  passed: { label: "Passed", colorVar: "var(--color-orange)" },
  signed: { label: "Signed", colorVar: "var(--color-orange)" },
  enacted: { label: "Enacted", colorVar: "var(--color-danger)" },
  "in-effect": { label: "In effect", colorVar: "var(--color-danger)" },
  adopted: { label: "Adopted", colorVar: "var(--color-danger)" },
  failed: { label: "Failed", colorVar: "var(--color-fg-dim)" },
};

// Category -> label, used for section grouping and the card's category tag.
export const LEGISLATION_CATEGORY_META: Record<
  LegislationCategory,
  { label: string; plural: string }
> = {
  bill: { label: "Bill", plural: "Bills" },
  statute: { label: "Statute", plural: "Enacted laws" },
  ordinance: { label: "Local ordinance", plural: "Local ordinances" },
};

export function getLegislation(): LegislationItem[] {
  if (!fs.existsSync(LEGISLATION_DIR)) return [];
  // Files starting with "_" are templates/docs, never rendered.
  const files = fs
    .readdirSync(LEGISLATION_DIR)
    .filter((f) => f.endsWith(".json") && !f.startsWith("_"));

  const out: LegislationItem[] = [];
  for (const file of files) {
    try {
      const d = JSON.parse(fs.readFileSync(path.join(LEGISLATION_DIR, file), "utf8"));

      // Reject anything not titled, not summarized, not categorized, not
      // status-typed, or not sourced — same guard as the facilities loader.
      if (typeof d.title !== "string" || !d.title.trim()) continue;
      if (typeof d.summary !== "string" || !d.summary.trim()) continue;
      if (!CATEGORIES.includes(d.category)) continue;
      if (!STATUSES.includes(d.status)) continue;
      if (typeof d.sourceUrl !== "string" || !/^https?:\/\//i.test(d.sourceUrl)) continue;

      out.push({
        slug: file.replace(/\.json$/, ""),
        category: d.category,
        title: d.title.trim(),
        billNumber: typeof d.billNumber === "string" ? d.billNumber : undefined,
        session: typeof d.session === "string" ? d.session : undefined,
        jurisdiction: typeof d.jurisdiction === "string" ? d.jurisdiction : undefined,
        status: d.status,
        chamber: d.chamber === "house" || d.chamber === "senate" ? d.chamber : undefined,
        harm: Array.isArray(d.harm)
          ? d.harm.filter((h: unknown): h is string => typeof h === "string")
          : undefined,
        summary: d.summary.trim(),
        whyItMatters: typeof d.whyItMatters === "string" ? d.whyItMatters : undefined,
        sourceUrl: d.sourceUrl,
        sourceName: typeof d.sourceName === "string" ? d.sourceName : undefined,
        lastAction: typeof d.lastAction === "string" ? d.lastAction : undefined,
        lastActionDate: typeof d.lastActionDate === "string" ? d.lastActionDate : undefined,
        legiscanId: typeof d.legiscanId === "number" ? d.legiscanId : undefined,
        dateFound: typeof d.dateFound === "string" ? d.dateFound : undefined,
      });
    } catch {
      // A malformed file is skipped, never breaks the page.
      continue;
    }
  }

  // Most recent legislative action first; undated entries sort last.
  return out.sort((a, b) => (b.lastActionDate ?? "").localeCompare(a.lastActionDate ?? ""));
}

// Group items in a fixed category order for the page's sections. Empty
// categories are omitted so a sparse interim page never shows a blank section.
export function getLegislationByCategory(): {
  category: LegislationCategory;
  items: LegislationItem[];
}[] {
  const all = getLegislation();
  return CATEGORIES.map((category) => ({
    category,
    items: all.filter((i) => i.category === category),
  })).filter((group) => group.items.length > 0);
}
