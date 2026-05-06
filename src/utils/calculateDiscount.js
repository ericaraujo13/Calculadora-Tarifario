import {
  LONG_STAY_DISCOUNT_RATE,
  LONG_STAY_MIN_NIGHTS_FOR_DISCOUNT,
} from '../data/tariffRules.js'

export function calculateDiscount(subtotalBeforeDiscount, nights) {
  const applies = nights > LONG_STAY_MIN_NIGHTS_FOR_DISCOUNT
  const discountAmount = applies
    ? subtotalBeforeDiscount * LONG_STAY_DISCOUNT_RATE
    : 0
  return { discountAmount, applies }
}
