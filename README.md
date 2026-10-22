# Simulado - COER

Plataforma independente e gratuita de estudos para a prova do **COER - Classe C** de radioamador.

**No ar:** <https://coer-simulado.pages.dev/>

## O que tem

- **Simulado**: reproduz a prova oficial. São 15 questões certo/errado de uma matéria, 20 minutos e mínimo de 8 acertos.
- **Treino**: por assunto da ementa, em certo/errado, múltipla escolha ou misto. Cada resposta mostra a explicação e a fonte na hora.
- As três matérias da Classe C:

| Matéria | Questões | Certo/errado |
| --- | ---: | ---: |
| Técnica e Ética Operacional | 186 | 147 |
| Legislação de Telecomunicações | 182 | 154 |
| Conhecimentos Básicos de Eletrônica e Eletricidade | 144 | 119 |

## Sobre as questões

As questões são **geradas por IA** com base na ementa do Ato nº 3448/2026 e na Cartilha do Serviço Radioamador (versão 2026-06), e foram revisadas por IA contra esses textos (`checkedByAi`). **Não são questões da prova real**: o banco oficial da Anatel não é público. Podem conter erros; na dúvida, confira na Cartilha.

## Executar localmente

```bash
cd app
npm install
npm run dev      # servidor local
npm run build    # gera o banco, valida e monta o site em dist/
```

O banco de questões é escrito em `app/scripts/templates/` (um arquivo por matéria). O comando `npm run generate` gera os JSON em `app/public/data/`, e `npm run validate` confere as regras de qualidade.

## Deploy

O site é hospedado no **Cloudflare Pages**, que faz o deploy automático a cada push na `main`. A configuração é:

- diretório raiz: `app`;
- comando de build: `npm run build`;
- diretório de saída: `dist`.

Se o validador falhar, o deploy não acontece.

## Documentação

- `AGENTS.md`: regras e mapa da documentação.
- `considerations/`: pesquisa sobre a prova, decisões de produto (`BRAINSTORM.md`), padrão de qualidade das questões e stack.
- `DESIGN.md`: contrato visual da interface.

## Fontes

- [Ato nº 3448/2026 — Anatel](https://informacoes.anatel.gov.br/legislacao/atos-de-requisitos-operacionais-de-outorga-e-licenciamento/2148-ato-3448-26)
- [Cartilha do Serviço Radioamador, versão 2026-06 — Anatel](https://sistemas.anatel.gov.br/anexar-api/publico/anexos/download/e2bee3ec4783c5c41a8ce4affe7baef8)

Este é um projeto independente e não possui vínculo oficial com a Anatel.
