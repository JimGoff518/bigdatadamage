import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { topics } from "@/content/topics";
import { locations } from "@/content/locations";
import { getAllArticles } from "@/lib/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const staticRoutes = ["", "/damage", "/locations", "/your-rights", "/news", "/contact"].map(
    (path) => ({ url: `${base}${path}`, changeFrequency: "weekly" as const, priority: path === "" ? 1 : 0.7 })
  );

  const topicRoutes = topics.map((t) => ({
    url: `${base}/damage/${t.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const locationRoutes = locations.map((l) => ({
    url: `${base}/locations/${l.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const articleRoutes = getAllArticles().map((a) => ({
    url: `${base}/articles/${a.slug}`,
    lastModified: new Date(a.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...topicRoutes, ...locationRoutes, ...articleRoutes];
}
