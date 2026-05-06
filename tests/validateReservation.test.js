import { describe, expect, it } from 'vitest'
import { RESERVATION_ERRORS } from '../src/data/reservationErrors.js'
import { validateReservation } from '../src/utils/validateReservation.js'

const suite = {
  accommodationId: 'suite_jardim',
  checkIn: '2026-06-01',
  checkOut: '2026-06-03',
  adults: 2,
}

describe('validateReservation', () => {
  it('accepts valid reservation', () => {
    const v = validateReservation(suite)
    expect(v.ok).toBe(true)
    expect(v.value.nights).toBe(2)
  })

  it('rejects check-out before check-in', () => {
    const v = validateReservation({
      ...suite,
      checkIn: '2026-06-10',
      checkOut: '2026-06-08',
    })
    expect(v.ok).toBe(false)
    expect(v.error).toBe(RESERVATION_ERRORS.checkOutNotAfterCheckIn)
  })

  it('rejects stay below minimum', () => {
    const v = validateReservation({
      ...suite,
      checkIn: '2026-06-01',
      checkOut: '2026-06-02',
    })
    expect(v.ok).toBe(false)
    expect(v.error).toContain('Estadia mínima')
  })

  it('rejects non-integer adults', () => {
    const v = validateReservation({ ...suite, adults: 2.5 })
    expect(v.ok).toBe(false)
    expect(v.error).toBe(RESERVATION_ERRORS.adultsNotInteger)
  })
})
