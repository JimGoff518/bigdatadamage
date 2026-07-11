import fs from "node:fs";
import path from "node:path";
import type { Lifecycle, LifecycleStage } from "./legislation";

// One JSON file per data-center lawsuit we track, in src/content/litigation/.
// SCOPE IS STRICTLY LITIGATION: court cases and formal legal disputes involving
// data centers — the sibling to legislation.ts (which tracks laws) and the
// locations data (which tracks the facilities). Texas cases are featured; a few
// national landmarks are included for context (national: true). Like
// legislation.ts, getLitigation() refuses to render any entry that isn't
// captioned, summarized, categorized, status-typed, and backed by a public
// sourceUrl — the code-level "never assert unsourced" guard. Summaries state
// only what the public docket/filing asserts; they never characterize the
// merits or predict an outcome, and no defendant is called liable before
// judgment.

export type LitigationCategory =
  | "nuisance" // noise, vibration, quiet enjoyment, property
  | "water" // groundwater depletion, well interference, water rights
  | "zoning" // zoning, permitting, moratoria, land use
  | "environmental" // air/TCEQ, citizen suits, enforcement, agency appeals
  | "utility"; // ratepayer, PUC, ERCOT, grid cost-shifting

export type LitigationStatus =
  // active stages
  | "filed"
  | "answered"
  | "discovery"
  | "motions"
  | "trial"
  | "judgment"
  | "appeal"
  | "resolved"
  // terminal outcomes
  | "settled"
  | "dismissed"
  | "nonsuited";

export type LitigationItem = {
  slug: string;
  category: LitigationCategory;
  caption: string; // e.g. "Smith v. Vantage Data Centers, LLC"
  court?: string; // e.g. "Hood County District Court, 355th"
  docketNumber?: string; // cause / docket number, when public
  jurisdiction?: string; // e.g. "Texas (state)" or "U.S. federal — W.D. Tex."
  county?: string; // links to /locations/[slug] when it matches
  filedDate?: string; // ISO date the case was filed
  status: LitigationStatus;
  harm?: string[]; // reuses the site harm taxonomy: water | air | property
  plaintiffs?: string; // short description of who is suing
  defendants?: string; // short description of who is sued
  operator?: string; // the data-center / crypto operator involved
  summary: string; // plain-English, our own words — asserts nothing about merits
  whyItMatters?: string; // one or two factual sentences on landowner impact
  reliefSought?: string; // e.g. "Injunction + damages", "Permit denial"
  sourceUrl: string; // public record / reporting the entry links out to
  sourceName?: string;
  docketUrl?: string; // CourtListener / county portal, when available
  lastAction?: string; // e.g. "Plea to the jurisdiction denied"
  lastActionDate?: string; // ISO date of the last action
  national?: boolean; // true = out-of-Texas landmark shown in the context section
  stage?: string; // explicit lifecycle stage key (overrides the status-derived one)
  stageNote?: string; // optional one-line caption, e.g. "MSJ briefing underway"
  stageDates?: Record<string, string>; // ISO date each stage was reached (by key)
  dateFound?: string; // ISO date the entry was added
};

const LITIGATION_DIR = path.join(process.cwd(), "src", "content", "litigation");

const CATEGORIES: LitigationCategory[] = [
  "nuisance",
  "water",
  "zoning",
  "environmental",
  "utility",
];

const STATUSES: LitigationStatus[] = [
  "filed",
  "answered",
  "discovery",
  "motions",
  "trial",
  "judgment",
  "appeal",
  "resolved",
  "settled",
  "dismissed",
  "nonsuited",
];

// Status -> label + the color used for its badge. Mirrors LEGISLATION_STATUS_META
// so the trackers feel consistent. Settled/resolved are a positive green; the
// dim outcomes (dismissed/nonsuited) read as a case that ended early.
export const LITIGATION_STATUS_META: Record<
  LitigationStatus,
  { label: string; colorVar: string }
