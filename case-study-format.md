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

### Colors — by content type

Every piece of text on the page is one of four types. Which type it is determines its color — never pick a color ad hoc.

| Type | Color | Examples |
|---|---|---|
| **Tag** | project accent color | "CONTEXT", "IMPACT", "DESIGN SNAPSHOT", "PROBLEM", "SOLUTION", "TAKEAWAYS" section labels; "TIMELINE"/"TEAM"/"ROLE"/"TOOLS" hero meta labels |
| **Title** | `#fff` | the hero headline; section titles like "Repetitive workflows made simple tasks inefficient at scale" |
| **Body (正文)** | `#E2E2E2` | paragraph copy under Context/Design Snapshot/Problem/Solution/Takeaways |
| **Mini-heading inside body** | tag color (project accent) | a bolded lead-in inside a body paragraph, e.g. **"Early concept 1: Smart filter"** before its description, or a standalone small heading like "Why AI Command Bar?" — anything that functions as a label for the prose that follows it, even if it isn't in the sidebar/section-label position |

Two deliberate exceptions to the above:
- **Hero meta values** (the answers under Timeline/Team/Role/Tools — "Fall 2025", "IU HCI/d Team", etc.) are `#fff`, not `#E2E2E2`, even though they read like body content. The meta block is tag+white, not tag+body.
- **Impact metric** stat is its own two-part pattern, not tag+body: the big number (`.xx-metric-num`) is `#fff`, and its caption underneath (`.xx-metric-sub`) is `#979797` — a third gray reserved only for this stat-caption role, distinct from `#E2E2E2` body copy.

Page background is near-black, project-specific tint (`#0F1511`, `#0A190F`, etc.) set on `<html style="background:...">`.

### Accent color — one per project
Used for every "Tag" and "mini-heading inside body" instance on that project's page. Pick a color that complements the project's brand:
- AgencyRoot → `#E6FB99` (lime)
- Bytedance → `#63BDEE` (sky blue)
- Salesforce → `#63EED7` (teal)
- DiDi → `#FF9C6E` (orange)
- New project → pick an unused hue in the same tonal register (pastel, moderately saturated).

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
- `.xx-meta`: `display:flex; gap:80px;` — a row of label/value columns, always in this order: **Timeline, Team, Role, Tools**. Label = tag (accent color), uppercase, 0.8rem; value = `#fff` (the hero-meta exception, not `#E2E2E2`), 1.045rem, line-height 1.9, `<br>`-separated for multiple lines.

### Overview
```
.xx-overview-section { padding:0 196px 180px; display:flex; align-items:center; gap:48px; }
```
Two children side by side (text column + cover image/video, `max-width:860px` each):
1. **Context** block — tag + body (`#E2E2E2`), 1–2 short paragraphs of project background.
2. **Impact** block — tag + 1 to 3 stat metrics (`.xx-metric`: big Cormorant Infant number in `#fff` + Figtree sub-label caption in `#979797` underneath), laid out in a row with `gap:64px`.
3. **Design Snapshot** — tag + body (`#E2E2E2`), one-sentence summary of the shipped solution, sitting above the hero cover image or looping video.

### Problem (`id="problem"`)
```
.xx-problem-section { padding:0 196px 180px; }
.xx-problem-inner { max-width:860px; display:flex; flex-direction:column; gap:72px; }
```
One or more `.xx-problem-item` blocks, each: tag + title (`.xx-problem-title`, `#fff`, 1.6rem/400) + body paragraph (`.xx-problem-body`, `#E2E2E2`, line-height 1.8).

### Takeaways (always last, `id="takeaways"`)
Reuses the solution-section shell (see §5). Tag "Takeaways" + title "What I've learned" (`#fff`) + a `<ul>` of 2–3 bullet points (`#E2E2E2`), each a full sentence reflecting on the work.

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

Any bolded lead-in or small heading inside these patterns (a decision-card title, a compare-column heading, an iteration version label, a captioned concept like "Early concept 1: Smart filter") is a **mini-heading** — tag color, not `#fff` and not `#E2E2E2` — per §3.

---

## 6. Spacing system
- **Tag → whatever follows it, 16px** — tag→title and tag→body (Context/Design Snapshot/Solution/Takeaways/Problem/Background/Research headers) all use this. Implementation varies by context: a plain `gap:16px` wrapper where the tag sits alone with one sibling, or the `margin-bottom: calc(16px - <container-gap>)` trick where the tag lives inside a larger-gap flex container (48px/72px section gap).
- **Exception: hero meta label → value stays 12px**, not 16px — `.xx-meta-col label { margin-bottom:12px }`. Confirmed explicitly; don't "fix" this to match the 16px tag rule above.
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
