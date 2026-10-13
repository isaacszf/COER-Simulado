# STACK

Technology decisions for coer-help. See `AGENTS.md` for the doc map and rules; `DESIGN.md` for the UI contract.

## Summary

Static, backendless quiz app. Two independent halves: a **build-time question pipeline** and a **static site** that ships the bank as JSON.

| Concern | Choice | Notes |
| --- | --- | --- |
| Site | **Astro** (static output) | no SPA; pages + small JS islands |
| Interactivity | **Vanilla TypeScript islands** | timer, scoring, shuffle, answer handling; framework-free for now |
| Future framework | Svelte island (possible) | keep the island boundary clean so swapping is cheap; only if Treino UI grows complex |
| Bank storage | **JSON per subject** (`teo.json`, `ele.json`, `leg.json`) | fetched at runtime; see "JSON vs SQLite" below |
| Bank pipeline | **Node + TypeScript** | templates → JSON + schema validator (build-time, not shipped) |
| Types | TypeScript | `schema.ts` is the single source of truth for the bank's invariants |
| Deployment | static host (`npm run build` → `dist/`) | GitHub Pages / Netlify / etc. |

## Why JSON, not SQLite

- Client-side SQLite (sql.js WASM, or OPFS) adds ~1 MB + host constraints (special headers) to do what plain JS does trivially at this scale (~660 questions ≈ a few hundred KB in memory: filter, shuffle, sample).
- JSON is human-readable, diffable, and matches the brainstorm decision (JSON now; SQLite later if needed).
- **Upgrade path:** schema/types are the source of truth; JSON is one serialization. If a backend ever exists, the pipeline can emit SQLite as a build artifact without changing app code.
- Revisit SQLite only when/if there is a server-side reason to (real backend, user data, analytics).

## Bank pipeline (build-time)

```
app/scripts/
├── schema.ts        # types + invariants (questionType, ementa topics, kind/level/pitfall, review flags, options, single correct index)
├── templates/
│   ├── helpers.ts   # shared builders (tf, mc) + Cartilha citation helpers
│   ├── index.ts     # registry: subject code → builder function
│   ├── teo.ts       # TEO items (content only)
│   ├── ele.ts       # ELE (CBEE) items (content only)
│   └── leg.ts       # LEG items (content only)
├── generate.ts      # render templates → JSON in public/data/
└── validate.ts      # lint JSON: enforce the invariants (fail build on violation)
```

- Question items are pt-BR; `true-false` (official, Simulado) and single-answer `multiple-choice` (Treino) only — enforced by `schema.ts` per `AGENTS.md`.
- Every item carries an ementa-topic slug and a review flag: `checkedByAi` or `reviewed` (per `AGENTS.md`).

## Site (Astro, under `app/`)

```
app/
├── astro.config.mjs
├── public/data/     # teo.json, ele.json, leg.json (pipeline output)
├── scripts/         # bank pipeline (above)
└── src/
    ├── pages/       # static pages (index, simulado, treino)
    ├── components/  # .astro components (Dell-96 chrome per DESIGN.md)
    ├── lib/         # vanilla TS: bank helpers, quiz engine, site/SEO metadata
    └── styles/      # design tokens mapped from DESIGN.md
```

- **Modes:** Simulado (certa/errado only, one subject per session, 20 min, min 8, result = score + plain right/wrong) and Treino (mix, per-topic drills, instant feedback + explanations, 50/50 default). Contracts in `BRAINSTORM.md`.
- Progressive enhancement: pages render statically; the quizzes are the only JS.
- Repeat prevention is session-only: shuffle/draw without replacement and keep question IDs in memory while a quiz is active. Do not persist seen-question IDs in `localStorage`; the list is discarded when the quiz ends.

## Workflow

- `npm run generate` — build the bank (templates → JSON).
- `npm run validate` — lint the bank.
- `npm run dev` — Astro dev server.
- `npm run build` — generate + validate + Astro build → `dist/`.

## Hosting & SEO

- **Host:** Cloudflare Pages (free), connected to the GitHub repo. Settings: production branch `main`, root directory `app`, build command `npm run build`, output directory `dist`. Node major version comes from `app/.nvmrc`. Every push to `main` redeploys; a failing validator fails the deploy.
- **`site`** in `astro.config.mjs` is the public URL (`https://coer-simulado.pages.dev`). It must match the Cloudflare project name. Canonical links, Open Graph tags, the sitemap, `robots.txt` and `llms.txt` are all built from it.
- **SEO:** `Layout.astro` takes `title`, `description` and optional `jsonLd`. Every page sets its own; subject pages get them from `subjectSeo()` in `src/lib/site.ts`. `@astrojs/sitemap` writes `sitemap-index.xml`, and `src/pages/robots.txt.ts` points crawlers at it. Subject pages render a `SubjectIntro` (summary plus ementa topics) server-side, because the quiz renders client-side.
- **GEO:** the home page FAQ (`FAQ` in `src/lib/site.ts`) is rendered as visible text and as `FAQPage` JSON-LD. Subject pages emit `Quiz` JSON-LD. `src/pages/llms.txt.ts` builds `/llms.txt` from the same FAQ and subject data, so the facts live in one place.

## Open / future

- Svelte island if Treino UI complexity demands it (decision doesn't cost anything now thanks to vanilla islands).
- SQLite as a build artifact if a backend ever appears.
- Question volume strategy (parametric templates, ~660 target) lives in `BRAINSTORM.md`; `schema.ts` is where it gets enforced.
