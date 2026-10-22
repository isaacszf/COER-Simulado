/**
 * templates/teo.ts — Técnica e Ética Operacional question bank.
 *
 * Written to the quality standard in considerations/BRAINSTORM.md §5:
 * every item carries a kind (conceitual | cenario | calculo), a level (1–5)
 * and the pitfall it tests; errado items change exactly one plausible point;
 * pure lookups (phonetic alphabet, Código Q, band names) are flagged `recall`
 * and capped. Content follows the Cartilha do Serviço Radioamador, versão
 * 2026-06 (Anexo 1 for TEO, plus the operational sections it points to).
 *
 * Builders and citation helpers live in ./helpers.ts. Every item must be
 * checked against the Cartilha before shipping: by AI (`checkedByAi: true`)
 * or by a human (`reviewed: true`). See AGENTS.md.
 */
import type { QuestionDraft } from "../schema";
import { createBuilder, cite } from "./helpers";

// Full AI review of every item in this file against the Cartilha 2026-06
// text, done 2026-10-13. Items added later must pass `checkedByAi: false`
// in their Meta until they are checked.
const { tf, mc } = createBuilder("TEO", { checkedByAi: true });

/** Anexo 1 (Técnica e Ética Operacional) reference. */
const a1 = (sec: string, page: number | string) => cite.annex(1, sec, page);
/** Main-body section reference. */
const body = cite.body;
/** Anexo 2 (Legislação) reference plus the Ato 3448/2026 item it transcribes. */
const a2 = (sec: string, page: number, atoItem: string) =>
  cite.annex(2, sec, page, `; Ato 3448/2026, item ${atoItem}`);

/* ── 1. Estação de radioamador (Anexo 1 §1, pp. 26–28) ─────────────────── */

function estacao(): QuestionDraft[] {
  const t = "estacao-de-radioamador";
  return [
    tf(t, { kind: "conceitual", level: 1, pitfall: "Confundir transceptor com repetidora.", ref: a1("1.1", 26) },
      "Um equipamento que reúne transmissor e receptor em um único conjunto é chamado de transceptor.", true,
      "A Cartilha define o transceptor como o equipamento que reúne TX e RX em um só conjunto. A repetidora é outra coisa: recebe em uma frequência e retransmite em outra."),
    tf(t, { kind: "conceitual", level: 2, pitfall: "Inverter as funções de TX e RX.", ref: a1("1.1", 26) },
      "Na estação, é o receptor que gera o sinal de RF a partir da voz do operador e entrega potência à linha de transmissão.", false,
      "Quem gera a RF a partir da informação e entrega potência à linha/antena é o transmissor. O receptor faz o caminho inverso: recebe a RF e reconstrói a informação."),
    tf(t, { kind: "conceitual", level: 1, pitfall: "Achar que o sistema irradiante é só a antena.", ref: a1("1.1", 26) },
      "O sistema irradiante de uma estação compreende somente a antena; cabos, conectores, filtros e casadores fazem parte do transmissor.", false,
      "A Cartilha define o sistema irradiante como antena + linha de transmissão, incluindo cabos, conectores e eventuais filtros/casadores."),
    tf(t, { kind: "conceitual", level: 2, pitfall: "Achar que sintonizar ajusta a potência ou o volume.", ref: a1("1.1", 26) },
      "Ao sintonizar uma estação no receptor, em geral o operador está ajustando a frequência da portadora do sinal desejado.", true,
      "Sintonizar é selecionar a frequência da portadora do sinal que se quer receber; volume e potência são outros controles."),
    tf(t, { kind: "conceitual", level: 2, pitfall: "Achar que a repetidora retransmite na mesma frequência em que recebe.", ref: a1("1.2", 26) },
      "Uma repetidora de VHF/UHF recebe o sinal em uma frequência e o retransmite em outra, permitindo o contato entre estações que não se escutariam diretamente.", true,
      "É exatamente a definição da Cartilha: recebe em uma frequência (entrada) e retransmite em outra (saída)."),
    tf(t, { kind: "cenario", level: 3, pitfall: "Trocar entrada e saída da repetidora.", ref: a1("1.2", 26) },
      "Para usar uma repetidora, o usuário transmite na frequência de saída da repetidora e escuta na frequência de entrada dela.", false,
      "É o contrário: o usuário transmite na entrada da repetidora e recebe na saída dela."),
    tf(t, { kind: "calculo", level: 3, pitfall: "Aplicar o shift na direção errada.", ref: a1("1.3", 27) },
      "Com recepção programada em 146,940 MHz e shift de −600 kHz, o rádio transmitirá em 147,540 MHz.", false,
      "Shift negativo subtrai: 146,940 − 0,600 = 146,340 MHz. 147,540 MHz resultaria de um shift de +600 kHz."),
    tf(t, { kind: "calculo", level: 5, pitfall: "Programar a entrada da repetidora como se fosse simplex.", ref: body("6.5", 16) },
      "Repetidora com saída em 145,370 MHz e shift −600 kHz: quem programa o rádio em simplex em 144,770 MHz transmite na entrada dela, mas não ouve a saída.", true,
      "144,770 MHz é a entrada (145,370 − 0,600). Em simplex o rádio transmite e recebe nessa mesma frequência, então nunca escuta a saída em 145,370 MHz. A Cartilha cita esse erro clássico: falar em uma entrada como se fosse simplex (§6.5)."),
    tf(t, { kind: "conceitual", level: 3, pitfall: "Ignorar o papel da blindagem do coaxial.", ref: a1("1.4", 27) },
      "No cabo coaxial, por causa da blindagem, os campos de RF ficam mais confinados e a linha irradia menos que uma linha paralela.", true,
      "Entre as vantagens do coaxial, a Cartilha lista campos de RF mais confinados e menor irradiação indesejada pela linha (blindado)."),
    tf(t, { kind: "conceitual", level: 3, pitfall: "Inverter a característica de perda do dielétrico de ar.", ref: a1("1.4", 27) },
      "O cabo coaxial com dielétrico de ar tem perda maior que o de dielétrico sólido e, por isso, é evitado em UHF.", false,
      "É o contrário: o coaxial com dielétrico de ar tem menor perda e geralmente é usado em UHF ou acima."),
    tf(t, { kind: "cenario", level: 3, pitfall: "Começar o diagnóstico pela antena e ignorar a alimentação.", ref: a1("1.5", 27) },
      "Um rádio que desliga sozinho ao transmitir deve ter, como primeira verificação, a tensão e a corrente de alimentação, citadas como primeira causa de falhas.", true,
      "A Cartilha aponta as tensões e correntes de alimentação dos equipamentos como a primeira causa de falhas, então são a primeira medição a fazer."),
    tf(t, { kind: "conceitual", level: 2, pitfall: "Achar que a ROE se mede só pela potência do transmissor.", ref: a1("1.5", 28) },
      "A ROE de uma instalação pode ser avaliada medindo apenas a potência direta que o transmissor entrega à linha.", false,
      "A ROE/SWR é avaliada pela potência direta e pela refletida na linha. Só a potência direta não revela o descasamento."),
    mc(t, { kind: "calculo", level: 3, pitfall: "Usar a saída da repetidora como frequência de transmissão.", ref: a1("1.3", 27) },
      "Uma repetidora de 2 m tem saída em 147,300 MHz e shift de +600 kHz. Em que frequência o radioamador deve transmitir para acessá-la?",
      ["147,900 MHz", "146,700 MHz", "147,300 MHz", "147,360 MHz"],
      "O rádio recebe na saída (147,300 MHz) e transmite com o shift aplicado: 147,300 + 0,600 = 147,900 MHz."),
  ];
}

/* ── 2. Antenas (Anexo 1 §2, pp. 28–29; §5.6, p. 13) ──────────────────── */

