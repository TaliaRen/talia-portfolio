# ByteDance · Doudian Order Tools — project brief

A plain-text record of the ByteDance case study, written for whoever (or whatever) writes Talia's résumé, cover letters, or interview notes. Everything under **Sourced** comes from the published case study (`bytedance.html`) or earlier drafts of it in git history. Everything under **Gaps** is *not* on record anywhere and must come from Talia — do not invent it.

---

## One-line

Helping merchants discover and handle exception requests in their daily workflow.

(Earlier wording, still accurate: *Helping merchants handle exception orders without leaving their primary order-processing workflow.*)

## Facts

| | |
|---|---|
| Company / org | ByteDance — Douyin E-commerce team (TikTok Shop China) |
| Product | **Doudian**, the merchant-facing platform; specifically the **Order Management** and **Order Tools** modules |
| When | Summer 2025 (internship) |
| Team | 1 Product Manager, 3 Developers, Talia as the designer |
| Role | Product Design · Problem Framing · UX Research |
| Tools | Figma |
| Audience | Douyin E-commerce merchants processing orders at volume |

## Impact (as published)

| Metric | Result |
|---|---|
| Adoption of Order Tools | **+23%** |
| Screen efficiency (order list visible in the first viewport after the Common Tools module was added) | **+12%** |
| CPO — calls per order (customer-support calls) | **−5%** |

> ⚠️ The homepage card's hover tip says "21% increase in feature adoption" while the case study says +23%. One of them is stale. Confirm the right number before it goes on a résumé.

## Context

Douyin E-commerce splits order work across two modules:

- **Order Management** — high-volume, standardized order processing: track shipping status, take individual and bulk actions. This is where merchants spend their day.
- **Order Tools** — less frequent, more complex *exceptions* (address changes, shipping-time negotiations, priority shipping), plus review and automation rules. Lives in a separate module.

## Problem

Exception requests only surfaced inside Order Tools, which merchants rarely opened. Pending requests were easy to miss; many merchants learned about a request only when customer support called — too late to avoid a refund or a reshipment. Exceptions were infrequent, but missing one was costly.

Framing question Talia set for the work: *How should we make exception work visible?* / *How can exceptions reach merchants without relying on them to check?*

## Process & decisions

The case study is structured as two decisions, each with explicit alternatives and trade-offs.

### Decision 1 — Discovery: how should exceptions surface?

Three directions compared, weighing visibility against added steps and interruptions:

| Direction | What it is | Depends on | What to weigh |
|---|---|---|---|
| Add a review step | Merchants review exceptions at a designated point, e.g. before (batch) shipping | Merchants adopting a new review routine | Is the added step worth it? Is a batched check timely enough? Too much work for merchants? |
| Trigger a notification | Proactively alert merchants when a request arrives | Merchants noticing and responding to alerts | Will alerts be ignored? Will they interrupt work in progress? Which requests warrant an interruption? |
| **Embed discovery in daily work** ✅ | Surface exceptions as merchants carry out existing order-processing tasks | Regular use of the order workspace | How can tasks earn attention without disrupting routine work? |

**Chosen:** embed in daily work. *Reason:* merchants primarily worked in Order Management, so build on existing habits and remove the need to check elsewhere.

### Decision 2 — Handling: where should exception handling happen?

Once requests surfaced in Order Management, should the handling move there too?

| Option | Benefit | Tradeoff |
|---|---|---|
| Handle on the order page | Complete tasks without switching pages | Adds complexity to the order page — every exception type brings its own information and controls |
| **Handle in a dedicated tool** ✅ | Retain tool capabilities without crowding the order page | Requires switching workspaces |

**Chosen:** surface requests in Order Management, link into the existing tool to handle them. *Reasons (as published):* reusing existing tools reduces engineering effort, supports detailed multi-step handling, and keeps new exception types from adding complexity to the order page. Stated tradeoff accepted: merchants still switch workspaces to complete a task.

### Decision 3 (earlier draft, "Attention") — how much attention should exceptions get?

Three presentations were compared on how much space/attention they demanded:

- **A general reminder banner** above the order page pointing to Order Tools — gives a visible route, but no indication of specific pending requests.
- **Inline actions inside each order row** (request + approve/reject beside the order) — the request sits next to its order, but exception tasks get scattered across the list and add complexity to an already dense workspace.
- **A consolidated task overview** of routine + exception tasks — everything in one place, but more categories competing for attention; hard to scan and scale as tools are added.

