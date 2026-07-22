# Build Prompt: ff360_labs Website v2 (Multi-Page, High-Tech Redesign)

## Context

You are building the marketing website for **ff360_labs**, a one-person creative
technology studio ("Always building something new.") working across web
development, interactive experiences, 3D visualization, creative coding,
branding, and music technology.

A single-page v1 already exists (plain HTML/CSS/JS). This task replaces it
with a **multi-page site** and a **more high-tech, dark, three-dimensional
visual direction** — closer to the genre of premium digital-agency sites like
`wearly.store` (dark backgrounds, glowing gradient/3D hero elements, kinetic
scroll-triggered animation, glassmorphism panels) — while keeping ff360_labs'
own brand identity, not Supernova's colors or copy.

Do not invent new brand colors, fonts, or copy beyond what's specified below —
reuse the content blocks given in each page section verbatim as a starting
point, then enhance the presentation.

---

## Tech Stack

- **Framework:** Next.js (App Router) + React + TypeScript
- **Styling:** Tailwind CSS, using CSS custom properties for the brand palette
- **3D / motion:**
  - `@react-three/fiber` + `@react-three/drei` for the WebGL hero element(s)
  - `framer-motion` for scroll-triggered reveals, page transitions, and
    hover/parallax micro-interactions
- **Deployment target:** static export or standard Next.js build, deployable
  free on Vercel
- **No CMS, no backend required** for this pass — content is hard-coded from
  the copy below. Contact form can be a front-end-only form for now (note a
  `TODO` comment for wiring to a real form handler later).

---

## Brand System (do not deviate)

```css
--bg: #0a0a0b;
--bg-soft: #121214;
--bg-card: #17171a;

--gold-light: #f0d28a;
--gold: #c9a15a;
--gold-dark: #8a6a2f;

--silver-light: #eef0f1;
--silver: #b9c0c4;
--silver-dark: #6f767b;

--text: #f2efe9;
--text-dim: #a7a49c;
--text-faint: #6c6a64;
```

- **Display font:** Fraunces (headlines, italics for emphasis words)
- **Body font:** Inter
- **Mono/label font:** JetBrains Mono (kickers, tags, UI labels, nav)
- Metallic gradient text treatment on key words: gradient sweep between
  gold-dark → gold-light → gold (or the silver equivalents), same effect
  used in the v1 site — carry this forward, don't drop it in favor of flat
  color.

### What to upgrade for the "high-tech" direction
- Add a real **3D/WebGL hero element** on the homepage — e.g. a slowly
  rotating abstract wireframe/particle form in brass-gold and chrome-silver
  materials on the near-black background (not a literal logo recreation —
  something abstract: a distorted icosahedron, a particle field, or a
  wireframe torus knot reacting subtly to mouse movement / scroll).
- Add **glassmorphism panels** (subtle blur + translucency + thin gold-tinted
  border) for cards: service rows, pricing cards, work cards.
- Add **scroll-triggered reveals** (fade + slight rise, staggered) for section
  content, and a subtle **parallax** on background grid/particle layers.
- Keep the existing blueprint-grid and corner-bracket motifs from v1 as a
  secondary technical/"lab" texture layered behind the new 3D elements — don't
  replace one for the other, combine them.
- Maintain full functionality and readability with JavaScript/WebGL disabled
  or on low-end devices: 3D hero must have a static gradient/image fallback,
  and all content must remain accessible without motion.
- Respect `prefers-reduced-motion` — disable non-essential animation for users
  who request it.

---

## Site Map

```
/                → Home
/services        → Services
/process         → Process
/pricing         → Pricing
/work            → Work
/contact         → Contact
```

All pages share a persistent header (logo mark + nav) and footer. Nav links:
Services · Process · Pricing · Work · Contact, plus the ff360_labs wordmark
(links home).

---

## Global Components

**Header:** fixed/sticky, translucent dark background with blur-on-scroll,
`ff³⁶⁰_labs` wordmark (styled like v1: italic Fraunces "ff", bold Inter
"360", italic Fraunces "_labs"), nav links in JetBrains Mono, uppercase,
letter-spaced.

**Footer:** `© 2026 ff360_labs` on the left, tagline `Always building
something new.` on the right, thin top border.

**CTA button styles:**
- Primary (gold): gradient gold background, dark text, used for "Start a
  Project" style actions.
- Secondary (ghost): silver-outlined, transparent background.

---

## Page Content

### Home (`/`)

- Hero: eyebrow label "Creative Technology Studio," headline "Always
  building / something / new." (with metallic gradient treatment on
  "something" and "new"), subhead:
  > ff360_labs designs and builds websites, interactive experiences, 3D
  > work, and creative software — for small businesses, artists, and anyone
  > with an idea that doesn't fit a template.
  - CTAs: "Start a Project" (→ /contact), "See the Work" (→ /work)
  - This is where the primary 3D/WebGL hero visual lives.
