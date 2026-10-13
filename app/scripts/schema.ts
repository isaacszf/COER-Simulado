/**
 * schema.ts — single source of truth for the question bank's types and invariants.
 * Shared by the generator, the validator, and (type-wise) the site.
 * See STACK.md and considerations/BRAINSTORM.md §5.
 */

export type SubjectId = "TEO" | "LEG" | "ELE";
export type QuestionType = "true-false" | "multiple-choice";
export type QuestionSource = "generated" | "extracted";

export interface Topic {
  slug: string;
  name: string;
}

export interface SubjectMeta {
  code: SubjectId;
  name: string;
  topics: Topic[];
}

export const SUBJECTS: Record<SubjectId, SubjectMeta> = {
  TEO: {
    code: "TEO",
    name: "Técnica e Ética Operacional",
    topics: [
      { slug: "estacao-de-radioamador", name: "Estação de Radioamador" },
      { slug: "antenas", name: "Antenas" },
      { slug: "frequencia-comprimento-de-onda", name: "Frequência e Comprimento de Onda" },
      { slug: "propagacao", name: "Propagação" },
      { slug: "interferencias", name: "Interferências" },
      { slug: "comunicados", name: "Comunicados" },
      { slug: "etica", name: "Ética" },
      { slug: "emergencias", name: "Emergências" },
    ],
  },
  LEG: {
    code: "LEG",
    name: "Legislação de Telecomunicações",
    topics: [
      { slug: "rr-uit", name: "Regulamento de Rádio (UIT)" },
      { slug: "recomendacao-itu-r-m1544", name: "Recomendação ITU-R M.1544-1" },
      { slug: "plano-iaru-regiao-2", name: "Plano de Faixas IARU Região 2" },
      { slug: "lgt", name: "Lei Geral das Telecomunicações" },
      { slug: "rgst", name: "Regulamento Geral dos Serviços de Telecomunicações" },
      { slug: "requisitos-tecnicos-operacionais", name: "Requisitos Técnicos e Operacionais de RF" },
      { slug: "plano-de-atribuicao", name: "Plano de Atribuição de Faixas" },
      { slug: "homologacao", name: "Avaliação da Conformidade e Homologação" },
    ],
  },
  ELE: {
    code: "ELE",
    name: "Conhecimentos Básicos de Eletrônica e Eletricidade",
    topics: [
      { slug: "eletronica-basica", name: "Eletrônica Básica" },
      { slug: "eletromagnetismo-basico", name: "Eletromagnetismo Básico" },
      { slug: "protecao-eletrica", name: "Proteção Elétrica" },
      { slug: "medicao-eletrica", name: "Medição Elétrica" },
      { slug: "estacao-de-radioamador", name: "Estação de Radioamador" },
      { slug: "telecomunicacoes", name: "Telecomunicações" },
    ],
  },
};

export const SUBJECT_ORDER: SubjectId[] = ["TEO", "LEG", "ELE"];

export interface BaseQuestion {
  id: string;
  subject: SubjectId;
  topic: string; // topic slug (must exist in SUBJECTS[subject].topics)
  topicName: string;
  statement: string; // pt-BR
  explanation: string;
  source: QuestionSource;
  sourceRef: string;
  reviewed: boolean;
}

export interface TrueFalseQuestion extends BaseQuestion {
  questionType: "true-false";
  answer: boolean; // true = certa, false = errada
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  questionType: "multiple-choice";
  options: string[]; // 3–5 options
  answer: number; // index of the single correct option
}

export type Question = TrueFalseQuestion | MultipleChoiceQuestion;
export type QuestionDraft = Omit<TrueFalseQuestion, "id"> | Omit<MultipleChoiceQuestion, "id">;

export interface Bank {
  subject: SubjectId;
  subjectName: string;
  sourceBasis: string;
  generatedAt: string;
  questions: Question[];
}

export const SIMULADO_SIZE = 15;
export const SIMULADO_MINUTES = 20;
export const SIMULADO_PASSING = 8;

export function topicMeta(subject: SubjectId, slug: string): Topic | undefined {
  return SUBJECTS[subject].topics.find((t) => t.slug === slug);
}
