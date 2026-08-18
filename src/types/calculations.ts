import type { LessonDuration } from './lesson'

export const academicHoursFromMinutes = (
  minutes: LessonDuration,
): number => {
  if (minutes === 30) return 0.75
  if (minutes === 40) return 1
  return 1.5
}

export const salaryRatePerAcademicHour = 25