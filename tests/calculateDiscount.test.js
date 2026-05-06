import { describe, expect, it } from 'vitest'
import { calculateDiscount } from '../src/utils/calculateDiscount.js'

describe('calculateDiscount (Long Stay Discount)', () => {
  it('does not apply discount with 7 nights or less', () => {
    const a = calculateDiscount(1000, 7)
    expect(a.applies).toBe(false)
    expect(a.discountAmount).toBe(0)
  })

  it('applies 10% with more than 7 nights', () => {
    const a = calculateDiscount(1000, 8)
    expect(a.applies).toBe(true)
    expect(a.discountAmount).toBe(100)
  })
})
