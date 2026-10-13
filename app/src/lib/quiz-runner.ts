/**
 * quiz-runner.ts — the quiz engine (vanilla TS island).
 * Drives both modes from one set of DOM templates styled per DESIGN.md.
 *
 * Simulado: certa/errado only, N questions, countdown timer, official scoring
 *          (min passing per BRAINSTORM), result = score + plain right/wrong.
 * Treino:   topic + type filters, instant feedback with explanations.
 */
import type { Bank, Question } from "../../scripts/schema";
import { SIMULADO_MINUTES, SIMULADO_PASSING, SIMULADO_SIZE } from "../../scripts/schema";
import { answerLabel, drawWithoutReplacement, isMultipleChoice, isTrueFalse, shuffle } from "./bank";

export interface QuizConfig {
  mode: "simulado" | "treino";
  bank: Bank;
  /** Treino only */
  topic?: string | "all";
  type?: "true-false" | "multiple-choice" | "mixed";
  quantity?: number;
}

const esc = (s: string): string =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

const fmtTime = (secs: number): string => {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

export function initQuiz(mount: HTMLElement, cfg: QuizConfig): void {
  mount.replaceChildren();
  if (cfg.mode === "simulado") runSimulado(mount, cfg);
  else runTreino(mount, cfg);
}

/* ── Simulado ──────────────────────────────────────────────────────────── */

function runSimulado(mount: HTMLElement, cfg: QuizConfig) {
  const pool = cfg.bank.questions.filter(isTrueFalse);
  const total = Math.min(SIMULADO_SIZE, pool.length);
  const questions = drawWithoutReplacement(pool, total);
  const answers: Array<boolean | null> = new Array(questions.length).fill(null);

  if (questions.length === 0) {
    mount.innerHTML = `<div class="notice">Banco de questões insuficiente para o simulado.</div>`;
    return;
  }

  const seconds = SIMULADO_MINUTES * 60;
  const state = { idx: 0, secondsLeft: seconds, finished: false };
  let timer: ReturnType<typeof setInterval> | undefined;

  const done = () => {
    if (state.finished) return;
    state.finished = true;
    if (timer) clearInterval(timer);
    renderResults();
  };

  const render = () => {
    const q = questions[state.idx];
    const allAnswered = answers.every((a) => a !== null);
    const chosen = answers[state.idx];

    mount.innerHTML = `
      <div class="quiz" data-step="question">
        <div class="quiz-bar">
          <div class="quiz-bar__left">
            <span class="mode-tag">SIMULADO</span>
            <span class="progress">Questão ${state.idx + 1} de ${questions.length}</span>
            <span class="progress">Assunto: ${esc(q.topicName)}</span>
          </div>
          <div class="timer" aria-live="off">${fmtTime(state.secondsLeft)}</div>
        </div>
        <section class="question-card">
          <div class="question-card__topic">${esc(q.topicName)}</div>
          <p class="question-card__statement">${esc(q.statement)}</p>
          <div class="answers">
            <button class="ans-btn ${chosen === true ? "is-selected" : ""}" data-action="tf" data-v="1">CERTO</button>
            <button class="ans-btn ${chosen === false ? "is-selected" : ""}" data-action="tf" data-v="0">ERRADO</button>
          </div>
        </section>
        <div class="quiz-nav">
          <button class="btn-secondary" data-action="prev" ${state.idx === 0 ? "disabled" : ""}>ANTERIOR</button>
          <span class="spacer"></span>
          <button class="btn-primary ${allAnswered ? "" : ""}" data-action="submit" ${allAnswered ? "" : "disabled"}>ENVIAR PROVA</button>
        </div>
      </div>`;

    if (!timer) {
      timer = setInterval(() => {
        state.secondsLeft -= 1;
        const t = mount.querySelector<HTMLElement>(".timer");
        if (t) t.textContent = fmtTime(state.secondsLeft);
        if (state.secondsLeft <= 0) {
          if (t) t.textContent = "00:00";
          done();
        }
      }, 1000);
    }
  };

  const renderResults = () => {
    const correct = answers.filter((a, i) => a === questions[i].answer).length;
    const passed = correct >= SIMULADO_PASSING;
    const pct = Math.round((correct / questions.length) * 100);

    const rows = questions
      .map((q, i) => {
        const user = answers[i];
        const ok = user === q.answer;
        return `<tr>
          <td>${i + 1}</td>
          <td>${esc(q.topicName)} — ${esc(q.statement)}</td>
          <td>${user !== null ? (ok ? '<span class="ok-mark">✔</span> ' : '<span class="bad-mark">✘</span> ') + answerLabel(user) : "—"}</td>
          <td>${answerLabel(q.answer)}</td>
          <td>${ok ? '<span class="ok-mark">✔</span>' : '<span class="bad-mark">✘</span>'}</td>
        </tr>`;
      })
      .join("");

    mount.innerHTML = `
      <div class="result" data-step="result">
        <div class="seal">${passed ? "APROVADO" : "REPROVADO"}</div>
        <h1>${passed ? "APROVADO" : "REPROVADO"}</h1>
        <p class="result__score">Você acertou <strong>${correct}</strong> de ${questions.length} (${pct}%).
        Mínimo para aprovação: <strong>${SIMULADO_PASSING}</strong> (51%).</p>
        <table class="result__table">
          <thead><tr><th>#</th><th>Questão</th><th>Sua resposta</th><th>Correta</th><th></th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="quiz-nav">
          <button class="btn-primary" data-action="restart">NOVO SIMULADO</button>
          <a class="btn-secondary" href="/simulado">OUTRA MATÉRIA</a>
        </div>
      </div>`;
  };

  mount.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>("[data-action]");
    if (!btn) return;
    const action = btn.dataset.action;

    if (state.finished) {
      if (action === "restart") runSimulado(mount, cfg);
      return;
    }

    if (action === "tf") {
      answers[state.idx] = btn.dataset.v === "1";
      if (state.idx < questions.length - 1) state.idx += 1;
      render();
    } else if (action === "prev") {
      if (state.idx > 0) state.idx -= 1;
      render();
    } else if (action === "submit") {
      if (answers.every((a) => a !== null)) done();
    }
  });

  render();
}

