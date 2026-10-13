# QUESTION QUALITY SURVEY — does our bank mirror the exam?

> Status: researched **2026-10-13**. Scope: COER Classe C, TEO bank first.
> Question asked: our questions felt too basic. Are they on par with the real exam, and is id.qsl.br a good model to follow?
> Outcome: the old bank was not on par. id.qsl.br holds up as the best reference. We adopted a quality standard (`BRAINSTORM.md` §5) and rebuilt TEO to it.

---

## 1. What we can know about the real exam

- **Format is fixed by the rules:** objective items, **certo/errado**. Classe C has 15 per subject, 20 min, at least 8 correct (Ato 3448/2026 §11.2–11.3, transcribed in the Cartilha 2026-06 §10).
- **No official sample questions exist.** The exam bank lives inside Anatel's SEC system. The only official study material is the **Cartilha do Serviço Radioamador**. Its annexes follow the §11.4 ementa topic by topic and repeatedly flag "conceitos importantes para prova".
- **Candidate reports are scarce and anecdotal.** One comment on antenaativa.com.br says the new certo/errado exam included items "que nem estão nos simuladores tradicionais", for example whether "Região 8 pertence ao Pará". That points to **detail-level content taken from Cartilha tables** (call-sign regions, band tables, segment rules), not just headline definitions.
- **The legacy Anatel bank** (Legislação "Teste de Avaliação", DEZ/2008, corrected MAR/2024, on an Anatel attachment URL) is still online. It is multiple-choice a–e under the old regime, so it is only useful for mining topics.

Conclusion: we cannot match items one-to-one against the real exam. The faithful target is **the Cartilha 2026-06 content at full depth, in certo/errado form, with plausible traps**.

## 2. Cartilha edition (correction)

The official attachment URL (`sistemas.anatel.gov.br/anexar-api/publico/anexos/download/e2bee3ec…`) now serves **Versão 2026-06**. It is byte-identical (same md5) to `CARTILHA-RADIOAMADOR-v9.pdf` hosted by id.qsl.br. `SUBJECTS-SURVEY.md` had called 2026-06 a community guide and 2026-03 the official edition. That was wrong and has been corrected. All content now cites 2026-06.

## 3. Benchmark: id.qsl.br/simulados

The site is a JS app. Its question bank ships in the public JS bundle, which we read for analysis only.

| | Old TEO bank (75) | id.qsl.br (1.877) | New TEO bank (161) |
| --- | --- | --- | --- |
| Format | 59 certo/errado + 16 multiple-choice | 100% certo/errado | 126 certo/errado + 35 multiple-choice (Treino only) |
| Subjects | TEO only | TEO 624 · LEG 540 · ELE 713 | TEO only |
| Kind mix (conceitual / cenario / calculo) | not tracked; nearly all recall | 46% / 37% / 18% | 47% / 42% / 12% |
| Level mix (L1–L5) | not tracked; nearly all L1 | 6 / 24 / 49 / 16 / 5% | 8 / 25 / 47 / 16 / 4% |
| Pure recall (phonetic, Código Q, band names) | **71%** (53 of 75) | 2.6% phonetic/Q | 7% (11) |
| Topic coverage | 72% in 2 of 8 topics; other topics 3–4 items each | fine-grained subtopics per ementa item | every topic 10–15% |
| Avg statement length | 75 chars | 110–125 chars | 105 chars |
| Pitfall per item | no | yes | yes |
| Source citation | Cartilha 2026-03, section level | Cartilha 2026-06, page level | Cartilha 2026-06, section + page |
| Certo share (certo/errado items) | 61% | n/a | 50% |

**Why the old bank felt basic.** Most items were one fact each ("a letra F é anunciada como Victor", "145 MHz pertence a VHF"). Six of the eight ementa topics had almost no items. Nothing asked the candidate to apply a rule to a situation, and errado items were often far-fetched.

**What makes id.qsl.br good:**
- Errado items change one plausible point. Examples: "um indicativo especial pode ter até quinze caracteres" (the real limit is ten); "reduzir o ruído à metade reduz a SNR em 3 dB" (it improves by 3 dB).
- Scenario items apply a rule ("num enlace LF em que predomina a onda de superfície, mudar o percurso para água do mar…").
- Calculations are realistic (repeater shift, e.i.r.p., RMS/peak).
- Each item records its level, kind and pitfall, which makes difficulty auditable.

**Spot checks against the Cartilha 2026-06:**
- Confirmed: a station gets one special call sign at a time (Anexo 2); PY4 is the Minas Gerais prefix (Anexo 2 table).
- Confirmed by arithmetic: SNR, e.i.r.p., repeater-shift and RMS items.
- Not verified: the ten-character call-sign limit. It isn't in the Cartilha text and the Ato PDF couldn't be fetched from gov.br.

**Caveats:**
- Community-run, not official, and **no open license**. We take structure and topic breadth only; wording stays ours (`BRAINSTORM.md` §3, §5).
- The **LABRE-DF simulator** (labredf.org.br/simulador; 650+ items, Cartilha v8, randomized calculation values) is a useful second benchmark, especially the randomized-calculation idea.

## 4. Decisions taken

1. **Quality standard** recorded in `BRAINSTORM.md` §5. It covers kind/level/pitfall per item, the recall cap, coverage and answer-balance limits, statement length, and page-level citations. `validate.ts` enforces it and prints a distribution report.
2. **TEO rebuilt** from the Cartilha 2026-06 text (Anexo 1 pp. 26–38, plus §§5.6, 6.5–6.6, 12–13 and Anexo 2 §4.4). The old template file had hard-coded `REVIEWED = true` without a review. The rebuilt items passed a full AI review against the Cartilha text (`checkedByAi: true`). Human review became optional; see §5.

## 5. AI review (2026-10-13)

Every one of the 161 TEO items was checked against the Cartilha 2026-06 text: answer, explanation, page reference, arithmetic, and certo/errado ambiguity.

- **No wrong answers found.**
- **Fixed 8 items:**
  - TEO-009: dropped "é ouvido pela repetidora", which depends on the access tone.
  - TEO-010: rewritten so it doesn't rely on "5 acima" meaning kHz, a convention the Cartilha doesn't state.
  - TEO-022: an antenna has an impedance, not a characteristic impedance.
  - TEO-059: grammar.
  - TEO-136: removed an inference the Cartilha doesn't make.
  - TEO-107, TEO-120: page range corrected to pp. 34–35.
- **Corrected 3 references** (TEO-139, TEO-140, TEO-156): they point to Anexo 2, not the main body.
- **Limit:** rules from Ato 3448 were checked only through the Cartilha's transcription, because the Ato PDF couldn't be fetched.
3. **Next:** ELE done (153 items, same standard). LEG remains. For LEG, the Cartilha's Anexo 2 tables (call-sign regions, class rules, special call signs) are where the "Região 8 → Pará"-style detail lives.

---

*Sources (accessed 2026-10-13): id.qsl.br/simulados (app bundle + hosted Cartilha v9); Anatel Cartilha attachment e2bee3ec…; Anatel Manual do Candidato v2026-04.1 (attachment 0a5f2113…); Anatel legacy Legislação bank (attachment 9eba8822…); antenaativa.com.br (prova Anatel, simulador COER, candidate comments); labredf.org.br/2026/10 simulator announcement; telesintese.com.br and gov.br/anatel news on the resumption of exams.*
