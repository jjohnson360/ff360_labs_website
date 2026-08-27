# ff360_labs — Studio Website

Marketing site for ff360_labs, a creative technology studio. Industrial-luxury
aesthetic (charcoal / silver / gold), an interactive WebGL hero, and tactile
Matter.js physics scenes.

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| Language | TypeScript, React 19 |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) (`@theme` tokens in `src/app/globals.css`) |
| Fonts | `next/font` — Fraunces (display), Inter (sans), JetBrains Mono |
| Animation | [Framer Motion](https://www.framer.com/motion/) |
| 3D | [React Three Fiber](https://r3f.docs.pmnd.rs/) + Drei |
| 2D physics | [Matter.js](https://brm.io/matter-js/) |
| Icons | [lucide-react](https://lucide.dev/) |
| Contact form | [Formspree](https://formspree.io/) (`@formspree/react`) |
| Hosting | Vercel |

> **Note:** this repo tracks the Next.js canary/latest line closely. Before
> changing framework-level code, read the relevant guide under
> `node_modules/next/dist/docs/` — APIs may differ from older releases.

## Getting started

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

CI (`.github/workflows/ci.yml`) runs lint + typecheck + build on every PR.

## Environment variables

Copy into `.env.local` (all optional for local dev):

| Variable | Purpose | Fallback |
| --- | --- | --- |
| `NEXT_PUBLIC_FORMSPREE_FORM_ID` | Contact form target | form posts are inert without it |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata, sitemap, robots, OG tags | Vercel's production URL at build, else `http://localhost:3000` |

Set both in the Vercel project settings for production.

## Routes

| Path | Notes |
| --- | --- |
| `/` | Hero (R3F) + section index |
| `/services` | Six disciplines + Tech Stack physics pit |
| `/process` | Four phases + floating-node physics background |
| `/pricing` | Three tiers |
| `/work` | Selected projects *(placeholder content — needs real case studies)* |
| `/about` | Studio background *(draft copy — see `TODO(content)` markers)* |
| `/contact` | Formspree contact form |
| `/privacy` | Privacy statement |

`sitemap.xml`, `robots.txt`, `opengraph-image`, and `twitter-image` are
generated from `src/app/`. Site-wide config (URL, nav, copy) lives in
`src/lib/site.ts`.

## Project structure

```
src/
  app/            App Router routes, layout, metadata, error/loading UI
  components/     Header, Footer, physics scenes, R3F hero, cursor, ErrorBoundary
  lib/           site config + shared physics helpers
public/models/   ff360_core.glb (hero model)
docs/            working notes and the previous vanilla HTML site (archived)
```
