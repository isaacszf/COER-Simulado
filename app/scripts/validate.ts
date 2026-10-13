/**
 * validate.ts — lints the generated bank files against the schema invariants.
 * Exits non-zero on any violation, so `npm run build` fails on bad data.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  SUBJECTS, SUBJECT_ORDER, SIMULADO_SIZE, QUESTION_KINDS,
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

// Quality standard (considerations/BRAINSTORM.md §5). Hard limits are errors;
// distribution targets are warnings so a person reviews the mix.
const STATEMENT_MIN = 60; // certo/errado only; multiple-choice stems may be short questions
const STATEMENT_MAX = 220;

interface Targets {
  recallMax: number; // max share of `recall: true` items
  topicMin: number; // min share of each ementa topic
  topicMax: number; // max share of each ementa topic
  certoMin: number; // certo share among certo/errado items
  certoMax: number;
  calculoMin: number; // min share of `kind: "calculo"` items
}

const DEFAULT_TARGETS: Targets = {
  recallMax: 0.10,
  topicMin: 0.08,
  topicMax: 0.25,
  certoMin: 0.40,
  certoMax: 0.60,
  calculoMin: 0.10,
};

/** Per-subject overrides of DEFAULT_TARGETS. */
const SUBJECT_TARGETS: Partial<Record<SubjectId, Partial<Targets>>> = {
  ELE: { calculoMin: 0.25 }, // electronics leans on computation (Ohm, power, λ)
  LEG: { calculoMin: 0 }, // law content has few computations
};

const targetsFor = (code: SubjectId): Targets => ({ ...DEFAULT_TARGETS, ...SUBJECT_TARGETS[code] });

const pct = (n: number, total: number) => `${Math.round((100 * n) / total)}%`;

function share<T>(items: T[], key: (x: T) => string | number): Map<string | number, number> {
  const m = new Map<string | number, number>();
  for (const x of items) m.set(key(x), (m.get(key(x)) ?? 0) + 1);
  return m;
}

function report(code: SubjectId, qs: Question[]) {
  const n = qs.length;
  const fmt = (m: Map<string | number, number>) =>
    [...m.entries()].sort(([a], [b]) => String(a).localeCompare(String(b))).map(([k, v]) => `${k} ${v} (${pct(v, n)})`).join(" · ");
  const avg = Math.round(qs.reduce((s, q) => s + q.statement.length, 0) / n);
  console.log(`[${code}] ${n} questions — avg statement ${avg} chars`);
  console.log(`  kind:  ${fmt(share(qs, (q) => q.kind))}`);
  console.log(`  level: ${fmt(share(qs, (q) => `L${q.level}`))}`);
  console.log(`  topic: ${fmt(share(qs, (q) => q.topic))}`);
  console.log(`  recall: ${qs.filter((q) => q.recall).length} (${pct(qs.filter((q) => q.recall).length, n)})`);
}

function checkDistribution(code: SubjectId, qs: Question[]) {
  const n = qs.length;
  const t = targetsFor(code);
  const p = (x: number) => `${Math.round(x * 100)}%`;
  const recall = qs.filter((q) => q.recall).length;
  warn(recall / n <= t.recallMax, `[${code}] recall share ${pct(recall, n)} above ${p(t.recallMax)}`);
  for (const topic of SUBJECTS[code].topics) {
    const c = qs.filter((q) => q.topic === topic.slug).length;
    warn(c / n >= t.topicMin, `[${code}] topic ${topic.slug} at ${pct(c, n)} (min ${p(t.topicMin)})`);
    warn(c / n <= t.topicMax, `[${code}] topic ${topic.slug} at ${pct(c, n)} (max ${p(t.topicMax)})`);
  }
  const tfq = qs.filter((q) => q.questionType === "true-false");
  if (tfq.length) {
    const certo = tfq.filter((q) => q.answer === true).length / tfq.length;
    warn(certo >= t.certoMin && certo <= t.certoMax, `[${code}] certo share ${p(certo)} outside ${p(t.certoMin)}-${p(t.certoMax)}`);
  }
  const calculo = qs.filter((q) => q.kind === "calculo").length;
  warn(calculo / n >= t.calculoMin, `[${code}] calculo share ${pct(calculo, n)} below ${p(t.calculoMin)}`);
  warn(qs.some((q) => q.level >= 4), `[${code}] no level 4-5 items`);
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
  assert(typeof q.checkedByAi === "boolean", `[${q.id}] checkedByAi must be boolean`);
  assert(QUESTION_KINDS.includes(q.kind), `[${q.id}] bad kind "${q.kind}"`);
  assert(Number.isInteger(q.level) && q.level >= 1 && q.level <= 5, `[${q.id}] level must be 1-5`);
  assert(typeof q.pitfall === "string" && q.pitfall.trim().length > 0, `[${q.id}] empty pitfall`);
  assert(q.recall === undefined || typeof q.recall === "boolean", `[${q.id}] recall must be boolean`);
  const len = q.statement.length;
  warn(q.questionType !== "true-false" || (len >= STATEMENT_MIN && len <= STATEMENT_MAX), `[${q.id}] statement length ${len} outside ${STATEMENT_MIN}-${STATEMENT_MAX}`);

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
  const unchecked = bank.questions.filter((q) => !q.checkedByAi && !q.reviewed);
  warn(unchecked.length === 0, `[${code}] ${unchecked.length} questions not checked by AI or human: ${unchecked.slice(0, 10).map((q) => q.id).join(", ")}`);
  report(code, bank.questions);
  checkDistribution(code, bank.questions);
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