/* ── Treino ────────────────────────────────────────────────────────────── */

function buildPool(qs: Question[], topic: string | "all", type: QuizConfig["type"]): Question[] {
  let pool = topic === "all" ? qs : qs.filter((q) => q.topic === topic);
  if (type === "true-false") pool = pool.filter(isTrueFalse);
  else if (type === "multiple-choice") pool = pool.filter(isMultipleChoice);
  else {
    const tf = shuffle(pool.filter(isTrueFalse));
    const mc = shuffle(pool.filter(isMultipleChoice));
    const out: Question[] = [];
    while (tf.length || mc.length) {
      if (tf.length) out.push(tf.shift()!);
      if (mc.length) out.push(mc.shift()!);
    }
    pool = out;
  }
  return shuffle(pool);
}

function runTreino(mount: HTMLElement, cfg: QuizConfig) {
  const topic = cfg.topic ?? "all";
  const type = cfg.type ?? "mixed";
  const quantity = Math.max(1, cfg.quantity ?? 10);

  const pool = buildPool(cfg.bank.questions, topic, type);
  const questions = drawWithoutReplacement(pool, quantity);

  if (questions.length === 0) {
    mount.innerHTML = `<div class="notice">
      <div class="notice__title">NENHUMA QUESTÃO NESTE FILTRO</div>
      <p>Para este assunto/tipo ainda não existem questões no banco.</p>
      <button class="btn-secondary" data-action="back">VOLTAR</button>
    </div>`;
    mount.addEventListener("click", () => {
      window.location.reload();
    });
    return;
  }

  const answers: Array<boolean> = new Array(questions.length).fill(false);
  const state = { idx: 0, answered: false, chosen: -1 };

  const render = () => {
    const q = questions[state.idx];
    const n = questions.length;
    const isLast = state.idx === n - 1;

    const answerArea =
      q.questionType === "true-false"
        ? `<div class="answers">
             <button class="ans-btn ${state.answered && q.answer === true ? "is-ok" : ""} ${state.answered && state.chosen === 0 && q.answer !== true ? "is-bad" : ""}" data-action="tf" data-v="1">CERTO</button>
             <button class="ans-btn ${state.answered && q.answer === false ? "is-ok" : ""} ${state.answered && state.chosen === 1 && q.answer !== false ? "is-bad" : ""}" data-action="tf" data-v="0">ERRADO</button>
           </div>`
        : `<div class="answers">${q.options
            .map(
              (opt, i) =>
                `<button class="ans-btn ${state.answered && q.answer === i ? "is-ok" : ""} ${state.answered && state.chosen === i && q.answer !== i ? "is-bad" : ""}" data-action="mc" data-i="${i}">${esc(opt)}</button>`,
            )
            .join("")}</div>`;

    const correctAnswerLabel = isTrueFalse(q)
      ? answerLabel(q.answer)
      : `«${q.options[q.answer]}»`;
    const isCorrectChoice = isTrueFalse(q)
      ? (state.chosen === 0 ? true : state.chosen === 1 ? false : null) === q.answer
      : state.chosen === q.answer;

    const feedbackHtml =
      state.answered === false
        ? ""
        : `<div class="feedback ${isCorrectChoice ? "feedback--ok" : "feedback--bad"}">
             <div class="feedback__verdict">${isCorrectChoice ? "CERTO ✔" : "ERRADO ✘ — resposta correta: " + correctAnswerLabel}</div>
             <p class="feedback__explanation">${esc(q.explanation)}</p>
             <p class="feedback__source">Fonte: ${esc(q.sourceRef)}</p>
           </div>`;

    mount.innerHTML = `
      <div class="quiz" data-step="question">
        <div class="quiz-bar">
          <div class="quiz-bar__left">
            <span class="mode-tag">TREINO</span>
            <span class="progress">Questão ${state.idx + 1} de ${n}</span>
            <span class="progress">Assunto: ${esc(q.topicName)}</span>
          </div>
          <span class="sticker">${anyString(typeLabel(type))}</span>
        </div>
        <section class="question-card">
          <div class="question-card__topic">${esc(q.topicName)}</div>
          <p class="question-card__statement">${esc(q.statement)}</p>
          ${answerArea}
          ${feedbackHtml}
        </section>
        <div class="quiz-nav">
          <span class="spacer"></span>
          <button class="btn-primary" data-action="next" ${state.answered ? "" : "disabled"}>${isLast ? "VER RESULTADO" : "PRÓXIMA"}</button>
        </div>
      </div>`;
  };

  const renderSummary = () => {
    const correct = answers.filter((a) => a).length;
    mount.innerHTML = `
      <div class="result" data-step="result">
        <div class="seal">TREINO</div>
        <h1>RESULTADO DO TREINO</h1>
        <p class="result__score">Você acertou <strong>${correct}</strong> de ${questions.length}.</p>
        <div class="quiz-nav">
          <button class="btn-primary" data-action="restart">NOVO TREINO</button>
          <a class="btn-secondary" href="/treino">MUDAR CONFIG</a>
        </div>
      </div>`;
  };

  mount.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>("[data-action]");
    if (!btn) return;
    const action = btn.dataset.action;

    if (action === "restart") {
      runTreino(mount, cfg);
      return;
    }
    if (action === "next") {
      if (!state.answered) return;
      if (state.idx < questions.length - 1) {
        state.idx += 1;
        state.answered = false;
        state.chosen = -1;
        render();
      } else {
        renderSummary();
      }
      return;
    }
    if (action === "tf") {
      if (state.answered) return;
      const v = btn.dataset.v === "1";
      state.chosen = btn.dataset.v === "1" ? 0 : 1;
      const current = questions[state.idx];
      if (!isTrueFalse(current)) return;
      answers[state.idx] = v === current.answer;
      state.answered = true;
      render();
      return;
    }
    if (action === "mc") {
      if (state.answered) return;
      const i = Number(btn.dataset.i);
      state.chosen = i;
      answers[state.idx] = i === (questions[state.idx] as Extract<Question, { questionType: "multiple-choice" }>).answer;
      state.answered = true;
      render();
      return;
    }
  });

  render();
}

function typeLabel(t: "true-false" | "multiple-choice" | "mixed"): string {
  if (t === "true-false") return "CERTA/ERRADA";
  if (t === "multiple-choice") return "MÚLT. ESCOLHA";
  return "MISTO";
}
function anyString(s: string): string {
  return s;
}
