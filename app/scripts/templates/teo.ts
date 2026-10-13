/**
 * templates/teo.ts — Técnica e Ética Operacional question templates.
 * Parametric families (phonetic alphabet, Q codes, bands, wavelength) plus
 * hand-written items for the remaining ementa topics.
 * Per BRAINSTORM §4: a reviewed template yields dozens of distinct items.
 */
import type { MultipleChoiceQuestion, Question, QuestionDraft, TrueFalseQuestion } from "../schema";
import { SUBJECTS } from "../schema";

const S = "TEO";
const TOPICS = SUBJECTS[S].topics;
// The current TEO template set was checked against the official Cartilha
// (versão 2026-03) and Ato 3448/2026 before publishing the generated bank.
const REVIEWED = true;

function topic(slug: string) {
  const t = TOPICS.find((x) => x.slug === slug);
  if (!t) throw new Error(`unknown TEO topic: ${slug}`);
  return t;
}

/** Minimal draft shape; ids are assigned later by generate.ts. */
type Draft = QuestionDraft;

function tf(
  slug: string,
  statement: string,
  answer: boolean,
  explanation: string,
  sourceRef: string,
): Draft {
  const t = topic(slug);
  return {
    subject: S,
    topic: t.slug,
    topicName: t.name,
    questionType: "true-false",
    statement,
    answer,
    explanation,
    source: "generated",
    sourceRef,
    reviewed: REVIEWED,
  };
}

/**
 * Multiple-choice builder. `options` arrives with the correct option FIRST;
 * the correct answer is rotated deterministically so its index varies across
 * the bank (schema: options must keep 3–5 items).
 */
let mcCounter = 0;
function mc(
  slug: string,
  statement: string,
  optionsWithCorrectFirst: string[],
  explanation: string,
  sourceRef: string,
): Draft {
  const t = topic(slug);
  const total = optionsWithCorrectFirst.length;
  const correct = optionsWithCorrectFirst[0];
  const distractors = optionsWithCorrectFirst.slice(1);
  const pos = mcCounter % total;
  mcCounter++;
  const options = [...distractors];
  options.splice(pos, 0, correct);
  return {
    subject: S,
    topic: t.slug,
    topicName: t.name,
    questionType: "multiple-choice",
    statement,
    options,
    answer: pos,
    explanation,
    source: "generated",
    sourceRef,
    reviewed: REVIEWED,
  };
}

const REF = {
  comunicados: "Cartilha do Serviço Radioamador, versão 2026-03, Anexo 1 §§6.2–6.3; Ato 3448/2026 §§10.4, 11.4",
  freq: "Cartilha do Serviço Radioamador, versão 2026-03, Anexo 1 §§3.1–3.6; Ato 3448/2026 §11.4",
  estacao: "Cartilha do Serviço Radioamador, versão 2026-03, Anexo 1 §§1.1–1.2; Ato 3448/2026 §11.4",
  antenas: "Cartilha do Serviço Radioamador, versão 2026-03, Anexo 1 §§2.1–2.5; Ato 3448/2026 §11.4",
  propagacao: "Cartilha do Serviço Radioamador, versão 2026-03, Anexo 1 §§4.2–4.6; Ato 3448/2026 §11.4",
  interferencias: "Cartilha do Serviço Radioamador, versão 2026-03, Anexo 1 §§5.1–5.3; Ato 3448/2026 §11.4",
  etica: "Cartilha do Serviço Radioamador, versão 2026-03, Anexo 1 §§7.1–7.8; Ato 3448/2026 §§4.1, 10.2–10.4",
  emergencias: "Cartilha do Serviço Radioamador, versão 2026-03, Anexo 1 §§8.1–8.4; Ato 3448/2026 §§10.1, 10.3, 11.4",
};

/* ── Parametric family 1: Alfabeto fonético da UIT ─────────────────────── */

const PHONETIC: Array<[string, string]> = [
  ["A", "Alfa"], ["B", "Bravo"], ["C", "Charlie"], ["D", "Delta"], ["E", "Echo"],
  ["F", "Foxtrot"], ["G", "Golf"], ["H", "Hotel"], ["I", "Índia"], ["J", "Juliett"],
  ["K", "Kilo"], ["L", "Lima"], ["M", "Mike"], ["N", "November"], ["O", "Oscar"],
  ["P", "Papa"], ["Q", "Quebec"], ["R", "Romeo"], ["S", "Sierra"], ["T", "Tango"],
  ["U", "Uniform"], ["V", "Victor"], ["W", "Whiskey"], ["X", "X-ray"], ["Y", "Yankee"],
  ["Z", "Zulu"],
];