function antenas(): QuestionDraft[] {
  const t = "antenas";
  return [
    tf(t, { kind: "conceitual", level: 2, pitfall: "Achar que a linha também deve irradiar.", ref: a1("2.1", 28) },
      "A linha de transmissão leva energia do transmissor à antena e, idealmente, não deve irradiar de forma significativa.", true,
      "Quem irradia é a antena; a linha deve conduzir a energia sem irradiar de forma significativa."),
    tf(t, { kind: "conceitual", level: 3, pitfall: "Não relacionar impedâncias iguais com ausência de reflexão.", ref: a1("2.1", 28) },
      "Quando o transmissor está adaptado à impedância característica da linha e a antena apresenta essa mesma impedância, não há reflexão e a transferência de potência é máxima.", true,
      "No sistema ideal, com as impedâncias casadas, não há reflexão de energia e ocorre a transferência máxima de potência."),
    tf(t, { kind: "calculo", level: 3, pitfall: "Esquecer de dividir λ por 4.", ref: a1("2.2", 28) },
      "Uma antena vertical de ¼ de onda para 145 MHz tem cerca de 2 m, já que λ ≈ 300 / 145 ≈ 2,07 m.", false,
      "Cerca de 2 m é o comprimento de onda inteiro. A antena de ¼ de onda tem λ/4 ≈ 2,07 / 4 ≈ 0,52 m."),
    tf(t, { kind: "calculo", level: 3, pitfall: "Confundir o comprimento de onda inteiro com meia onda.", ref: a1("2.2", 28) },
      "Um dipolo de meia onda para 7 MHz tem aproximadamente 42 m de comprimento total.", false,
      "λ ≈ 300 / 7 ≈ 42,8 m é o comprimento de onda inteiro. O dipolo de meia onda tem λ/2 ≈ 21 m."),
    tf(t, { kind: "calculo", level: 5, pitfall: "Achar que o comprimento cresce com a frequência.", ref: a1("2.2", 28) },
      "Uma vertical de ¼ de onda para 7,1 MHz tem cerca de 10,6 m; para 14,2 MHz, ela precisaria ter cerca do dobro desse comprimento.", false,
      "O primeiro dado está certo (300 / 7,1 / 4 ≈ 10,6 m), mas o comprimento é inversamente proporcional à frequência: dobrando a frequência, a antena cai para cerca da metade (≈ 5,3 m)."),
    tf(t, { kind: "conceitual", level: 2, pitfall: "Confundir antena omnidirecional com direcional.", ref: a1("2.3", 28) },
      "Antenas omnidirecionais irradiam de forma quase uniforme no plano horizontal, enquanto antenas direcionais concentram a energia em um feixe.", true,
      "É a distinção da Cartilha: as omnidirecionais são quase uniformes no plano horizontal; Yagi, log-periódica e algumas loops concentram energia em um feixe."),
    tf(t, { kind: "conceitual", level: 3, pitfall: "Achar que o ganho direcional surge sem perda em outras direções.", ref: a1("2.3", 28) },
      "Uma antena Yagi, por ser direcional, oferece mais ganho em uma direção à custa de menos ganho em outras.", true,
      "As antenas direcionais concentram energia em um feixe, ganhando em uma direção e perdendo nas demais."),
    tf(t, { kind: "conceitual", level: 3, pitfall: "Tratar o ganho como medida absoluta.", ref: a1("2.3", 28) },
      "O ganho de uma antena é uma medida absoluta, que dispensa comparação com qualquer antena de referência.", false,
      "A Cartilha define o ganho em comparação com uma antena de referência (isotrópica ou dipolo)."),
    tf(t, { kind: "conceitual", level: 3, pitfall: "Entender a onda estacionária como sinal de bom casamento.", ref: a1("2.4", 29) },
      "A presença de onda estacionária na linha indica bom casamento de impedância entre transmissor, linha e antena.", false,
      "A Cartilha é explícita: onda estacionária é sinal de descasamento, não de bom casamento."),
    tf(t, { kind: "cenario", level: 2, pitfall: "Interpretar ROE alta como bom casamento.", ref: a1("2.4", 29) },
      "Uma ROE de 3:1 medida na linha indica bom casamento, com pouca energia refletida para o transmissor.", false,
      "Bom casamento é ROE próxima de 1:1. Uma ROE de 3:1 é alta e indica que boa parte da energia está sendo refletida."),
    tf(t, { kind: "cenario", level: 3, pitfall: "Subestimar o efeito da ROE alta no transmissor.", ref: a1("2.4", 29) },
      "Com ROE elevada, uma grande fração da energia volta ao transmissor, o que pode causar aquecimento e perda de eficiência.", true,
      "Com ROE alta, grande parte da energia é refletida de volta ao transmissor, causando aquecimento e perda de eficiência."),
    tf(t, { kind: "conceitual", level: 4, pitfall: "Achar que a onda refletida tem outra frequência.", ref: a1("2.4", 29) },
      "Havendo descasamento, a onda refletida tem frequência diferente da onda direta e, por isso, pode ser separada por um filtro.", false,
      "A onda refletida tem a mesma frequência da direta, só que em sentido oposto; a superposição das duas forma a onda estacionária."),
    tf(t, { kind: "cenario", level: 1, pitfall: "Testar o transmissor na antena real e irradiar sem necessidade.", ref: a1("2.5", 29) },
      "Para ajustar o transmissor na bancada sem irradiar sinal, o operador deve usar uma antena artificial (carga fictícia), geralmente resistiva.", true,
      "A antena artificial, geralmente resistiva, serve para testar e ajustar o transmissor sem irradiar."),
    tf(t, { kind: "cenario", level: 3, pitfall: "Restringir a função da antena artificial.", ref: a1("2.5", 29) },
      "A antena artificial serve apenas para medir a ROE; ela não é adequada para medir a potência de saída do transmissor.", false,
      "Entre os usos listados estão justamente medir a potência de saída, ajustar moduladores e etapas de RF e evitar interferências nos testes."),
    tf(t, { kind: "conceitual", level: 3, pitfall: "Achar que antenas pequenas são sempre piores em ruído.", ref: a1("2.2", 28) },
      "A loop magnética, projetada com algo entre λ/3 e λ/10, é indicada para espaços reduzidos, mas costuma captar mais ruído que antenas maiores.", false,
      "A tabela da Cartilha associa a loop magnética a espaços reduzidos e a menor ruído, não maior."),
    tf(t, { kind: "cenario", level: 4, pitfall: "Achar que dobrar a potência rende mais que ajustar a antena.", ref: body("5.6", 13) },
      "Uma antena corretamente ajustada costuma render mais do que um grande aumento de potência, pois o sinal é medido em dB e esse aumento traz pouco ganho.", true,
      "A Cartilha observa que a antena bem ajustada representa muito mais ganho que a amplificação: em dB, grandes aumentos de potência rendem pequenos ganhos."),
    mc(t, { kind: "calculo", level: 3, pitfall: "Esquecer de dividir o comprimento de onda por 4.", ref: a1("2.2", 28) },
      "Qual é o comprimento aproximado de uma antena vertical de ¼ de onda para 28 MHz?",
      ["≈ 2,7 m", "≈ 10,7 m", "≈ 5,4 m", "≈ 1,3 m"],
      "λ ≈ 300 / 28 ≈ 10,7 m; λ/4 ≈ 2,7 m. 10,7 m é o λ inteiro e 5,4 m é meia onda."),
    mc(t, { kind: "conceitual", level: 3, pitfall: "Atribuir a onda estacionária a outra causa que não a reflexão.", ref: a1("2.4", 29) },
      "Em uma linha de transmissão, a onda estacionária resulta de:",
      ["Superposição da onda direta com uma onda refletida de mesma frequência e sentido oposto", "Aumento da frequência da portadora ao longo da linha", "Excesso de ganho da antena direcional", "Uso de cabo coaxial em vez de linha paralela"],
      "Com descasamento, parte da energia é refletida; a onda refletida (mesma frequência, sentido oposto) se superpõe à direta e forma a onda estacionária."),
    mc(t, { kind: "cenario", level: 2, pitfall: "Testar o transmissor irradiando.", ref: a1("2.5", 29) },
      "Para testar e ajustar um transmissor sem irradiar e sem causar interferência, ele deve ser conectado a:",
      ["Uma antena artificial (carga fictícia)", "Uma antena Yagi apontada para o alto", "Uma antena vertical de ¼ de onda", "Um frequencímetro no lugar da antena"],
      "Só a antena artificial absorve a potência sem irradiar. Qualquer antena irradia, mesmo apontada para cima."),
    mc(t, { kind: "cenario", level: 3, pitfall: "Escolher uma antena omnidirecional para concentrar sinal.", ref: a1("2.3", 28) },
      "Qual antena é mais indicada para concentrar energia em uma direção, como em contatos DX em VHF/UHF?",
      ["Yagi", "Vertical omnidirecional de ¼ de onda", "Antena artificial", "Linha paralela sem antena"],
      "A Yagi é direcional, com alta diretividade, típica de DX em VHF/UHF. A vertical é omnidirecional e a antena artificial não irradia."),
    tf(t, { kind: "conceitual", level: 3, pitfall: "Achar que só o sinal mais forte melhora a SNR.", ref: a1("4.7", 33) },
      "Se a potência do ruído diminuir e o sinal permanecer igual, a relação sinal-ruído (SNR) diminui.", false,
      "A SNR é sinal/ruído: com o denominador menor, a razão aumenta. A Cartilha lista 'ruído menor' entre as condições que aumentam a SNR."),
    tf(t, { kind: "cenario", level: 3, pitfall: "Ignorar as fontes de ruído locais.", ref: a1("4.7", 33) },
      "Para melhorar a SNR na recepção, reduzir fontes de ruído locais, como fontes com defeito e iluminação ruidosa, é uma medida eficaz.", true,
      "Reduzir fontes de ruído locais (eletrônicos, iluminação, fontes com defeito) está entre as formas de melhorar a SNR citadas pela Cartilha."),
    mc(t, { kind: "cenario", level: 4, pitfall: "Achar que amplificar o áudio melhora a SNR.", ref: a1("4.7", 33) },
      "Qual das medidas abaixo NÃO melhora a relação sinal-ruído na recepção?",
      ["Aumentar o volume do alto-falante", "Reduzir fontes de ruído locais", "Usar filtros e recursos de DSP do receptor", "Escolher uma frequência menos congestionada"],
      "O volume amplifica sinal e ruído por igual. As outras três estão na lista da Cartilha de formas de melhorar a SNR."),
  ];
}

/* ── 3. Frequência, comprimento de onda e modulação (Anexo 1 §3, pp. 29–31) */

