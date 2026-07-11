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
  stage?: string; // explicit lifecycle stage key (overrides the status-derived one)
  stageNote?: string; // optional one-line caption, e.g. "In House committee"
  stageDates?: Record<string, string>; // optional ISO date each stage was reached (keyed by stage key)
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
        stage: typeof d.stage === "string" ? d.stage : undefined,
        stageNote: typeof d.stageNote === "string" ? d.stageNote : undefined,
        stageDates:
          d.stageDates && typeof d.stageDates === "object" && !Array.isArray(d.stageDates)
            ? d.stageDates
            : undefined,
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

export function getLegislationItem(slug: string): LegislationItem | undefined {
  return getLegislation().find((i) => i.slug === slug);
}

// ---------------------------------------------------------------------------
// Lifecycle tracker — where an item sits in the legislative process.
// Two tracks: the Texas BILL process (also used by enacted statutes, which are
// just completed bills) and the local ORDINANCE process. The current position
// comes from an explicit `stage` key when curated, otherwise it's derived from
// the coarser `status`. Faithful to the "how a bill becomes law" flow.
// ---------------------------------------------------------------------------

// Each stage carries its own color so the tracer reads as a journey (a
// golden-hour ramp: cool dawn → warm sunset → green "it's law").
export type LifecycleStage = { key: string; label: string; blurb: string; color: string };

export const BILL_TRACK: LifecycleStage[] = [
  { key: "filed", label: "Filed", color: "#3f7cac", blurb: "Introduced and read the first time, then referred to a committee." },
  { key: "committee", label: "Committee", color: "#4e8c7d", blurb: "Studied in committee — a public hearing, then a committee report." },
  { key: "chamber1", label: "1st chamber", color: "#7e9b3e", blurb: "Debated and passed on second and third reading in its first chamber." },
  { key: "chamber2", label: "2nd chamber", color: "#c6a02e", blurb: "Sent to the other chamber to repeat committee and floor votes." },
  { key: "conference", label: "Conference", color: "#d97a13", blurb: "If the chambers disagree, a conference committee reconciles the versions." },
  { key: "enrolled", label: "Enrolled", color: "#c2560a", blurb: "Passed both chambers and signed by the Speaker and Lieutenant Governor." },
  { key: "governor", label: "Governor", color: "#a8410a", blurb: "Sent to the governor to sign, allow to become law, or veto." },
  { key: "law", label: "Law", color: "#3f7d34", blurb: "Enacted and in effect as Texas law." },
];

export const ORDINANCE_TRACK: LifecycleStage[] = [
  { key: "proposed", label: "Proposed", color: "#3f7cac", blurb: "Brought before the city or county as a proposed ordinance." },
  { key: "hearing", label: "Hearing", color: "#4e8c7d", blurb: "Studied with public input on its local impact." },
  { key: "vote", label: "Vote", color: "#c6a02e", blurb: "Put to a vote by the council or commissioners court." },
  { key: "adopted", label: "Adopted", color: "#3f7d34", blurb: "Approved and in effect locally." },
];

// Where to watch live committee testimony, by chamber.
export const HEARING_VIDEO = {
  house: "https://house.texas.gov/videos",
  senate: "https://senate.texas.gov/av-live.php",
} as const;

export type Lifecycle = {
  track: LifecycleStage[];
  currentIndex: number; // furthest stage reached (index into track)
  terminal: boolean; // true if it died/failed here rather than advancing
  terminalLabel?: string; // e.g. "Failed", "Rejected"
  terminalColor?: string; // color for the terminal marker (defaults to danger red)
};

// Map the coarse status onto a track index when no explicit stage is given.
function deriveIndex(status: LegislationStatus, ordinance: boolean): number {
  if (ordinance) {
    switch (status) {
      case "filed": return 0;
      case "in-committee": return 1;
      case "passed": return 2;
      case "adopted": case "enacted": case "in-effect": return 3;
      case "failed": return 1; // most die at the hearing/vote stage
      default: return 0;
    }
  }
  switch (status) {
    case "filed": return 0;
    case "in-committee": return 1;
    case "passed": return 3; // cleared the legislature (both chambers)
    case "signed": return 6;
    case "enacted": case "in-effect": case "adopted": return 7;
    case "failed": return 1; // most bills die in committee
    default: return 0;
  }
}

export function getLifecycle(item: LegislationItem): Lifecycle {
  const ordinance = item.category === "ordinance";
  const track = ordinance ? ORDINANCE_TRACK : BILL_TRACK;
  const keys = track.map((s) => s.key);

  const currentIndex =
    item.stage && keys.includes(item.stage)
      ? keys.indexOf(item.stage)
      : deriveIndex(item.status, ordinance);

  const terminal = item.status === "failed";
  return {
    track,
    currentIndex,
    terminal,
    terminalLabel: terminal ? (ordinance ? "Rejected" : "Failed") : undefined,
  };
}
