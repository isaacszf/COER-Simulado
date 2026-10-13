/**
 * generate.ts — renders templates into JSON bank files (public/data/<subject>.json).
 * Every subject registered in templates/index.ts gets a bank file.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { SUBJECTS, SUBJECT_ORDER, type Question, type Bank, type MultipleChoiceQuestion, type SubjectId, type TrueFalseQuestion } from "./schema";
import { BUILDERS } from "./templates";
import { CARTILHA } from "./templates/helpers";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "public", "data");

function buildBank(subject: SubjectId): Bank {
  const meta = SUBJECTS[subject];
  const builder = BUILDERS[subject];
  if (!builder) throw new Error(`no template builder for subject ${subject}`);

  const drafts = builder();
  const questions: Question[] = drafts.map((draft, i) => {
    const id = `${subject}-${String(i + 1).padStart(3, "0")}`;
    return draft.questionType === "true-false"
      ? ({ ...draft, id } satisfies TrueFalseQuestion)
      : ({ ...draft, id } satisfies MultipleChoiceQuestion);
  });

  const trueFalse = questions.filter((q) => q.questionType === "true-false").length;
  const mc = questions.length - trueFalse;
  console.log(`[${subject}] ${questions.length} questions (${trueFalse} true-false, ${mc} multiple-choice)`);

  return {
    subject,
    subjectName: meta.name,
    sourceBasis: `Ato 3448/2026 §11.4 ementa · ${CARTILHA}`,
    generatedAt: new Date().toISOString(),
    questions,
  };
}

mkdirSync(OUT_DIR, { recursive: true });

for (const code of SUBJECT_ORDER) {
  if (!BUILDERS[code]) {
    console.log(`[${code}] no builder registered (skipped)`);
    continue;
  }
  const bank = buildBank(code);
  writeFileSync(join(OUT_DIR, `${code.toLowerCase()}.json`), `${JSON.stringify(bank, null, 2)}\n`);
}

console.log(`written to ${OUT_DIR}`);