// Representative direct-recall coverage. Do not emit one standalone item
// for every letter; the rest of the alphabet is used as distractor material
// in varied multiple-choice questions when appropriate.
const PHONETIC_REPRESENTATIVE: Array<[string, string]> = [
  ["A", "Alfa"],
  ["F", "Foxtrot"],
  ["S", "Sierra"],
  ["Z", "Zulu"],
];

const phoneticWord = (letter: string) => PHONETIC.find((p) => p[0] === letter)?.[1];

function phoneticTf(): Draft[] {
  const out: Draft[] = [];
  for (const [letter, word] of PHONETIC_REPRESENTATIVE) {
    out.push(
      tf("comunicados", `No alfabeto fonético da UIT, a letra «${letter}» é anunciada como «${word}».`, true,
        `No alfabeto fonético internacional da UIT, «${letter}» corresponde a «${word}».`, REF.comunicados),
    );
  }
  const mismatches: Array<[string, string]> = [
    ["A", "Bravo"], ["F", "Victor"], ["S", "Tango"], ["Z", "Yankee"],
  ];
  for (const [letter, wrong] of mismatches) {
    out.push(
      tf("comunicados", `No alfabeto fonético da UIT, a letra «${letter}» é anunciada como «${wrong}».`, false,
        `No alfabeto fonético internacional da UIT, «${letter}» não é «${wrong}», e sim «${phoneticWord(letter)}».`, REF.comunicados),
    );
  }
  return out;
}

function phoneticMc(): Draft[] {
  return [
    mc("comunicados", "Qual é a palavra fonética da UIT para a letra «B»?",
      ["Bravo", "Beta", "Baker", "Brasil"],
      "No alfabeto fonético da UIT, «B» é anunciada como «Bravo».", REF.comunicados),
    mc("comunicados", "Qual letra é anunciada como «Foxtrot»?",
      ["F", "X", "V", "P"],
      "«Foxtrot» é a palavra fonética da letra «F».", REF.comunicados),
    mc("comunicados", "Qual é a palavra fonética da UIT para a letra «S»?",
      ["Sierra", "Sara", "Sinal", "Sable"],
      "No alfabeto fonético da UIT, «S» é anunciada como «Sierra».", REF.comunicados),
  ];
}

/* ── Parametric family 2: Código Q ─────────────────────────────────────── */

// Keep this list aligned with the current Cartilha's “principais códigos de
// utilização”. Older banks commonly mix in codes from other radio services.
const QCODES: Array<[string, string]> = [
  ["QRA", "nome da estação, do operador ou indicativo"],
  ["QRG", "frequência de operação"],
  ["QTH", "localização da estação"],
  ["QSL", "confirmado ou entendido; também cartão de QSO"],
  ["QRO", "aumentar a potência"],
  ["QAP", "estar na escuta ou à disposição"],
  ["QTC", "mensagem a transmitir"],
  ["QRM", "interferência de outras estações"],
  ["QRP", "operação com baixa potência"],
  ["QRV", "estar pronto ou preparado"],
  ["QSA", "intensidade do sinal recebido"],
];

const QCODES_REPRESENTATIVE: Array<[string, string]> = QCODES.filter(([code]) =>
  ["QRA", "QRG", "QTH", "QSL", "QRM", "QRP"].includes(code),
);

const qcodeMeaning = (code: string) => QCODES.find((q) => q[0] === code)?.[1];

function qcodesTf(): Draft[] {
  const out: Draft[] = [];
  for (const [code, meaning] of QCODES_REPRESENTATIVE) {
    out.push(
      tf("comunicados", `No Código Q, a abreviatura «${code}» significa: «${meaning}».`, true,
        `No Código Q, «${code}» corresponde a «${meaning}».`, REF.comunicados),
    );
  }
  const mismatches: Array<[string, string]> = [
    ["QRG", "a localização da estação"],
    ["QTH", "a frequência de operação"],
    ["QRM", "aumentar a potência"],
    ["QRP", "aumentar a potência"],
  ];
  for (const [code, wrong] of mismatches) {
    out.push(
      tf("comunicados", `No Código Q, a abreviatura «${code}» significa: «${wrong}».`, false,
        `No Código Q, «${code}» não significa «${wrong}». Significado correto: «${qcodeMeaning(code)}».`, REF.comunicados),
    );
  }
  return out;
}

