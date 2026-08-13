export type LessonDuration = 30 | 40 | 60


export type LessonStudent = {
  studentId: string
  attended: boolean
}


export type Student = {
  id: string
  name: string
  school: string
  grade: string
  notes: string
  age?: number
  books?: string
  contact?: string
}


export type Lesson = {
  id: string
  title: string
  date: string
  startTime: string
  plannedDuration: LessonDuration
  actualDurationMinutes: LessonDuration | null
  students: LessonStudent[]
  completed: boolean
  notes: string
  recurrenceId?: string | null
}


export const academicHoursFromMinutes = (
  minutes: LessonDuration,
): number => {
  if (minutes === 30) return 0.75
  if (minutes === 40) return 1
  return 1.5
}


export const salaryRatePerAcademicHour = 25