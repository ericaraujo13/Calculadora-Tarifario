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

  const { noitesFimDeSemana, noitesUteis } = countNightTypes(checkIn, nights)
  const valorAcrecimoFimDeSemana =
    noitesFimDeSemana * accommodation.dailyRate * WEEKEND_SURCHARGE_RATE

  const valorDiarias = calculateNightlyRatesTotal(
    accommodation,
    checkIn,
    nights,
    adults,
  )

  const adultosAcimaCapacidade = Math.max(
    0,
    adults - accommodation.maxAdults,
  )
  const valorAdultosExtras =
    adultosAcimaCapacidade * EXTRA_ADULT_RATE_PER_NIGHT * nights
  const valorDiariasAcomodacao = valorDiarias - valorAdultosExtras

  const taxaLimpeza = calculateCleaningFee(accommodation)
  const subtotalBeforeDiscount = valorDiarias + taxaLimpeza

  const { discountAmount: longStayDiscountAmount, applies: aplicouDescontoLongaEstadia } =
    calculateDiscount(subtotalBeforeDiscount, nights)

  const totalFinal = subtotalBeforeDiscount - longStayDiscountAmount

  return {
    ok: true,
    accommodationName: accommodation.name,
    diariaCadastro: accommodation.dailyRate,
    nights,
    noitesUteis,
    noitesFimDeSemana,
    valorAcrecimoFimDeSemana,
    percentualFimDeSemana: Math.round(WEEKEND_SURCHARGE_RATE * 100),
    valorDiarias,
    valorDiariasAcomodacao,
    adultosAcimaCapacidade,
    valorAdultosExtras,
    taxaLimpeza,
    subtotalBeforeDiscount,
    longStayDiscountAmount,
    totalFinal,
    aplicouDescontoLongaEstadia,
  }
}

export const calculateTarifario = calculateReservation
