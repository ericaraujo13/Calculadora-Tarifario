import { MS_PER_DAY } from './date.js'

export function calculateNights(checkIn, checkOut) {
  return Math.round((checkOut - checkIn) / MS_PER_DAY)
}
