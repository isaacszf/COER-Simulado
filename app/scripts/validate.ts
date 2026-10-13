/**
 * validate.ts — lints the generated bank files against the schema invariants.
 * Exits non-zero on any violation, so `npm run build` fails on bad data.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  SUBJECTS, SUBJECT_ORDER, SIMULADO_SIZE,
  type Bank, type Question, type SubjectId,
} from "./schema";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DATA_DIR = join(ROOT, "public", "data");

const errors: string[] = [];
const warns: string[] = [];

function assert(cond: boolean, msg: string) {
  if (!cond) errors.push(msg);
}
function warn(cond: boolean, msg: string) {
  if (!cond) warns.push(msg);
}

function loadBank(code: SubjectId): Bank | null {
  const file = join(DATA_DIR, `${code.toLowerCase()}.json`);
  try {
    return JSON.parse(readFileSync(file, "utf8")) as Bank;
  } catch {
    return null;
  }
}

function validateQuestion(q: Question, subject: SubjectId) {
  assert(typeof q.id === "string" && /^(TEO|LEG|ELE)-\d{3,}$/.test(q.id), `[${q.id}] id must match <SUBJECT>-NNN`);
  assert(q.subject === subject, `[${q.id}] subject field mismatch`);
  const meta = SUBJECTS[subject];
  const topic = meta.topics.find((t) => t.slug === q.topic);
  assert(!!topic, `[${q.id}] unknown topic slug "${q.topic}"`);
  assert(q.topicName === topic?.name, `[${q.id}] topicName mismatch for "${q.topic}"`);
  assert(typeof q.statement === "string" && q.statement.trim().length > 0, `[${q.id}] empty statement`);
  assert(typeof q.explanation === "string" && q.explanation.trim().length > 0, `[${q.id}] empty explanation`);
  assert(q.source === "generated" || q.source === "extracted", `[${q.id}] bad source "${q.source}"`);
  assert(typeof q.sourceRef === "string" && q.sourceRef.trim().length > 0, `[${q.id}] empty sourceRef`);
  assert(typeof q.reviewed === "boolean", `[${q.id}] reviewed must be boolean`);

  if (q.questionType === "true-false") {
    assert(typeof q.answer === "boolean", `[${q.id}] true-false answer must be boolean`);
  } else if (q.questionType === "multiple-choice") {
    assert(Array.isArray(q.options) && q.options.length >= 3 && q.options.length <= 5, `[${q.id}] mc needs 3-5 options`);
    assert(q.options.every((o) => typeof o === "string" && o.trim().length > 0), `[${q.id}] mc has empty option`);
    assert(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length, `[${q.id}] mc answer index out of range`);
    assert(new Set(q.options).size === q.options.length, `[${q.id}] mc has duplicate options`);
  } else {
    const malformed = q as unknown as { id: string; questionType?: unknown };
    assert(false, `[${malformed.id}] bad questionType "${malformed.questionType}"`);
  }
}

for (const code of SUBJECT_ORDER) {
  const bank = loadBank(code);
  if (!bank) {
    console.log(`[${code}] no bank file (skipped)`);
    continue;
  }
  assert(bank.subject === code, `[${code}] file subject mismatch`);
  assert(bank.subjectName === SUBJECTS[code].name, `[${code}] subjectName mismatch`);
  assert(Array.isArray(bank.questions) && bank.questions.length > 0, `[${code}] bank has no questions`);

  const ids = new Set<string>();
  for (const q of bank.questions) {
    assert(!ids.has(q.id), `[${code}] duplicate id ${q.id}`);
    ids.add(q.id);
    validateQuestion(q, code);
  }

  const trueFalse = bank.questions.filter((q) => q.questionType === "true-false");
  const mc = bank.questions.filter((q) => q.questionType === "multiple-choice");
  warn(trueFalse.length >= SIMULADO_SIZE, `[${code}] Simulado needs >= ${SIMULADO_SIZE} true-false questions (has ${trueFalse.length})`);
  warn(trueFalse.some((q) => q.answer === true) && trueFalse.some((q) => q.answer === false), `[${code}] true-false set not mixed (all one side)`);
  warn(mc.length === 0 || new Set(mc.map((q) => q.answer)).size > 1, `[${code}] mc correct answer should vary`);
  warn(bank.questions.some((q) => q.reviewed), `[${code}] no reviewed questions yet (expected for MVP)`);
}

if (warns.length) {
  console.log(`\nWarnings (${warns.length}):`);
  for (const w of warns) console.log(`  ! ${w}`);
}
if (errors.length) {
  console.error(`\nValidation FAILED (${errors.length} errors):`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log(`\nValidation OK — ${errors.length} errors, ${warns.length} warnings.`);
