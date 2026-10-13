/**
 * templates/index.ts — registry of subject builders used by generate.ts.
 * To add a subject: write templates/<subject>.ts exporting a builder
 * function, then add one line here.
 */
import type { QuestionDraft, SubjectId } from "../schema";
import { buildEleQuestions } from "./ele";
import { buildLegQuestions } from "./leg";
import { buildTeoQuestions } from "./teo";

export const BUILDERS: Partial<Record<SubjectId, () => QuestionDraft[]>> = {
  TEO: buildTeoQuestions,
  LEG: buildLegQuestions,
  ELE: buildEleQuestions,
};