Direction taken: surface enough task information to support action, while keeping the order list central.

### Earlier versions not shipped (from the published "Earlier versions" section, since removed)

- **V1 — Button-triggered side panel:** shortened the path to Order Tools, but did not improve awareness of exception requests; the entry point became more visible, the pending tasks did not.
- **V2 — Overview showing all pending actions:** combined routine orders and exception tasks in one overview, but as more tools were added the information became difficult to scan and scale.

## Solution (what shipped)

1. **"Common Tools" strip inside Order Management.** A carousel of tool entry cards (e.g. *Address Change Review — 90 orders with address change requests — Review*; *Shipping Negotiation — 28% of delayed orders were retained — Negotiate*; *Priority Shipping Review — 32 orders pending priority shipping — Ship*). Each card surfaces the pending-task count or outcome and links straight into the relevant Order Tool, with a clear way back.
   - **Value-led cues:** each card shows the potential benefit of handling the requests, giving merchants a stronger reason to enter the tool.
   - **Scalable tool carousel:** built to support a growing number of tools without redesign.
2. **Restructured status navigation and filters.** Adding the strip pushed the order list below the first viewport. Talia reduced the vertical footprint of the area above the list — optimized the metrics selection, merged the time-range selector into the status tabs, restructured and consolidated the filter rows — so the order list stayed in view while the existing order-management workflow was preserved. This is the source of the +12% screen-efficiency figure.

## Takeaways (as published)

- **Small changes require a broader view.** Even a change to one module needs to be evaluated across the full workflow; the interface change may be small, but its impact can reach beyond it.
- **Existing workflows carry familiar habits.** Reusing tools reduces engineering effort and preserves familiar ways of working; the key is knowing what needs to change and what is worth keeping.
- (Earlier drafts) Products constantly evolve through adding, removing and adjusting features; anticipating that is central to scalable products. In a mature ecosystem users rely on muscle memory — interventions should fit in seamlessly rather than change things radically. (Note: "integrate" is avoided deliberately — the tools were connected, not merged; see Decision 2.)

## Résumé-ready phrasing (only uses sourced facts)

- Surfaced pending exception requests inside Doudian's Order Management workflow (ByteDance, Douyin E-commerce) and connected each to its existing handling tool, so merchants could act without checking a separate module; **+23% Order Tools adoption, −5% calls per order.**
- Framed the problem from support-call evidence (merchants discovering requests only after customers complained) and led exploration across three discovery strategies and two handling models, documenting the tradeoffs behind each decision.
- Chose to reuse existing tools rather than rebuild handling inside the order page, cutting engineering scope while keeping the order list uncluttered and the design scalable to new exception types.
- Restructured status navigation and filters to recover vertical space lost to the new module, **+12% screen efficiency**, with no change to the existing order-processing flow.
- Worked with 1 PM and 3 engineers over a summer internship; owned product design, problem framing and UX research in Figma.

## Gaps — ask Talia before writing these

None of the following is on record. Leave out or ask:

- **Engineering collaboration specifics:** how the "reuse existing tools → less engineering effort" argument was made (estimates? a scoping conversation?), what the devs pushed back on, handoff format, any design-QA or build iterations.
- **PM collaboration:** who set the metrics, how success was defined up front, any prioritisation negotiation.
- **Research method:** the page says "UX Research" and mentions merchant feedback and support calls, but not how many merchants, interviews vs. support logs vs. analytics, or what the research surfaced beyond "merchants rarely checked Order Tools".
- **Metric definitions and baselines:** what "screen efficiency" measures exactly, over what period the +23% / −5% were measured, sample size, and whether it was an A/B test or pre/post.
- **Timeline inside the summer:** weeks spent on research vs. exploration vs. delivery; whether it shipped before the internship ended.
- **Scope of ownership:** whether the Common Tools strip was Talia's proposal from the start or a brief from the PM; who designed the Order Tools pages themselves (they appear to be pre-existing).
- **Which exception types were in scope at launch** (the mock-ups show address change, shipping negotiation, priority shipping) and how many tools the carousel launched with.
- The **21% vs 23%** adoption discrepancy noted above.
