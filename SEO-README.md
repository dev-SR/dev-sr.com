# SEO & AEO Guide — dev-sr

Production SEO, social cards, structured data, and Answer Engine Optimization for [https://dev-sr.vercel.app](https://dev-sr.vercel.app).

Set `NEXT_PUBLIC_SITE_URL` in Vercel (or `.env.local`) when you attach a custom domain. Until then the site defaults to `https://dev-sr.vercel.app`.

---

## What was implemented

### 1. Central SEO config — `lib/seo.ts`

- Canonical site URL, titles, descriptions, brand colors (`#F08F87`, `#ACC5D3`, `#0A0A0A`)
- `constructMetadata()` for consistent Next.js `Metadata` (Open Graph, Twitter, canonical, robots, verification)
- Schema.org JSON-LD builders: Person, WebSite, Organization, TechArticle, LearningResource, BreadcrumbList, CollectionPage, ProfilePage, AboutPage, WebApplication, course ItemList

### 2. Social / Open Graph cards — `lib/og-card.tsx`

Dynamic 1200×630 cards via `next/og`, matching navbar branding:

- Logo mark (same path as `public/logo.svg`)
- “Sharukh” coral + “Rahman” slate wordmark
- Host watermark from `siteConfig.url`
- Glass panel, ambient brand glows, tags, author footer

Endpoints:

| Route | File |
| --- | --- |
| Site default OG / Twitter | `app/opengraph-image.tsx`, `app/twitter-image.tsx` |
| Dynamic blog / learn cards | `app/api/og/route.tsx` (`?kind=blog\|learn&slug=…`) |

> Next.js 16 does not allow `opengraph-image` under catch-all `[...slug]` segments, so per-post cards are served from `/api/og` and linked from metadata.

Preview after deploy:

- `https://dev-sr.vercel.app/opengraph-image`
- `https://dev-sr.vercel.app/api/og?kind=blog&slug=<post-slug>`
- `https://dev-sr.vercel.app/api/og?kind=learn&slug=<lesson-slug>`

### 3. Per-route metadata & JSON-LD

| Page | Metadata | Structured data |
| --- | --- | --- |
| Root layout | `metadataBase`, title template, verification | Person + WebSite + Organization |
| `/` | Home | Person |
| `/portfolio` | Profile | ProfilePage |
| `/blog` | Collection | CollectionPage |
| `/blog/...` | Article OG | TechArticle + BreadcrumbList |
| `/learn` | Catalog | ItemList |
| `/learn/...` | Lesson | LearningResource + BreadcrumbList |
| `/about` | About | AboutPage |
| `/tools/path-visualizer` | Tool | WebApplication |

JSON-LD is rendered via `components/seo/json-ld.tsx`.

### 4. Discovery files

| URL | Source |
| --- | --- |
| `/sitemap.xml` | `app/sitemap.ts` — static routes + all blog + learn pages |
| `/robots.txt` | `app/robots.ts` — search bots + AI crawlers (GPTBot, PerplexityBot, ClaudeBot, Google-Extended, …) |
| `/manifest.webmanifest` | `app/manifest.ts` |

### 5. LLM / AEO files

| URL | Purpose |
| --- | --- |
| `/llms.txt` | Compact site index for AI crawlers ([llms.txt](https://llmstxt.org/) style) |
| `/llms-full.txt` | Extended bio, projects, course outlines, citation guidance |

---

## Your action checklist (do this after deploy)

### A. Set environment variables (Vercel)

In **Vercel → Project → Settings → Environment Variables**:

| Variable | When | Example |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Always recommended | `https://dev-sr.vercel.app` (later `https://dev-sr.com`) |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | After Google Search Console gives you a meta token | `abc123…` |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | After Bing Webmaster Tools | `xyz789…` |

Redeploy after adding variables so metadata picks them up.

### B. Google Search Console (current host: `*.vercel.app`)

You **cannot** edit DNS for `vercel.app`, so use a **URL-prefix** property + HTML tag verification:

1. Open [Google Search Console](https://search.google.com/search-console).
2. Add property → **URL prefix** → `https://dev-sr.vercel.app`.
3. Choose **HTML tag** verification.
4. Copy the `content="…"` value from the meta tag Google shows.
5. Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` to that value in Vercel → Redeploy.
6. Click **Verify** in Search Console.
7. **Sitemaps** → submit `https://dev-sr.vercel.app/sitemap.xml`.
8. Use **URL Inspection** on `/`, `/blog`, `/learn`, and a few key posts → **Request indexing**.

Tips:

- Prefer HTTPS with no trailing slash inconsistency; the app normalizes the base URL without a trailing slash.
- Indexing can take days; request indexing only for important URLs, not every lesson at once.

### C. Bing Webmaster Tools

1. Open [Bing Webmaster Tools](https://www.bing.com/webmasters).
2. Add site `https://dev-sr.vercel.app`.
3. Import from Google Search Console **or** use the meta tag / XML file method.
4. If using meta verification, set `NEXT_PUBLIC_BING_SITE_VERIFICATION` and redeploy.
5. Submit the same sitemap URL.

### D. When you attach a custom domain (e.g. `dev-sr.com`)

1. In Vercel: **Domains** → add `dev-sr.com` (and `www` if desired) → follow DNS instructions at your registrar.
2. Update `NEXT_PUBLIC_SITE_URL` to `https://dev-sr.com` → Redeploy.
3. In Google Search Console, add a **Domain** property for `dev-sr.com` and verify with a **DNS TXT** record (best long-term).
4. Submit `https://dev-sr.com/sitemap.xml`.
5. Optionally set a 301 from the Vercel URL to the custom domain (Vercel domain settings / redirects) so equity consolidates.
6. Update any hard-coded mentions in `public/llms.txt` / `public/llms-full.txt` if you want them to show the custom domain (or regenerate those files to use the new host).

### E. IndexNow (optional — faster Bing / Yandex / partners)

1. Generate a key (random UUID string).
2. Host it at `https://<your-host>/<key>.txt` containing only that key (add under `public/`).
3. On each meaningful publish, POST to IndexNow:

```http
POST https://api.indexnow.org/indexnow
Content-Type: application/json

{
  "host": "dev-sr.vercel.app",
  "key": "<your-key>",
  "keyLocation": "https://dev-sr.vercel.app/<your-key>.txt",
  "urlList": [
    "https://dev-sr.vercel.app/blog/your-new-post"
  ]
}
```

You can run this manually after posting or wire it into a deploy hook / GitHub Action later.

---

## Validation checklist

After deploy, verify:

1. **View source / DevTools**
   - `<title>`, `<meta name="description">`
   - `og:title`, `og:image`, `twitter:card`
   - `link rel="canonical"`
   - `<script type="application/ld+json">` blocks

2. **Endpoints**
   - [/sitemap.xml](https://dev-sr.vercel.app/sitemap.xml)
   - [/robots.txt](https://dev-sr.vercel.app/robots.txt)
   - [/llms.txt](https://dev-sr.vercel.app/llms.txt)
   - [/manifest.webmanifest](https://dev-sr.vercel.app/manifest.webmanifest)
   - [/opengraph-image](https://dev-sr.vercel.app/opengraph-image)

3. **Rich results / schema**
   - [Google Rich Results Test](https://search.google.com/test/rich-results)
   - [Schema Markup Validator](https://validator.schema.org/)

4. **Social previews**
   - [opengraph.xyz](https://www.opengraph.xyz/)
   - [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
   - X/Twitter Card Validator (if available in your developer account)

5. **AI crawler policy**
   - Confirm `robots.txt` allows `GPTBot`, `PerplexityBot`, `ClaudeBot`, `Google-Extended` (already configured).

---

## Content authoring for SEO & LLM visibility

### Blog (`content/blog/**/*.mdx`)

Required frontmatter:

```yaml
title: 'Clear, specific title'
date: '2026-03-18'
excerpt: '1–2 sentence summary used for meta description and social cards.'
tags: ['ddd', 'dotnet']
```

Recommended:

```yaml
coverImage: '/path/in/public.jpg'
coverImageAlt: 'Accessible description of the cover'
```

### Learn (`content/learn/**`)

```yaml
title: 'Lesson title'
description: 'What the reader will learn (used as meta description).'
icon: 'Layers3'   # optional
badge: 'New'      # optional
```

### Writing tips that help rankings and AI citations

- Put the primary topic in the **H1-equivalent title** and first paragraph.
- Use descriptive headings (`##`, `###`) — they become TOC anchors and citation anchors.
- Prefer original explanations and working code over thin rewrites.
- Keep `excerpt` / `description` under ~160 characters when possible.
- Always set `coverImageAlt` when using a cover image.
- Link related lessons/posts internally (previous/next already helps on Learn).

---

## File map (quick reference)

```
lib/seo.ts                         # siteConfig + metadata + JSON-LD helpers
lib/og-card.tsx                    # shared OG ImageResponse template
components/seo/json-ld.tsx         # <JsonLd /> injector
app/layout.tsx                     # root metadata + Person/WebSite/Organization
app/opengraph-image.tsx            # default social card
app/twitter-image.tsx
app/api/og/route.tsx               # dynamic blog/learn social cards
app/sitemap.ts
app/robots.ts
app/manifest.ts
public/llms.txt
public/llms-full.txt
SEO-README.md                      # this file
```

---

## Ongoing maintenance

| Cadence | Action |
| --- | --- |
| Every new post/lesson | Deploy; optionally IndexNow the URL; request indexing for flagship pieces |
| Monthly | Check Search Console Coverage / Experience reports |
| After custom domain | Flip `NEXT_PUBLIC_SITE_URL`, resubmit sitemaps, update GSC property |
| When branding changes | Update `lib/og-card.tsx` / `siteConfig.brandColors` |

SEO is not a one-time switch — consistent publishing, accurate metadata, and Search Console monitoring matter more than any single tag.