function frequencia(): QuestionDraft[] {
  const t = "frequencia-comprimento-de-onda";
  return [
    tf(t, { kind: "calculo", level: 2, pitfall: "Errar a ordem de grandeza ao aplicar 300/f.", ref: a1("3.1", 29) },
      "Usando λ (m) ≈ 300 / f (MHz), um sinal de 50 MHz tem comprimento de onda de aproximadamente 6 m.", true,
      "300 / 50 = 6 m; por isso 50 MHz é a faixa de 6 metros."),
    tf(t, { kind: "calculo", level: 3, pitfall: "Não saber converter nome de faixa em frequência.", ref: a1("3.1", 29) },
      "A faixa de 40 metros corresponde a frequências em torno de 14 MHz.", false,
      "f (MHz) ≈ 300 / λ (m) = 300 / 40 = 7,5 MHz, ou seja, a faixa de 7 MHz. 14 MHz corresponde a cerca de 21 m (faixa de 20 metros)."),
    tf(t, { kind: "calculo", level: 3, pitfall: "Errar a unidade ao calcular T = 1/f.", ref: a1("3.1", 29) },
      "O período de um sinal de 1 MHz é de 1 milissegundo, pois T = 1 / f.", false,
      "T = 1 / 1.000.000 Hz = 1 µs (microssegundo). 1 ms seria o período de um sinal de 1 kHz."),
    tf(t, { kind: "calculo", level: 4, pitfall: "Achar que λ é diretamente proporcional a f.", ref: a1("3.1", 29) },
      "Dobrar a frequência de um sinal, no mesmo meio, também dobra o seu comprimento de onda.", false,
      "λ = c / f: com a velocidade constante, dobrar a frequência reduz o comprimento de onda à metade."),
    tf(t, { kind: "conceitual", level: 1, pitfall: "Confundir as designações das faixas.", ref: a1("3.2", 29), recall: true },
      "A faixa de 3 a 30 MHz é designada HF e suas ondas são chamadas decamétricas.", true,
      "Pela tabela da Cartilha, HF vai de 3 a 30 MHz (ondas decamétricas)."),
    tf(t, { kind: "conceitual", level: 3, pitfall: "Classificar a faixa pelo número sem considerar a unidade.", ref: a1("3.2", 29) },
      "Um sinal de 1.500 kHz pertence à faixa de HF, já que esse valor é superior a 1.000 kHz.", false,
      "1.500 kHz = 1,5 MHz, dentro de MF (300 a 3.000 kHz). HF só começa em 3 MHz (3.000 kHz)."),
    tf(t, { kind: "conceitual", level: 3, pitfall: "Trocar decimétricas por centimétricas.", ref: a1("3.2", 30) },
      "As ondas da faixa de UHF (300 a 3.000 MHz) são chamadas centimétricas.", false,
      "As ondas de UHF são decimétricas. Centimétricas são as de SHF (3 a 30 GHz)."),
    tf(t, { kind: "conceitual", level: 2, pitfall: "Situar a faixa de 2 m fora de VHF.", ref: a1("3.2", 30) },
      "A faixa de 2 metros (em torno de 144 MHz) pertence a VHF, que vai de 30 a 300 MHz e cujas ondas são chamadas métricas.", true,
      "144 MHz está entre 30 e 300 MHz (VHF, ondas métricas), e 300 / 144 ≈ 2,1 m confirma o nome da faixa."),
    tf(t, { kind: "conceitual", level: 2, pitfall: "Confundir a faixa da voz telefônica com a da audição.", ref: a1("3.2", 30) },
      "A voz telefônica ocupa aproximadamente de 16 Hz a 16.000 Hz, a mesma faixa da audição humana típica.", false,
      "A Cartilha dá ~300–3.400 Hz para a voz telefônica; ~16–16.000 Hz é a audição humana típica."),
    tf(t, { kind: "conceitual", level: 2, pitfall: "Achar que a modulação gera a portadora.", ref: a1("3.3", 30) },
      "Na modulação, a mensagem é 'impressa' na portadora pela alteração da amplitude, da frequência ou da fase.", true,
      "É a definição da Cartilha: modular é imprimir a mensagem na portadora alterando amplitude, frequência ou fase."),
    tf(t, { kind: "conceitual", level: 3, pitfall: "Trocar o parâmetro que varia em FM e AM.", ref: a1("3.4", 31) },
      "Em FM, a amplitude da portadora varia conforme a mensagem, enquanto a frequência é mantida fixa.", false,
      "É o inverso: em FM varia a frequência instantânea e a amplitude fica fixa. Variar a amplitude é AM."),
    tf(t, { kind: "conceitual", level: 3, pitfall: "Achar que SSB não é uma forma de AM.", ref: a1("3.4", 30) },
      "O SSB (faixa lateral única) é um tipo de modulação em frequência, muito usado em HF.", false,
      "O SSB é AM: a Cartilha o classifica como AM-SSB (faixa lateral única), muito usado em HF."),
    tf(t, { kind: "conceitual", level: 2, pitfall: "Confundir CW com modulação de frequência.", ref: a1("3.4", 31) },
      "Em CW, a portadora é ligada e desligada, formando os pontos e traços do código Morse.", true,
      "CW (telegrafia) é a portadora ligada e desligada no padrão Morse."),
    tf(t, { kind: "conceitual", level: 3, pitfall: "Achar que a portadora é entregue ao alto-falante.", ref: a1("3.5", 31) },
      "Na demodulação, o receptor extrai a mensagem do sinal modulado, e a portadora é removida ou ignorada nas etapas de detecção.", true,
      "A demodulação é o processo inverso da modulação; a portadora é removida/ignorada na detecção."),
    tf(t, { kind: "calculo", level: 4, pitfall: "Errar a subtração na componente de diferença.", ref: a1("3.6", 31) },
      "Em um misturador, combinar um sinal de 14,200 MHz com um oscilador de 9,000 MHz produz componentes em 23,200 MHz e 4,200 MHz.", false,
      "A soma está correta (23,200 MHz), mas a diferença é 14,200 − 9,000 = 5,200 MHz."),
    tf(t, { kind: "conceitual", level: 4, pitfall: "Achar que o batimento ocorre em circuito linear.", ref: a1("3.6", 31) },
      "O batimento de duas frequências, que gera as componentes de soma e diferença, ocorre em circuitos lineares ideais.", false,
      "A Cartilha especifica circuitos não lineares: é a não linearidade que produz f₁ + f₂ e f₁ − f₂, princípio usado nos misturadores para gerar a FI."),
    tf(t, { kind: "calculo", level: 5, pitfall: "Não aplicar o batimento ao projeto do oscilador local.", ref: a1("3.6", 31) },
      "Para que um receptor com FI de 10,7 MHz e oscilador local acima do sinal sintonize 145,000 MHz, o oscilador deve operar em 155,700 MHz.", true,
      "A FI é a diferença entre o oscilador e o sinal: 155,700 − 145,000 = 10,700 MHz."),
    tf(t, { kind: "conceitual", level: 2, pitfall: "Achar que instrumentos combinados são sempre tão precisos quanto o dedicado.", ref: a1("3.7", 31) },
      "O instrumento específico para medir frequência é o frequencímetro; instrumentos combinados costumam ter menos precisão nessa função.", true,
      "A Cartilha diz que muitos instrumentos combinados têm frequencímetro, mas geralmente com menos precisão e opções que o instrumento dedicado."),
    mc(t, { kind: "calculo", level: 3, pitfall: "Errar a ordem de grandeza.", ref: a1("3.1", 29) },
      "Qual é o comprimento de onda aproximado de um sinal de 21 MHz?",
      ["≈ 14,3 m", "≈ 1,43 m", "≈ 6,3 m", "≈ 143 m"],
      "300 / 21 ≈ 14,3 m (faixa de 15 metros)."),
    mc(t, { kind: "conceitual", level: 1, pitfall: "Confundir as designações das faixas.", ref: a1("3.2", 30), recall: true },
      "Qual designação corresponde à faixa de 30 a 300 MHz?",
      ["VHF", "HF", "UHF", "MF"],
      "VHF vai de 30 a 300 MHz; HF é 3–30 MHz, UHF é 300–3.000 MHz e MF é 300–3.000 kHz."),
    mc(t, { kind: "calculo", level: 4, pitfall: "Escolher a soma em vez da diferença.", ref: a1("3.6", 31) },
      "Um receptor mistura um sinal de 7,100 MHz com um oscilador local de 7,555 MHz. Qual componente de diferença surge na saída do misturador?",
      ["455 kHz", "14,655 MHz", "7,555 MHz", "45,5 kHz"],
      "7,555 − 7,100 = 0,455 MHz = 455 kHz. 14,655 MHz é a soma."),
    mc(t, { kind: "calculo", level: 3, pitfall: "Errar a conversão de unidades no período.", ref: a1("3.1", 29) },
      "Qual é o período de um sinal de 10 kHz?",
      ["100 µs", "10 µs", "1 ms", "0,1 µs"],
      "T = 1 / 10.000 Hz = 0,0001 s = 100 µs."),
  ];
}

/* ── 4. Propagação (Anexo 1 §4, pp. 31–33) ─────────────────────────────── */

function propagacao(): QuestionDraft[] {
  const t = "propagacao";
  return [
    tf(t, { kind: "conceitual", level: 3, pitfall: "Classificar a tropodifusão como onda espacial.", ref: a1("4.2", 32) },
      "As ondas terrestres incluem a onda de superfície, a difração e a visada direta, mas não a tropodifusão, que é uma onda espacial.", false,
      "A Cartilha inclui a tropodifusão entre as ondas terrestres (ocorre na troposfera). Ondas espaciais são as refratadas/refletidas na ionosfera."),
    tf(t, { kind: "conceitual", level: 2, pitfall: "Confundir ondas espaciais com ondas terrestres.", ref: a1("4.2", 32) },
      "As ondas espaciais sofrem refração ou reflexão na ionosfera e possibilitam contatos a grande distância (DX) em HF.", true,
      "É a definição da Cartilha para ondas espaciais."),
    tf(t, { kind: "conceitual", level: 2, pitfall: "Errar a altitude da ionosfera.", ref: a1("4.3", 32) },
      "A ionosfera, aproximadamente entre 10 e 50 km de altura, é a região relevante para as reflexões que permitem DX em HF.", false,
      "A ionosfera fica em ~60–400 km. A faixa de 10–50 km é a estratosfera."),
    tf(t, { kind: "conceitual", level: 3, pitfall: "Atribuir à troposfera as reflexões de HF.", ref: a1("4.3", 32) },
      "A troposfera é a região responsável pelas reflexões que permitem contatos DX em HF.", false,
      "A troposfera (0–10/15 km) é relevante para VHF/UHF/SHF, visada direta e tropodifusão. As reflexões de HF ocorrem na ionosfera."),
    tf(t, { kind: "conceitual", level: 3, pitfall: "Associar a onda de superfície ao VHF.", ref: a1("4.4", 32) },
      "Em LF/MF, o mecanismo predominante é a onda de superfície, que acompanha a curvatura da Terra com alcance moderado.", true,
      "Para 100 kHz – 3 MHz, a Cartilha aponta a onda de superfície, que segue a curvatura da Terra com alcance moderado."),
    tf(t, { kind: "cenario", level: 4, pitfall: "Esperar propagação ionosférica em VHF.", ref: a1("4.4", 32) },
      "Um enlace em 145 MHz entre duas cidades separadas por uma serra alta depende principalmente da reflexão ionosférica.", false,
      "Em VHF/UHF predominam a linha de visada, a difração e a tropodifusão; a refração/reflexão ionosférica é o mecanismo do HF. A serra é um obstáculo à visada."),
    tf(t, { kind: "cenario", level: 3, pitfall: "Ignorar a altura e os obstáculos em VHF/UHF.", ref: a1("4.5", 32) },
      "Em UHF, instalar as antenas mais altas e livres de obstáculos favorece o enlace, pois a propagação é predominantemente em visada direta.", true,
      "Na visada direta o sinal se propaga praticamente em linha reta; reduzir obstáculos melhora o enlace."),
    tf(t, { kind: "conceitual", level: 4, pitfall: "Achar que a tropodifusão dá sinais fortes.", ref: a1("4.5", 33) },
      "A tropodifusão, relevante entre 300 MHz e 3 GHz, permite comunicações além do horizonte com sinais tipicamente fortes.", false,
      "A Cartilha diz que a tropodifusão permite ir além do horizonte, porém com sinais fracos."),
    tf(t, { kind: "conceitual", level: 3, pitfall: "Ignorar a atenuação por chuva em micro-ondas.", ref: a1("4.4", 32) },
      "Acima de 3 GHz (SHF), a chuva e os obstáculos podem atenuar significativamente o sinal.", true,
      "Para SHF, a Cartilha aponta visada direta, reflexões locais e atenuação por chuva e obstáculos."),
    tf(t, { kind: "cenario", level: 5, pitfall: "Atribuir a uma falha da estação o que é variação da propagação.", ref: a1("4.6", 33) },
      "Um contato DX em 14 MHz que funciona ao entardecer pode deixar de funcionar à noite sem mudança na estação, pois a propagação em HF varia com a hora.", true,
      "A ionosfera muda entre dia e noite; o mesmo enlace em HF pode abrir e fechar sem que a estação tenha nenhum defeito."),
    tf(t, { kind: "conceitual", level: 3, pitfall: "Subestimar o alcance com múltiplos saltos.", ref: a1("4.6", 33) },
      "Em HF, o sinal pode fazer múltiplos saltos entre a ionosfera e a Terra, alcançando milhares de quilômetros.", true,
      "A Cartilha menciona os múltiplos 'saltos' que permitem alcançar milhares de quilômetros."),
    mc(t, { kind: "conceitual", level: 2, pitfall: "Associar HF à visada direta.", ref: a1("4.4", 32) },
      "Qual mecanismo de propagação predomina na faixa de HF (3 a 30 MHz)?",
      ["Refração/reflexão ionosférica", "Linha de visada", "Onda de superfície", "Tropodifusão"],
      "Para HF, a Cartilha aponta a refração/reflexão ionosférica, principal faixa para DX."),
    mc(t, { kind: "conceitual", level: 3, pitfall: "Confundir camadas ionosféricas com regiões da atmosfera.", ref: a1("4.6", 33) },
      "Com quais camadas ionosféricas interage a propagação em HF?",
      ["D, E, F1 e F2", "Troposfera e estratosfera", "Apenas a camada de ozônio", "VLF, LF e MF"],
      "A Cartilha cita as camadas D, E, F1 e F2. Troposfera e estratosfera são outras regiões da atmosfera; VLF, LF e MF são faixas de frequência."),
    mc(t, { kind: "cenario", level: 3, pitfall: "Escolher HF para contato local em visada.", ref: a1("4.4", 32) },
      "Para contatos locais e regionais em visada direta, a faixa mais adequada é:",
      ["VHF/UHF", "HF", "VLF", "LF"],
      "A Cartilha associa VHF/UHF ao uso local/regional e aos enlaces em visada."),
    mc(t, { kind: "conceitual", level: 3, pitfall: "Situar a visada e a tropodifusão na ionosfera.", ref: a1("4.3", 32) },
      "Em qual região da atmosfera ocorrem a visada direta e a tropodifusão relevantes para VHF/UHF/SHF?",
      ["Troposfera", "Ionosfera", "Estratosfera", "Camada F2"],
      "A tabela da Cartilha associa a troposfera (0–10/15 km) a VHF/UHF/SHF, à visada direta e à tropodifusão."),
  ];
}