- Below the fold: short teaser strips linking out to each of the five pages
  (Services, Process, Pricing, Work, Contact), each with a one-line summary
  and an arrow link — this replaces the old single-page anchored sections.

### Services (`/services`)

Kicker: "What Gets Built" — Heading: "Six disciplines, one studio."

Intro line: Every project draws on some combination of these — scoped up
front so nothing gets lost between phases.

1. **Website Design & Development** — Small business, portfolio, and product
   sites — designed and built end to end.
2. **Interactive Web Experiences** — Custom interfaces and animation-driven
   pages that go past the standard template.
3. **3D Modeling & Visualization** — Procedural, game-ready 3D assets and
   environments — built in Blender, staged for Unity.
4. **Creative Coding & Automation** — Custom tools and integrations — API
   syncs, generative scripts, AI-assisted pipelines.
5. **Branding & Digital Identity** — Logo systems, color and type direction,
   and the guidelines that keep a brand consistent.
6. **Music Technology Projects** — Production, mixing, and the tools that
   support an artist's release workflow.

Presentation: upgrade the flat service-row list from v1 into glass-panel
cards in a responsive grid, each with an icon, title, description, and a
subtle hover-lift + glow.

### Process (`/process`)

Kicker: "How A Project Runs" — Heading: "Four phases, from idea to live
product."

| Phase | Focus | Deliverable |
|---|---|---|
| 01 Discover | Your business · Your audience · Your goals · Your vision | Project Brief |
| 02 Design | Site structure · Visual direction · User experience · Branding elements | Design Prototype |
| 03 Build | Responsive website · Interactive features · Optimization · Testing | Working Website |
| 04 Launch | Deployment · Domain setup · SEO basics · Training | Live Product |

Presentation: a horizontal (desktop) / vertical (mobile) connected timeline
with animated line-draw between steps as the user scrolls, each step in a
glass panel.

### Pricing (`/pricing`)

Kicker: "Starting Points" — Heading: "Three ways to begin."

- **Launch** — $750–$1,500 — 3–5 pages · Mobile design · Contact form ·
  Basic SEO — *For small businesses · personal brands · simple portfolios*
- **Growth** (featured/highlighted card) — $1,500–$3,000 — 5–10 pages ·
  Custom design · Animations · CMS integration · Analytics — *For
  established businesses · creators · organizations*
- **Innovation** — Custom — Advanced UI · 3D assets · Custom development ·
  Experimental features — *For interactive sites · 3D experiences · web
  apps · custom tools* — include an **"Experimental"** badge on this card,
  and this footnote below the pricing grid:
  > Innovation projects push past standard web development — 3D scenes,
  > custom interfaces, generative or automated systems. Because the scope is
  > less predictable, these start with a paid discovery phase to define
  > feasibility and timeline before a final quote or commitment, and
  > typically run longer than a Launch or Growth project.

### Work (`/work`)

Kicker: "Selected Work" — Heading: "A few things worth showing."

1. **Retail Inventory Sync Engine** — Software — Square × Shopify API
2. **Victorian Apothecary Scene** — 3D / Environment — Blender → Unity,
   procedural
3. **ff360 Identity System** — Brand — Logo, mark, guidelines
4. **Original Score & Mix** — Music Tech — Full production

Presentation: grid of project cards; since these are placeholders/portfolio
stubs rather than full case studies, keep each card compact (tag, title,
one-line meta) — leave clear component structure so real case-study detail
pages (`/work/[slug]`) can be added later without restructuring.

### Contact (`/contact`)

Kicker: "Get In Touch" — Heading: "Tell me what you're building."

- Form fields: Name, Email, Project (textarea) — front-end only for now,
  `TODO` comment noting it needs a real backend/handler (e.g. Formspree,
  Resend, or a Next.js API route) before launch.
- Contact info panel: Email `hello@ff360labs.com`, Based In `Conway,
  Arkansas`, Availability `Booking new projects`
- Social links: Instagram, GitHub, YouTube (placeholder `#` hrefs — flag as
  TODO)

---

## Technical Requirements

- Fully responsive: mobile, tablet, desktop.
- Lighthouse targets: Performance ≥ 85, Accessibility ≥ 95 on all pages
  (the 3D hero is the main performance risk — lazy-load it, cap pixel ratio,
  and pause/reduce it off-screen or off-tab).
- Semantic HTML, proper heading hierarchy, alt text on all images/icons,
  visible focus states.
- Basic per-page SEO: unique `<title>` and meta description per route.
- Respect `prefers-reduced-motion`.
- No `localStorage`/browser-storage dependency for core functionality.

## Deliverables Checklist

- [ ] Next.js project scaffolded with the six routes above
- [ ] Shared Header/Footer/Nav components
- [ ] Brand tokens set up as Tailwind theme extension / CSS variables
- [ ] 3D hero component with static fallback + reduced-motion handling
- [ ] All five content pages built from the copy above, in glass-panel /
      card style
- [ ] Responsive pass on all pages
- [ ] Lighthouse check on Home and one content page, results reported back
