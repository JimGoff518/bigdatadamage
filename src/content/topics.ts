export type Topic = {
  slug: string;
  name: string;
  short: string;
  icon: "water" | "air" | "home";
  headline: string;
  intro: string;
  accent: string; // tailwind color token name
  points: { title: string; body: string }[];
};

export const topics: Topic[] = [
  {
    slug: "water",
    name: "Stolen Water",
    short: "Data centers are pumping Texas aquifers dry.",
    icon: "water",
    accent: "water",
    headline: "They're Draining Texas Dry",
    intro:
      "A single large data center can consume millions of gallons of water a day to cool its servers. In much of Texas, groundwater is governed by the 'Rule of Capture' — the biggest pump wins. When a corporate facility drills deep, high-volume wells next door, neighboring landowners can watch their own wells sputter and their land begin to sink.",
    points: [
      {
        title: "Aquifer depletion",
        body: "Evaporative cooling towers can consume millions of gallons daily, drawing down the same aquifers that supply local wells, farms, and ranches.",
      },
      {
        title: "The Rule of Capture — and its limits",
        body: "Texas groundwater law generally protects the largest pumper. But the rule is not absolute: malicious or wasteful pumping, and pumping that damages a neighbor's land, may still create liability.",
      },
      {
        title: "Subsidence",
        body: "When an aquifer is over-pumped, the land above it can sink, crack foundations, and damage irrigation infrastructure — a direct, actionable harm to neighboring property owners.",
      },
      {
        title: "Permit protests",
        body: "Most Texas groundwater is overseen by regional Groundwater Conservation Districts. Landowners may be able to formally protest a facility's water permit before it is granted.",
      },
    ],
  },
  {
    slug: "air",
    name: "Poisoned Air",
    short: "Diesel backup generators foul neighborhood air.",
    icon: "air",
    accent: "ember",
    headline: "The Air They Leave Behind",
    intro:
      "Data centers rely on banks of large diesel backup generators and run them regularly for testing and during grid strain. The result can be localized smog, diesel particulate, and degraded air quality settling over nearby homes, schools, and neighborhoods.",
    points: [
      {
        title: "Diesel generator emissions",
        body: "Backup generator farms can release significant localized air pollution during testing cycles and grid events, concentrated right where people live.",
      },
      {
        title: "Air permits & the TCEQ",
        body: "These facilities require air permits from the Texas Commission on Environmental Quality. Permit terms — and violations — can be central to holding a facility accountable.",
      },
      {
        title: "Health & quality of life",
        body: "Residents near heavy emissions sources frequently report air quality concerns. Documenting the timeline of symptoms and emissions matters.",
      },
    ],
  },
  {
    slug: "property",
    name: "Ruined Property Value",
    short: "24/7 fan noise and industrial blight crush home values.",
    icon: "home",
    accent: "alarm",
    headline: "When the Fans Never Stop",
    intro:
      "The walls of cooling fans on a data center or crypto mine can produce constant, low-frequency noise that carries for blocks — rattling windows, ruining sleep, and driving down the value of every home nearby. Texas law protects a landowner's right to the 'quiet enjoyment' of their property.",
    points: [
      {
        title: "Constant low-frequency noise",
        body: "Industrial cooling fans can run 24/7 at volumes that interfere with sleep and the normal use of a home — a classic basis for a private nuisance claim.",
      },
      {
        title: "Diminution of property value",
        body: "When a facility makes neighboring homes harder to sell — or only sellable at a steep loss — that lost value is a concrete, measurable financial injury.",
      },
      {
        title: "Public & private nuisance",
        body: "Texas common law recognizes claims when someone substantially and unreasonably interferes with the use and enjoyment of your land.",
      },
    ],
  },
];

export const getTopic = (slug: string) => topics.find((t) => t.slug === slug);