function qcodesMc(): Draft[] {
  return [
    mc("comunicados", "No Código Q, qual abreviatura indica interferência de outras estações?",
      ["QRM", "QRG", "QTC", "QSA"],
      "«QRM» indica interferência de outras estações.", REF.comunicados),
    mc("comunicados", "No Código Q, qual abreviatura se relaciona à frequência de operação?",
      ["QRG", "QSL", "QTH", "QRV"],
      "«QRG» se refere à frequência de operação.", REF.comunicados),
    mc("comunicados", "«QTH» no Código Q refere-se:",
      ["à localização da estação", "à potência transmitida", "à mensagem a transmitir", "à intensidade do sinal"],
      "«QTH» indica a localização da estação.", REF.comunicados),
  ];
}

/* ── Parametric family 3: Faixas de frequência ─────────────────────────── */

const BAND_TABLE: Array<{ band: string; lo: number; hi: number; unit: string }> = [
  { band: "VLF", lo: 3, hi: 30, unit: "kHz" },
  { band: "LF", lo: 30, hi: 300, unit: "kHz" },
  { band: "MF", lo: 300, hi: 3000, unit: "kHz" },
  { band: "HF", lo: 3, hi: 30, unit: "MHz" },
  { band: "VHF", lo: 30, hi: 300, unit: "MHz" },
  { band: "UHF", lo: 300, hi: 3000, unit: "MHz" },
  { band: "SHF", lo: 3, hi: 30, unit: "GHz" },
];

const bandLabel = (band: string) => {
  const b = BAND_TABLE.find((x) => x.band === band);
  return b ? `${b.lo} a ${b.hi} ${b.unit}` : "";
};

function bandsTf(): Draft[] {
  const out: Draft[] = [];
  const correct: Array<[number, string, string]> = [
    [14, "MHz", "HF"], [145, "MHz", "VHF"], [433, "MHz", "UHF"], [7.1, "MHz", "HF"],
    [27, "MHz", "HF"], [100, "MHz", "VHF"], [900, "MHz", "UHF"], [5, "GHz", "SHF"],
    [520, "kHz", "MF"], [150, "kHz", "LF"],
  ];
  for (const [freq, unit, band] of correct) {
    out.push(
      tf("frequencia-comprimento-de-onda", `A frequência de ${freq} ${unit} pertence à faixa de ${band}.`, true,
        `Com ${freq} ${unit}, o sinal está na faixa de ${band} (${bandLabel(band)}).`, REF.freq),
    );
  }
  const wrong: Array<[number, string, string]> = [
    [433, "MHz", "VHF"], [27, "MHz", "VLF"], [100, "MHz", "UHF"], [7.1, "MHz", "VHF"],
    [520, "kHz", "HF"], [145, "MHz", "SHF"],
  ];
  for (const [freq, unit, band] of wrong) {
    out.push(
      tf("frequencia-comprimento-de-onda", `A frequência de ${freq} ${unit} pertence à faixa de ${band}.`, false,
        `Com ${freq} ${unit}, a faixa correta é ${bandOf(freq, unit)}, não ${band}.`, REF.freq),
    );
  }
  return out;
}

function bandOf(freq: number, unit: string): string {
  const mhz = unit === "kHz" ? freq / 1000 : unit === "GHz" ? freq * 1000 : freq;
  if (mhz >= 0.003 && mhz < 0.03) return "VLF";
  if (mhz >= 0.03 && mhz < 0.3) return "LF";
  if (mhz >= 0.3 && mhz < 3) return "MF";
  if (mhz >= 3 && mhz < 30) return "HF";
  if (mhz >= 30 && mhz < 300) return "VHF";
  if (mhz >= 300 && mhz < 3000) return "UHF";
  if (mhz >= 3000 && mhz < 30000) return "SHF";
  return "fora das designações";
}

