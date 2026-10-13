/**
 * templates/helpers.ts — shared builders for every subject's question file.
 *
 * A subject file (teo.ts, ele.ts, leg.ts) calls `createBuilder("ELE")` and
 * writes items with `tf()` / `mc()`. The builder fills in the subject, topic
 * name, source and review flags, so subject files only hold content.
 * See considerations/BRAINSTORM.md §5 for the quality standard.
 */
import type { QuestionDraft, QuestionKind, QuestionLevel, SubjectId } from "../schema";
import { SUBJECTS } from "../schema";

/** Per-item metadata required by the quality standard. */
export interface Meta {
  kind: QuestionKind;
  level: QuestionLevel;
  pitfall: string; // the misconception the item tests
  ref: string; // sourceRef — build it with the `cite` helpers below
  recall?: boolean; // pure lookup (phonetic, Código Q, table row)
  checkedByAi?: boolean; // overrides the builder default for this item
}

export interface BuilderOptions {
  /**
   * Default `checkedByAi` for items from this builder. Leave it false for new
   * content; set it to true only after a full review against the Cartilha.
   */
  checkedByAi?: boolean;
}

export interface Builder {
  /** Certo/errado item. `answer`: true = certo, false = errado. */
  tf(topic: string, m: Meta, statement: string, answer: boolean, explanation: string): QuestionDraft;
  /**
   * Single-answer multiple-choice item. Pass the correct option FIRST; it is
   * moved to a rotating position so the answer index varies across the bank.
   */
  mc(topic: string, m: Meta, statement: string, optionsWithCorrectFirst: string[], explanation: string): QuestionDraft;
}

export function createBuilder(subject: SubjectId, opts: BuilderOptions = {}): Builder {
  const topics = SUBJECTS[subject].topics;
  let mcCounter = 0;

  function base(slug: string, m: Meta, statement: string, explanation: string) {
    const t = topics.find((x) => x.slug === slug);
    if (!t) throw new Error(`unknown ${subject} topic: ${slug}`);
    return {
      subject,
      topic: t.slug,
      topicName: t.name,
      statement,
      explanation,
      kind: m.kind,
      level: m.level,
      pitfall: m.pitfall,
      ...(m.recall ? { recall: true } : {}),
      source: "generated" as const,
      sourceRef: m.ref,
      reviewed: false,
      checkedByAi: m.checkedByAi ?? opts.checkedByAi ?? false,
    };
  }

  return {
    tf(topic, m, statement, answer, explanation) {
      return { ...base(topic, m, statement, explanation), questionType: "true-false", answer };
    },
    mc(topic, m, statement, optionsWithCorrectFirst, explanation) {
      const [correct, ...distractors] = optionsWithCorrectFirst;
      const pos = mcCounter % optionsWithCorrectFirst.length;
      mcCounter++;
      const options = [...distractors];
      options.splice(pos, 0, correct);
      return { ...base(topic, m, statement, explanation), questionType: "multiple-choice", options, answer: pos };
    },
  };
}

/* ── Citations ─────────────────────────────────────────────────────────── */

export const CARTILHA = "Cartilha do Serviço Radioamador, versão 2026-06";

/** Cartilha annexes: 1 = Técnica e Ética, 2 = Legislação, 3 = Eletrônica. */
export const cite = {
  /** Section of an annex, e.g. cite.annex(1, "2.4", 29). Pages may be a range like "34–35". */
  annex: (annex: 1 | 2 | 3, sec: string, page: number | string, suffix = "") =>
    `${CARTILHA}, Anexo ${annex} §${sec}, p. ${page}${suffix}`,
  /** Section of the Cartilha's main body (before the annexes). */
  body: (sec: string, page: number | string) => `${CARTILHA}, §${sec}, p. ${page}`,
};
