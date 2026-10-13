/**
 * generate.ts — renders templates into JSON bank files (public/data/<subject>.json).
 * MVP emits the TEO subject; further subjects follow the same pattern.
 */
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { SUBJECTS, SUBJECT_ORDER, type Question, type QuestionDraft, type Bank, type MultipleChoiceQuestion, type TrueFalseQuestion } from "./schema";
import { buildTeoQuestions } from "./templates/teo";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "public", "data");

const BUILDERS: Record<string, () => QuestionDraft[]> = {
  TEO: buildTeoQuestions,
};

function buildBank(subject: keyof typeof SUBJECTS & string): Bank {
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
    sourceBasis: "Ato 3448/2026 §11.4 ementa · Cartilha do Serviço Radioamador, versão 2026-06",
    generatedAt: new Date().toISOString(),
    questions,
  };
}

mkdirSync(OUT_DIR, { recursive: true });

for (const code of SUBJECT_ORDER) {
  if (BUILDERS[code]) {
    const bank = buildBank(code);
    writeFileSync(join(OUT_DIR, `${code.toLowerCase()}.json`), `${JSON.stringify(bank, null, 2)}\n`);
  }
}

console.log(`written to ${OUT_DIR}`);
console.log(existsSync(join(OUT_DIR, "teo.json")) ? "teo.json ok" : "teo.json missing");