/* ── 5. Interferências (Anexo 1 §5, pp. 33–34; §6.6, p. 16) ────────────── */

function interferencias(): QuestionDraft[] {
  const t = "interferencias";
  return [
    tf(t, { kind: "conceitual", level: 2, pitfall: "Confundir interferência irradiada com conduzida.", ref: a1("5.2", 33) },
      "Na interferência irradiada, a RF chega a outros equipamentos conduzida pelos cabos de energia da rede elétrica.", false,
      "Isso descreve a interferência conduzida. Na irradiada, a RF vaza pelo sistema irradiante ou por instalação deficiente e atinge os equipamentos pelo ar."),
    tf(t, { kind: "conceitual", level: 3, pitfall: "Inverter as definições de conduzida e irradiada.", ref: a1("5.2", 33) },
      "Na interferência conduzida, a RF chega a outros equipamentos apenas pelo ar, sem passar por cabos de energia, áudio ou sinal.", false,
      "Na conduzida, a RF entra em cabos de energia, áudio ou sinal e é conduzida até outros equipamentos. Pelo ar é a irradiada."),
    tf(t, { kind: "cenario", level: 5, pitfall: "Não combinar dois testes para isolar a origem.", ref: a1("5.2", 33) },
      "Interferência que continua com o rádio na carga fictícia e some ao alimentá-lo por bateria sugere origem conduzida pela fonte, e não irradiada pela antena.", true,
      "Com a carga fictícia a antena não irradia, e mesmo assim o problema continua: logo não vem da antena. Se some com a bateria, o caminho é a alimentação, ou seja, interferência conduzida."),
    tf(t, { kind: "cenario", level: 3, pitfall: "Trocar filtro passa-baixas por passa-altas na saída do TX.", ref: a1("5.3", 34) },
      "Um filtro passa-baixas na saída do transmissor ajuda a reduzir os harmônicos que podem interferir em outros serviços.", true,
      "A Cartilha recomenda filtros passa-baixas na saída do transmissor justamente para reduzir harmônicos."),
    tf(t, { kind: "conceitual", level: 3, pitfall: "Desconhecer o uso de balun/choque de RF.", ref: a1("5.3", 34) },
      "Baluns e choques de RF podem ser usados para reduzir a corrente de modo comum no cabo coaxial.", true,
      "A Cartilha recomenda baluns/choques de RF onde for preciso para reduzir a corrente de modo comum no coaxial."),
    tf(t, { kind: "cenario", level: 3, pitfall: "Ignorar o acoplamento com a fiação da casa.", ref: a1("5.3", 34) },
      "Passar o cabo coaxial paralelo e junto à fiação elétrica interna da casa é recomendado para reduzir interferências.", false,
      "A Cartilha recomenda evitar cabos paralelos a fiações internas, porque isso favorece o acoplamento."),
    tf(t, { kind: "cenario", level: 4, pitfall: "Manter a operação sem resolver a causa.", ref: body("6.6", 16) },
      "Se a interferência persiste após verificar cabos, filtros, aterramento e segmento de operação, o radioamador deve suspender a operação até achar a causa.", true,
      "O último passo do roteiro é suspender a operação até identificar a causa, se o problema persistir."),
    mc(t, { kind: "cenario", level: 4, pitfall: "Não interpretar o teste da bateria.", ref: a1("5.2", 33) },
      "A interferência que um radioamador causa na TV do vizinho some quando ele alimenta o rádio por bateria. A causa mais provável é:",
      ["Interferência conduzida pela fonte ou pela rede elétrica", "Variação da propagação ionosférica", "ROE próxima de 1:1", "Operação em frequência de chamada"],
      "Pela dica clássica da Cartilha, uma grande mudança ao usar bateria indica forte componente conduzida pela fonte/rede."),
    mc(t, { kind: "cenario", level: 3, pitfall: "Escolher o filtro errado para harmônicos.", ref: a1("5.3", 34) },
      "Qual recurso reduz os harmônicos gerados na saída do transmissor?",
      ["Filtro passa-baixas na saída do transmissor", "Filtro passa-altas na entrada do receptor", "Aumento da potência de saída", "Frequencímetro em série com a antena"],
      "Os harmônicos são múltiplos da frequência de operação; um passa-baixas na saída do TX os atenua."),
    mc(t, { kind: "cenario", level: 3, pitfall: "Reagir à reclamação sem roteiro.", ref: body("6.6", 16) },
      "Ao receber um relato de interferência, qual sequência é a mais adequada?",
      ["Parar a transmissão, ouvir, reduzir a potência e verificar a instalação", "Aumentar a potência para superar o ruído", "Mudar de faixa sem investigar a causa", "Continuar operando até a fiscalização intervir"],
      "É o roteiro da Cartilha (§6.6): parar e ouvir, reduzir a potência e testar, verificar cabos, filtros e aterramento, e suspender se persistir."),
    mc(t, { kind: "conceitual", level: 3, pitfall: "Desconhecer o recurso contra corrente de modo comum.", ref: a1("5.3", 34) },
      "Para reduzir a corrente de modo comum no cabo coaxial, utiliza-se:",
      ["Balun ou choque de RF", "Antena artificial", "Frequencímetro", "Linha paralela no lugar do coaxial"],
      "A Cartilha indica baluns/choques de RF para reduzir a corrente de modo comum no coaxial."),
  ];
}

/* ── 6. Comunicados (Anexo 1 §6, pp. 34–36) ────────────────────────────── */

function comunicados(): QuestionDraft[] {
  const t = "comunicados";
  return [
    tf(t, { kind: "conceitual", level: 2, pitfall: "Achar que os códigos são só tradição, sem função prática.", ref: a1("6.1", 34) },
      "Padrões como o alfabeto fonético e o Código Q existem para evitar mal-entendidos com sinal fraco, vencer diferenças de idioma e agilizar contatos.", true,
      "A Cartilha lista esses três motivos para a padronização."),
    tf(t, { kind: "cenario", level: 3, pitfall: "Soletrar com palavras não padronizadas.", ref: a1("6.2", "34–35"), recall: true },
      "Para soletrar o indicativo PY2KJ em fonia, o operador diz: Papa, Yankee, dois, Kilo, Juliett.", true,
      "P = Papa, Y = Yankee, K = Kilo, J = Juliett pelo Alfabeto Fonético Internacional; o número é dito normalmente."),
    tf(t, { kind: "cenario", level: 2, pitfall: "Usar nomes de cidades no lugar do fonético oficial.", ref: a1("6.2", 35), recall: true },
      "Ao soletrar a letra W em um QSO, o operador deve usar a palavra 'Washington'.", false,
      "No Alfabeto Fonético Internacional, W é 'Whiskey'. Nomes de cidades não são o padrão."),
    tf(t, { kind: "cenario", level: 2, pitfall: "Confundir QTH com QRA.", ref: a1("6.3", 36), recall: true },
      "Um operador que pergunta 'qual o seu QTH?' quer saber o indicativo de chamada da outra estação.", false,
      "QTH é a localização (cidade, região, latitude e longitude). O indicativo é QRA."),
    tf(t, { kind: "cenario", level: 2, pitfall: "Confundir QRM com ruído atmosférico.", ref: a1("6.3", 36), recall: true },
      "Ao dizer 'estou com muito QRM', o operador informa que está recebendo interferência de outras estações.", true,
      "QRM = interferência de outras estações."),
    tf(t, { kind: "cenario", level: 3, pitfall: "Trocar QRP por QRO.", ref: a1("6.3", 36), recall: true },
      "Pedir 'QRP' à outra estação equivale a pedir que ela aumente a potência do transmissor.", false,
      "QRP é diminuir a potência; aumentar é QRO."),
    tf(t, { kind: "cenario", level: 2, pitfall: "Confundir QRV com QRT.", ref: a1("6.3", 36), recall: true },
      "Em um QSO, 'QRV' indica que a estação vai cessar a transmissão e sair do ar.", false,
      "QRV = estou pronto/preparado. Cessar a transmissão é QRT."),
    tf(t, { kind: "conceitual", level: 4, pitfall: "Achar que o radioamador pode usar todo o Código Q.", ref: a1("6.3", 36) },
      "Para o radioamadorismo, o regulamento especifica o uso somente do subconjunto do Código Q das séries QRA a QUZ.", true,
      "A Cartilha registra que só as séries QRA a QUZ são para o radioamadorismo; os demais subconjuntos são para serviços aeronáuticos, marítimos e outros."),
    tf(t, { kind: "conceitual", level: 3, pitfall: "Interpretar CL como 'na escuta'.", ref: a1("6.3", 36) },
      "Em CW, o sinal 'CL' ao final de um QSO indica que a estação continua na escuta.", false,
      "A Cartilha é explícita: CL indica encerramento (sair do ar), não 'na escuta'."),
    tf(t, { kind: "conceitual", level: 2, pitfall: "Achar que o QSL é documento de licença.", ref: a1("6.4", 36) },
      "O cartão QSL, físico ou eletrônico, confirma formalmente um contato e pode servir como prova para diplomas e certificações.", true,
      "É a descrição da Cartilha para o cartão QSL."),
    tf(t, { kind: "cenario", level: 3, pitfall: "Responder ao CQ fora da frequência de quem chamou.", ref: a1("7.4", 37) },
      "Ao responder a um CQ, o correto é chamar na sua própria frequência habitual e aguardar que a estação que chamou o encontre.", false,
      "A Cartilha indica que, ao responder a um CQ, se deve sintonizar na QRG (frequência) do colega que chamou."),
    mc(t, { kind: "cenario", level: 2, pitfall: "Usar palavras não padronizadas para soletrar.", ref: a1("6.2", "34–35"), recall: true },
      "Qual sequência soletra corretamente o sufixo 'BEM' em fonia?",
      ["Bravo, Echo, Mike", "Brasil, Europa, México", "Bravo, Eco, Maria", "Bola, Escola, Mike"],
      "B = Bravo, E = Echo, M = Mike no Alfabeto Fonético Internacional."),
    mc(t, { kind: "cenario", level: 3, pitfall: "Confundir QRG com QTH.", ref: a1("6.3", 36), recall: true },
      "Um operador quer saber a frequência exata de transmissão da outra estação. Qual código Q ele deve usar?",
      ["QRG", "QTH", "QRA", "QSL"],
      "QRG = frequência exata de transmissão. QTH é a localização, QRA o indicativo e QSL a confirmação."),
  ];
}

