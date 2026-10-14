---
name: mdx-authoring
description: >-
  Author Learn lessons and blog MDX for this site using the shared component map.
  Use when writing or editing content under content/learn/ or content/blog/, or when
  the user asks for MDX lessons, docs, guides, or content aligned with site authoring.
---

# MDX authoring (this site)

Write `.mdx` that matches existing Learn courses (`mlops/01-mlflow`, `computer-vision`, `aspire-dotnet`). Prefer patterns those courses already use. Do not invent new wrapper components.

## Paths & frontmatter

| Surface | Path | URL |
| --- | --- | --- |
| Learn | `content/learn/<course>/...` | `/learn/...` |
| Blog | `content/blog/...` | `/blog/...` |

Numeric prefixes (`01-overview`) sort only — stripped from URLs.

**Learn frontmatter**

```yaml
---
title: 'Lesson title'
excerpt: 'One or two sentences. Inline `code` is OK — excerpts render as MDX.'
tags: ['topic']   # required on course root index.mdx only
icon: 'BookOpen'  # optional Lucide name
badge: 'New'      # optional
---
```

- No `date` / `coverImage` on Learn (blog needs `date`).
- Layout already renders `<h1>` from `title` — **start the body at `##`**.
- Do **not** insert `<br />` for spacing; block margins are automatic (`mb-6` between paragraphs/lists).

## What to use most ( empirically from those courses)

**Always fine (highest use):**

- `##` / `###` headings, `---` section breaks
- Paragraphs with **bold** and `` `inline code` ``
- Bullet / numbered lists (tight item leading is built-in)
- Fenced code (auto `CodeBlock` card). Prefer `title="path/file.ext"` when showing a real file
- Markdown tables
- `Figure` for images under `public/`
- `Mark` for handwritten underline / highlight on key phrases
- `Guide` + `GuideStep` for multi-step walkthroughs

**Use when the lesson needs them:**

- `DocsFileTabs` — multi-file code on Learn (not blog `CodeTabs`)
- `InstallTabs` / `InstallTab` + `Steps` / `Step` — install flows
- `CommandBlock` — package-manager command switcher
- `ItemList` / `ListItem` / `ListTitle` / `LineItem` — icon-led concept cards
- `FlowDiagram` / `Mermaid` — architecture / sequence
- `ComponentPreview` — live UI demos (GSAP lessons: TSX + HTML markup tabs inside `DocsFileTabs`)
- `Callout` — `note` | `tip` | `warning` | `dont`

**Do not use on Learn:** `CodeFrame`, `CodeTabs`, `MultiFileCodeBlock`. Prefer `DocsFileTabs`.

**Do not import components** in MDX — tags are provided by the renderer.

## Minimal examples

### Fenced code

````mdx
```python title="train.py"
import mlflow

with mlflow.start_run():
    mlflow.log_param("lr", 0.01)
```
````

Optional Shiki notes (aspire-dotnet uses these sparingly):

```text
// [!code ++]
// [!code --]
// [!code focus]
// [!code highlight]
```

### Figure

```mdx
<Figure
  src="/learn/mlops/mlflow/exp_run.png"
  alt="MLflow experiment runs table"
  caption="Runs in the tracking UI"
  width="720"
/>
```

### Mark

```mdx
<Mark type="underline" color="tip">performance metrics</Mark>
```

`type`: `underline` | `circle` | `box` | `highlight` | `strike-through` | `bracket`  
`color`: semantic (`tip`, `warning`, …) or CSS/`#hex`

### Guide

```mdx
<Guide title="Bootstrap" numbered>
  <GuideStep title="Create the project">

```bash
dotnet new aspire-starter -n ShopApp
```

  </GuideStep>
</Guide>
```

### DocsFileTabs (Learn multi-file)

````mdx
<DocsFileTabs title="AppHost wiring">

```csharp title="AppHost/Program.cs"
var builder = DistributedApplication.CreateBuilder(args);
```

```csharp title="ServiceDefaults/Extensions.cs"
public static TBuilder AddServiceDefaults<TBuilder>(this TBuilder builder)
```

</DocsFileTabs>
````

### Callout / InstallTabs (when needed)

```mdx
<Callout variant="tip" title="Prefer transforms">
  Animate `x` / `scale`, not `left` / `width`.
</Callout>

<InstallTabs>
  <InstallTab value="cli" label="CLI">
    <CommandBlock npm="npx foo init" pnpm="pnpm dlx foo init" />
  </InstallTab>
  <InstallTab value="manual" label="Manual">
    <Steps>
      <Step>Install the package.</Step>
      <Step>Wire it in AppHost.</Step>
    </Steps>
  </InstallTab>
</InstallTabs>
```

## Structure checklist

1. Frontmatter → body starts at `##`
2. Short intro paragraph, then sections with `##` / `###`
3. Prefer real `title="..."` on code fences over anonymous blocks
4. Put screenshots in `public/learn/...` and reference with `Figure`
5. Use `Guide` for procedural lessons; plain lists/tables for reference
6. Keep one idea per section; no hero chrome, no card spam
7. Excerpt may include `` `code` `` — it is MDX-rendered

## Full reference

Human-facing catalog with Source/Result demos: `content/blog/examples/content-authoring.mdx`  
Minimal agent copy: `content/blog/examples/content-authoring-minimal.mdx`
