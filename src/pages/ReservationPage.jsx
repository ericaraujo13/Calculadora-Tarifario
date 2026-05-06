import { useEffect, useRef, useState } from 'react'
import { ACCOMMODATIONS } from '../data/accommodations.js'
import ReservationForm from '../components/ReservationForm.jsx'
import ReservationSummary from '../components/ReservationSummary.jsx'
import {
  LONG_STAY_DISCOUNT_RATE,
  LONG_STAY_MIN_NIGHTS_FOR_DISCOUNT,
  WEEKEND_SURCHARGE_RATE,
} from '../data/tariffRules.js'
import { calculateTarifario } from '../utils/calculateTarifario.js'

const ACCOMMODATION_LIST = Object.values(ACCOMMODATIONS)

const FEEDBACK_DELAY_MS = 220

function rulesFootnote(accommodation) {
  if (!accommodation) return ''
  const fdsPct = Math.round(WEEKEND_SURCHARGE_RATE * 100)
  const longPct = Math.round(LONG_STAY_DISCOUNT_RATE * 100)
  return (
    `Regras: fim de semana (sáb/dom) +${fdsPct}% na diária da noite; ` +
    `mais de ${LONG_STAY_MIN_NIGHTS_FOR_DISCOUNT} noites −${longPct}% no total; ` +
    `mínimo ${accommodation.minNights} noites para ${accommodation.name}.`
  )
}

export default function ReservationPage() {
  const [draft, setDraft] = useState(() => ({
    accommodationId: ACCOMMODATIONS.suite_jardim.id,
    checkIn: '',
    checkOut: '',
    adults: 2,
  }))
  const [pending, setPending] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const calcDelayRef = useRef(null)

  useEffect(() => {
    return () => {
      if (calcDelayRef.current != null) {
        window.clearTimeout(calcDelayRef.current)
      }
    }
  }, [])

  const selectedAccommodation = ACCOMMODATIONS[draft.accommodationId]
  const minNoitesLabel = rulesFootnote(selectedAccommodation)

  function handleSubmit(e) {
    e.preventDefault()
    const snapshot = { ...draft }
    setFeedback(null)
    setPending(true)

    if (calcDelayRef.current != null) {
      window.clearTimeout(calcDelayRef.current)
    }

    calcDelayRef.current = window.setTimeout(() => {
      calcDelayRef.current = null
      const adults = snapshot.adults === '' ? NaN : snapshot.adults

      const outcome = calculateTarifario({
        accommodationId: snapshot.accommodationId,
        checkIn: snapshot.checkIn,
        checkOut: snapshot.checkOut,
        adultos: adults,
      })

      setPending(false)

      if (!outcome.ok) {
        setFeedback({ kind: 'error', message: outcome.error })
        return
      }

      setFeedback({ kind: 'success', result: outcome })
    }, FEEDBACK_DELAY_MS)
  }

  const successResult =
    feedback?.kind === 'success' ? feedback.result : null

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Calculadora de tarifário
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Simule o valor da sua estadia.
        </p>
      </header>

      <section className="ui-card p-4 sm:p-5">
        <ReservationForm
          accommodationsList={ACCOMMODATION_LIST}
          draft={draft}
          onDraftChange={setDraft}
          onSubmit={handleSubmit}
          pending={pending}
        />
      </section>

      {feedback?.kind === 'error' ? (
        <div
          className="ui-alert-error"
          role="alert"
        >
          {feedback.message}
        </div>
      ) : null}

      {feedback?.kind === 'success' ? (
        <p
          className="ui-alert-success"
          role="status"
        >
          Cálculo concluído. Confira o resumo abaixo.
        </p>
      ) : null}

      <ReservationSummary
        result={successResult}
        minNoitesLabel={minNoitesLabel}
      />
    </div>
  )
}
