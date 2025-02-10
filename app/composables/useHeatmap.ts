import { format, isThisYear, subDays } from 'date-fns'

export function generateWeeks(daysCount = 49): Week[] {
  const days: Day[] = Array.from({ length: daysCount }, (_, i) => {
    const date = subDays(new Date(), daysCount - 1 - i)
    return { date: format(date, 'yyyy-MM-dd') }
  })

  const weeks: Week[] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  return weeks
}
