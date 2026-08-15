# Case Study Page Format

This is the format every project case-study page (`agencyroot.html`, `bytedance.html`, `salesforce.html`, `didi.html`, and any future project page) follows. When starting a new project page, copy an existing one (didi.html is the most complete reference) and rework it against this spec rather than building from scratch.

---

## 1. Page skeleton

Every case-study page has exactly this top-level structure:

```
<head>  → shared font @font-face / preload block (copy verbatim from any existing page)
<body>
  <nav>                     → shared site nav, identical across all pages
  <aside class="case-sidebar">  → scroll-spy jump links, one per <section id="">
  <main>
    [Hero]                  → required, id="overview"
    [Overview]              → required — Context + Impact + Design Snapshot
    [Problem]               → required, id="problem"
    ...flexible narrative sections...  → 1 or more, pick what the story needs (see §5)
    [Takeaways]             → required, always last, id="takeaways"
  </main>
  <footer>                  → shared site footer, identical across all pages
```

**Required sections, in order:** Hero → Overview → Problem → (flexible middle) → Takeaways.
Everything between Problem and Takeaways is chosen per project — see §5 for the available patterns and when to reach for each.

The sidebar's links must exactly match the section `id`s in the page, in the same order, and the first link starts with class `active` (JS scroll-spy takes over from there).

---

## 2. File setup

### Fonts (paste into `<head>`, identical on every page)
Preload + `@font-face` for: **Figtree** (weight 300–900, UI/body), **Source Serif 4** (weight 200–900, headline), **Crimson Text** (footer quote), **Cormorant Infant** (metric numbers, "More Works" italic titles). Copy this block verbatim from any existing case-study page — don't hand-roll it.

### Nav / footer
The `<nav>` and `<footer>` markup (logo, links, footer campfire game, social icons, email-copy button, and their JS) is shared site chrome, not part of the case-study content. Copy it byte-for-byte from an existing page. The only thing that ever changes is the `<title>` tag and the page background color set inline on `<html style="background:...">` (each project can use its own near-black tint, e.g. `#0F1511`).

### Naming convention
Every project gets its own 2–4 letter class prefix for content unique to that page (`didi-`, `sf-`, `bt-`). All prefixed classes follow the same suffix vocabulary across projects: `-hero-section`, `-top`, `-logo-lockup`, `-headline`, `-meta`, `-meta-col`, `-overview-section`, `-block-label`, `-block-text`, `-metric`, `-metric-num`, `-metric-sub`, `-problem-section`, `-problem-item`, `-problem-title`, `-problem-body`, `-solution-section`, `-solution-inner`, `-solution-content`, `-solution-img`, `-decision-card` (if used). Shared, non-prefixed classes (`.case-sidebar`, `.footer-*`, `.nav-*`) are never duplicated per project.

