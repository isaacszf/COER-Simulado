/**
 * llms.txt — plain-text summary for AI answer engines (llmstxt.org format).
 * Built from the same FAQ and subject data as the pages, so it stays in sync.
 */
import type { APIRoute } from "astro";
import { FAQ, SITE_NAME, SOURCES } from "../lib/site";
import { subjectCards } from "../lib/subject-cards";

export const GET: APIRoute = ({ site }) => {
  const url = (path: string) => new URL(path, site).href;
  const subjects = subjectCards()
    .filter((c) => c.total)
    .map(
      (c) =>
        `- [Simulado de ${c.title}](${url(`/simulado/${c.slug}/`)}): ${c.trueFalse} questões certo/errado\n` +
        `- [Treino de ${c.title}](${url(`/treino/${c.slug}/`)}): ${c.total} questões, por assunto`,
    )
    .join("\n");
  const faq = FAQ.map((f) => `### ${f.q}\n\n${f.a}`).join("\n\n");

  const body = `# ${SITE_NAME}

> Simulado e treino gratuitos para a prova do COER (Certificado de Operador de Estação de Radioamador), Classe C, da Anatel. Questões no formato oficial certo/errado, geradas por IA a partir da ementa do Ato nº 3448/2026 e da Cartilha do Serviço Radioamador (versão 2026-06). Não são questões da prova real; o site não tem vínculo com a Anatel.

## Matérias

${subjects}

## Perguntas frequentes

${faq}

## Fontes oficiais

- [${SOURCES.ato.name}](${SOURCES.ato.url})
- [${SOURCES.cartilha.name}](${SOURCES.cartilha.url})
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
