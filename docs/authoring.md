# Content authoring guide

How to write posts for this site. Use this when adding or editing files under `content/`.

Live examples (source + rendered):

- `content/examples/markdown-all.mdx` → `/blog/examples/markdown-all`
- `content/examples/advanced-code-examples.mdx` → `/blog/examples/advanced-code-examples`
- `content/examples/advanced-rehype-pretty-code-shiki-examples.mdx` → `/blog/examples/advanced-rehype-pretty-code-shiki-examples`

---

## Where posts live

Every `.md` or `.mdx` file under `content/` becomes a blog post. Nested folders are topics in the blog tree.

| File | URL |
| --- | --- |
| `content/algorithms/sorting.mdx` | `/blog/algorithms/sorting` |
| `content/math/linear-algebra/01-vector-part-1.md` | `/blog/math/linear-algebra/01-vector-part-1` |

Rules:

- Use kebab-case folder and file names. The tree shows `linear-algebra` as `linear algebra`.
- Prefer `.mdx` whenever the post uses custom components (`Figure`, `CodeTabs`, `PathVisualizer`).
- Plain Markdown (headings, lists, math, fenced code) works in both `.md` and `.mdx`.
- Do not put authoring docs in `content/` — they would publish as posts.

Numeric prefixes (`01-vector-part-1.md`) are fine; they sort naturally in the tree.

---

## Frontmatter

YAML at the top of every post. Parsed by `gray-matter` in `lib/mdx.ts`.

```yaml
---
title: 'Understanding Vectors in Linear Algebra'
date: '2024-01-15'
excerpt: 'Vectors, operations, and geometric intuition.'
tags: ['math', 'linear-algebra', 'vectors']
coverImage: '/v1/content/math/linear-algebra/cover.png'
coverImageAlt: 'Two vectors added tip-to-tail'
---
```

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | Shown in the hero, cards, tree, and SEO. Missing title becomes `Untitled`. |
| `date` | yes | ISO date `YYYY-MM-DD`. Missing date becomes now. Recent posts sort by this. |
| `excerpt` | recommended | Card summary and hero subtitle. |
| `tags` | recommended | YAML array. Used for related posts and the “Best Topics” section. |
| `coverImage` | optional | Local path under `public/` or a remote URL. Cards and the hero only show a cover when this is set. |
| `coverImageAlt` | with cover | Accessible alt text. Falls back to `title`. |

The layout already renders `title` as the page `<h1>`. Start the body at `##` so the title is not duplicated. Headings `h1`–`h4` in the body feed the table of contents.

Reading time is computed from word count. Do not set it in frontmatter.

---

## Images

Put files in `public/` and reference them from the site root.

```text
public/v1/content/math/linear-algebra/cover.png
→ /v1/content/math/linear-algebra/cover.png
```

Markdown image:

```md
![BFS vs DFS traversal](/v1/demo.png)
```

Remote images currently work only for `images.unsplash.com` (`next.config.ts` `images.remotePatterns`). Add a host there before using another CDN.

---

## Custom MDX components

These are registered in `components/mdx/client.tsx` and `components/mdx/server.tsx`. Authors can use them as JSX tags in `.mdx` files. Do not import them.

`CodeBlock`, copy buttons, and syntax highlighting wrap fenced code automatically. Do not call those by hand. `CodeFrame` and `DocsCodeBlock` are deprecated aliases for `CodeBlock`.

### `Figure`

Captioned image with size and alignment. Prefer this over a raw `![alt](src)` when you need a caption or a specific width.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `src` | string | — | Path under `public/` or allowed remote URL. |
| `alt` | string | `'Image'` | Required for accessibility. |
| `caption` | string | — | Centered figcaption. |
| `width` / `height` | number \| string | `960` / `600` | Intrinsic size for `next/image`. |
| `size` | `'sm'` \| `'md'` \| `'lg'` \| `'full'` | `'md'` | Max width of the figure. |
| `align` | `'left'` \| `'center'` \| `'right'` | `'center'` | |
| `maxWidth` | number \| string | — | Extra max-width override. |
| `priority` | boolean | `false` | Set on the first large in-article image only. |

```mdx
<Figure
  src="/v1/content/math/linear-algebra/math.linear-algebra.vector-add-mul-geom.png"
  alt="Vector addition and scalar multiplication"
  caption="Fig 1. Geometric view of x + y and c x"
  width={500}
  size="sm"
/>
```

You can also wrap a Markdown image; `Figure` reads `src` / `alt` from the child:

```mdx
<Figure caption="A visual comparison of BFS and DFS" size="md">
  ![BFS vs DFS](/v1/demo.png)
</Figure>
```

