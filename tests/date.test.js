import { describe, expect, it } from 'vitest'
import { countNightTypes, parseISODateLocal } from '../src/utils/date.js'

describe('parseISODateLocal', () => {
  it('recognizes valid date in local calendar', () => {
    const d = parseISODateLocal('2026-06-01')
    expect(d).toBeInstanceOf(Date)
    expect(d.getFullYear()).toBe(2026)
    expect(d.getMonth()).toBe(5)
    expect(d.getDate()).toBe(1)
  })

  it('returns null for 31 February', () => {
    expect(parseISODateLocal('2026-02-31')).toBeNull()
  })

  it('returns null for empty or invalid string', () => {
    expect(parseISODateLocal('')).toBeNull()
    expect(parseISODateLocal(null)).toBeNull()
  })
})

describe('countNightTypes', () => {
  it('counts zero weekends in consecutive weekdays', () => {
    const checkIn = parseISODateLocal('2026-06-01')
    const { weekendNights, weekdayNights } = countNightTypes(checkIn, 2)
    expect(weekendNights).toBe(0)
    expect(weekdayNights).toBe(2)
  })

  it('counts Saturday and Sunday as weekends', () => {
    const checkIn = parseISODateLocal('2026-06-06')
    const { weekendNights, weekdayNights } = countNightTypes(checkIn, 2)
    expect(weekendNights).toBe(2)
    expect(weekdayNights).toBe(0)
  })
})
