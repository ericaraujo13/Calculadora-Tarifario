import { describe, expect, it } from 'vitest'
import { ACCOMMODATIONS } from '../src/data/accommodations.js'
import { calculateTarifario } from '../src/utils/calculateTarifario.js'

describe('calculateTarifario', () => {
  it('two useful nights in the Suite: 600 + 80', () => {
    const r = calculateTarifario({
      accommodationId: 'suite_jardim',
      checkIn: '2026-06-01',
      checkOut: '2026-06-03',
      adults: 2,
    })
    expect(r.ok).toBe(true)
    expect(r.nightlyRatesTotal).toBe(600)
    expect(r.cleaningFee).toBe(80)
    expect(r.totalFinal).toBe(680)
    expect(r.weekendNights).toBe(0)
  })

  it('weekend in the Suite: 360+360 + 80', () => {
    const r = calculateTarifario({
      accommodationId: 'suite_jardim',
      checkIn: '2026-06-06',
      checkOut: '2026-06-08',
      adults: 2,
    })
    expect(r.ok).toBe(true)
    expect(r.nightlyRatesTotal).toBe(720)
    expect(r.totalFinal).toBe(800)
    expect(r.weekendNights).toBe(2)
  })

  it('extra adults in the Suite', () => {
    const r = calculateTarifario({
      accommodationId: 'suite_jardim',
      checkIn: '2026-06-01',
      checkOut: '2026-06-03',
      adults: 3,
    })
    expect(r.ok).toBe(true)
    expect(r.extraAdultsCount).toBe(1)
    expect(r.extraAdultsAmount).toBe(100)
    expect(r.accommodationNightlyAmount).toBe(600)
    expect(r.nightlyRatesTotal).toBe(700)
    expect(r.totalFinal).toBe(780)
  })

  it('long stay in the Chalé: 8 nights with 10% discount', () => {
    const r = calculateTarifario({
      accommodationId: 'chale_familia',
      checkIn: '2026-06-01',
      checkOut: '2026-06-09',
      adults: 2,
    })
    expect(r.ok).toBe(true)
    expect(r.nights).toBe(8)
    expect(r.longStayDiscountApplied).toBe(true)
    expect(r.nightlyRatesTotal).toBe(3780)
    expect(r.cleaningFee).toBe(100)
    expect(r.subtotalBeforeDiscount).toBe(3880)
    expect(r.longStayDiscountAmount).toBe(388)
    expect(r.totalFinal).toBe(3492)
  })

  it('returns error equal to validation when invalid period', () => {
    const r = calculateTarifario({
      accommodationId: 'suite_jardim',
      checkIn: '2026-06-10',
      checkOut: '2026-06-05',
      adults: 2,
    })
    expect(r.ok).toBe(false)
    expect(r.error).toBeDefined()
  })
})

describe('accommodationDailyRate vs ACCOMMODATIONS.dailyRate', () => {
  it('exposes accommodationDailyRate aligned with accommodation dailyRate', () => {
    const r = calculateTarifario({
      accommodationId: 'chale_familia',
      checkIn: '2026-06-01',
      checkOut: '2026-06-03',
      adults: 2,
    })
    expect(r.ok).toBe(true)
    expect(r.accommodationDailyRate).toBe(ACCOMMODATIONS.chale_familia.dailyRate)
    expect(r.accommodationName).toBe('Chalé Família')
  })
})
