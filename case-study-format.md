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

The sidebar's links must exactly match the section `id`s in the page, in the same order, and the first link starts with class `active` (JS scroll-spy takes over from there). Clicking a sidebar link intercepts the native anchor jump and calls `scrollIntoView({behavior:'smooth', block:'start'})` on the target section instead — smooth-scrolling to it rather than snapping instantly. This relies on `scroll-margin-top:140px` already being set on every section id (accounts for the fixed nav).

---

## 2. File setup

### Fonts (paste into `<head>`, identical on every page)
Preload + `@font-face` for: **Figtree** (weight 300–900, UI/body/section titles), **Source Serif 4** (weight 200–900, hero headline only), **Crimson Text** (footer quote), **Cormorant Infant** (metric numbers, "More Works" italic titles). Copy this block verbatim from any existing case-study page — don't hand-roll it.

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

### Sizes — only 3 buckets, simpler than the color model
For font-size (not color), everything collapses to **Title / Tag / Body** — anything that isn't literally a Title or a Tag counts as Body, even content types that get their own *color* above (mini-headings, hero meta values, impact metric captions). Size and color are independent axes; a mini-heading is tag-*colored* but body-*sized*.

| Bucket | Size | Includes |
|---|---|---|
| **Title** | 28px (`1.75rem`), weight 400 | the five `.xx-*-title` classes (research/solution/problem/background/users). *Not* the hero headline (`.xx-headline` stays 2.125rem/Source Serif 4 — a separate, established element) and *not* card-level titles like `.xx-decision-title` (see exceptions below). |
| **Tag** | unchanged, own small sizes (0.7rem–0.8rem depending on role) | section labels, hero meta labels — not part of this resize, only Title and Body moved |
| **Body** | 18px (`1.125rem`) | everything else with visible text: all body paragraph classes, hero meta *values*, impact metric captions, and every mini-heading (Early concept labels, Why AI Command Bar, DiDi mindset names, decision-card titles/hints, compare-column headings, tradeoff cards, iteration label/critique, sf-solution-tagline) |

Exceptions — left at their existing (smaller) sizes, not bumped to 18px:
- Small pill/badge UI: `.bt-compare-pill` (the "Before"/"After" rounded tags), `.didi-users-tag`. These are compact decorative badges, not prose — sizing them like body text would break their padding/shape.
- **Hint** — a new named exception, not "body": interaction hint text like DiDi's "Hover each card to see related designs" above the Key Design Decisions accordion (`.didi-decision-hint`). Sized and weighted identically to Tag (12px/weight 300 in DiDi's case — matches whatever the page's own tag size is), even though it keeps the accent color rather than being a literal section-label tag. Only DiDi has this pattern currently; apply the same Tag-matched sizing if another project page adds hint text.
- Any dead/unused CSS (journey-map persona/pain-card classes in salesforce, `.didi-users-quote`, `.didi-work-*`, `.didi-moreworks-title`, etc. — not rendered in any page body, see §5 note on `bt-` prefix reuse for the pattern of leftover CSS from copy-pasted templates).

### Accent color — one per project
Used for every "Tag" and "mini-heading inside body" instance on that project's page. Pick a color that complements the project's brand:
- AgencyRoot → `#E6FB99` (lime)
- Bytedance → `#63BDEE` (sky blue)
- Salesforce → `#63EED7` (teal)
- DiDi → `#FF9C6E` (orange)
- New project → pick an unused hue in the same tonal register (pastel, moderately saturated).

### Fonts
- **Source Serif 4**, weight 200, italic off — page headline only (`.xx-headline`, 2.125rem, line-height 1.3). Tried extending this to every section/problem/solution title too; reverted — those stay Figtree.
- **Figtree** — everything else: nav, sidebar, tags, mini-headings, body text, metric sub-labels, section/problem/solution/background/research/iteration/decision titles. Sizes: see the Title/Tag/Body table above — titles 28px/weight 400, body (incl. mini-headings, meta values, metric captions) 18px.
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
.xx-overview-section { padding:0 196px 180px; display:flex; align-items:center; gap:64px; }
```
Two children side by side (text column + cover image/video, `max-width:860px` each):
1. **Context** block — tag + body (`#E2E2E2`), 1–2 short paragraphs of project background.
2. **Impact** block — tag + 1 to 3 stat metrics (`.xx-metric`: big Cormorant Infant number in `#fff` + Figtree sub-label caption in `#979797` underneath), laid out in a row with `gap:64px` (the metrics-row gap — a different relationship from the block-to-block gap below, they just happen to share the same value).
3. **Design Snapshot** — tag + body (`#E2E2E2`), one-sentence summary of the shipped solution, sitting above the hero cover image or looping video.

