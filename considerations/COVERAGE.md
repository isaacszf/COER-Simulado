# COVERAGE — ementa vs bank (TEO, ELE)

> Status: mapped **2026-10-21**, after the exam-fidelity cleanup (`BRAINSTORM.md` §4–§5). Scope: TEO and ELE. LEG is not mapped yet.
> Sources: the Ato nº 3448/2026 text, item 11.4 (local copy in `gov/`), and the Cartilha versão 2026-06 (official attachment URL, `SUBJECTS-SURVEY.md` §5.1).
> Counts come from each item's `sourceRef`. The Cartilha section → ementa point mapping is by hand. Re-run the counts after any bank change; they go stale.

## How to read this

The Ato lists the ementa per subject. The Cartilha teaches it:
- **Anexo 1** covers TEO, and also the frequency and modulation basics that ELE reuses.
- **Anexo 3** covers electronics for **all three classes together**, with no class markers.

So for ELE the class boundary has to come from the Ato. Anything the Ato lists only for Classe B or A is out of scope for a Classe C bank, even though Anexo 3 teaches it.

| Anexo 3 section | Classe in the Ato | In the bank? |
| --- | --- | --- |
| §1.1–1.3 Ohm, power | C (eletrônica básica) | yes |
| §1.5 Kirchhoff | B (circuitos elétricos) | no |
| §2.1, 2.4 (function), 2.6, 2.7 resistors, capacitors, diodes, transistors | C (funções de componentes) | yes |
| §2.2 colour code, §2.3 series/parallel | B | no |
| §2.4 (capacitance), §2.5 inductance, §2.8 materials | B (teoria de circuitos CA, propriedades dos materiais) | **cut 2026-10-21** (3 items) |
| §3 electric and magnetic fields | B | no |
| §4.1 frequency, period, amplitude | B (ondulatória) | frequency and period only; Anexo 1 §3.1 teaches them for everyone |
| §5 CA circuits, impedance, reactance | B / A | **cut 2026-10-21** (1 item, impedance matching) |
| §6 protection, §7 measurement | C | yes |
| §8.2 polarization and antenna types | B (teoria de antenas, polarização) | **cut 2026-10-21** in ELE (2 items) and TEO (2 polarization items); TEO keeps one Yagi-element item, as an antenna type |
| §9 propagation phenomena | B / A | no |
| §10 RF electronics | A (eletrônica de RF) | **cut** the ponto Q item; two component-function items (diode detector, transistor gain) remain, see notes |
| §11.2 ASK/FSK/PSK | B | no; 3 general "digital vs analog" items stay under telecom (noções de modulação) |

## TEO — Técnica e Ética Operacional (186 items)

| Ementa point (Ato 11.4) | Cartilha sections | Items |
| --- | --- | ---: |
| **Estação:** block diagrams of RX, TX, transceptor, repeater | A1 §1.2 (repeater diagram), §3.4 (AM/FM diagrams) | 5 |
| Estação: station function, repeater use, shift, lines, station measurements (Cartilha only) | A1 §1.1–1.5, corpo §6.5 | 16 |
| **Antenas:** directional antennas | A1 §2.3 | 5 |
| Antenas: types and characteristics | A1 §2.1–2.2, A3 §8.2 (Yagi elements), corpo §5.6 | 13 |
| Antenas: dummy load | A1 §2.5 | 3 |
| Antenas: SNR | A1 §4.7 | 6 |
| Antenas: standing waves / ROE | A1 §2.4 | 8 |
| **Frequência:** audio frequencies, bands and wavelengths | A1 §3.1–3.2 | 18 |
| Frequência: beat frequencies | A1 §3.6 | 4 |
| Frequência: modulation, demodulation, frequency counter (Cartilha only) | A1 §3.3–3.5, §3.7 | 8 |
| **Propagação:** ground and sky waves | A1 §4.2 | 4 |
| Propagação: atmospheric layers | A1 §4.3 | 4 |
| Propagação: by band, VLF to SHF | A1 §4.4–4.6 | 16 |
| **Interferências:** detect and avoid | A1 §5.2–5.3, corpo §6.6, §7.2–7.3, §8.1 | 19 |
| **Comunicados:** setting up a contact in each mode | A1 §6.1, §7.2, §7.4, Ato item 10.3, A3 §11.3 (APRS, Echolink) | 6 |
| Comunicados: ITU phonetic alphabet | A1 §6.2 | 3 |
| Comunicados: Código Q | A1 §6.3, corpo §8.3 | 8 |
| Comunicados: QSL (Cartilha only) | A1 §6.4 | 1 |
| **Ética** | A1 §7.2–7.9, corpo §2.2, §5.6, A2 §13, Ato item 4.1 | 24 |
| **Emergências** | A1 §8.1–8.4, A2 §4.4, §12–13, Ato items 10.2–10.5 | 15 |

Notes:
- **Block diagrams were the gap.** They are the only thing the ementa names under Estação, but after the cleanup only one item tested them. Four function-level items were added (repeater demodulates and re-modulates, CAG acts on the RF stages, the FM discriminator demodulates, where FM modulation happens). They were checked against the diagram images on Cartilha pp. 26, 30 and 31. Questions about which box follows which stay out.
- **SNR sits under Antenas**, as the ementa lists it. All six SNR items were retagged from `propagacao`.
- **Cartilha sections with no items:** A1 §4.1 (transmission media), §5.1 (interference principle), §6.5 (contests and QRP), §7.1 (main rule). None is worth an item at Classe C depth.
- **Emergências is at 8.1%**, just above the 8% floor. Cutting from it needs a replacement.

## ELE — Conhecimentos Básicos de Eletrônica e Eletricidade (144 items)

| Ementa point (Ato 11.4, Classe C) | Cartilha sections | Items |
| --- | --- | ---: |
| **Eletrônica básica:** Ohm's law, R, V, I and power | A3 §1.1–1.3 | 21 |
| Eletrônica básica: component functions and uses | A3 §2.1, §2.4 (function), §2.6–2.7 | 12 |
| **Eletromagnetismo básico:** spectrum, frequency and wavelength | A1 §3.1–3.2, A3 §4.1 (frequency and period) | 27 |
| **Proteção:** fuses and breakers | A3 §6.1–6.4, §1.3 (sizing) | 14 |
| Proteção: grounding | A3 §6.5 | 6 |
| **Medição:** multimeter (V, I, R) | A3 §7.2–7.5, §1.2–1.3 | 18 |
| Medição: wattmeter | A3 §7.6 | 7 |
| Medição: SWR meter | A3 §7.7 | 4 |
| **Estação:** function of RX, TX, transceptor, repeater; block diagrams | A1 §1.1–1.2, §3.4, §3.6, A3 §10.1–10.2 | 7 |
| Estação: antennas and transmission lines | A1 §1.4, §2.1–2.2, §2.4 | 7 |
| Estação: station power supply (Cartilha only) | A3 §1.3 | 3 |
| **Telecomunicações:** modulation and demodulation | A1 §3.3–3.5, A3 §4.3, §11.2 | 13 |
| Telecomunicações: propagation | A1 §4.4, §4.6 | 5 |

Notes:
- **The Classe B/A cut** (7 items) is listed in the boundary table above.
- **ELE-104 and ELE-105** cite A3 §10, which the Ato places in Classe A (eletrônica de RF). They stay because their content is component function (a diode as detector, a transistor as gain stage), which is Classe C. Their `sourceRef` could point to A3 §2.6–2.7 instead.
- **Transceptor** has no ELE item of its own. TEO-001 covers the definition. ELE has no thin point that needs new items.