### `CodeTabs`

Tabbed multi-file code. Wrap fenced blocks. Each fence should have `title="filename"` — that string becomes the tab label.

````mdx
<CodeTabs title="React component with styles">

```tsx title="Button.tsx"
export function Button({ children }: { children: React.ReactNode }) {
  return <button className="btn">{children}</button>
}
```

```css title="Button.css"
.btn {
  padding: 0.5rem 1rem;
}
```

</CodeTabs>
````

Notes:

- Optional `title` on `CodeTabs` is the group heading, not a filename.
- A single child fence still renders, without tabs.
- Copy copies the **active** file.
- Transformer comments (`[!code ++]`, and so on) work inside tabbed fences.

Do not use `MultiFileCodeBlock` or a `files={[...]}` prop. That API is deprecated and shows a migration warning.

### `PathVisualizer`

Interactive curriculum graph. Pass YAML or JSON as a string.

| Prop | Type | Default |
| --- | --- | --- |
| `script` | string \| object | required |
| `height` | number \| string | `600` |
| `theme.monthColors` | `Record<string, string>` | built-in pastels |

YAML shape (months → weeks → topics). Use a template string so `{ }` is not parsed as JSX:

```mdx
<PathVisualizer
  height={480}
  script={`
MONTH 1 — Foundations:
  Weeks:
    - Week 1:
        Title: Python & Linear Algebra
        Topics:
          - { name: "Vectors", slug: "vectors" }
          - { name: "Matrices", slug: "matrices" }
        DependsOn: []
    - Week 2:
        Title: Calculus
        Topics:
          - Derivatives
          - Gradients
        DependsOn: ["Week 1"]
`}
/>
```

`DependsOn` may be `"Week 1"` (same month) or `"Month 1: Week 1"`. Topic slugs should match post slugs when you want nodes to link into the blog.

Standalone playground: `/tools/path-visualizer`.

---

## Code fences (automatic)

Fenced blocks get Shiki highlighting (Dracula, no extra background), a filename/language chrome, and a copy button. No component tag needed.

### Language and filename

````md
```ts
const n = 1
```

```tsx title="Button.tsx"
export function Button() {
  return <button />
}
```

```python hideLineNumbers
def hello():
    print("hi")
```
````

`title="..."` is the header label and the `CodeTabs` tab name. Line numbers are **on by default**; add `hideLineNumbers` to a fence to turn them off.

### Line highlight (meta)

````md
```ts showLineNumbers {1-2}
console.log('highlighted')
console.log('also highlighted')
console.log('plain')
```
````

### Word highlight (meta)

````md
```ts /Hello/
const message = 'Hello World'
```

```js showLineNumbers /greeting/2#mySpecialHighlight
let greeting = 'Hello World!'
console.log(greeting)
```
````

The `/word/` form highlights every match. `/word/2` is the second match. `#id` is a highlight variant.

### Transformer comments (inside the code)

These are stripped from the copied text and drive line styles.

| Comment | Effect |
| --- | --- |
| `// [!code ++]` | Added line (green) |
| `// [!code --]` | Removed line (red) |
| `// [!code highlight]` | Highlighted line |
| `// [!code focus]` | Focus this line |
| `// [!code focus:2]` | Focus this line and the next one |
| `// [!code error]` | Error line |
| `// [!code warning]` | Warning line |
| `// [!code word:padding]` | Highlight the word `padding` |

````md
```ts
console.log('hewwo') // [!code --]
console.log('hello') // [!code ++]
console.error('boom') // [!code error]
```
````

Use the comment style of the language (`# [!code ++]` in Python, `/* [!code focus] */` in CSS).

Inline code (`` `npm install` ``) is styled separately and does not run transformers.

---

## Math (KaTeX)

Enabled via `remark-math` + `rehype-katex`. There is no `<Math>` MDX tag.

Inline:

```md
The vector $\mathbf{x} = (x_1, x_2, \dots, x_n)$ lives in $\mathbb{R}^n$.
```

Display:

```md
$$
\mathbf{x} + \mathbf{y} = (x_1 + y_1, \dots, x_n + y_n)
$$
```

Keep `$...$` tight against the formula (`$x$`, not `$ x $`) so Markdown does not eat the dollars. `strict: false` is on, so unknown commands should not crash the page.

---

## Standard Markdown

GitHub Flavored Markdown is on (`remark-gfm`): tables, strikethrough, task lists, autolinks.

```md
> Callouts are left-bordered blockquotes.

- Unordered
1. Ordered

| Algorithm | Average |
| --- | --- |
| Merge Sort | $O(n \log n)$ |

[Internal](/blog/algorithms/sorting)
[External](https://example.com)

~~deprecated~~
```