**Gap between each of these three tag-blocks (Context↔Impact, Impact↔Design Snapshot) is 64px** — `.xx-overview-text { gap:64px }` (Context↔Impact) and `.xx-overview-section`'s own `gap:64px` above (Impact-column ↔ Design-Snapshot-column). Was 48px; widened on all four project pages.

### Problem (`id="problem"`)
```
.xx-problem-section { padding:0 196px 180px; }
.xx-problem-inner { max-width:860px; display:flex; flex-direction:column; gap:120px; }
```
One or more `.xx-problem-item` blocks, each: tag + title (`.xx-problem-title`, `#fff`, 1.75rem/400) + body paragraph (`.xx-problem-body`, `#E2E2E2`, 1.125rem, line-height 1.8). Gap between items when there's more than one: 120px (see §6).

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

| Relationship | Gap | Notes |
|---|---|---|
| Hero title → the four meta blocks (Timeline/Team/Role/Tools row) | **64px** | `.xx-hero-section { gap:64px }` |
| Tag → whatever follows it (title, or body when there's no title) | **16px** | Context/Design Snapshot/Solution/Takeaways/Problem/Background/Research headers. A plain `gap:16px` wrapper when the tag sits alone with one sibling, or `margin-bottom: calc(16px - <container-gap>)` when the tag lives inside a larger-gap flex container — see the multi-title row below for why that calc matters. |
| *Exception:* hero meta label → value | **12px**, not 16px | `.xx-meta-col label { margin-bottom:12px }`. Confirmed explicitly — don't "fix" this to 16px. |
| Title → body text (or a list) directly beneath it | **36px** | `.xx-problem-item`, `.xx-users-text`, a title→body inline wrapper. Doesn't apply when something else (tagline/image/grid) comes between title and body first — that's the 48px row below instead. |
| Context / Impact / Design Snapshot, and any other body text vs. a directly-adjacent video or image | **48px** | `.xx-overview-text` (Context↔Impact), `.xx-overview-section`/`.xx-cover-img` (↔Design Snapshot's video), `.xx-problem-row`/`.sf-solution-body` (body text ↔ image or video, in a row or stacked), `.xx-solution-inner` (paragraph block ↔ video). |
| Paragraph → paragraph within the same body block | **24px** | Different relationship from title→body or body→media above — don't conflate. |
| Before/after compare pill → the image beneath it | **24px** | `.bt-solution-block { gap:24px }` (Bytedance-style before/after pattern). |
| Multiple titled items sharing one tag | **120px** | E.g. AgencyRoot/DiDi's Problem section has two `.xx-problem-item`s under one "Problem" tag (`.xx-problem-inner { gap:120px }`). This also applies across separate `<section>`s when a later one has **no tag of its own** — a continuation of the previous tag's topic, not a new one: AgencyRoot/Bytedance's second (untagged) Solution section, and Salesforce's Solution-2/3 (only Solution-1 carries a tag) — implemented as an inline `padding-bottom:120px` on the *preceding* section. DiDi's Solution 1/2/3 each carry their own distinct tag text, so those are genuinely different tags and correctly stay at 180px. **Also applies when an image/video belonging to the first title sits between the two titles** — the rule is about title-section-to-title-section distance, not literal adjacency. DiDi's Solution-1 has "Redesign customized riding service feature" → an image → "Key design decisions"; the image→second-title gap is still 120px (achieved via `margin-top:72px` on top of the content wrapper's 48px gap). Don't mistake an image-in-between for a sign that a different, one-off spacing was intended. |
| ⚠️ Watch out | — | Some containers (`.xx-problem-inner`, etc.) are shared by multiple usages — e.g. Salesforce's `.sf-problem-inner` backs both the Problem section (single item + trailing image, needs 48px) and Takeaways (tag + single title-block, where the raw value doesn't matter). Bumping a shared container to 120px for the "multiple titled items" rule can silently break an unrelated body→image gap elsewhere that reuses the same class — check every usage of a class before changing its gap, not just the one you're targeting. |
| Text blocks within one section, general | **48px** | Default rhythm not covered by a more specific row above. |
| Outer section inner gap (label/title/body/image stack) | **72px** | |
| Between sections (different tags) | **180px** | Bottom padding of each `.xx-*-section`, desktop. |
| Section horizontal padding | **196px** | Desktop. |

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
