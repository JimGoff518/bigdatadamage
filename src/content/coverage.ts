// Local TV news coverage for location hubs.
//
// IP rule: we never host, download, or re-cut footage. We embed each station's
// OWN official YouTube upload (privacy-enhanced nocookie player) and link out to
// the original. Captions are BigDataDamage's own words — never transcript text.
// Only include videos uploaded by the station's official channel (verified via
// yt-dlp metadata: channel == "WFAA" | "CBS TEXAS").

export type CoverageVideo = {
  id: string; // YouTube video id
  station: string; // official channel, e.g. "WFAA", "CBS Texas"
  title: string; // the station's own title (for the link-out list)
  date: string; // upload date, ISO "YYYY-MM-DD"
  highlight?: boolean; // featured as an embedded player
  caption?: string; // BDD's original one-line framing (highlights only)
};

export const coverage: Record<string, CoverageVideo[]> = {
  granbury: [
    // ---- Featured (embedded) — the arc: harm → approval → lawsuit → escalation
    {
      id: "gBTuonnuURA",
      station: "CBS Texas",
      title: "North Texas community says crypto-mining facility means never-ending noise, declining health",
      date: "2024-07-17",
      highlight: true,
      caption:
        "An early look at the round-the-clock fan noise Hood County neighbors say has disrupted their sleep and health near the crypto-mining site.",
    },
    {
      id: "OhadC-eorzo",
      station: "WFAA",
      title: "Granbury City Council approves changes for new data center against the wishes of residents",
      date: "2026-04-08",
      highlight: true,
      caption:
        "Granbury's City Council approved zoning changes for a new data center despite organized resident opposition.",
    },
    {
      id: "23mQcSMqorw",
      station: "CBS Texas",
      title: "Granbury residents sue city over handling of massive data center proposal",
      date: "2026-04-12",
      highlight: true,
      caption:
        "Residents took the dispute to court, suing over how the city handled the data center proposal.",
    },
    {
      id: "8ecYhZEItYA",
      station: "CBS Texas",
      title: "Hood County approves 2,000-acre Comanche Circle data center plan",
      date: "2026-06-10",
      highlight: true,
      caption:
        "The fight's latest turn: Hood County signs off on a 2,000-acre data center plan at Comanche Circle.",
    },

    // ---- Full coverage list (link-out only), oldest → newest
    {
      id: "0aWmPzgpv6k",
      station: "WFAA",
      title: "How a Bitcoin mining facility is causing headaches, health concerns for Hood County residents",
      date: "2024-02-09",
    },
    {
      id: "1EX7zD7vtok",
      station: "WFAA",
      title: "Hood County residents urge action on Bitcoin mining facility noise in public hearing",
      date: "2024-02-14",
    },
    {
      id: "xSE8ItwRwKo",
      station: "WFAA",
      title: "Seeking to quiet Bitcoin mine's hum, Hood and Somervell County residents start petition",
      date: "2024-03-04",
    },
    {
      id: "DDT8oCAEm48",
      station: "WFAA",
      title: "Group demands answers over Bitcoin mine noise in North Texas",
      date: "2025-09-04",
    },
    {
      id: "et9rnQpLd7s",
      station: "WFAA",
      title: "Crypto mine noise drives Hood County residents to the ballot box — and possibly to cityhood",
      date: "2025-10-31",
    },
    {
      id: "QnDXUsmBGQo",
      station: "CBS Texas",
      title: "Residents push back on proposed Hood County data center near homes",
      date: "2026-02-10",
    },
    {
      id: "5yNwdfX9HPA",
      station: "WFAA",
      title: "AI data centers among industrial projects causing concern in Hood County",
      date: "2026-02-13",
    },
    {
      id: "J4gsy-h4BnQ",
      station: "CBS Texas",
      title: "Hood County commissioners reject data center moratorium for the second time",
      date: "2026-02-24",
    },
    {
      id: "zf5eJZyXpgQ",
      station: "CBS Texas",
      title: "Hood County to discuss data center proposals",
      date: "2026-03-24",
    },
    {
      id: "KNcSLqEXNRE",
      station: "CBS Texas",
      title: "City of Granbury considers zoning changes for data centers",
      date: "2026-04-07",
    },
    {
      id: "VrJZP2fEnGQ",
      station: "CBS Texas",
      title: "Granbury leaders to weigh data center proposals as residents raise concerns",
      date: "2026-04-07",
    },
    {
      id: "iBJfo-HTO_I",
      station: "WFAA",
      title: "City leaders discuss data centers out in Hood County, Texas",
      date: "2026-04-07",
    },
    {
      id: "Xq0OmZvvcHA",
      station: "CBS Texas",
      title: "Granbury residents sue over the handling of a data center construction proposal",
      date: "2026-04-10",
    },
  ],

  amarillo: [
    // ---- Featured (embedded) — the arc: stakes → council vote → protest → moratorium
    {
      id: "-t6X2hSQI3o",
      station: "ABC 7 Amarillo",
      title: "Community raises water concerns over world's largest AI data center in Texas",
      date: "2025-09-25",
      highlight: true,
      caption:
        "Amarillo residents raise water-supply alarms as Fermi America's “Project Matador” — billed as the world's largest AI campus — advances near the city.",
    },
    {
      id: "bKqQxPClZko",
      station: "ABC 7 Amarillo",
      title: "Amarillo council approves water sale to Fermi America amid pricing concerns",
      date: "2025-10-29",
      highlight: true,
      caption:
        "The City Council approved selling water to Fermi America over residents' objections about price and long-term supply.",
    },
    {
      id: "6_PZV0aKNOo",
      station: "KFDA NewsChannel 10",
      title: "Protest over Panhandle AI data centers held at Potter County Courthouse",
      date: "2025-09-22",
      highlight: true,
      caption:
        "Opponents rallied at the Potter County Courthouse against the Panhandle's rapid AI data-center buildout.",
    },
    {
      id: "3NKgub6GTsY",
      station: "ABC 7 Amarillo",
      title: "Amarillo leaders weigh 2-year moratorium on large-scale data centers amid resource concerns",
      date: "2026-05-29",
      highlight: true,
      caption:
        "With local resources stretched, Amarillo leaders weighed a two-year moratorium on large-scale data centers.",
    },

    // ---- Full coverage list (link-out only), oldest → newest
    {
      id: "0FNLdPYwbIw",
      station: "ABC 7 Amarillo",
      title: "Amarillo city council faces questions over AI data center water agreement claims",
      date: "2025-10-13",
    },
    {
      id: "vRA9LRFpdpE",
      station: "KFDA NewsChannel 10",
      title: "Amarillo City Council approves first reading for possible water agreement with Fermi America",
      date: "2025-10-15",
    },
    {
      id: "Eu3Rcx-SGs0",
      station: "ABC 7 Amarillo",
      title: "Amarillo council advances AI data center proposal amid water concerns",
      date: "2025-10-15",
    },
    {
      id: "O4o_nyrCo-M",
      station: "KAMR Local 4 News",
      title: "Amarillo Mayor Cole Stanley details agreement with Fermi America over water; residents speak up",
      date: "2025-10-15",
    },
    {
      id: "xoJJLT1GftM",
      station: "ABC 7 Amarillo",
      title: "Former Texas Gov. Rick Perry addresses concerns over AI data center's water use",
      date: "2025-10-23",
    },
    {
      id: "Jx7Y6CeeRUU",
      station: "ABC 7 Amarillo",
      title: "Amarillo council to vote on water sale for AI data center",
      date: "2025-10-28",
    },
    {
      id: "joMc3xemoyE",
      station: "KAMR Local 4 News",
      title: "Fermi America project aims to build the world's largest AI data center",
      date: "2025-10-30",
    },
    {
      id: "S0pjLDkzODU",
      station: "KFDA NewsChannel 10",
      title: "TCEQ holds public meeting on Fermi AI data center air quality permits",
      date: "2025-12-05",
    },
    {
      id: "utaSlIbCZQs",
      station: "KAMR Local 4 News",
      title: "Sitting down with Fermi America as they await TCEQ permits",
      date: "2026-02-10",
    },
    {
      id: "G4o_Umrb6NI",
      station: "ABC 7 Amarillo",
      title: "Texas seeks to regulate data centers' power and water use, Sid Miller says",
      date: "2026-06-11",
    },
  ],

  "san-marcos": [
    // ---- Featured (embedded) — the arc: opposition → rejection → citywide ban → human cost
    {
      id: "bsTsKtmXL4s",
      station: "KVUE",
      title: "San Marcos residents oppose 200-acre data center near their homes",
      date: "2025-08-21",
      highlight: true,
      caption:
        "San Marcos residents began organizing against a 200-acre data center proposed near their homes.",
    },
    {
      id: "NQh6UPdOAU8",
      station: "KVUE",
      title: "San Marcos leaders reject rezoning plan for $1.5B data center",
      date: "2026-02-18",
      highlight: true,
      caption:
        "City leaders rejected the rezoning a $1.5 billion data center needed, after sustained public opposition.",
    },
    {
      id: "8hfzbIdUwME",
      station: "KVUE",
      title: "San Marcos approves citywide ban on data centers",
      date: "2026-06-18",
      highlight: true,
      caption:
        "San Marcos went further than any Texas city yet — approving a citywide ban on data centers.",
    },
    {
      id: "kVkqzC63TUI",
      station: "KXAN",
      title: "“It's devastating”: Family's fight against a controversial AI data center ends",
      date: "2025-11-07",
      highlight: true,
      caption:
        "A Hays County family describes the toll of a drawn-out fight against a data center planned next door.",
    },

    // ---- Full coverage list (link-out only), oldest → newest
    {
      id: "tSDS1mCAnl4",
      station: "KXAN",
      title: "A new AI data center is coming to San Marcos",
      date: "2025-02-13",
    },
    {
      id: "BFAZnBHzsZY",
      station: "KVUE",
      title: "Hays County homeowners push back against planned data center",
      date: "2025-11-10",
    },
    {
      id: "WYBlHnRs8Vo",
      station: "KVUE",
      title: "Controversial data center plan returns in San Marcos",
      date: "2026-01-14",
    },
    {
      id: "OIL0RiNhZ84",
      station: "KVUE",
      title: "San Marcos residents share mixed opinions on planned 200-acre data center",
      date: "2026-01-14",
    },
    {
      id: "fyoEba3Bf18",
      station: "KXAN",
      title: "Water usage for San Marcos data center is among concerns of locals",
      date: "2026-02-13",
    },
    {
      id: "-CtjXI-zeoQ",
      station: "KVUE",
      title: "San Marcos leaders to take first vote on proposed $1.5B data center",
      date: "2026-02-17",
    },
    {
      id: "085c7ON-TQg",
      station: "KVUE",
      title: "Hays County judge seeks to limit development after concerns with data centers, water use",
      date: "2026-02-17",
    },
    {
      id: "l8F6SKcNixQ",
      station: "KVUE",
      title: "San Marcos weighs massive new data center amid protests",
      date: "2026-02-18",
    },
    {
      id: "jAgbWxqT_-A",
      station: "KVUE",
      title: "Farmers fear water restrictions as Hays County weighs data center ban",
      date: "2026-02-18",
    },
    {
      id: "-wAIn5gGyXg",
      station: "KXAN",
      title: "San Marcos Council nixes data center re-zoning plan",
      date: "2026-02-18",
    },
    {
      id: "iCye-v-CwsM",
      station: "KXAN",
      title: "San Marcos council takes steps toward stricter data center regulations",
      date: "2026-05-20",
    },
    {
      id: "x4cawpLPVmM",
      station: "KSAT 12",
      title: "San Marcos City Council votes to prohibit data centers citywide",
      date: "2026-06-18",
    },
    {
      id: "bzvnz-L4QzQ",
      station: "KVUE",
      title: "Hays County pauses future data center projects",
      date: "2026-06-23",
    },
    {
      id: "ZwYkTfWgfWM",
      station: "CBS Austin",
      title: "Hays County passes industrial high-water resolution targeting data center impacts",
      date: "2026-06-24",
    },
  ],
};

export const getCoverage = (slug: string): CoverageVideo[] => coverage[slug] ?? [];
