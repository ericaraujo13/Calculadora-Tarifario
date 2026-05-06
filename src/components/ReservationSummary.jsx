import { EXTRA_ADULT_RATE_PER_NIGHT } from '../data/tariffRules.js'
import { formatMoney } from '../utils/formatMoney.js'

function WeekendHintInline({ result }) {
  if (result.weekendNights <= 0) return null
  return (
    <span className="ui-hint-inline-muted">
      +{result.weekendSurchargePercent}% em {result.weekendNights} noite(s) de
      fim de semana
    </span>
  )
}

function MoneyWithWeekendHint({ amount, result }) {
  const hasWeekendSurcharge = result.weekendNights > 0

  return (
    <div className="ui-value-stack">
      <div className="ui-value-line">
        <span className="tabular-nums">{formatMoney(amount)}</span>
      </div>
      {hasWeekendSurcharge ? (
        <p className="ui-hint-below-muted">
          <WeekendHintInline result={result} />
        </p>
      ) : null}
    </div>  
  )
}

function MoneyWithExtrasHint({ amount, result }) {
  const n = result.extraAdultsCount
  const extraAdultsLabel =
    n === 1 ? '1 adulto extra' : `${n} adultos extras`

  return (
    <div className="ui-value-stack">
      <div className="ui-value-line">
        <span className="tabular-nums">{formatMoney(amount)}</span>
        <span className="ui-hint-inline-muted">
          ({extraAdultsLabel} × {formatMoney(EXTRA_ADULT_RATE_PER_NIGHT)} ×{' '}
          {result.nights} diárias)
        </span>
      </div>
    </div>
  )
}

function NightlyRatesPanel({ result }) {
  const { nightlyRatesTotal, accommodationNightlyAmount, extraAdultsAmount } = result

  return (
    <div className="w-full max-w-sm">
      <table className="w-full border-collapse text-sm">
        <tbody>
          <tr>
            <th
              scope="row"
              className="py-1.5 pr-3 text-left font-medium text-slate-600 dark:text-slate-300"
            >
              Diárias da acomodação
            </th>
            <td className="whitespace-nowrap py-1.5 text-right tabular-nums">
              {formatMoney(accommodationNightlyAmount)}
            </td>
          </tr>
          <tr>
            <th
              scope="row"
              className="py-1.5 pr-3 text-left font-medium text-slate-600 dark:text-slate-300"
            >
              Adultos extras
            </th>
            <td className="whitespace-nowrap py-1.5 text-right tabular-nums">
              {formatMoney(extraAdultsAmount)}
            </td>
          </tr>
          <tr className="border-t border-slate-200 dark:border-slate-700">
            <th
              scope="row"
              className="pt-2 pr-3 text-left font-semibold text-slate-900 dark:text-slate-100"
            >
              Total
            </th>
            <td className="whitespace-nowrap pt-2 text-right font-semibold tabular-nums text-slate-900 dark:text-slate-100">
              {formatMoney(nightlyRatesTotal)}
            </td>
          </tr>
        </tbody>
      </table>
      {result.weekendNights > 0 ? (
        <p className="ui-hint-below-muted mt-2 max-w-none">
          O +{result.weekendSurchargePercent}% em sábados e domingos incide só sobre
          a diária da acomodação (já refletido na primeira linha).
        </p>
      ) : null}
    </div>
  )
}

export default function ReservationSummary({ result, minNightsLabel }) {
  if (!result?.ok) return null

  const hasExtras = result.extraAdultsCount > 0

  return (
    <section
      className="ui-card"
      aria-live="polite"
    >
      <h2 className="ui-card-title">Resumo da estadia</h2>
      <dl className="mt-4 space-y-3">
        <div className="ui-row">
          <dt className="ui-row-label">Acomodação</dt>
          <dd className="ui-row-value">{result.accommodationName}</dd>
        </div>
        <div className="ui-row">
          <dt className="ui-row-label">Noites</dt>
          <dd className="ui-row-value tabular-nums">{result.nights}</dd>
        </div>
        <div className="ui-row">
          <dt className="ui-row-label-muted">Diária da acomodação</dt>
          <dd className="ui-row-value-muted">{formatMoney(result.accommodationDailyRate)}</dd>
        </div>

        {hasExtras ? (
          <div className="ui-panel">
            <p className="ui-panel-heading">Valores das diárias</p>
            <div className="mt-3 space-y-3">
              <div className="flex items-start justify-between gap-6 text-sm">
                <dt className="text-slate-600 dark:text-slate-300">
                  Diárias da acomodação
                </dt>
                <dd>
                  <MoneyWithWeekendHint
                    amount={result.accommodationNightlyAmount}
                    result={result}
                  />
                </dd>
              </div>
              <div className="flex items-start justify-between gap-6 text-sm">
                <dt className="text-slate-600 dark:text-slate-300">
                  Adultos extras
                </dt>
                <dd>
                  <MoneyWithExtrasHint
                    amount={result.extraAdultsAmount}
                    result={result}
                  />
                </dd>
              </div>
              <div className="ui-divider-dashed">
                <div className="flex items-start justify-between gap-6 text-sm">
                  <dt className="text-slate-700 dark:text-slate-200">
                    Total em diárias
                  </dt>
                  <dd>
                    <NightlyRatesPanel result={result} />
                  </dd>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="ui-row">
            <dt className="ui-row-label">Valor das diárias</dt>
            <dd>
              <MoneyWithWeekendHint
                amount={result.nightlyRatesTotal}
                result={result}
              />
            </dd>
          </div>
        )}

        <div className="ui-row">
          <dt className="ui-row-label">Taxa de limpeza</dt>
          <dd className="ui-row-value tabular-nums">{formatMoney(result.cleaningFee)}</dd>
        </div>
        {result.longStayDiscountApplied ? (
          <div className="ui-row">
            <dt className="ui-row-label-muted">Subtotal antes do desconto</dt>
            <dd className="ui-row-value-muted">{formatMoney(result.subtotalBeforeDiscount)}</dd>
          </div>
        ) : null}
        {result.longStayDiscountApplied ? (
          <div className="ui-row">
            <dt className="ui-row-label">Desconto longa estadia (10%)</dt>
            <dd className="text-right font-medium tabular-nums text-teal-700 dark:text-teal-300">
              − {formatMoney(result.longStayDiscountAmount)}
            </dd>
          </div>
        ) : null}
        <div className="ui-total-final-row">
          <dt className="ui-total-final-label">Total final</dt>
          <dd className="ui-total-final-value">{formatMoney(result.totalFinal)}</dd>
        </div>
      </dl>
      <p className="ui-footnote">{minNightsLabel}</p>
    </section>
  )
}
