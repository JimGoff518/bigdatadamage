// Curated research library backing the BigDataDamage resources page.
//
// SOURCING RULE (IP-safe): we never rehost publisher PDFs. Each study links to
// its OFFICIAL source landing page or open-access PDF, so any download happens
// from the publisher (PMC, Frontiers, arXiv, the agency), not from us. All
// summaries below are written in our own words.
//
// "evidence" tells the reader how directly a study bears on data centers:
//   direct    — studies/reporting about actual data centers
//   modeled   — projections/estimates from emissions or lifecycle models
//   analogous — robust science on the same exposure (noise, diesel, etc.)
//               applied to data centers by analogy, not measured at one

export type EvidenceType = "direct" | "modeled" | "analogous";

export type StudyKind =
  | "Peer-reviewed study"
  | "Government / agency report"
  | "Preprint (not peer-reviewed)"
  | "Investigative report";

export type Study = {
  title: string;
  source: string; // journal / publisher / outlet
  year: number;
  kind: StudyKind;
  evidence: EvidenceType;
  summary: string; // our own words
  url: string; // official source — always the canonical landing page / full text
  pdf?: boolean; // true when `url` itself opens/downloads the full PDF at the source
  file?: string; // root-relative path to a copy we host (only CC-BY / public-domain works)
  license?: string; // e.g. "CC BY 4.0" — shown when we host the file, for attribution
};

export type StudyCategory = {
  slug: string;
  title: string;
  icon: "doc" | "air" | "water" | "home" | "shield";
  intro: string;
  studies: Study[];
};