function bandsMc(): Draft[] {
  return [
    mc("frequencia-comprimento-de-onda", "A faixa de 3 a 30 MHz recebe a designação:",
      ["HF", "VHF", "MF", "UHF"],
      "A faixa de 3 a 30 MHz é a HF (onda curta).", REF.freq),
    mc("frequencia-comprimento-de-onda", "A faixa de 30 a 300 MHz recebe a designação:",
      ["VHF", "HF", "UHF", "SHF"],
      "A faixa de 30 a 300 MHz é a VHF.", REF.freq),
    mc("frequencia-comprimento-de-onda", "A frequência de 433 MHz encontra-se na faixa de:",
      ["UHF", "VHF", "HF", "SHF"],
      "433 MHz está entre 300 e 3000 MHz, ou seja, na UHF.", REF.freq),
  ];
}

/* ── Parametric family 4: Comprimento de onda (λ = 300 / f[MHz]) ───────── */

function wavelengthTf(): Draft[] {
  const out: Draft[] = [];
  const correct: Array<[number, number]> = [
    [100, 3], [150, 2], [300, 1], [50, 6], [75, 4], [30, 10],
  ];
  for (const [freq, lambda] of correct) {
    out.push(
      tf("frequencia-comprimento-de-onda", `O comprimento de onda no espaço livre de um sinal de ${freq} MHz é, aproximadamente, ${lambda} metro(s).`, true,
        `λ = 300 / f(MHz): 300 / ${freq} = ${lambda} m.`, REF.freq),
    );
  }
  const wrong: Array<[number, number]> = [
    [100, 0.3], [50, 3], [300, 30], [150, 15],
  ];
  for (const [freq, lambda] of wrong) {
    out.push(
      tf("frequencia-comprimento-de-onda", `O comprimento de onda no espaço livre de um sinal de ${freq} MHz é, aproximadamente, ${lambda} metro(s).`, false,
        `λ = 300 / f(MHz): 300 / ${freq} = ${(300 / freq).toFixed(2)} m, e não ${lambda} m.`, REF.freq),
    );
  }
  return out;
}

function wavelengthMc(): Draft[] {
  return [
    mc("frequencia-comprimento-de-onda", "O comprimento de onda no espaço livre de um sinal de 300 MHz é, aproximadamente:",
      ["1 metro", "3 metros", "30 metros", "300 metros"],
      "λ = 300 / 300 = 1 m.", REF.freq),
  ];
}

/* ── Hand-written items ────────────────────────────────────────────────── */