/* ── 7. Ética (Anexo 1 §7, pp. 37–38; identificação, p. 53) ────────────── */

function etica(): QuestionDraft[] {
  const t = "etica";
  return [
    tf(t, { kind: "cenario", level: 1, pitfall: "Transmitir sem antes escutar.", ref: a1("7.2", 37) },
      "Antes de transmitir, o operador deve escutar por um tempo para verificar se a frequência está livre.", true,
      "A Cartilha manda escutar antes de transmitir para saber se a frequência está livre."),
    tf(t, { kind: "cenario", level: 3, pitfall: "Usar BREAK para pedir vez em conversa comum.", ref: a1("7.3", 37) },
      "Usar 'BREAK' para pedir a vez em uma conversa comum de rodada é procedimento adequado.", false,
      "A Cartilha diz para não usar 'BREAK' apenas para pedir vez em conversas comuns; ele indica tráfego prioritário."),
    tf(t, { kind: "cenario", level: 2, pitfall: "Interromper a rodada sem aguardar o câmbio.", ref: a1("7.3", 37) },
      "Para entrar em uma rodada, o operador deve aguardar um câmbio e pedir oportunidade de forma cortês.", true,
      "É o procedimento da Cartilha para entrar em rodadas."),
    tf(t, { kind: "cenario", level: 4, pitfall: "Manter conversa paralela longa dentro da rodada.", ref: a1("7.3", 37) },
      "Em uma rodada movimentada, dois participantes que queiram uma conversa longa à parte devem combinar um QSY para outra frequência.", true,
      "A Cartilha recomenda evitar conversas paralelas longas em rodada movimentada e combinar um QSY se preciso."),
    tf(t, { kind: "conceitual", level: 3, pitfall: "Não reconhecer o 'passar por cima' como QRM intencional.", ref: a1("7.4", 37) },
      "Transmitir por cima da fala de outro operador constitui interferência intencional (QRM deliberado), prática antiética.", true,
      "A Cartilha classifica essa prática como QRM deliberado, antiético e prejudicial a todos."),
    tf(t, { kind: "cenario", level: 4, pitfall: "Responder a um CQ direcionado sem ser o alvo.", ref: a1("7.5", 37) },
      "Se uma estação faz CQ direcionado à Europa, um operador no Brasil interessado em DX pode responder normalmente.", false,
      "Em CQ direcionado (continente, país, região, prefixo), só responde quem for o alvo. Uma estação no Brasil não é alvo de um CQ para a Europa."),
    tf(t, { kind: "cenario", level: 2, pitfall: "Fazer comentários longos em pile-up.", ref: a1("7.5", 37) },
      "Em um pile-up, deve-se passar o indicativo e o relatório de forma breve, sem comentários longos.", true,
      "Em pile-up/DXpedition, a Cartilha manda ser breve, porque há muitos aguardando contato."),
    tf(t, { kind: "cenario", level: 3, pitfall: "Usar o sinal forte para dominar o pile-up.", ref: a1("7.5", 37) },
      "Quem chega com sinal muito forte em um pile-up deve usar isso com responsabilidade, dando espaço a estações mais fracas.", true,
      "É a orientação da Cartilha para quem 'chega muito forte'."),
    tf(t, { kind: "cenario", level: 3, pitfall: "Ocupar HF de longo alcance com bate-papo local.", ref: a1("7.6", 37) },
      "Bate-papos locais devem dar preferência às faixas de HF, por terem maior alcance.", false,
      "A Cartilha recomenda dar preferência a faixas de curto alcance, como VHF ou UHF, para bate-papos locais."),
    tf(t, { kind: "cenario", level: 3, pitfall: "Achar aceitável o uso comercial do serviço.", ref: a1("7.8", 38) },
      "Anunciar a venda de um equipamento usado durante uma rodada é compatível com a natureza do serviço de radioamador.", false,
      "Negócios e mercantilização (publicidade, vendas etc.) estão entre os temas a evitar."),
    tf(t, { kind: "cenario", level: 3, pitfall: "Usar a repetidora sem deixar espaço para outros.", ref: a1("7.7", 37) },
      "Em uma repetidora, o ideal é emendar uma transmissão na outra, sem pausas, para não perder o canal.", false,
      "A Cartilha recomenda pausas entre transmissões para permitir intervenções importantes, como uma emergência."),
    tf(t, { kind: "conceitual", level: 3, pitfall: "Achar que a identificação só é exigida no início.", ref: a2("13", 53, "3.1 I e 10.2") },
      "O indicativo de chamada deve ser usado no início, durante e no término das emissões, sendo vedada a operação de estação sem identificação.", true,
      "A Cartilha transcreve a regra: indicativo no início, durante e no término; é vedada a operação sem identificação."),
    mc(t, { kind: "cenario", level: 2, pitfall: "Disputar uma frequência ocupada.", ref: a1("7.2", 37) },
      "Ao encontrar uma frequência ocupada por um QSO, qual é o procedimento ético?",
      ["Esperar o intervalo ou procurar outra frequência", "Transmitir por cima, se o seu sinal for mais forte", "Usar 'BREAK' para pedir a frequência", "Aumentar a potência para ser ouvido primeiro"],
      "A Cartilha manda esperar ou procurar outra frequência; não se 'expulsa' quem já está usando, salvo emergência real."),
    mc(t, { kind: "conceitual", level: 2, pitfall: "Não reconhecer os temas a evitar.", ref: a1("7.8", 38) },
      "Qual tema deve ser evitado no serviço de radioamador?",
      ["Propaganda política", "Troca de informações técnicas", "Relatório de sinal", "Organização de conteste"],
      "A Cartilha lista entre os temas a evitar negócios/mercantilização, propaganda política e trotes."),
    mc(t, { kind: "cenario", level: 4, pitfall: "Responder a CQ direcionado sem ser o alvo.", ref: a1("7.5", 37) },
      "Uma estação chama 'CQ PY5', isto é, dirigido a um prefixo específico. Quem deve responder?",
      ["Apenas estações com prefixo PY5", "Qualquer estação brasileira", "Somente estações estrangeiras", "Qualquer estação com sinal forte"],
      "Em CQ direcionado, só responde quem é o alvo; no caso, as estações com prefixo PY5."),
    mc(t, { kind: "conceitual", level: 3, pitfall: "Confundir ilhas costeiras com entidades DX.", ref: a1("7.9", 38) },
      "Para efeitos de DX, quais são consideradas entidades distintas do Brasil continental?",
      ["Fernando de Noronha, Ilhas de São Pedro e São Paulo e Ilha de Trindade", "Ilha de Marajó, Ilha Grande e Ilhabela", "Florianópolis, Vitória e São Luís", "Ilha do Mel, Ilha Comprida e Ilha do Bananal"],
      "A Cartilha lista Brasil (continente), Fernando de Noronha, Ilhas de São Pedro e São Paulo e Ilha de Trindade."),
    mc(t, { kind: "cenario", level: 3, pitfall: "Usar a repetidora para conflitos.", ref: a1("7.7", 37) },
      "Em uma repetidora, qual conduta está de acordo com a ética operacional?",
      ["Respeitar o tempo máximo por câmbio e fazer pausas entre transmissões", "Usar o canal para resolver conflitos pessoais", "Criticar no ar outra repetidora da região", "Transmitir sem pausas para manter o canal ocupado"],
      "A Cartilha recomenda respeitar o tempo por câmbio, fazer pausas e não usar a repetidora para conflitos, boatos e intrigas."),
  ];
}

/* ── 8. Emergências (Anexo 1 §8, p. 38; Anexo 2 §4.4, p. 46) ──────────── */

function emergencias(): QuestionDraft[] {
  const t = "emergencias";
  return [
    tf(t, { kind: "conceitual", level: 1, pitfall: "Achar que tráfego de emergência disputa espaço com os demais.", ref: a1("8.1", 38) },
      "Em situação de emergência, as comunicações de socorro têm prioridade real sobre qualquer outro tráfego.", true,
      "É a 'prioridade absoluta' da Cartilha: o foco é salvar vidas e minimizar danos."),
    tf(t, { kind: "cenario", level: 2, pitfall: "Ignorar o 'break break' em QSO comum.", ref: a1("8.2", 38) },
      "Ao ouvir 'break break' em uma frequência ocupada por um QSO comum, os operadores devem interromper a conversa e dar espaço à estação em emergência.", true,
      "É o procedimento descrito pela Cartilha."),
    tf(t, { kind: "cenario", level: 2, pitfall: "Achar que só a estação em emergência tem deveres.", ref: a1("8.3", 38) },
      "Durante um tráfego de emergência, os demais operadores devem evitar transmissões desnecessárias e ajudar a manter a disciplina na frequência.", true,
      "A Cartilha atribui esse dever aos outros operadores."),
    tf(t, { kind: "cenario", level: 4, pitfall: "Usar a emergência para fins próprios, mesmo que brevemente.", ref: a1("8.4", 38) },
      "Aproveitar a ativação de uma rede de emergência para testar o alcance de um equipamento novo é aceitável, desde que o teste seja breve.", false,
      "A Cartilha manda não usar a emergência para testar equipamento ou brincar, independentemente da duração."),
    tf(t, { kind: "conceitual", level: 4, pitfall: "Desconhecer as hipóteses de transmissão simultânea.", ref: a2("4.4", 46, "10.1") },
      "A transmissão simultânea em mais de uma faixa de frequências é permitida para o atendimento de situação de emergência ou calamidade pública.", true,
      "Está entre as hipóteses exclusivas previstas: boletins de associações, emergência ou calamidade pública, complementação de transmissões e competições internacionais."),
    tf(t, { kind: "conceitual", level: 4, pitfall: "Achar que a transmissão simultânea é livre.", ref: a2("4.4", 46, "10.1") },
      "A transmissão simultânea em mais de uma faixa é permitida livremente, a critério do radioamador, desde que use baixa potência.", false,
      "Ela é permitida exclusivamente nas hipóteses previstas (boletins de associações, emergência/calamidade, complementação de transmissões, competições internacionais). Potência baixa não é critério."),
    mc(t, { kind: "cenario", level: 2, pitfall: "Gerar tráfego desnecessário em emergência.", ref: a1("8.4", 38) },
      "Qual conduta é adequada em uma comunicação de emergência?",
      ["Ser claro, breve e objetivo", "Transmitir longos relatórios de sinal", "Aproveitar para testar equipamentos", "Manter conversas paralelas para animar a rede"],
      "A Cartilha pede clareza, brevidade e objetividade, sem testes nem discussões paralelas."),
    mc(t, { kind: "conceitual", level: 3, pitfall: "Achar que a frequência em emergência continua livre para todos.", ref: a1("8.3", 38) },
      "Em situação de emergência, a frequência em uso:",
      ["Pode ser tratada como prioritária para aquele tráfego", "Fica livre para qualquer QSO", "Deve ser abandonada por todas as estações", "Só pode ser usada por radioamadores Classe A"],
      "A Cartilha diz que a frequência pode ser tratada como prioritária para aquele tráfego, e os demais devem evitar transmissões desnecessárias."),
  ];
}

