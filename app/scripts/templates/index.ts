/**
 * templates/index.ts — registry of subject builders used by generate.ts.
 * To add a subject: write templates/<subject>.ts exporting a builder
 * function, then add one line here.
 */
import type { QuestionDraft, SubjectId } from "../schema";
import { buildTeoQuestions } from "./teo";

export const BUILDERS: Partial<Record<SubjectId, () => QuestionDraft[]>> = {
  TEO: buildTeoQuestions,
};