function handwritten(): Draft[] {
  return [
    // Estação de Radioamador
    tf("estacao-de-radioamador", "O transceptor reúne, em uma mesma unidade, as funções de transmissor e de receptor.", true,
      "Transceptor (transceiver) combina transmissor e receptor num só equipamento.", REF.estacao),
    tf("estacao-de-radioamador", "Uma repetidora retransmite, na mesma frequência em que recebe, o sinal recebido.", false,
      "A repetidora recebe numa frequência e retransmite em outra (full-duplex), ampliando a cobertura.", REF.estacao),
    tf("estacao-de-radioamador", "No diagrama de blocos de um transmissor, o modulador varia a portadora de radiofrequência conforme o sinal de áudio.", true,
      "A modulação consiste em variar uma característica da portadora conforme o sinal modulante (áudio).", REF.estacao),
    mc("estacao-de-radioamador", "O equipamento que combina transmissor e receptor em uma única unidade é o:",
      ["transceptor", "repetidora", "modulador", "amplificador"],
      "Transceptor = transmissor + receptor.", REF.estacao),

    // Antenas
    tf("antenas", "Uma relação de onda estacionária (ROE) igual a 1:1 indica o casamento ideal de impedâncias entre a linha de transmissão e a antena.", true,
      "ROE 1:1 significa ausência de ondas refletidas, ou seja, máxima transferência de potência.", REF.antenas),
    tf("antenas", "Uma antena direcional irradia igualmente em todas as direções.", false,
      "Antena direcional concentra a irradiação em determinadas direções, gerando ganho.", REF.antenas),
    tf("antenas", "A antena artificial é utilizada nos ajustes do transmissor para não irradiar sinais.", true,
      "A antena artificial (carga fantasma) dissipa a energia como calor, evitando irradiação.", REF.antenas),
    mc("antenas", "Para ajustar o transmissor sem irradiar sinal pela antena, utiliza-se:",
      ["uma antena artificial", "uma antena direcional", "um amplificador", "um cabo mais longo"],
      "A antena artificial converte a energia de RF em calor durante os ajustes.", REF.antenas),

    // Propagação
    tf("propagacao", "Na faixa de HF, as ondas podem ser refletidas pela ionosfera, permitindo comunicações a longas distâncias.", true,
      "A reflexão ionosférica é característica da faixa de HF (DX).", REF.propagacao),
    tf("propagacao", "Na faixa de VHF, o modo predominante de comunicação é a reflexão ionosférica.", false,
      "Em VHF a reflexão ionosférica é excepcional; o modo predominante é a propagação em linha de visada.", REF.propagacao),
    tf("propagacao", "Em VHF e UHF, a propagação predominante é praticamente em linha de visada (troposférica).", true,
      "Em VHF/UHF a propagação direta é limitada pela curvatura da Terra.", REF.propagacao),
    mc("propagacao", "A reflexão de ondas de HF pela ionosfera permite:",
      ["comunicações a longas distâncias", "comunicações apenas em linha de visada", "eliminar qualquer interferência", "aumentar a potência transmitida"],
      "O salto ionosférico em HF possibilita contatos a milhares de quilômetros.", REF.propagacao),

    // Interferências
    tf("interferencias", "Para evitar interferências, o radioamador deve operar somente nas faixas e limites de potência destinados à sua classe.", true,
      "Operar dentro da faixa e potência da classe é medida básica de prevenção de interferência.", REF.interferencias),
    tf("interferencias", "Operar o transmissor com a antena desconectada e sem carga adequada é um procedimento seguro.", false,
      "Sem carga adequada, a energia refletida pode danificar o estágio final e gerar emissões espúrias.", REF.interferencias),
    mc("interferencias", "Ao perceber que sua estação causa interferência em outro serviço, o radioamador deve:",
      ["reduzir ou cessar as transmissões até corrigir a causa", "aumentar a potência", "mudar para o modo digital", "ignorar o problema"],
      "Corrigir a causa e evitar causar interferência é dever do operador.", REF.interferencias),

    // Ética
    tf("etica", "A propaganda política é compatível com a natureza do Serviço de Radioamador.", false,
      "A Cartilha inclui propaganda política entre os temas incompatíveis com a natureza do serviço.", REF.etica),
    tf("etica", "O indicativo de chamada deve ser usado no início, durante e no término das emissões ou comunicados.", true,
      "O Ato 3448/2026 §3.2 determina o uso do indicativo no início, durante e no término das emissões ou comunicados.", REF.etica),
    mc("etica", "Quanto à identificação da estação, é correto afirmar que o radioamador deve:",
      ["usar o indicativo no início, durante e no término das emissões", "nunca transmitir o indicativo", "usar um pseudônimo no lugar do indicativo", "identificar-se apenas se solicitado"],
      "O indicativo deve ser usado no início, durante e no término das emissões ou comunicados.", REF.etica),

    // Emergências
    tf("emergencias", "Em situação de emergência, as mensagens de socorro têm prioridade sobre qualquer outro tráfego.", true,
      "O tráfego de emergência tem prioridade absoluta no serviço de radioamador.", REF.emergencias),
    tf("emergencias", "A transmissão simultânea em mais de uma faixa de frequências é permitida para atendimento de situação de emergência ou calamidade pública.", true,
      "O Ato 3448/2026 §10.1 inclui o atendimento de situação de emergência ou calamidade pública entre as hipóteses autorizadas.", REF.emergencias),
    mc("emergencias", "Em situação de emergência, o radioamador deve:",
      ["dar prioridade às mensagens de socorro", "transmitir em qualquer frequência", "interromper todo tipo de comunicação", "usar potência máxima em qualquer faixa"],
      "O suporte às comunicações de emergência ocorre dentro da regulamentação, com prioridade ao socorro.", REF.emergencias),
  ];
}

export function buildTeoQuestions(): QuestionDraft[] {
  return [
    ...phoneticTf(),
    ...phoneticMc(),
    ...qcodesTf(),
    ...qcodesMc(),
    ...bandsTf(),
    ...bandsMc(),
    ...wavelengthTf(),
    ...wavelengthMc(),
    ...handwritten(),
  ];
}
