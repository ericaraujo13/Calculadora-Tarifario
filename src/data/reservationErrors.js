export const RESERVATION_ERRORS = {
  invalidAccommodation: 'Selecione uma acomodação válida.',
  datesRequired: 'Informe check-in e check-out.',
  adultsInvalid: 'Informe um número válido de adultos (mínimo 1).',
  adultsNotInteger: 'O número de adultos deve ser um valor inteiro.',
  datesInvalid:
    'Datas inválidas. Use o formato do calendário ou verifique os valores.',
  checkOutNotAfterCheckIn:
    'Período inválido: a data de check-out deve ser posterior ao check-in.',
}

export function minimumStayError(minNoites, accommodationName, nights) {
  return `Estadia mínima de ${minNoites} noites para ${accommodationName}. O período selecionado tem ${nights} noite(s).`
}