> = {
  filed: { label: "Filed", colorVar: "var(--color-teal)" },
  answered: { label: "Answered", colorVar: "var(--color-teal)" },
  discovery: { label: "In discovery", colorVar: "var(--color-hazard)" },
  motions: { label: "Motions pending", colorVar: "var(--color-orange)" },
  trial: { label: "At trial", colorVar: "var(--color-orange)" },
  judgment: { label: "Judgment", colorVar: "var(--color-danger)" },
  appeal: { label: "On appeal", colorVar: "var(--color-danger)" },
  resolved: { label: "Resolved", colorVar: "#3f7d34" },
  settled: { label: "Settled", colorVar: "#3f7d34" },
  dismissed: { label: "Dismissed", colorVar: "var(--color-fg-dim)" },
  nonsuited: { label: "Nonsuited", colorVar: "var(--color-fg-dim)" },
};

// Category -> label, used for section grouping and the card's category tag.
export const LITIGATION_CATEGORY_META: Record<
  LitigationCategory,
  { label: string; plural: string }
> = {
  nuisance: { label: "Nuisance & property", plural: "Nuisance, noise & property" },
  water: { label: "Water", plural: "Water" },
  zoning: { label: "Zoning & permitting", plural: "Zoning, permitting & land use" },
  environmental: { label: "Environmental", plural: "Environmental & regulatory" },
  utility: { label: "Electricity & utility", plural: "Electricity, utility & grid" },
};

