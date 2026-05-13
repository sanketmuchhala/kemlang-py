import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://kemlang.cloud";
  const now = new Date();

  return [
    { url: base,                                    lastModified: now, changeFrequency: "monthly", priority: 1.0 },
    { url: `${base}/docs`,                          lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/docs/installation`,             lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/docs/how-it-works`,             lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/docs/how-it-works/lexer`,       lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/docs/how-it-works/parser`,      lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/docs/how-it-works/interpreter`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/docs/how-it-works/runtime`,     lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/docs/language/syntax`,          lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/docs/language/variables`,       lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/docs/language/control-flow`,    lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/docs/examples`,                 lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/docs/cli`,                      lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/docs/errors`,                   lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/docs/roadmap`,                  lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/docs/github`,                   lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/playground`,                    lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/changelog`,                     lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];
}
