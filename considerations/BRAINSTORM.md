# BRAINSTORM

Consolidated findings and design decisions from the brainstorming sessions about the app
(COER **Classe C** quiz/training). Living document — update it as decisions crystallize.

Related docs: [`IDEA.md`](./IDEA.md) (the idea) · [`SUBJECTS-SURVEY.md`](./SUBJECTS-SURVEY.md) (exam research) · [`../DESIGN.md`](../DESIGN.md) (UI direction).

---

## 1. The app: two modes, one question bank

| Mode | Format | Scoring | Purpose |
| --- | --- | --- | --- |
| **Simulado** | Exam-faithful: **certa/errado only** | Official scoring (Ato 3448/2026 §11.3) | Reproduce the real exam experience |
| **Treino** | certa/errado **+ multiple-choice** (várias opções, uma correta), all ementa topics | Right/wrong feedback only (no pass/fail) | Drill and learn, per topic |

- Simulado mirrors the official exam: 15 questões, 20 min, mínimo 8 acertos (51%) — **one subject per session, user picks which of the three** (TEO / LEG / ELE). Multiple-choice items never appear in Simulado.
- **Simulado result screen:** score + plain per-question right/wrong list. No explanations/rundowns (the real exam gives none).
- Treino shows instant right/wrong feedback (explanations), supports per-topic drills.
- **Treino draw mechanics:** per-topic drills let the user choose certa/errado or multiple-choice; mixed mode defaults to 50/50.
- **One bank, two modes:** both modes draw from the same tagged pool; Simulado filters to `true-false` items, Treino uses everything.

## 2. Question types

- **certa/errado** (`true-false`) — the official exam format.
- **multiple-choice** — a statement with 3–5 options and **exactly one correct answer** (single-answer multiple choice; NOT "select all that apply"). Used in **Treino** across all ementa topics — the common pattern in other COER simulators.
- Multiple-choice multiplies the pool legitimately: one concept yields both a certa/errado item and a multi-option variant, and option sets are new each time.

## 3. Question sourcing & provenance

- **No public official past exams**; the official bank lives inside Anatel's SEC system.
- Path (decided): **generate** (AI-written) or **extract** (reworked from other exams/sources — legacy LABRE banks, community exercise sets, older exams) questions covering the official ementa topics.
- Every item — generated or extracted — must be **re-validated against the 2026 ementa/legislation** and tagged with its ementa topic. Avoid wholesale copying of community banks.

## 4. Volume strategy: templates, not sentences

- Freewriting thousands of certa/errado statements degrades quality fast (the ementa is compact). Instead:
  - **Parametric/template questions**: one reviewed template yields distinct items (e.g. bounded frequency-band and wavelength calculations, selected Código Q and phonetic-alphabet checks, and computable λ/f and Ohm items). Parameter expansion is capped by the diversity guard below.
  - **Template register** as the review artifact: one line per template (topic, shape, option/parameter ranges, expected count). You approve the register, not each sentence.
- **Diversity guard:** parametric expansion must not become a one-fact-per-question dump. In particular, avoid a long sequence of questions like “a letra X representa Y?” or “o código Q X significa Y?”. Keep a smaller representative set of direct-recall items and use the remaining question budget for scenarios, comparisons, distractors, and application of the same knowledge.
- Honest per-subject pool targets (Parametric-driven):

| Matéria | Pool estimado |
| --- | --- |
| Técnica e Ética Operacional | ~290 |
| Conhecimentos Básicos de Eletrônica e Eletricidade | ~175–200 (least review cost) |
| Legislação de Telecomunicações | ~165–185 (most hand-written — law content) |
| **Classe C total** | **~660** |

- **Current MVP bank:** TEO has 75 reviewed questions (59 certo/errado, 16 multiple-choice). The larger pool estimates remain long-term targets, not current requirements.

- **Build order:** TEO → ELE → LEG (Eletrônica is the high-yield/low-review win; Legislação last, writ-heavy).
- Legislação is the honest low spot: if we ever want it > ~250 we'd need legacy extraction or looser/repetitive questions — the recommendation is that ~180 strong items is enough.

## 5. Schema direction (data model)

```jsonc
{
  "id": "TEO-001",                       // <SUBJECT>-NNN: TEO | LEG | ELE
  "questionType": "true-false" | "multiple-choice",
  "topic": "estacao-de-radioamador",     // ementa topic slug (Ato 3448/2026 §11.4)
  "topicName": "Estação de Radioamador",
  "statement": "…",                      // pt-BR
  // true-false:
  "answer": true,                        // true = certo, false = errado
  // multiple-choice (alt. block):
  "options": ["…", "…", "…"],            // 3–5 options
  "answer": 2,                           // index of the single correct option
  "explanation": "…",
  "source": "generated",                 // generated | extracted
  "sourceRef": "Ato 3448/2026 §11.4 – …",
  "reviewed": false                      // human-validated against the current official Cartilha + ementa
}
```

- Storage: JSON (per subject file) now; SQLite migration later if needed.
- Quality guard: `reviewed: false` until validated; healthy sets mix certos and errados.

## 6. Other decisions

- **Repeat-prevention scope:** prevent duplicate questions **within the current quiz session only**. Track the question IDs in memory while the session is running; discard them when the quiz ends. A new session may draw questions that appeared in an earlier session.
- **No persistent question history:** do not use `localStorage` for seen-question IDs. The session pool is shuffled/drawn without replacement, and a requested quantity larger than the available pool uses each available question once.
- App remains **static** (no backend) per IDEA.md; questions in a JSON/SQLite file (see `SUBJECTS-SURVEY.md` §6 for the full gap analysis).
- **UI design:** follow `DESIGN.md` (Dell 1996 language). Quiz-specific states it doesn't cover today (right/wrong feedback, countdown timer, result screen) will be adapted from its vocabulary at build time.

## 7. Open threads (still pondering)

- ~~Treino multi-select scoring nuance~~ — **resolved:** with a single correct option, Treino scoring is trivially right/wrong; no partial credit. (The "select-all" idea was a misnomer on our part; it's single-answer multiple-choice.)
- ~~Simulado per-subject vs full run~~ — **resolved:** one subject per session, user chooses (TEO / LEG / ELE).
- ~~Simulado post-exam feedback~~ — **resolved:** score + plain per-question right/wrong; no explanations/rundowns.
- ~~Treino draw mechanics~~ — **resolved:** per-topic drills with type choice; mixed 50/50.
- Exact per-topic template map for Legislação (least multiple-choice-friendly of the three).
