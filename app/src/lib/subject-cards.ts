/**
 * subject-cards.ts — build-time data for the Simulado/Treino subject pickers.
 * A subject's card is enabled as soon as its bank file exists in
 * public/data/, so adding a subject needs no page edits.
 * Server-side only (reads the bank with node:fs in Astro frontmatter).
 */
import { readFileSync } from "node:fs";
import { SUBJECT_ORDER, SUBJECTS, type Bank, type SubjectId } from "../../scripts/schema";

const CARD_STYLE: Record<SubjectId, { tint: string; blurb: string }> = {
  TEO: {
    tint: "lime",
    blurb: "Todas as áreas da ementa: estação, antenas, frequência, propagação, interferências, comunicados, ética e emergências.",
  },
  LEG: {
    tint: "sky",
    blurb: "Regulamento de Rádio da UIT, LGT, RGST, plano de faixas, requisitos técnicos e operacionais e homologação.",
  },
  ELE: {
    tint: "steel",
    blurb: "Lei de Ohm e componentes, espectro e comprimento de onda, proteção e medição elétrica, estação e telecomunicações.",
  },
};

export interface SubjectCard {
  code: SubjectId;
  slug: string;
  title: string;
  tint: string;
  blurb: string;
  trueFalse: number; // certo/errado items (Simulado pool)
  total: number; // all items (Treino pool)
}

function loadBank(code: SubjectId): Bank | null {
  try {
    return JSON.parse(readFileSync(`public/data/${code.toLowerCase()}.json`, "utf8")) as Bank;
  } catch {
    return null;
  }
}

/** One card per subject, in ementa order; counts are 0 when no bank exists. */
export function subjectCards(): SubjectCard[] {
  return SUBJECT_ORDER.map((code) => {
    const qs = loadBank(code)?.questions ?? [];
    return {
      code,
      slug: code.toLowerCase(),
      title: SUBJECTS[code].name,
      ...CARD_STYLE[code],
      trueFalse: qs.filter((q) => q.questionType === "true-false").length,
      total: qs.length,
    };
  });
}
