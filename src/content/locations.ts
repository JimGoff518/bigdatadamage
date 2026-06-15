export type Location = {
  slug: string;
  city: string;
  county: string;
  region: string;
  aquifer?: string;
  intro: string;
  hot?: boolean; // currently a hotspot of activity
};

export const locations: Location[] = [
  {
    slug: "granbury",
    city: "Granbury",
    county: "Hood County",
    region: "North Central Texas",
    aquifer: "Trinity Aquifer",
    hot: true,
    intro:
      "Granbury has become a flashpoint for data center and crypto-mining pushback, with residents raising alarms over constant fan noise and the process by which facilities were approved.",
  },
  {
    slug: "red-oak",
    city: "Red Oak",
    county: "Ellis County",
    region: "Dallas–Fort Worth Metroplex",
    aquifer: "Trinity Aquifer",
    hot: true,
    intro:
      "As development pushes south of Dallas, Red Oak landowners face new industrial-scale facilities and the water, air, and noise impacts that follow.",
  },
  {
    slug: "midlothian",
    city: "Midlothian",
    county: "Ellis County",
    region: "Dallas–Fort Worth Metroplex",
    aquifer: "Trinity Aquifer",
    hot: true,
    intro:
      "Midlothian's industrial corridor is drawing water-intensive data centers, raising concerns about aquifer drawdown and emissions for nearby property owners.",
  },
  {
    slug: "corsicana",
    city: "Corsicana",
    county: "Navarro County",
    region: "North Central Texas",
    aquifer: "Carrizo–Wilcox Aquifer",
    intro:
      "Large-scale facilities have targeted Navarro County, bringing questions about long-term water use and the effect on surrounding land values.",
  },
  {
    slug: "abilene",
    city: "Abilene",
    county: "Taylor County",
    region: "West Texas",
    aquifer: "Seymour Aquifer",
    intro:
      "West Texas water is scarce and precious. New data center projects near Abilene put pressure on already-stressed supplies.",
  },
];

export const getLocation = (slug: string) => locations.find((l) => l.slug === slug);
