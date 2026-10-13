/**
 * bank.ts — client-side helpers over the question bank.
 * Types come from scripts/schema.ts (type-only import, erased at build).
 */
import type { Question } from "../../scripts/schema";

export type { Bank, Question, SubjectId } from "../../scripts/schema";

export function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function draw<T>(arr: readonly T[], count: number): T[] {
  return shuffle(arr).slice(0, count);
}

/**
 * Draw a session pool without replacement. IDs are intentionally kept only
 * in memory by the active quiz; they are discarded when the session ends.
 */
export function drawWithoutReplacement<T extends { id: string }>(
  arr: readonly T[],
  count: number,
): T[] {
  const seen = new Set<string>();
  const result: T[] = [];
  for (const item of shuffle(arr)) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    result.push(item);
    if (result.length >= count) break;
  }
  return result;
}

export function isTrueFalse(q: Question): q is Extract<Question, { questionType: "true-false" }> {
  return q.questionType === "true-false";
}

export function isMultipleChoice(q: Question): q is Extract<Question, { questionType: "multiple-choice" }> {
  return q.questionType === "multiple-choice";
}

export const answerLabel = (b: boolean): string => (b ? "Certo" : "Errado");
