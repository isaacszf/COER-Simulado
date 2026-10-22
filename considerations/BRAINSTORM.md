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
- **Diversity guard:** parametric expansion must not become a one-fact-per-question dump. In particular, avoid a long sequence of questions like “a letra X representa Y?” or “o código Q X significa Y?”. Parametric families are kept only for real computations; direct recall is capped (see the quality standard in §5).
- ~~Honest per-subject pool targets (Parametric-driven)~~ — **dropped (2026-10-21):** chasing these numbers pulled in off-exam filler (see the cleanup note below). Bank size is now whatever passes the §5 standard.

| Matéria | Pool estimado |
| --- | --- |
| Técnica e Ética Operacional | ~290 |
| Conhecimentos Básicos de Eletrônica e Eletricidade | ~175–200 (least review cost) |
| Legislação de Telecomunicações | ~165–185 (most hand-written — law content) |
| **Classe C total** | **~660** |

- **Expansion cleanup (2026-10-21):** the 2026-10-18 expansion (129 TEO, 40 ELE items) drifted away from the exam. It added niche topics (NanoVNA, WSPR, ALE, ACDS, SDR, DXpedition split), block-diagram position trivia, repeated calculation families (about 20 λ/dipole items, SNR in both TEO and ELE), and strawman errado items. The cleanup cut 65 TEO and 18 ELE items. It also removed Cartilha mentions from four stems and retagged the SNR items to `antenas`, where the ementa lists them. A second pass the same day applied the same rules to the first batch. It cut 37 more TEO items, 24 more ELE items and 2 more expansion mixer duplicates. Those were DX/split/satellite niche, TinySA, near-duplicate multiple-choice twins of certo/errado items, strawman errados, content-free certos and SNR in ELE. The bank is now TEO 184 (146 certo/errado, 38 multiple-choice), ELE 151 (126 certo/errado, 25 multiple-choice) and LEG 182 (unchanged), so 517 items. IDs were renumbered by position; nothing stores them. TEO emergências sits at 8.2%, just above the 8% floor, so new TEO cuts there need a replacement item. The rules that came out of this are in §5 ("Exam fidelity").
- **Bank expansion (2026-10-18), superseded by the cleanup above:** TEO grew to 288 and ELE to 193, appended after the first batch. All items were `checkedByAi: true` against Cartilha 2026-06.
- **First MVP bank (2026-10-13):** TEO has 159 questions (124 certo/errado, 35 multiple-choice), rebuilt to the §5 quality standard against Cartilha 2026-06; all `checkedByAi: true` after a full AI review (2026-10-13), none human-reviewed yet. It replaced the earlier 75-item bank, which was 71% phonetic/Código Q/band recall (see `QUESTION-QUALITY-SURVEY.md`). ELE (CBEE) has 153 questions (125 certo/errado, 28 multiple-choice) on the Classe C ementa only: Anexo 3's Classe B content (colour code, series/parallel, Kirchhoff, reactance, RLC, ASK/FSK/PSK) is left out. All `checkedByAi: true` after a full AI review (2026-10-13). LEG has 182 questions (154 certo/errado, 28 multiple-choice), checked against Cartilha Anexo 2 and the Ato 3448/2026 text; all `checkedByAi: true` (2026-10-13). The larger pool estimates remain long-term targets.

- ~~**Build order:** TEO → ELE → LEG~~ — **done (2026-10-13):** all three banks are built and AI-reviewed.
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
  "kind": "cenario",                     // conceitual | cenario | calculo
  "level": 3,                            // 1 (direct recall) … 5 (multi-step reasoning)
  "pitfall": "…",                        // the misconception the item tests
  "recall": true,                        // optional: pure lookup (phonetic, Código Q, table row)
  "source": "generated",                 // generated | extracted
  "sourceRef": "Ato 3448/2026 §11.4 – …",
  "reviewed": false,                     // human-validated against the current official Cartilha + ementa (optional)
  "checkedByAi": true                    // AI-validated against the Cartilha text
}
```

- Storage: JSON (per subject file) now; SQLite migration later if needed.
- Quality guard: every item is checked against the Cartilha before shipping, by AI (`checkedByAi`) or by a human (`reviewed`). Human review is optional (decided 2026-10-13). Healthy sets mix certos and errados.

### Quality standard (decided 2026-10-13)

Benchmarked against id.qsl.br, the strongest community bank (`QUESTION-QUALITY-SURVEY.md`). Enforced by `app/scripts/validate.ts`: field rules are errors, distribution targets are warnings plus a per-bank report.

- **Every item** carries `kind`, `level` and `pitfall`.
- **Errado items change exactly one plausible point** of a true statement (a value, a direction, a swapped term). No absurd distractors.
- **Statements** run about 60–220 characters for certo/errado. Each is self-contained, one judgeable claim, in pt-BR. Multiple-choice stems may be short questions.
- **Kind mix:** roughly 45% conceitual, 35% cenario, 20% calculo. TEO runs lighter on calculo; ELE should run heavier.
- **Level mix:** roughly 10% L1, 30% L2, 40% L3, 15% L4, 5% L5.
- **Recall cap:** at most 10% of a subject is pure lookup (`recall: true`). Phonetic and Código Q items are framed as QSO scenarios where possible.
- **Coverage:** every ementa topic is between 8% and 25% of the bank.
- **Answer balance:** certo share between 40% and 60%; multiple-choice answer index rotates.
- **sourceRef** cites the Cartilha 2026-06 section and page (or Ato 3448 via the Cartilha's transcription).
- **Calculations** use only real computations (λ ≈ 300/f, λ/2 and λ/4, period, repeater shift, beat frequency, dB/SNR reasoning) with bounded values.
- **Inspiration, not copying:** community banks (id.qsl.br, LABRE-DF) inform structure and topic breadth only; our wording is original.

### Exam fidelity (decided 2026-10-21)

These rules came out of the expansion cleanup (§4). They apply to every new item.

- **Ementa only.** An item must test a point the Ato 3448 §11.4 ementa names, at the depth the Cartilha teaches it. No tool or brand names (NanoVNA, SDR), and no niche digital-mode detail (WSPR, ALE, ACDS, iGate vs digipeater). One or two items on what a common mode is for (APRS, Echolink) are fine.
- **No mention of the Cartilha in stems or options.** The real exam doesn't quote its study guide. Citations go in `sourceRef` and the explanation. `validate.ts` warns on this.
- **Block diagrams test function, not position.** Ask what a stage does or what signal it handles, not which box comes after which in one figure.
- **Calculation families are capped.** A new batch adds at most 2–3 items per family (λ, dipole length, repeater shift, SNR in dB, P = V·I). It doesn't repeat a calculation the other subject already covers.
- **No strawman errados.** If nobody would plausibly believe the false version ("ignore distress calls", "reset the breaker until it holds"), the item tests nothing.
- **No content-free certos.** "Cooperating against interference is a duty" can't be got wrong. Make it a scenario or drop it.

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