/* ── Expansion (2026-10) ────────────────────────────────────────────────
 * Second batch of items, one function per topic. They are listed after the
 * first batch in buildTeoQuestions() so the earlier IDs (TEO-001…159) stay
 * stable. Sources: Cartilha Anexo 1 (including its block diagrams), the main
 * body, Anexo 2 §§11–13, Anexo 3 §§8 and 11, and Ato 3448/2026 items 4.1 and 10.
 */

// Full AI review of every expansion item against the Cartilha 2026-06 text
// (and the Ato 3448/2026 text for the items citing it), done 2026-10-18.
const ext = createBuilder("TEO", { checkedByAi: true });

/** Anexo 2 (Legislação) section reference, without an Ato item. */
const a2s = (sec: string, page: number | string) => cite.annex(2, sec, page);
/** Anexo 3 (Eletrônica) reference — antenna polarization and digital modes. */
const a3 = (sec: string, page: number | string) => cite.annex(3, sec, page);
/** Item of the Ato 3448/2026, for rules the Cartilha does not transcribe. */
const ato = cite.ato;

function estacaoExtra(): QuestionDraft[] {
  const t = "estacao-de-radioamador";
  return [
    ext.tf(t, { kind: "conceitual", level: 3, pitfall: "Não saber onde portadora e informação se encontram no transmissor AM.", ref: a1("3.4", 30) },
      "No transmissor de AM-DSB, a portadora do oscilador de RF é amplificada e aplicada ao modulador, que também recebe a informação já amplificada.", true,
      "No diagrama da Cartilha, oscilador RF → amplificador RF → modulador → antena; a informação vem do transdutor, passa pelo pré-amplificador, pelo filtro e pelo amplificador e chega ao modulador."),
    ext.mc(t, { kind: "calculo", level: 4, pitfall: "Não perceber o efeito de um shift com o sinal trocado.", ref: a1("1.3", 27) },
      "Um rádio deveria acessar uma repetidora com saída em 146,820 MHz e shift de −600 kHz, mas foi programado com shift de +600 kHz. Em que frequência ele transmite?",
      ["147,420 MHz", "146,220 MHz", "146,820 MHz", "147,020 MHz"],
      "Com o shift trocado, o rádio soma: 146,820 + 0,600 = 147,420 MHz. A entrada correta seria 146,220 MHz, então a repetidora não o ouve."),
    ext.tf(t, { kind: "cenario", level: 3, pitfall: "Achar que a repetidora pertence só ao grupo mantenedor.", ref: a1("1.2", 26) },
      "Um radioamador de passagem pela cidade não pode usar a repetidora local por não ser sócio do grupo que a mantém.", false,
      "Segundo a Cartilha, o uso da repetidora é, em princípio, compartilhado pelos radioamadores, obedecidas as regras do serviço e do grupo mantenedor."),
    ext.tf(t, { kind: "calculo", level: 4, pitfall: "Errar o sinal do shift a partir das frequências de entrada e saída.", ref: a1("1.3", 27) },
      "Uma repetidora tem entrada em 146,400 MHz e saída em 147,000 MHz; para acessá-la, o rádio recebe em 147,000 MHz com shift de +600 kHz.", false,
      "O rádio recebe na saída (147,000 MHz) e transmite na entrada (146,400 MHz), que fica 600 kHz abaixo: o shift é de −600 kHz."),
    // Block diagrams, asked by function (2026-10-21 coverage pass). Checked
    // against the diagram images on Cartilha pp. 26, 30 and 31.
    ext.tf(t, { kind: "conceitual", level: 3, pitfall: "Achar que a repetidora só amplifica o sinal recebido, sem demodulá-lo.", ref: a1("1.2", 26) },
      "Na repetidora, o sinal recebido passa direto do amplificador de RF da entrada para o amplificador de potência da saída, sem ser demodulado.", false,
      "No diagrama da repetidora, a recepção passa por amplificador de RF, misturador, FI/limitador e detector FM. O áudio recuperado vai ao processador de áudio e ao modulador do transmissor, que segue para o multiplicador e o amplificador de potência."),
    ext.tf(t, { kind: "conceitual", level: 3, pitfall: "Achar que o CAG é o controle de volume do áudio.", ref: a1("3.4", 30) },
      "No receptor AM-DSB, o CAG (controle automático de ganho) atua sobre o amplificador de áudio, fazendo o papel do controle de volume.", false,
      "No diagrama do receptor AM-DSB, o CAG parte do demodulador e atua sobre o 1º e o 2º amplificadores de RF, ajustando o ganho dessas etapas. Ele não atua sobre o amplificador de áudio que alimenta o alto-falante."),
    ext.mc(t, { kind: "conceitual", level: 3, pitfall: "Confundir o bloco que demodula com os que convertem ou amplificam o sinal.", ref: a1("3.4", 31) },
      "No receptor FM, qual bloco extrai a mensagem (o áudio) do sinal de FI?",
      ["Discriminador", "Misturador", "Oscilador local", "Amplificador de RF"],
      "Demodular é extrair a mensagem do sinal modulado. No receptor FM, quem faz isso é o discriminador, depois do amplificador de FI e do limitador; na repetidora, o bloco equivalente aparece como detector FM. Misturador e oscilador local geram a FI, e o amplificador de RF só amplifica."),
    ext.tf(t, { kind: "conceitual", level: 4, pitfall: "Achar que o FM é modulado no último estágio, como no transmissor AM.", ref: a1("3.4", "30–31") },
      "No transmissor FM, o áudio é aplicado ao amplificador de RF final, logo antes da antena, como acontece com o modulador no transmissor AM-DSB.", false,
      "No transmissor FM, o áudio passa pelo modulador, que atua sobre o oscilador; o sinal segue pelo multiplicador e só então pelo amplificador de RF até a antena. No AM-DSB, ao contrário, o modulador é o último bloco antes da antena."),
  ];
}

function antenasExtra(): QuestionDraft[] {
  const t = "antenas";
  return [
    ext.tf(t, { kind: "calculo", level: 4, pitfall: "Não aplicar o cálculo de λ/2 ao espaço disponível.", ref: a1("2.2", 28) },
      "Com 12 m livres no quintal, cabe um dipolo de meia onda esticado para 14 MHz, mas não um para 7 MHz.", true,
      "Para 14 MHz: λ ≈ 21,4 m e meia onda ≈ 10,7 m, que cabe. Para 7 MHz: λ ≈ 42,8 m e meia onda ≈ 21,4 m, que não cabe."),
    ext.mc(t, { kind: "calculo", level: 3, pitfall: "Confundir λ com λ/2.", ref: a1("2.2", 28) },
      "Qual é o comprimento total aproximado de um dipolo de meia onda para 3,75 MHz?",
      ["≈ 40 m", "≈ 80 m", "≈ 20 m", "≈ 4 m"],
      "λ ≈ 300 / 3,75 = 80 m; meia onda ≈ 40 m. 80 m é o λ inteiro e 20 m seria ¼ de onda."),
    ext.mc(t, { kind: "conceitual", level: 2, pitfall: "Errar o tamanho dos elementos da Yagi.", ref: a1("2.2", 28) },
      "Os elementos de uma antena Yagi medem aproximadamente:",
      ["λ/2", "λ/4", "Uma onda inteira (λ)", "De λ/3 a λ/10"],
      "A tabela descreve a Yagi com elementos de ~λ/2. λ/4 é a vertical típica de móveis, e λ/3 a λ/10 é a faixa de projeto da loop magnética."),
    ext.tf(t, { kind: "conceitual", level: 3, pitfall: "Trocar o elemento ativo da Yagi.", ref: a3("8.2", 62) },
      "Em uma antena Yagi-Uda, o elemento ativo é o refletor; o dipolo e os diretores são passivos.", false,
      "Na Yagi-Uda, o elemento ativo é o dipolo; refletores e diretores completam o conjunto."),
    ext.tf(t, { kind: "conceitual", level: 2, pitfall: "Não reconhecer antenas direcionais além da Yagi.", ref: a1("2.3", 28) },
      "Antenas log-periódicas e algumas loops estão entre as antenas direcionais, que concentram a energia em um feixe.", true,
      "A Cartilha cita Yagi, log-periódicas e algumas loops como direcionais."),
    ext.tf(t, { kind: "cenario", level: 4, pitfall: "Interpretar ROE baixa como problema.", ref: a1("2.4", 29) },
      "Uma ROE de 1,1:1 indica que grande parte da potência está voltando ao transmissor e que a antena deve ser reajustada.", false,
      "ROE próxima de 1:1 indica bom casamento e pouca energia refletida. ROE alta é que indica muita energia voltando."),
    ext.tf(t, { kind: "cenario", level: 3, pitfall: "Não reconhecer uma potência refletida alta.", ref: a1("2.4", 29) },
      "Um medidor indica 100 W de potência direta e 25 W de refletida: um quarto da potência volta ao transmissor, sinal de descasamento.", true,
      "Um quarto da potência está sendo refletido. Com bom casamento, a refletida seria pequena e a ROE ficaria perto de 1:1; aqui ela fica em torno de 3:1."),
    ext.tf(t, { kind: "cenario", level: 4, pitfall: "Tentar compensar a ROE alta com mais potência.", ref: a1("2.4", 29) },
      "Com ROE alta, aumentar a potência do transmissor não resolve o problema: uma grande fração da energia continua voltando ao transmissor.", true,
      "ROE alta significa que grande fração da energia volta ao transmissor, com aquecimento e perda de eficiência. O remédio é corrigir o casamento, não aumentar a potência."),
    ext.tf(t, { kind: "calculo", level: 5, pitfall: "Achar que um dipolo serve igual em qualquer banda.", ref: a1("2.2", 28) },
      "Um dipolo de meia onda cortado para 7,1 MHz (cerca de 21 m) tem, em 14,2 MHz, o comprimento de uma onda inteira, e não de meia onda.", true,
      "Em 14,2 MHz, λ ≈ 300 / 14,2 ≈ 21,1 m: os ~21 m do dipolo equivalem a uma onda inteira."),
    ext.tf(t, { kind: "calculo", level: 4, pitfall: "Não converter uma variação de 10 vezes em dB.", ref: a1("4.7", 33) },
      "Se o sinal fica igual e o ruído de fundo aumenta 10 vezes, uma SNR de 20 dB cai para cerca de 10 dB.", true,
      "Uma razão 10 vezes menor equivale a −10 dB (10·log 10 = 10): 20 − 10 = 10 dB."),
    ext.tf(t, { kind: "calculo", level: 3, pitfall: "Achar que 0 dB significa sinal muito forte.", ref: a1("4.7", 33) },
      "Uma SNR de 0 dB indica que o sinal tem potência dez vezes maior que a do ruído.", false,
      "0 dB significa razão 1: sinal e ruído com a mesma potência. Uma razão de 10 vezes corresponde a 10 dB."),
    ext.tf(t, { kind: "cenario", level: 3, pitfall: "Achar que a antena receptora não influi na SNR.", ref: a1("4.7", 33) },
      "Na recepção, usar antena com ganho apropriado e boa instalação não altera a SNR, que depende só da potência da estação distante.", false,
      "Usar antenas com ganho apropriado e boa instalação está entre as medidas que a Cartilha indica para melhorar a SNR."),
  ];
}

