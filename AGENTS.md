# coer-help — agent notes

Static quiz/training app for the COER radioamador exam (Classe C). No backend.

## Doc map (read on demand, don't restate)

| File | Role | Read when |
| --- | --- | --- |
| `considerations/IDEA.md` | the vision — the human's own notes, **not a spec** | orienting |
| `considerations/SUBJECTS-SURVEY.md` | exam research, **dated 2026-10-12** | any exam/subject/question work |
| `considerations/QUESTION-QUALITY-SURVEY.md` | bank-vs-exam benchmark, **dated 2026-10-13** | any question-quality work |
| `considerations/COVERAGE.md` | ementa point → Cartilha section → item counts for TEO/ELE, plus the Classe C/B/A boundary, **dated 2026-10-21** | adding or cutting items; any ELE content near Classe B |
| `considerations/BRAINSTORM.md` | design decisions + schema + open threads — the product spec | any feature or question work; record new decisions there |
| `considerations/STACK.md` | technology decisions — static Astro + vanilla TS islands, JSON bank, TS pipeline | any tooling/structure decision |
| `DESIGN.md` | UI design contract (Dell 1996) — **binding** for UI work | any UI work |

## Repo layout

- **Docs live at the root**: `AGENTS.md`, `DESIGN.md`, `STACK.md`, `considerations/`.
- **Implementation lives in `app/`** (Astro site + bank pipeline + generated JSON in `app/public/data/`).
- All `npm` commands are run from `app/` (`cd app && npm run …`).

## Precedence

- `BRAINSTORM.md` (decisions) and `DESIGN.md` (UI) override older paragraphs elsewhere in the docs.
- The regulation itself (Ato nº 3448/2026) overrides any doc drift. The survey facts are dated because the exam was reformed in 2026 — **re-verify against current ANATEL rules before relying on them** if norms may have changed.

## Question content invariants

- Content is pt-BR; exam format per Ato 3448/2026: **certa/errado** (official, Simulado only) + **single-answer multiple-choice** (Treino only). No other types.
- Every item is tagged with an ementa topic (Ato 3448 §11.4) and must be checked against the Cartilha before shipping: `checkedByAi: true` (AI review against the Cartilha text) or `reviewed: true` (human review). Human review is optional. Never present generated content as official.
- Simulado = certa/errado only; Treino may mix (50/50 default).

## About this file

- `AGENTS.md` stays operational — pointers and rules only. Vision and decisions live in `considerations/`; don't duplicate them here.