export function getLitigation(): LitigationItem[] {
  if (!fs.existsSync(LITIGATION_DIR)) return [];
  // Files starting with "_" are templates/docs, never rendered.
  const files = fs
    .readdirSync(LITIGATION_DIR)
    .filter((f) => f.endsWith(".json") && !f.startsWith("_"));

  const out: LitigationItem[] = [];
  for (const file of files) {
    try {
      const d = JSON.parse(fs.readFileSync(path.join(LITIGATION_DIR, file), "utf8"));

      // Reject anything not captioned, not summarized, not categorized, not
      // status-typed, or not sourced — same guard as the legislation loader.
      if (typeof d.caption !== "string" || !d.caption.trim()) continue;
      if (typeof d.summary !== "string" || !d.summary.trim()) continue;
      if (!CATEGORIES.includes(d.category)) continue;
      if (!STATUSES.includes(d.status)) continue;
      if (typeof d.sourceUrl !== "string" || !/^https?:\/\//i.test(d.sourceUrl)) continue;

      out.push({
        slug: file.replace(/\.json$/, ""),
        category: d.category,
        caption: d.caption.trim(),
        court: typeof d.court === "string" ? d.court : undefined,
        docketNumber: typeof d.docketNumber === "string" ? d.docketNumber : undefined,
        jurisdiction: typeof d.jurisdiction === "string" ? d.jurisdiction : undefined,
        county: typeof d.county === "string" ? d.county : undefined,
        filedDate: typeof d.filedDate === "string" ? d.filedDate : undefined,
        status: d.status,
        harm: Array.isArray(d.harm)
          ? d.harm.filter((h: unknown): h is string => typeof h === "string")
          : undefined,
        plaintiffs: typeof d.plaintiffs === "string" ? d.plaintiffs : undefined,
        defendants: typeof d.defendants === "string" ? d.defendants : undefined,
        operator: typeof d.operator === "string" ? d.operator : undefined,
        summary: d.summary.trim(),
        whyItMatters: typeof d.whyItMatters === "string" ? d.whyItMatters : undefined,
        reliefSought: typeof d.reliefSought === "string" ? d.reliefSought : undefined,
        sourceUrl: d.sourceUrl,
        sourceName: typeof d.sourceName === "string" ? d.sourceName : undefined,
        docketUrl:
          typeof d.docketUrl === "string" && /^https?:\/\//i.test(d.docketUrl)
            ? d.docketUrl
            : undefined,
        lastAction: typeof d.lastAction === "string" ? d.lastAction : undefined,
        lastActionDate: typeof d.lastActionDate === "string" ? d.lastActionDate : undefined,
        national: d.national === true,
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

  // Most recent action first; undated entries sort last.
  return out.sort((a, b) => (b.lastActionDate ?? "").localeCompare(a.lastActionDate ?? ""));
}

// Texas cases grouped by category in a fixed order, for the page's main
// sections. National landmarks are excluded here (they get their own section).
// Empty categories are omitted so a sparse interim page never shows a blank one.
export function getTexasLitigationByCategory(): {
  category: LitigationCategory;
  items: LitigationItem[];
}[] {
  const all = getLitigation().filter((i) => !i.national);
  return CATEGORIES.map((category) => ({
    category,
    items: all.filter((i) => i.category === category),
  })).filter((group) => group.items.length > 0);
}

// The out-of-Texas landmark cases, shown as context/precedent below the Texas
// sections.
export function getNationalLitigation(): LitigationItem[] {
  return getLitigation().filter((i) => i.national);
}

export function getLitigationItem(slug: string): LitigationItem | undefined {
  return getLitigation().find((i) => i.slug === slug);
}

// ---------------------------------------------------------------------------
// Lifecycle tracker — where a case sits in the litigation process. Reuses the
// shared LifecycleTracker component (same golden-hour tracer as legislation).
// The current position comes from an explicit `stage` key when curated,
// otherwise it's derived from the coarser `status`. Terminal outcomes
// (settled / dismissed / nonsuited) stop the tracer where the case ended:
// settled reads green (resolution reached), dismissed/nonsuited read dim.
// ---------------------------------------------------------------------------

// Golden-hour ramp: cool "filed" dawn -> warm "trial/judgment" -> green
// "resolved" — mirrors BILL_TRACK's journey feel.
export const LITIGATION_TRACK: LifecycleStage[] = [
  { key: "filed", label: "Filed", color: "#3f7cac", blurb: "A petition or complaint is filed, opening the case." },
  { key: "answer", label: "Answer", color: "#4e8c7d", blurb: "The defendant is served and files an answer or a plea to the jurisdiction." },
  { key: "discovery", label: "Discovery", color: "#7e9b3e", blurb: "The parties exchange documents, written questions, and depositions." },
  { key: "motions", label: "Motions", color: "#c6a02e", blurb: "Dispositive motions — summary judgment or a plea to the jurisdiction — are briefed and heard." },
  { key: "trial", label: "Trial", color: "#d97a13", blurb: "The case is tried to a judge or jury." },
  { key: "judgment", label: "Judgment", color: "#c2560a", blurb: "The court enters a final judgment." },
  { key: "appeal", label: "Appeal", color: "#a8410a", blurb: "The judgment is challenged in an appellate court." },
  { key: "resolved", label: "Resolved", color: "#3f7d34", blurb: "The case is finally resolved and closed." },
];

const TRACK_KEYS = LITIGATION_TRACK.map((s) => s.key);

const POSITIVE_GREEN = "#3f7d34";
const DIM = "var(--color-fg-dim)";

// Map the coarse status onto a track index when no explicit stage is given.
function deriveIndex(status: LitigationStatus): number {
  switch (status) {
    case "filed": return 0;
    case "answered": return 1;
    case "discovery": return 2;
    case "motions": return 3;
    case "trial": return 4;
    case "judgment": return 5;
    case "appeal": return 6;
    case "resolved": return 7;
    // Terminal outcomes can happen at any stage; discovery is the most common
    // point a case settles or is dismissed. A curated `stage` overrides this.
    case "settled": return 2;
    case "dismissed": return 3;
    case "nonsuited": return 2;
    default: return 0;
  }
}

export function getLitigationLifecycle(item: LitigationItem): Lifecycle {
  const currentIndex =
    item.stage && TRACK_KEYS.includes(item.stage)
      ? TRACK_KEYS.indexOf(item.stage)
      : deriveIndex(item.status);

  // "resolved" is a normal completion (reaches the final green stage, not
  // terminal). settled / dismissed / nonsuited stop the tracer early.
  const terminal =
    item.status === "settled" ||
    item.status === "dismissed" ||
    item.status === "nonsuited";

  const terminalLabel = terminal ? LITIGATION_STATUS_META[item.status].label : undefined;
  // Settled reads as a (relatively) positive resolution; the dim outcomes read
  // as a case that ended without one.
  const terminalColor = item.status === "settled" ? POSITIVE_GREEN : DIM;

  return {
    track: LITIGATION_TRACK,
    currentIndex,
    terminal,
    terminalLabel,
    terminalColor: terminal ? terminalColor : undefined,
  };
}