function frequenciaExtra(): QuestionDraft[] {
  const t = "frequencia-comprimento-de-onda";
  return [
    ext.tf(t, { kind: "calculo", level: 3, pitfall: "Deslocar a vírgula no cálculo de λ.", ref: a1("3.1", 29) },
      "Um sinal de 28 MHz tem comprimento de onda de cerca de 1,07 m.", false,
      "300 / 28 ≈ 10,7 m. 1,07 m seria o λ de cerca de 280 MHz."),
    ext.mc(t, { kind: "calculo", level: 3, pitfall: "Errar a ordem de grandeza ao converter λ em frequência.", ref: a1("3.1", 29) },
      "Qual é a frequência aproximada de um sinal com comprimento de onda de 70 cm?",
      ["≈ 430 MHz", "≈ 43 MHz", "≈ 210 MHz", "≈ 4,3 GHz"],
      "f ≈ 300 / 0,70 ≈ 430 MHz."),
    ext.tf(t, { kind: "conceitual", level: 3, pitfall: "Trocar os nomes das ondas por faixa.", recall: true, ref: a1("3.2", 29) },
      "As ondas da faixa de MF (300 a 3.000 kHz) são chamadas quilométricas.", false,
      "As ondas de MF são hectométricas. Quilométricas são as de LF (30–300 kHz)."),
    ext.tf(t, { kind: "conceitual", level: 3, pitfall: "Não situar frequências em GHz na faixa certa.", ref: a1("3.2", 30) },
      "Um sinal de 1,2 GHz pertence à faixa de UHF, cujas ondas são chamadas decimétricas.", true,
      "UHF vai de 0,3 a 3 GHz, e suas ondas são decimétricas."),
    ext.tf(t, { kind: "cenario", level: 3, pitfall: "Achar que todo som audível cabe na faixa da voz telefônica.", ref: a1("3.2", 30) },
      "Um tom de 12 kHz pode ser audível para uma pessoa com audição típica, mas está fora da faixa da voz telefônica.", true,
      "A audição típica vai de ~16 Hz a 16.000 Hz; a voz telefônica, de ~300 Hz a 3.400 Hz. 12 kHz está na primeira e fora da segunda."),
    ext.tf(t, { kind: "calculo", level: 4, pitfall: "Não encadear período, frequência e comprimento de onda.", ref: a1("3.1", 29) },
      "Um sinal com período de 0,5 µs tem frequência de 2 MHz e, portanto, comprimento de onda de cerca de 150 m.", true,
      "f = 1 / T = 1 / 0,5 µs = 2 MHz; λ ≈ 300 / 2 = 150 m."),
    ext.tf(t, { kind: "conceitual", level: 3, pitfall: "Trocar AM-DSB e SSB.", ref: a1("3.4", 30) },
      "O AM-DSB transmite uma única faixa lateral e, por isso, também é chamado de faixa lateral única.", false,
      "AM-DSB é dupla faixa lateral (double side-band). Faixa lateral única é o SSB (single side-band)."),
    ext.mc(t, { kind: "conceitual", level: 3, pitfall: "Confundir SSB com AM-DSB ou FM.", ref: a1("3.4", 30) },
      "Qual modulação transmite uma única faixa lateral e é muito usada em HF?",
      ["AM-SSB (SSB)", "AM-DSB", "FM", "CW"],
      "O SSB é a faixa lateral única, muito usada em HF. O AM-DSB usa as duas faixas laterais."),
  ];
}

function propagacaoExtra(): QuestionDraft[] {
  const t = "propagacao";
  return [
    ext.tf(t, { kind: "conceitual", level: 1, pitfall: "Confundir onda terrestre com onda espacial.", ref: a1("4.2", 32) },
      "Ondas terrestres viajam junto à superfície da Terra ou dentro da ionosfera.", false,
      "Ondas terrestres viajam junto à superfície ou dentro da troposfera. A ionosfera é onde as ondas espaciais são refratadas ou refletidas."),
    ext.tf(t, { kind: "cenario", level: 3, pitfall: "Achar que a difração é um mecanismo ionosférico.", ref: a1("4.2", 32) },
      "Um sinal de VHF que alcança um vale por difração na borda de um morro está se propagando como onda terrestre.", true,
      "A Cartilha inclui a difração entre os mecanismos de onda terrestre, ao lado da onda de superfície, da visada direta e da tropodifusão."),
    ext.tf(t, { kind: "conceitual", level: 3, pitfall: "Trocar as alturas da troposfera e da ionosfera.", ref: a1("4.3", 32) },
      "A troposfera vai de cerca de 60 a 400 km de altura e é a região de interesse para VHF/UHF/SHF.", false,
      "A troposfera vai de 0 a 10/15 km. A faixa de ~60 a 400 km é a da ionosfera."),
    ext.tf(t, { kind: "cenario", level: 3, pitfall: "Atribuir o alcance em MF à ionosfera ou à visada direta.", ref: a1("4.4", 32) },
      "Um sinal de 500 kHz que alcança cidades além do horizonte acompanhando a curvatura da Terra propaga-se principalmente por onda de superfície.", true,
      "Na faixa de 100 kHz a 3 MHz (LF/MF), o mecanismo predominante é a onda de superfície, que segue a curvatura da Terra com alcance moderado."),
    ext.tf(t, { kind: "cenario", level: 4, pitfall: "Desconhecer o uso da tropodifusão em enlaces planejados.", ref: a1("4.5", "32–33") },
      "Um enlace planejado em 1,2 GHz além do horizonte, que aceita sinais fracos, pode se apoiar na tropodifusão.", true,
      "A tropodifusão (300 MHz – 3 GHz) espalha o sinal na troposfera e permite comunicações além do horizonte, com sinais fracos; é mais relevante em enlaces planejados."),
    ext.tf(t, { kind: "cenario", level: 3, pitfall: "Atribuir o enlace via satélite à ionosfera.", ref: a1("4.5", 32) },
      "Um enlace via satélite em UHF depende principalmente da reflexão ionosférica, e não da visada direta entre as antenas.", false,
      "Em UHF e em comunicações via satélite, o mecanismo importante é a visada direta. A reflexão ionosférica é típica de HF."),
    ext.tf(t, { kind: "cenario", level: 3, pitfall: "Não reconhecer um enlace típico de visada direta.", ref: a1("4.4", 32) },
      "Um contato em 2 m entre duas cidades próximas, em terreno plano e com antenas altas, é típico de propagação por linha de visada.", true,
      "Em VHF/UHF predomina a linha de visada, para uso local/regional; antenas altas em terreno plano favorecem esse mecanismo."),
    ext.mc(t, { kind: "conceitual", level: 3, pitfall: "Atribuir a SHF mecanismos de outras faixas.", ref: a1("4.4", 32) },
      "Acima de 3 GHz (SHF), quais fatores predominam na propagação?",
      ["Visada direta, reflexões locais e atenuação por chuva/obstáculos", "Refração ionosférica e múltiplos saltos", "Onda de superfície que segue a curvatura da Terra", "Apenas a reflexão na estratosfera"],
      "A tabela da Cartilha lista, para SHF, visada direta, reflexões locais e atenuação por chuva/obstáculos. Refração ionosférica é de HF; onda de superfície, de LF/MF."),
    ext.mc(t, { kind: "cenario", level: 4, pitfall: "Achar que a propagação em HF depende de um único fator.", ref: a1("4.6", 33) },
      "Um operador nota que as aberturas em HF mudam entre dia e noite, ao longo do ano e de um ciclo solar para outro. Isso ocorre porque a propagação em HF varia com:",
      ["Hora do dia, ciclo solar e estação do ano", "Somente a hora do dia; o ciclo solar não influi", "Somente o ciclo solar; a hora do dia não influi", "Apenas a chuva e os obstáculos na troposfera"],
      "A Cartilha diz que a propagação em HF varia com a hora do dia, o ciclo solar e a estação do ano."),
  ];
}

function interferenciasExtra(): QuestionDraft[] {
  const t = "interferencias";
  return [
    ext.tf(t, { kind: "cenario", level: 3, pitfall: "Achar que só a interrupção total é interferência prejudicial.", ref: body("8.1", 20) },
      "Um sinal que degrada a comunicação de outra estação, sem chegar a interrompê-la, não se enquadra como interferência prejudicial.", false,
      "Interferência prejudicial é a que obstrui, degrada, interrompe repetidamente ou compromete a comunicação. A degradação já se enquadra."),
    ext.tf(t, { kind: "cenario", level: 3, pitfall: "Não usar a redução de potência como medida contra interferência.", ref: a1("5.3", 34) },
      "Um vizinho tem interferência na TV quando o radioamador transmite com 100 W; com 10 W o problema some e o QSO continua. Operar com a menor potência necessária resolveu o caso.", true,
      "Operar com a menor potência necessária para manter a comunicação é a primeira boa prática da Cartilha para reduzir interferências."),
    ext.tf(t, { kind: "conceitual", level: 3, pitfall: "Não reconhecer os caminhos da interferência conduzida.", ref: a1("5.2", 33) },
      "Fontes ruidosas e cabos mal filtrados podem levar RF até outros equipamentos, caracterizando interferência irradiada.", false,
      "Isso é interferência conduzida, não irradiada. Na interferência conduzida, a RF entra em cabos de energia, áudio ou sinal e é conduzida a outros equipamentos (fonte ruidosa, rede elétrica, cabos mal filtrados)."),
    ext.tf(t, { kind: "cenario", level: 4, pitfall: "Achar que estar na faixa e no modo certos dispensa resolver a interferência.", ref: body("7.2", 18) },
      "Uma interferência causada pela estação pode ser mantida se o radioamador estiver operando dentro da faixa e do modo permitidos.", false,
      "A expectativa regulatória é 'não causar e não manter interferência': mesmo dentro da faixa e do modo, é preciso parar, ajustar a estação e resolver o problema."),
    ext.tf(t, { kind: "calculo", level: 4, pitfall: "Não saber calcular a frequência de um harmônico.", ref: a1("5.3", 34) },
      "O 2º harmônico de um transmissor em 145 MHz cai em 290 MHz; um filtro passa-baixas na saída do transmissor ajuda a atenuá-lo.", true,
      "O harmônico de ordem n fica em n × f: 2 × 145 = 290 MHz. O passa-baixas deixa passar a fundamental e atenua as frequências acima dela."),
    ext.tf(t, { kind: "cenario", level: 5, pitfall: "Não combinar os testes para separar interferência irradiada de conduzida.", ref: a1("5.2", 33) },
      "Uma interferência que some com o rádio na carga fictícia e não muda ao alimentá-lo por bateria sugere origem irradiada pelo sistema irradiante, e não conduzida pela fonte.", true,
      "Se a troca por bateria não muda o problema, a fonte/rede não é o caminho principal; se ele some quando nada é irradiado pela antena, a RF chega pelo sistema irradiante, o quadro da interferência irradiada."),
    ext.tf(t, { kind: "cenario", level: 4, pitfall: "Achar que ROE baixa descarta outras causas de interferência.", ref: body("6.6", 16) },
      "Ao investigar uma interferência, verificar o filtro e o aterramento é dispensável se a ROE estiver próxima de 1:1.", false,
      "A Cartilha manda verificar cabos, conectores, filtro passa-baixa/passa-faixa e aterramento. Um bom casamento de impedância não elimina essas causas."),
    ext.mc(t, { kind: "conceitual", level: 2, pitfall: "Desconhecer o que motiva a fiscalização.", ref: body("7.3", 18) },
      "Qual destes fatos pode levar a uma fiscalização da Anatel?",
      ["Uma denúncia de interferência", "A participação em um conteste", "O uso do alfabeto fonético da UIT", "A operação em QRP"],
      "A Cartilha cita denúncia de interferência, identificação de emissão irregular e verificação de licenças, dados e conformidade técnica."),
  ];
}

