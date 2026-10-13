/**
 * site.ts — shared site metadata for SEO/GEO: the site name, the official
 * sources and the exam FAQ. The home page renders the FAQ (visible text and
 * FAQPage JSON-LD) and /llms.txt reuses it, so the facts live in one place.
 * Facts come from the Ato nº 3448/2026 and the Cartilha 2026-06.
 */
import { SUBJECTS, type Bank, type SubjectId } from "../../scripts/schema";

export const SITE_NAME = "Simulado COER";

export const SOURCES = {
  ato: {
    name: "Ato nº 3448/2026 (Anatel) — Requisitos Operacionais do Serviço de Radioamador",
    url: "https://informacoes.anatel.gov.br/legislacao/atos-de-requisitos-operacionais-de-outorga-e-licenciamento/2148-ato-3448-26",
  },
  cartilha: {
    name: "Cartilha do Serviço Radioamador (Anatel), versão 2026-06",
    url: "https://sistemas.anatel.gov.br/anexar-api/publico/anexos/download/e2bee3ec4783c5c41a8ce4affe7baef8",
  },
};

export interface Faq {
  q: string;
  a: string;
}

export const FAQ: Faq[] = [
  {
    q: "Como é a prova do COER Classe C?",
    a: "São três matérias: Legislação de Telecomunicações, Técnica e Ética Operacional e Conhecimentos Básicos de Eletrônica e Eletricidade. Cada matéria tem 15 questões objetivas no formato certo ou errado, 20 minutos de prova e exige no mínimo 8 acertos (Ato nº 3448/2026, itens 11.2 e 11.3).",
  },
  {
    q: "Se eu passar em uma matéria e reprovar em outra, preciso refazer tudo?",
    a: "Não. As aprovações valem por 12 meses, e nesse prazo basta refazer as matérias em que houve reprovação. Uma nova tentativa só pode ser feita 8 dias após a última reprovação (Ato nº 3448/2026, itens 11.8, 11.8.1 e 11.8.2).",
  },
  {
    q: "Qual é a idade mínima para a Classe C?",
    a: "A idade mínima para a Classe C é de 10 anos. Menores de idade são inscritos pelos responsáveis legais, por meio do SEI da Anatel (Cartilha do Serviço Radioamador, Anexo 2 §4.1; Ato nº 3448/2026, item 11.10).",
  },
  {
    q: "Qual é a diferença entre o Simulado e o Treino deste site?",
    a: "O Simulado reproduz a prova: uma matéria, 15 questões certo/errado, 20 minutos e nota mínima de 8 acertos. O Treino deixa escolher o assunto e o tipo de questão (certo/errado ou múltipla escolha) e mostra a explicação e a fonte de cada questão na hora.",
  },
  {
    q: "As questões são as da prova oficial?",
    a: "Não. O banco oficial da Anatel não é público. As questões deste site são geradas por inteligência artificial com base na ementa do Ato nº 3448/2026 e na Cartilha do Serviço Radioamador (versão 2026-06), e revisadas por IA contra esses textos. Podem conter erros: na dúvida, confira na Cartilha.",
  },
];

/* ── Subject pages ─────────────────────────────────────────────────────── */

export type PageMode = "simulado" | "treino";

/** Title, description and Quiz JSON-LD for a /simulado/<s> or /treino/<s> page. */
export function subjectSeo(mode: PageMode, code: SubjectId, bank: Bank | null, site: URL | undefined) {
  const name = SUBJECTS[code].name;
  const qs = bank?.questions ?? [];
  const count = mode === "simulado" ? qs.filter((q) => q.questionType === "true-false").length : qs.length;
  const title =
    mode === "simulado"
      ? `Simulado de ${name} — COER Classe C`
      : `Treino de ${name} — COER Classe C`;
  const description =
    mode === "simulado"
      ? `Simulado de ${name} para a prova de radioamador Classe C da Anatel: 15 questões certo/errado, 20 minutos e mínimo de 8 acertos, sorteadas de ${count} questões.`
      : `Treino de ${name} para a prova do COER Classe C: escolha o assunto e o tipo de questão, com explicação e fonte na Cartilha. ${count} questões.`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: title,
    about: name,
    educationalLevel: "Radioamador Classe C",
    inLanguage: "pt-BR",
    isAccessibleForFree: true,
    numberOfQuestions: count,
    url: site ? new URL(`/${mode}/${code.toLowerCase()}/`, site).href : undefined,
    isBasedOn: [SOURCES.ato.url, SOURCES.cartilha.url],
  };
  return { title, description, count, jsonLd };
}