External links get an icon automatically. Headings get `id` slugs for the TOC (`rehype-slug`).

---

## Checklist for a new post

1. Create `content/<topic>/<slug>.mdx` (use `.mdx` if you need components).
2. Fill `title`, `date`, `excerpt`, `tags`. Add `coverImage` + `coverImageAlt` only when you have a real image.
3. Put images in `public/` and reference `/...` paths.
4. Start the body at `##`, not another `# Title`.
5. Use `CodeTabs` for related files; use transformer comments instead of screenshots of diffs.
6. Preview at `/blog/<topic>/<slug>`. Confirm the tree, cover, TOC, code copy, and math.

---

## Do not

- Import React components in the post. If it is not listed above, it is not available in MDX.
- Use `MultiFileCodeBlock`.
- Put this guide, READMEs, or drafts in `content/`.
- Repeat the frontmatter title as an H1.
- Invent frontmatter keys (`author`, `draft`, `published`). They are ignored.
- Hotlink images from hosts that are not in `next.config.ts`.

---

## Learn docs (`content/learn/`)

Study materials live under `content/learn/` and publish at `/learn/...`. They are **not** blog posts — the blog crawler skips `content/learn/`.

| File | URL |
| --- | --- |
| `content/learn/aspire-dotnet/index.mdx` | `/learn/aspire-dotnet` |
| `content/learn/aspire-dotnet/02-apphost/01-resources.mdx` | `/learn/aspire-dotnet/apphost/resources` |

Numeric folder/file prefixes (`01-overview`) control sort order only; they are stripped from URLs.

### Learn frontmatter

```yaml
---
title: 'Declaring Resources'
description: 'Add databases and service references in AppHost.'
icon: 'Database'
badge: 'New'
---
```

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | Page and sidebar label |
| `description` | recommended | Subtitle under the title |
| `icon` | optional | Lucide name: `BookOpen`, `Boxes`, `Code2`, `Database`, `Layers3`, `Network`, `Server` |
| `badge` | optional | `New` / `Updated` pill in sidebar |

No `date` or `coverImage`. Start body at `##`.

### Learn-only MDX components

Learn uses the same **CodeBlock** as blog posts (expandable fences with language badge + copy). Learn-only wrappers: `DocsFileTabs` instead of `CodeTabs`.

| Component | Use |
| --- | --- |
| `ComponentPreview` | Static Preview \| Code for frontend demos |
| `DocsFileTabs` | Multi-file tabs in docs chrome |
| `InstallTabs` + `InstallTab` | CLI \| Manual install sections |
| `Guide` + `GuideStep` | Full-page step-by-step tutorials (install walkthroughs) |
| `Steps` + `Step` | Compact numbered steps inside `InstallTabs` manual tab |
| `CommandBlock` | pnpm/npm/yarn/bun command tabs |
| `Mermaid` | Explicit diagram (`chart` prop) or ` ```mermaid ` fence |
| `FlowDiagram` | Architecture graphs (`script` YAML/JSON) |
| `PathVisualizer` | Curriculum YAML graphs |

`Button`, `Card`, `Badge`, `Input` are available inside `ComponentPreview`.

### Examples

```mdx
<ComponentPreview>
  <Button>Save</Button>

```tsx title="save-button.tsx"
<Button>Save</Button>
```
</ComponentPreview>
```

```mdx
<InstallTabs>
  <InstallTab value="cli" label="CLI">
    <CommandBlock pnpm="dotnet add package Aspire.Hosting" npm="dotnet add package Aspire.Hosting" />
  </InstallTab>
  <InstallTab value="manual" label="Manual">
    <Steps>
      <Step>Install dependencies</Step>
      ```bash
      dotnet add package Aspire.Hosting.PostgreSQL
      ```
    </Steps>
  </InstallTab>
</InstallTabs>
```

```mdx
<Guide title="Tailwind CSS v4 Installation" numbered>
  <GuideStep title="Create your project">

```bash
npx create-next-app@latest my-project --typescript --eslint
cd my-project
```

  </GuideStep>

  <GuideStep title="Create your CSS file">
    Create a new CSS file (e.g., `app/globals.css`) and add the Tailwind import:

```css title="app/globals.css"
@import "tailwindcss";
```
  </GuideStep>
</Guide>
```

- `Guide` optional props: `title` (section heading), `numbered` (default `false` — grey pill markers; `true` — numbered circles).
- `GuideStep` requires `title`; children can be prose, inline code, and fenced blocks (rendered via `CodeBlock`).

Long C# files use normal fences with `title="path/file.cs"` — they auto-collapse with **Expand**.