function comunicadosExtra(): QuestionDraft[] {
  const t = "comunicados";
  return [
    ext.tf(t, { kind: "cenario", level: 2, pitfall: "Identificar só a própria estação no QSO.", ref: ato("10.3 III") },
      "Uma vez estabelecido o comunicado, basta mencionar o indicativo de chamada da própria estação, e não o da estação contatada.", false,
      "Devem ser mencionados os indicativos de ambas as estações. O Ato 3448/2026 (item 10.3, III) exige mencionar o indicativo das duas estações depois de estabelecida a comunicação."),
    ext.tf(t, { kind: "conceitual", level: 4, pitfall: "Achar que a Anatel define o significado de cada código Q.", ref: body("8.3", 20) },
      "A definição exata de cada código Q consta do Regulamento de Radiocomunicações da UIT, e não de norma própria da Anatel.", true,
      "A Cartilha explica que a norma brasileira define a faixa de códigos Q utilizável, mas o significado de cada código está no Regulamento de Radiocomunicações da UIT."),
    ext.tf(t, { kind: "cenario", level: 2, pitfall: "Chamar sem antes escutar.", ref: a1("7.2", 37) },
      "Antes de chamar, recomenda-se escutar a frequência e, no intervalo, anunciar-se com algo como 'bom dia de PY1..., na escuta'.", true,
      "É o procedimento descrito pela Cartilha: escutar, aguardar o intervalo e se identificar para os colegas."),
    ext.tf(t, { kind: "conceitual", level: 2, pitfall: "Desconhecer o que o APRS transmite.", ref: a3("11.3", 64) },
      "O APRS permite transmitir em tempo real dados como posição GPS, mensagens curtas e informações meteorológicas.", true,
      "É a descrição da Cartilha para o APRS, que usa principalmente o protocolo AX.25."),
    ext.tf(t, { kind: "cenario", level: 3, pitfall: "Achar que a ligação via internet dispensa licença.", ref: a3("11.3", 64) },
      "Uma pessoa sem licença de radioamador pode usar o Echolink livremente, já que a conversa trafega pela internet.", false,
      "A Cartilha diz que o Echolink exige licença válida e validação do usuário."),
  ];
}

function eticaExtra(): QuestionDraft[] {
  const t = "etica";
  return [
    ext.tf(t, { kind: "cenario", level: 3, pitfall: "Achar que se pode expulsar quem já usa a frequência.", ref: a1("7.2", 37) },
      "Encontrando a frequência ocupada por um QSO comum, o operador pode pedir que os colegas a liberem, já que todos têm o mesmo direito ao espectro.", false,
      "A Cartilha manda não 'expulsar' quem já está usando a frequência, exceto em emergência real. O correto é esperar ou procurar outra frequência."),
    ext.tf(t, { kind: "cenario", level: 4, pitfall: "Achar que o uso comercial é aceitável com operador habilitado.", ref: body("2.2", 6) },
      "Uma empresa pode usar uma estação de radioamador para coordenar suas entregas, desde que o operador seja habilitado.", false,
      "O radioamadorismo não existe para fins comerciais, publicidade ou 'rádio de empresa'. Ter COER não muda a finalidade do serviço."),
    ext.tf(t, { kind: "conceitual", level: 2, pitfall: "Achar que linguagem ofensiva é só falta de educação.", ref: ato("4.1") },
      "Ao radioamador é vedado usar palavras obscenas e ofensivas, assim como desvirtuar a natureza do serviço.", true,
      "É regra expressa do Ato 3448/2026, item 4.1."),
    ext.tf(t, { kind: "cenario", level: 3, pitfall: "Usar toda a potência disponível sem necessidade.", ref: body("5.6", 13) },
      "Usar 1 kW em um QSO local que funcionaria com 10 W contraria a boa prática de usar só a potência necessária.", true,
      "A Cartilha recomenda começar com potência baixa e aumentar só o necessário; potência além do necessário aumenta o risco de interferência e de 'tomar a faixa'."),
    ext.tf(t, { kind: "cenario", level: 3, pitfall: "Não reconhecer quando se é o alvo de um CQ dirigido.", ref: a1("7.5", 37) },
      "Uma estação em Portugal chama 'CQ América do Sul'. Um radioamador no Brasil pode respondê-la, pois é alvo dessa chamada.", true,
      "Em CQ direcionado, só responde quem é o alvo. O Brasil está na América do Sul, então o brasileiro é alvo da chamada."),
    ext.tf(t, { kind: "cenario", level: 3, pitfall: "Achar que serviços técnicos pagos podem ser anunciados.", ref: a1("7.8", 38) },
      "Anunciar em uma rodada os serviços de manutenção de rádios que o operador presta mediante pagamento é aceitável, por ser tema técnico.", false,
      "Negócios e mercantilização (publicidade, vendas etc.) estão entre os temas a evitar, mesmo quando o assunto é técnico."),
    ext.mc(t, { kind: "cenario", level: 3, pitfall: "Confundir atividades compatíveis com a finalidade do serviço.", ref: body("2.2", 6) },
      "Qual destas práticas é compatível com a finalidade do Serviço de Radioamador?",
      ["Experimentação técnica com antenas", "Anunciar produtos de uma loja", "Pedir votos para um candidato", "Simular uma emergência para testar os colegas"],
      "O serviço é voltado a aprendizado, experimentação técnica e comunicação entre radioamadores. Publicidade, propaganda política e trotes estão entre os temas a evitar."),
  ];
}

function emergenciasExtra(): QuestionDraft[] {
  const t = "emergencias";
  return [
    ext.tf(t, { kind: "conceitual", level: 2, pitfall: "Restringir a precedência a poucos tipos de situação.", ref: a2s("12", 53) },
      "Operações de busca e salvamento e de defesa civil estão entre as situações em que as comunicações de socorro têm precedência.", true,
      "A Cartilha cita emergência, calamidade pública, busca e salvamento e defesa civil."),
    ext.tf(t, { kind: "cenario", level: 3, pitfall: "Achar que reduzir a potência substitui liberar a frequência.", ref: a2s("12", 53) },
      "Durante uma calamidade pública, os demais operadores podem continuar seu QSO na frequência de socorro, desde que reduzam a potência.", false,
      "As comunicações de socorro têm precedência: os demais operadores devem liberar a frequência e colaborar."),
    ext.tf(t, { kind: "cenario", level: 3, pitfall: "Aplicar o limite de 10 minutos também à emergência.", ref: ato("10.3 V") },
      "Em emergência, uma transmissão entre estações pode exceder o limite de 10 minutos que vale para as comunicações comuns.", true,
      "O Ato 3448/2026 (item 10.3, V) limita a transmissão a 10 minutos, exceto nos casos de emergência."),
    ext.tf(t, { kind: "conceitual", level: 3, pitfall: "Achar que a repetidora sempre se desliga após 10 minutos.", ref: ato("10.5.4 I") },
      "Uma repetidora pode transmitir unilateralmente, sem restrição de tempo, em comunicação de emergência.", true,
      "O Ato 3448/2026 (item 10.5.4, I) lista a comunicação de emergência entre os casos de transmissão unilateral sem restrição de tempo."),
    ext.tf(t, { kind: "cenario", level: 3, pitfall: "Gerar tráfego desnecessário por curiosidade.", ref: a1("8.3", 38) },
      "Durante um tráfego de emergência, uma estação que não participa dele pode transmitir para perguntar o que está acontecendo, desde que seja breve.", false,
      "Perguntar por curiosidade é transmissão desnecessária. A Cartilha manda os outros operadores evitarem transmissões desnecessárias e ajudarem a manter a disciplina."),
    ext.mc(t, { kind: "cenario", level: 4, pitfall: "Achar que a emergência relaxa as regras de identificação.", ref: a2("13", 53, "10.2 e 10.3 IV") },
      "Durante um tráfego de emergência longo, como a estação deve se identificar?",
      ["Com o indicativo completo, no início, durante e no término das emissões", "Só no início, para economizar tempo", "Apenas com o sufixo, por ser mais rápido", "Não precisa se identificar enquanto durar a emergência"],
      "O indicativo é usado no início, durante e no término das emissões, sempre completo, e é vedada a operação sem identificação. Nenhuma dessas regras tem exceção para emergência."),
    ext.mc(t, { kind: "conceitual", level: 4, pitfall: "Estender a exceção de emergência a regras que não a têm.", ref: ato("10.2 e 10.3") },
      "Qual destas regras de operação admite exceção nos casos de emergência?",
      ["O limite de 10 minutos para a transmissão entre estações", "A proibição de operar sem identificação", "A declaração completa do indicativo de chamada", "O uso do Código Q limitado às séries QRA a QUZ"],
      "Só o limite de 10 minutos (Ato 3448/2026, item 10.3, V) traz exceção expressa para emergência. A identificação e o indicativo completo valem sempre."),
  ];
}

export function buildTeoQuestions(): QuestionDraft[] {
  return [
    ...estacao(),
    ...antenas(),
    ...frequencia(),
    ...propagacao(),
    ...interferencias(),
    ...comunicados(),
    ...etica(),
    ...emergencias(),
    // Expansion batch goes last so the first batch's IDs don't shift.
    ...estacaoExtra(),
    ...antenasExtra(),
    ...frequenciaExtra(),
    ...propagacaoExtra(),
    ...interferenciasExtra(),
    ...comunicadosExtra(),
    ...eticaExtra(),
    ...emergenciasExtra(),
  ];
}
