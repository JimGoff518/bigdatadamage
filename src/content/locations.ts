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
    slug: "amarillo",
    city: "Amarillo",
    county: "Potter County",
    region: "Texas Panhandle",
    aquifer: "Ogallala Aquifer",
    hot: true,
    intro:
      "Fermi America's enormous “Project Matador” AI campus is rising on thousands of acres near Amarillo, drawing on the already-declining Ogallala Aquifer. Residents have protested over what heavy water use could mean for farms, ranches, and the city's supply.",
  },
  {
    slug: "san-marcos",
    city: "San Marcos",
    county: "Hays County",
    region: "Central Texas",
    aquifer: "Edwards Aquifer",
    hot: true,
    intro:
      "San Marcos rejected a $1.5 billion data center proposal in early 2026 amid record-low Edwards Aquifer levels. With several projects eyeing Hays County, water advocates see the fight as just beginning.",
  },
  {
    slug: "temple",
    city: "Temple",
    county: "Bell County",
    region: "Central Texas",
    aquifer: "Trinity Aquifer",
    hot: true,
    intro:
      "Temple's council approved a $700 million data center over objections from scores of residents, and a recall effort followed. Neighbors point to water demand and strain on local infrastructure.",
  },
  {
    slug: "corpus-christi",
    city: "Corpus Christi",
    county: "Nueces County",
    region: "Gulf Coast",
    aquifer: "Gulf Coast Aquifer",
    hot: true,
    intro:
      "As Corpus Christi residents live under mandatory water restrictions, a nearby Bitcoin-mining operation has pulled millions of gallons during drought. The city's refusal to release usage records has fueled public frustration.",
  },
  {
    slug: "waco-lacy-lakeview",
    city: "Waco – Lacy Lakeview",
    county: "McLennan County",
    region: "Central Texas",
    aquifer: "Trinity Aquifer",
    hot: true,
    intro:
      "A $10 billion data center and power-plant project in Lacy Lakeview would need roughly two million gallons of wastewater a day. Rural neighbors near Waco have organized in opposition, and water access remains a sticking point.",
  },
  {
    slug: "harlingen",
    city: "Harlingen",
    county: "Cameron County",
    region: "South Texas",
    aquifer: "Gulf Coast Aquifer",
    hot: true,
    intro:
      "A proposed 1,800-acre data center outside Harlingen would draw millions of gallons a day of reclaimed water. The city approved a moratorium in 2026 to rework its land rules as residents raised water and power concerns.",
  },
  {
    slug: "sulphur-springs",
    city: "Sulphur Springs",
    county: "Hopkins County",
    region: "East Texas",
    aquifer: "Trinity Aquifer",
    hot: true,
    intro:
      "A sprawling AI data center campus broke ground near Sulphur Springs with plans for thousands of megawatts of capacity. The project is tangled in ongoing litigation that has drawn in the Texas Attorney General's office.",
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
    slug: "sweetwater",
    city: "Sweetwater",
    county: "Nolan County",
    region: "West Texas",
    aquifer: "Dockum Aquifer",
    intro:
      "A multibillion-dollar data center backed by a 10-year tax abatement is coming to Sweetwater. Residents worry about water depletion, power strain, and how a project this size will reshape a small rural town.",
  },
  {
    slug: "odessa",
    city: "Odessa",
    county: "Ector County",
    region: "West Texas",
    intro:
      "A joint venture has bought 235 acres near Odessa for a one-gigawatt-plus AI campus and is seeking access to municipal water and wastewater service — adding to water questions across the Permian Basin.",
  },
  {
    slug: "hillsboro",
    city: "Hillsboro",
    county: "Hill County",
    region: "North Central Texas",
    aquifer: "Trinity Aquifer",
    intro:
      "Hill County briefly paused data center development near Hillsboro, then rescinded the moratorium after a $100 million lawsuit. A 1,235-megawatt project (“Project Aquila”) has put the rural county on the map.",
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
  {
    slug: "laredo",
    city: "Laredo",
    county: "Webb County",
    region: "South Texas",
    intro:
      "Energy Abundance Development Corp. has proposed “Data City,” a 50,000-acre AI data-center campus near Laredo billed as one of the largest in the world. It lands in a county already strained over water: Laredo draws nearly all of its supply from the Rio Grande, holds only hours of stored water, and has been hunting for backup sources amid extreme drought. The developer has not disclosed how much water the project would use.",
  },
];

export const getLocation = (slug: string) => locations.find((l) => l.slug === slug);
