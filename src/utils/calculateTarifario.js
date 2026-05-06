import {
  EXTRA_ADULT_RATE_PER_NIGHT,
  WEEKEND_SURCHARGE_RATE,
} from '../data/tariffRules.js'
import { calculateCleaningFee } from './calculateCleaningFee.js'
import { calculateDiscount } from './calculateDiscount.js'
import { calculateNightlyRatesTotal } from './calculateNightlyRatesTotal.js'
import { countNightTypes } from './date.js'
import { validateReservation } from './validateReservation.js'

export { ACCOMMODATIONS } from '../data/accommodations.js'

export function calculateReservation(input) {
  const validated = validateReservation(input)
  if (!validated.ok) {
    return validated
  }

  const { accommodation, checkIn, nights, adults } = validated.value

  const { weekendNights, weekdayNights } = countNightTypes(checkIn, nights)
  const weekendSurchargeAmount =
    weekendNights * accommodation.dailyRate * WEEKEND_SURCHARGE_RATE

  const nightlyRatesTotal = calculateNightlyRatesTotal(
    accommodation,
    checkIn,
    nights,
    adults,
  )

  const extraAdultsCount = Math.max(
    0,
    adults - accommodation.maxAdults,
  )
  const extraAdultsAmount =
    extraAdultsCount * EXTRA_ADULT_RATE_PER_NIGHT * nights
  const accommodationNightlyAmount = nightlyRatesTotal - extraAdultsAmount

  const cleaningFee = calculateCleaningFee(accommodation)
  const subtotalBeforeDiscount = nightlyRatesTotal + cleaningFee

  const { discountAmount: longStayDiscountAmount, applies: longStayDiscountApplied } =
    calculateDiscount(subtotalBeforeDiscount, nights)

  const totalFinal = subtotalBeforeDiscount - longStayDiscountAmount

  return {
    ok: true,
    accommodationName: accommodation.name,
    accommodationDailyRate: accommodation.dailyRate,
    nights,
    weekdayNights,
    weekendNights,
    weekendSurchargeAmount,
    weekendSurchargePercent: Math.round(WEEKEND_SURCHARGE_RATE * 100),
    nightlyRatesTotal,
    accommodationNightlyAmount,
    extraAdultsCount,
    extraAdultsAmount,
    cleaningFee,
    subtotalBeforeDiscount,
    longStayDiscountAmount,
    totalFinal,
    longStayDiscountApplied,
  }
}

export const calculateTarifario = calculateReservation
