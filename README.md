# Calculadora de tarifário (Hospedin)

Mini-app em **React (JavaScript)** + **Vite** que simula o valor de uma reserva com base nas regras do desafio técnico.

## Como rodar

Requisitos: **Node.js** 18+ (recomendado 20+).

```bash
npm install
npm run dev
```

Abra o endereço indicado no terminal (geralmente `http://localhost:5173`).

Outros scripts:

```bash
npm run build   # build de produção em dist/
npm run preview # servidor estático da build
npm run lint    # ESLint
npm run test    # testes unitários (Vitest)
npm run test:watch  # Vitest em modo watch
```

## Regras implementadas

| Regra | Detalhe |
|--------|---------|
| **Suíte Jardim** | Diária R$ 300, mínimo 2 noites, limpeza R$ 80, até 2 adultos na capacidade base |
| **Chalé Família** | Diária R$ 450, mínimo 2 noites, limpeza R$ 100, até 4 adultos na capacidade base |
| **Adultos extras** | R$ 50,00 por adulto acima da capacidade **por noite** |
| **Fim de semana** | +20% na **diária base** de cada noite cujo dia de calendário é **sábado ou domingo** (adultos extras não recebem esse acréscimo) |
| **Longa estadia** | Mais de **7 noites** → **10% de desconto** sobre o subtotal (soma das diárias + taxa de limpeza), aplicado **uma vez** ao final |

### Decisões / trade-offs

1. **Datas em horário local** — Campos `type="date"` são interpretados como `yyyy-mm-dd` em **data local** (`parseISODateLocal`), evitando “voltar um dia” por UTC ao usar `new Date(string)` puro.
2. **Contagem de noites** — `(check-out − check-in) / 1 dia`, alinhado ao uso típico de reserva (ex.: segunda a quarta = 2 noites).
3. **Desconto longa estadia** — Interpretação de “mais de 7 noites” como **estritamente maior que 7** (a partir da 8ª noite). O desconto incide sobre **diárias + limpeza** por ser “no total”.
4. **Fim de semana** — O acréscimo de 20% aplica-se só ao valor da diária da acomodação naquela noite; a cobrança extra por adulto segue R$ 50 fixos por noite.
5. **Cálculo isolado** — Regras em funções puras pequenas (`validateReservation`, `calculateNights`, `calculateNightlyRatesTotal`, `calculateCleaningFee`, `calculateDiscount`) compostas por `calculateReservation` / `calculateTarifario()` em `src/utils/calculateTarifario.js`.
6. **Feedback ao calcular** — Pequeno atraso (~220 ms) no botão para simular feedback de processamento (opcional no desafio).

## Estrutura principal

```
src/
  data/
    accommodations.js     # Catálogo de acomodações
    tariffRules.js        # Constantes (extras, fim de semana, longa estadia)
    reservationErrors.js  # Mensagens de validação (texto + minimumStayError)
  utils/
    date.js                        # parseISODateLocal, isWeekendNight
    calculateNights.js
    calculateNightlyRatesTotal.js
    calculateCleaningFee.js
    calculateDiscount.js
    validateReservation.js
    calculateTarifario.js          # calculateReservation + alias calculateTarifario
    formatMoney.js
  components/
    ReservationForm.jsx
    ReservationSummary.jsx
    DateRangeFields.jsx
  pages/
    ReservationPage.jsx          # Estado do formulário + feedback (sem useEffect)
  App.jsx
tests/                    # Testes Vitest (imports com ../src/...)
  *.test.js
```