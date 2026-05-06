export const MS_PER_DAY = 24 * 60 * 60 * 1000

export function parseISODateLocal(iso) {
  if (!iso || typeof iso !== 'string') return null
  const parts = iso.split('-').map(Number)
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null
  const [y, m, d] = parts
  const date = new Date(y, m - 1, d)
  if (
    date.getFullYear() !== y ||
    date.getMonth() !== m - 1 ||
    date.getDate() !== d
  ) {
    return null
  }
  return date
}

export function isWeekendNight(date) {
  const dow = date.getDay()
  return dow === 0 || dow === 6
}

export function countNightTypes(checkInDate, nights) {
  let noitesFimDeSemana = 0
  for (let i = 0; i < nights; i++) {
    const d = new Date(checkInDate.getTime() + i * MS_PER_DAY)
    if (isWeekendNight(d)) noitesFimDeSemana++
  }
  return {
    noitesFimDeSemana,
    noitesUteis: nights - noitesFimDeSemana,
  }
}

