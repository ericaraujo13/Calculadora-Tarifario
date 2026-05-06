import { ACCOMMODATIONS } from '../data/accommodations.js'
import DateRangeFields from './DateRangeFields.jsx'
import { EXTRA_ADULT_RATE_PER_NIGHT } from '../data/tariffRules.js'
import { formatMoney } from '../utils/formatMoney.js'

export default function ReservationForm({
  accommodationsList,
  draft,
  onDraftChange,
  onSubmit,
  pending,
}) {
  function patchDraft(partial) {
    onDraftChange((prev) => ({ ...prev, ...partial }))
  }

  const selectedAcc = ACCOMMODATIONS[draft.accommodationId]
  const adultsNum = draft.adults === '' ? NaN : Number(draft.adults)
  const adultosExtrasPreview =
    Number.isFinite(adultsNum) && selectedAcc
      ? Math.max(0, adultsNum - selectedAcc.maxAdults)
      : 0

  return (
    <form className="ui-form" onSubmit={onSubmit} noValidate>
      <label className="ui-field">
        <span className="ui-label">Acomodação</span>
        <select
          className="ui-control"
          value={draft.accommodationId}
          onChange={(e) =>
            patchDraft({ accommodationId: e.target.value })
          }
          aria-describedby="cap-hint"
        >
          {accommodationsList.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name} — até {a.maxAdults} adulto(s)
            </option>
          ))}
        </select>
        <span
          id="cap-hint"
          className="ui-hint"
        >
          Adultos acima da capacidade: {formatMoney(EXTRA_ADULT_RATE_PER_NIGHT)}{' '}
          por adulto extra por noite.
        </span>
      </label>

      <DateRangeFields
        checkIn={draft.checkIn}
        checkOut={draft.checkOut}
        onCheckInChange={(v) => patchDraft({ checkIn: v })}
        onCheckOutChange={(v) => patchDraft({ checkOut: v })}
      />

      <label className="ui-field">
        <span className="ui-label">Número de adultos</span>
        <input
          className="ui-control"
          type="number"
          min={1}
          step={1}
          value={draft.adults === '' ? '' : draft.adults}
          aria-describedby={
            adultosExtrasPreview > 0 ? 'extras-preview-hint' : undefined
          }
          onChange={(e) =>
            patchDraft({
              adults:
                e.target.value === '' ? '' : Number(e.target.value),
            })
          }
        />
        {adultosExtrasPreview > 0 ? (
          <span
            id="extras-preview-hint"
            className="ui-hint"
          >
            Serão cobrados {adultosExtrasPreview} adulto(s) extra(s):{' '}
            {formatMoney(EXTRA_ADULT_RATE_PER_NIGHT)} por noite cada (entra no
            total das diárias).
          </span>
        ) : null}
      </label>

      <div className="pt-4">
        <button
          type="submit"
          className="ui-button-primary"
          disabled={pending}
        >
          {pending ? 'Calculando…' : 'Calcular valor da estadia'}
        </button>
      </div>
    </form>
  )
}
