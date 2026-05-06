import {
  EXTRA_ADULT_RATE_PER_NIGHT,
  WEEKEND_SURCHARGE_RATE,
} from '../data/tariffRules.js'
import { MS_PER_DAY, isWeekendNight } from './date.js'

export function calculateNightlyRatesTotal(
  accommodation,
  checkInDate,
  nights,
  adults,
) {
  const extrasPerNight = Math.max(
    0,
    adults - accommodation.maxAdults,
  )

  return [...Array(nights)].reduce((sum, _, index) => {
    const nightDate = new Date(
      checkInDate.getTime() + index * MS_PER_DAY,
    )
    const weekendMultiplier = isWeekendNight(nightDate)
      ? 1 + WEEKEND_SURCHARGE_RATE
      : 1
    const baseNight = accommodation.dailyRate * weekendMultiplier
    const extrasNight = extrasPerNight * EXTRA_ADULT_RATE_PER_NIGHT
    return sum + baseNight + extrasNight
  }, 0)
}
