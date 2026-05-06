import { ACCOMMODATIONS } from '../data/accommodations.js'
import {
  RESERVATION_ERRORS,
  minimumStayError,
} from '../data/reservationErrors.js'
import { parseISODateLocal } from './date.js'
import { calculateNights } from './calculateNights.js'

export function validateReservation({
  accommodationId,
  checkIn,
  checkOut,
  adults,
}) {
  const accommodation = ACCOMMODATIONS[accommodationId]
  if (!accommodation) {
    return { ok: false, error: RESERVATION_ERRORS.invalidAccommodation }
  }

  const checkInStr = String(checkIn ?? '').trim()
  const checkOutStr = String(checkOut ?? '').trim()
  if (!checkInStr || !checkOutStr) {
    return { ok: false, error: RESERVATION_ERRORS.datesRequired }
  }

  const adultsNum = Number(adults)
  if (!Number.isFinite(adultsNum) || adultsNum < 1) {
    return {
      ok: false,
      error: RESERVATION_ERRORS.adultsInvalid,
    }
  }

  if (!Number.isInteger(adultsNum)) {
    return {
      ok: false,
      error: RESERVATION_ERRORS.adultsNotInteger,
    }
  }

  const start = parseISODateLocal(checkInStr)
  const end = parseISODateLocal(checkOutStr)

  if (!start || !end) {
    return {
      ok: false,
      error: RESERVATION_ERRORS.datesInvalid,
    }
  }

  if (end <= start) {
    return {
      ok: false,
      error: RESERVATION_ERRORS.checkOutNotAfterCheckIn,
    }
  }

  const nights = calculateNights(start, end)

  if (nights < accommodation.minNights) {
    return {
      ok: false,
      error: minimumStayError(
        accommodation.minNights,
        accommodation.name,
        nights,
      ),
    }
  }

  return {
    ok: true,
    value: {
      accommodation,
      checkIn: start,
      checkOut: end,
      nights,
      adults: adultsNum,
    },
  }
}
