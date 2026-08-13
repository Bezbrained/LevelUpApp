import type { LessonDuration } from './index'

export type LessonChanges = {
  title: string
  date: string
  startTime: string
  plannedDuration: LessonDuration
  actualDurationMinutes: LessonDuration | null

  students: {
    studentId: string
    attended: boolean
  }[]

  notes: string
  completed: boolean

  repeatWeekly: boolean
  repeatWeeks: number
  recurrenceId?: string | null
}