export const studyCategories: StudyCategory[] = [
  {
    slug: "data-center-direct",
    title: "Data centers & health — the direct evidence",
    icon: "doc",
    intro:
      "Research that looks at data centers specifically. Note the honest state of the field: a 2026 peer-reviewed review concludes there is not yet direct epidemiology measuring health outcomes in people living near a facility. The strongest numbers so far come from emissions and lifecycle models, not from studies of actual neighbors.",
    studies: [
      {
        title:
          "Public health and environmental dimensions of data center growth (mini-review)",
        source: "Frontiers in Climate",
        year: 2026,
        kind: "Peer-reviewed study",
        evidence: "direct",
        summary:
          "A peer-reviewed review of what is — and is not — known about data centers and health. It documents the 40–59 dB hum, thousands of diesel backup generators, and large water draws, while stating plainly that direct epidemiological evidence linking facilities to measured health outcomes does not yet exist.",
        url: "https://www.frontiersin.org/journals/climate/articles/10.3389/fclim.2026.1648912/full",
        file: "/studies/frontiers-climate-2026-data-centers-health.pdf",
        license: "CC BY 4.0",
      },
      {
        title:
          "The Unpaid Toll: Quantifying the public health impact of AI data centers",
        source: "arXiv preprint (Caltech / UC Riverside authors)",
        year: 2024,
        kind: "Preprint (not peer-reviewed)",
        evidence: "modeled",
        summary:
          "A lifecycle model estimating that, on current trajectories, air pollution tied to U.S. data center electricity and backup generators could carry a public-health cost exceeding $20 billion per year by 2028. These are modeled projections, not measured outcomes near specific facilities.",
        url: "https://arxiv.org/pdf/2412.06288",
        pdf: true,
      },
      {
        title:
          "California data center health impacts tripled in four years",
        source: "UC Riverside News (with the think tank Next 10)",
        year: 2025,
        kind: "Investigative report",
        evidence: "modeled",
        summary:
          "Reporting on UC Riverside research (Shaolei Ren) finding that the public-health burden from California data-center pollution roughly tripled from 2019 to 2023 and could rise another ~72% by 2028 without policy change — driven by diesel-generator nitrogen oxides, fine particulates, and gas-plant emissions. The researchers stress these are modeled estimates made 'in the dark' because facilities disclose little environmental data.",
        url: "https://news.ucr.edu/articles/2025/11/21/california-data-center-health-impacts-tripled-4-years",
        pdf: false,
      },
      {
        title: "The dangers of data centers",
        source: "Environmental Health Project (nonprofit)",
        year: 2025,
        kind: "Investigative report",
        evidence: "direct",
        summary:
          "A plain-language overview from the Environmental Health Project, a nonprofit, that pulls the concerns together in one place — generator and power-plant air pollution (citing the 2025 modeling projecting ~1,300 premature deaths and over $20B in health costs a year by 2030), heavy water use, light pollution, and noise. It is an advocacy-oriented summary that leans on peer-reviewed and government sources rather than a study in its own right.",
        url: "https://www.environmentalhealthproject.org/post/the-dangers-of-data-centers",
        pdf: false,
      },
    ],
  },
  {
    slug: "noise-health",
    title: "Noise → sleep, stress & cardiovascular health",
    icon: "home",
    intro:
      "Data centers run a constant 24/7 hum. There is no long-term study of that specific hum yet, but there is a deep, high-quality body of science on environmental and traffic noise at comparable levels — the closest analog for what neighbors are exposed to.",
    studies: [
      {
        title:
          "WHO systematic review: environmental noise and cardiovascular / metabolic effects",
        source: "Int. Journal of Environmental Research & Public Health (van Kempen et al.)",
        year: 2018,
        kind: "Peer-reviewed study",
        evidence: "analogous",
        summary:
          "The systematic review underpinning the WHO noise guidelines. It found the risk of ischemic heart disease rises about 8% for every 10-decibel increase in road-traffic noise (rated high-quality evidence), with risk climbing continuously from roughly 50 dB and no clear safe threshold.",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5858448/",
        file: "/studies/van-kempen-2018-noise-cardiovascular-who.pdf",
        license: "CC BY 4.0",
      },
      {
        title: "Environmental noise and the cardiovascular system (mechanisms)",
        source: "Journal of the American College of Cardiology (Hahad et al.)",
        year: 2019,
        kind: "Peer-reviewed study",
        evidence: "analogous",
        summary:
          "Explains how chronic noise harms the body even during sleep: it triggers a stress response that raises cortisol and adrenaline, elevates blood pressure, and promotes vascular inflammation — the biological pathway linking persistent noise to heart disease.",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6878772/",
        pdf: false,
      },
      {
        title: "Transportation noise and cardiovascular risk — updated review",
        source: "Journal of Exposure Science & Environmental Epidemiology (Münzel et al.)",
        year: 2024,
        kind: "Peer-reviewed study",
        evidence: "analogous",
        summary:
          "A recent synthesis estimating roughly a 3% increase in cardiovascular risk per 10-decibel rise in transportation noise, with significant associations for stroke, heart failure, and cardiovascular death, and measurable effects beginning around 45 dB.",
        url: "https://www.nature.com/articles/s41370-024-00732-4",
        pdf: false,
      },
      {
        title: "WHO systematic review: environmental noise and effects on sleep",
        source: "Int. Journal of Environmental Research & Public Health (Basner & McGuire)",
        year: 2018,
        kind: "Peer-reviewed study",
        evidence: "analogous",
        summary:
          "The companion to the WHO cardiovascular review, focused on sleep. It found sufficient evidence that nighttime transportation noise fragments sleep and raises awakenings and self-reported disturbance — the pathway by which a constant nighttime hum can wear on health over time. The sleep evidence is from traffic and aircraft noise, applied by analogy.",
        url: "https://www.mdpi.com/1660-4601/15/3/519",
        pdf: false,
      },
    ],
  },
  {
    slug: "diesel-air",
    title: "Diesel backup generators & air quality",
    icon: "air",
    intro:
      "Large data centers keep banks of diesel generators on standby and run them for testing. Diesel exhaust is a recognized health hazard; these sources document both the emissions and the underlying harm.",
    studies: [
      {
        title:
          "Air-quality impact of stationary diesel backup generators in the Northeast",
        source: "NESCAUM (Northeast States for Coordinated Air Use Management)",
        year: 2014,
        kind: "Government / agency report",
        evidence: "analogous",
        summary:
          "An air-agency analysis of stationary diesel backup generators — the same class of equipment data centers rely on — detailing their NOx and fine-particulate emissions and the disproportionate pollution they create relative to their run-hours.",
        url: "https://www.nescaum.org/documents/nescaum-aq-electricity-stat-diesel-engines-in-northeast_20140102.pdf",
        pdf: true,
      },
      {
        title:
          "Modeled NOx emissions from data center generator testing in Texas",
        source: "arXiv preprint",
        year: 2025,
        kind: "Preprint (not peer-reviewed)",
        evidence: "modeled",
        summary:
          "A modeling estimate that routine generator testing alone at a single large Texas facility can emit on the order of 12 metric tons of NOx per year, worsening ozone in the Dallas–Fort Worth and Houston areas, which are already in federal ozone non-attainment. A single-author preprint, not peer-reviewed.",
        url: "https://arxiv.org/pdf/2509.21312",
        pdf: true,
      },
      {
        title:
          "Northern Virginia data center air pollution rivals power-plant emissions",
        source: "VCU News (Virginia Commonwealth University)",
        year: 2025,
        kind: "Investigative report",
        evidence: "direct",
        summary:
          "Reporting on VCU research finding that backup-generator emissions of CO, NOx, and fine particulates across Northern Virginia's data center corridor rose sharply from 2015 to 2023 — a real-world look at emissions from an actual data center cluster.",
        url: "https://news.vcu.edu/article/northern-virginia-data-center-air-pollution-rivals-power-plant-emissions",
        pdf: false,
      },
      {
        title:
          "Data centers' use of diesel generators for backup power is commonplace — and problematic",
        source: "Inside Climate News (Arcelia Martin)",
        year: 2025,
        kind: "Investigative report",
        evidence: "direct",
        summary:
          "Investigative reporting on the diesel backup generators that keep data centers at 99.999% uptime. It notes the American Cancer Society links diesel emissions to heart and lung disease and cancer, that natural-gas generators emit far less NOx, and that operators largely self-report emissions to Texas and federal regulators — in metro areas that already violate air-quality standards.",
        url: "https://insideclimatenews.org/news/12112025/data-center-diesel-generators-noise-pollution/",
        pdf: false,
      },
    ],
  },
  {
    slug: "water",
    title: "Water use, aquifers & contamination",
    icon: "water",
    intro:
      "Cooling consumes enormous volumes of water and can stress local aquifers and wells. These sources document the consumption and the contamination pathways. Most treat groundwater and discharge risks as potential harms drawn from the broader literature rather than harm measured at a specific facility.",
    studies: [
      {
        title: "How data centers impact surface and ground waters",
        source: "University of Georgia, College of Ag & Environmental Sciences (Field Report TP121)",
        year: 2025,
        kind: "Government / agency report",
        evidence: "analogous",
        summary:
          "A land-grant university field report: medium facilities can use up to 300,000 gallons a day and large ones up to 5 million, much of it drinking-quality; groundwater pumping can lower water tables and affect private wells; and cooling-tower discharge can carry biocides, heavy metals, glycols, and PFAS that are hard to remove.",
        url: "https://fieldreport.caes.uga.edu/publications/TP121/how-data-centers-impact-surface-and-ground-waters/",
        pdf: false,
      },
      {
        title: "Water consumption of data centers — national and local assessment",
        source: "AGU Advances (American Geophysical Union)",
        year: 2025,
        kind: "Peer-reviewed study",
        evidence: "direct",
        summary:
          "A peer-reviewed assessment confirming data centers evaporate on the order of 1–9 liters per kilowatt-hour and that, while the national water footprint is modest, the impact is significant and concentrated in already water-stressed regions — the situation across much of Texas.",
        url: "https://agupubs.onlinelibrary.wiley.com/doi/10.1029/2025AV002140",
        pdf: false,
      },
      {
        title: "Making AI less 'thirsty': the secret water footprint of AI models",
        source: "arXiv preprint (UC Riverside / UT Arlington); later in Communications of the ACM",
        year: 2023,
        kind: "Preprint (not peer-reviewed)",
        evidence: "modeled",
        summary:
          "The widely-cited estimate of AI's water footprint: training a model like GPT-3 in U.S. data centers can directly evaporate roughly 700,000 liters of clean freshwater, and global AI water withdrawal could reach 4.2–6.6 billion cubic meters a year by 2027. Modeled figures, since published in a peer-reviewed ACM journal.",
        url: "https://arxiv.org/pdf/2304.03271",
        pdf: true,
      },
      {
        title: "Toxicological Profile for Perfluoroalkyls (PFAS)",
        source: "ATSDR, U.S. Department of Health & Human Services",
        year: 2021,
        kind: "Government / agency report",
        evidence: "analogous",
        summary:
          "The federal health agency's profile of PFAS — the 'forever chemicals' that can turn up in cooling-tower discharge. It links PFAS exposure to effects on the liver, immune system, and cholesterol, to raised blood pressure in pregnancy, and to increased risk of some cancers, and explains why they are so hard to remove from water. It establishes why the contamination pathway matters; it does not measure PFAS near a specific data center.",
        url: "https://www.atsdr.cdc.gov/toxprofiles/tp200.pdf",
        pdf: true,
      },
    ],
  },
  {
    slug: "infrasound-livestock",
    title: "Low-frequency hum, infrasound & livestock",
    icon: "shield",
    intro:
      "Two of the most-asked-about concerns — the sub-audible 'hum' and effects on animals — have the thinnest direct evidence. We include the best available analogs and label them honestly so you can weigh them fairly.",
    studies: [
      {
        title:
          "Health effects related to wind turbine sound: an update",
        source: "International Journal of Environmental Research & Public Health",
        year: 2021,
        kind: "Peer-reviewed study",
        evidence: "analogous",
        summary:
          "The closest analog for the low-frequency hum debate. It finds audible turbine sound reliably causes annoyance and sleep disturbance, but concludes that sub-audible infrasound is highly unlikely to cause adverse health effects and that cardiovascular links are not established. A useful counter to overstated 'infrasound sickness' claims.",
        url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8430592/",
        file: "/studies/wind-turbine-sound-health-2021.pdf",
        license: "CC BY 4.0",
      },
      {
        title: "Noise as a factor of environmental stress for cattle — a review",
        source: "Annals of Animal Science (Angrecka et al.)",
        year: 2023,
        kind: "Peer-reviewed study",
        evidence: "analogous",
        summary:
          "No study examines cattle raised near a data center, but this peer-reviewed review of the cattle-noise science is directly relevant to Texas ranch and dairy land. It documents that once sound exceeds roughly 80–90 dB, it can disrupt adrenal and hormone function, lower milk yield, raise somatic cell counts, and impair fertility — with discomfort at 90–100 dB. Those documented effects occur at higher levels than a data-center hum, so the link is by analogy, not direct proof.",
        url: "https://sciendo.com/article/10.2478/aoas-2023-0046",
        file: "/studies/noise-environmental-stress-cattle-2023.pdf",
        license: "CC BY 4.0",
      },
    ],
  },
];

// Internal guides on this site that help landowners act on the research above.
export const actionGuides: { title: string; href: string; blurb: string }[] = [
  {
    title: "Your Rights: Texas water & property law",
    href: "/your-rights",
    blurb: "Rule of Capture, subsidence, nuisance, quiet enjoyment, and permit protests — in plain English.",
  },
  {
    title: "How to protest a data center's air permit with the TCEQ",
    href: "/articles/how-to-protest-a-data-center-s-air-permit-with-the-tceq",
    blurb: "Step-by-step on opposing an air permit before it's finalized.",
  },
  {
    title: "How to protest a data center water permit in Texas",
    href: "/articles/how-to-protest-data-center-water-permit-texas",
    blurb: "Where to push back on groundwater permits through your local GCD.",
  },
  {
    title: "What evidence to preserve if a data center is harming your property",
    href: "/articles/what-evidence-to-preserve-if-a-data-center-is-harming-your-property",
    blurb: "Documenting noise, water, and value loss so it counts later.",
  },
];
