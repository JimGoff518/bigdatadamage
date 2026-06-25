import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileCTABar } from "@/components/MobileCTABar";
import { NewsTicker } from "@/components/NewsTicker";

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
    // Fallback social card for every page without its own OG image.
    images: [{ url: "/images/hero-fenceline.jpg", width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: ["/images/hero-fenceline.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  // Paste the token from Google Search Console here when you verify (HTML-tag method).
  // verification: { google: "YOUR_GOOGLE_VERIFICATION_TOKEN" },
};

// Sitewide brand entity for search engines.
const orgJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.name,
      url: site.url,
      description: site.description,
      image: `${site.url}/images/hero-fenceline.jpg`,
      logo: {
        "@type": "ImageObject",
        url: `${site.url}/images/logo-mark.png`,
        width: 512,
        height: 512,
      },
      // TODO: add `sameAs` once verified profile URLs are available
      // (LinkedIn, @getgoff YouTube, X, Facebook, Wikidata) — entity grounding.
      knowsAbout: [
        "Texas groundwater rights",
        "data center water usage",
        "property value diminution",
        "rule of capture",
        "Groundwater Conservation District permit protests",
        "nuisance law",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+1-214-206-3377",
        contactType: "legal intake",
        areaServed: "US-TX",
        availableLanguage: "English",
      },
      // Sponsoring firm (Texas Bar advertising). The Dallas, TX address
      // disambiguates from the unrelated similarly named firm in Connecticut
      // (same surname only). URL intentionally omitted to keep BigDataDamage
      // walled off from gofflawdfw.com.
      publisher: {
        "@type": "LegalService",
        name: site.sponsor,
        areaServed: { "@type": "State", name: "Texas" },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Dallas",
          addressRegion: "TX",
          addressCountry: "US",
        },
      },
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      publisher: { "@id": `${site.url}/#organization` },
      inLanguage: "en-US",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${oswald.variable} ${inter.variable} h-full scroll-smooth antialiased`}>
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <NewsTicker />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileCTABar />
      </body>
    </html>
  );
}