> Note: `agencyroot.html` and `bytedance.html` both currently reuse the `bt-` prefix (a leftover from copy-pasting bytedance's template for agencyroot). New pages should pick their own unused prefix instead of copying this.

---

## 3. Design tokens

### Colors
- Page background: near-black, project-specific tint (`#0F1511`, `#0A190F`, etc.) set on `<html style="background:...">`.
- Primary text: `#fff`.
- Body copy: `rgba(255,255,255,X)` — see opacity ladder below. Never pure white for paragraph text.
- **Accent color — one per project**, used consistently for: section labels/tags, hero meta labels, hint text, decision-hint icon+text, border-left accents on name/quote rows, and any inline highlighted term. Pick a color that complements the project's brand:
  - AgencyRoot → `#E6FB99` (lime)
  - Bytedance → `#63BDEE` (sky blue)
  - Salesforce → `#63EED7` (teal)
  - DiDi → `#FF9C6E` (orange)
  - New project → pick an unused hue in the same tonal register (pastel, moderately saturated).

### Body-text opacity ladder (rgba(255,255,255,X))
Use these bands for hierarchy — do not go above 0.93 (never pure white) or use values not in this rough ladder:
| Role | Opacity |
|---|---|
| Primary paragraph body | 0.85 |
| Secondary/supporting body | 0.75 |
| Card/quote body | 0.7–0.9 |
| Muted caption / sub-label under a stat | 0.5 |
| Persona/short description | 0.55 |
| Faint hint text ("Click me", disabled state) | 0.35–0.45 |
| Nav/sidebar inactive link | 0.35 |
| Nav/sidebar active or hover | 0.75 |

### Fonts
- **Source Serif 4**, weight 200, italic off — page headline only (`.xx-headline`, 2.125rem, line-height 1.3).
- **Figtree** — everything else: nav, sidebar, labels, body text, metric sub-labels, card titles.
- **Cormorant Infant** — big stat numbers (`.xx-metric-num`, 3.2rem, weight 400) and the italic "More Works" section title, if used.
- **Crimson Text** — footer quote only (shared chrome, not page-specific).

---

## 4. Required sections in detail

### Hero (`id="overview"`)
```
.xx-hero-section { display:flex; flex-direction:column; align-items:center; justify-content:center;
  min-height:100vh; padding:120px 196px 80px; gap:64px; }
```
- `.xx-top` (max-width:860px): company logo lockup (image, ~44px tall) + `<h1 class="xx-headline">` (the one-line project tagline).
- `.xx-meta`: `display:flex; gap:80px;` — a row of label/value columns, always in this order: **Timeline, Team, Role, Tools**. Label = accent color, uppercase, 0.8rem; value = `rgba(255,255,255,0.93)`, 1.045rem, line-height 1.9, `<br>`-separated for multiple lines.

### Overview
```
.xx-overview-section { padding:0 196px 180px; display:flex; align-items:center; gap:48px; }
```
Two children side by side (text column + cover image/video, `max-width:860px` each):
1. **Context** block — 1–2 short paragraphs of project background.
2. **Impact** block — 1 to 3 stat metrics (`.xx-metric`: big Cormorant Infant number + Figtree sub-label caption underneath), laid out in a row with `gap:64px`.
3. **Design Snapshot** — a label + one-sentence summary of the shipped solution, sitting above the hero cover image or looping video.

### Problem (`id="problem"`)
```
.xx-problem-section { padding:0 196px 180px; }
.xx-problem-inner { max-width:860px; display:flex; flex-direction:column; gap:72px; }
```
One or more `.xx-problem-item` blocks, each: title (`.xx-problem-title`, 1.6rem/400) + body paragraph (`.xx-problem-body`, 0.85 opacity, line-height 1.8).

### Takeaways (always last, `id="takeaways"`)
Reuses the solution-section shell (see §5). Title "What I've learned" + a `<ul>` of 2–3 bullet points, each a full sentence reflecting on the work. Body text sits at the brighter 0.85 opacity end.

---

## 5. Flexible middle sections — pick what fits the story

Not every project needs every pattern below. Choose based on what the case study actually needs to explain; skip the rest. Section IDs in the sidebar should match whatever subset is used.

| Pattern | When to use | Key classes |
|---|---|---|
| **Background** | The product/domain needs context before the problem makes sense | `.xx-bg-header`, `.xx-bg-title`, `.xx-bg-body` |
| **Insights / Research** | User research, journey mapping, or a pain-point breakdown drove the solution | freeform — e.g. Salesforce's `.sf-journey-grid` / `.sf-pain-card` stage columns |
| **Understanding Users** | Distinct user mindsets/personas shaped the design | `.xx-mindsets` row of `.xx-mindset-item` (image + name with accent border-left + description), optionally a pull-quote box (`.xx-users-quote`) and tag pills (`.xx-users-tag`) |
| **Solution N** (1 or more) | The core design work — always present in some form | `.xx-solution-section`, title + body + full-width `.xx-solution-img` |
| **Key Design Decisions** (accordion) | A solution needs to show several distinct decisions, each with supporting visuals | `.xx-decisions` → `.xx-decision-card` (title + body, hover-expands via CSS grid `0fr → 1fr` to reveal `.xx-decision-imgs`/captions). Hint text above: "Hover each card to see related designs." |
| **Before/After Compare** | Contrasting an old approach vs. the new one conceptually (not a screenshot diff) | `.xx-compare-grid` → two `.xx-compare-col`, each with heading + pill label + body + image |
| **Iteration log** | The design went through visible V1/V2/V3 revisions worth showing | Repeating `.xx-iteration-label` (`<strong>V1:</strong> ...`) + looping `.xx-iteration-video` + `.xx-iteration-critique` (what was learned from that version) |

All of these sections share the outer shell:
```
.xx-solution-section { padding:0 196px 180px; display:flex; flex-direction:column; align-items:center; }
.xx-solution-inner   { max-width:860px; display:flex; flex-direction:column; gap:72px; }
```
with the section label using the `calc(16px - 72px)` negative-margin trick so it sits 16px from the title despite the 72px container gap.

---

## 6. Spacing system
- Section label → title: **16px** (via `margin-bottom: calc(16px - <container-gap>)`)
- Title → body text: **24px**
- Text blocks within one section: **48px**
- Outer section inner gap (label/title/body/image stack): **72px**
- Between sections (bottom padding of each `.xx-*-section`): **180px** (desktop)
- Section horizontal padding: **196px** desktop

## 7. Responsive breakpoints
- `max-width:1100px` → hide `.case-sidebar`
- `max-width:860px` → section padding drops to `0 32px 80px`; hero padding `120px 32px 80px`; multi-column rows (meta, mindsets) collapse to 1 column
- `max-width:480px` → hero padding `100px 24px 60px`

---

## 8. New-page checklist
1. Duplicate `didi.html`, rename, update `<title>` and background color.
2. Pick a class prefix not already used (avoid `bt-`) and rename every `didi-*` class + reference.
3. Pick an accent color in the established tonal register.
4. Write Hero: logo, headline, Timeline/Team/Role/Tools meta.
5. Write Overview: Context, 1–3 Impact metrics, Design Snapshot.
6. Write Problem: 1–2 problem items.
7. Choose which flexible middle sections the story needs from §5 — don't include a pattern just because another project has it.
8. Write Takeaways: 2–3 bullet learnings.
9. Update the sidebar links to match the final section list, in order.
10. Add the project card to the homepage's Selected Works list (`index.html`) with matching accent (`data-accent`) and a `.project-tag` set.
