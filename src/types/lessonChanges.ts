import type {
  LessonDuration,
  LessonStudent,
} from './lesson'

export type LessonChanges = {
  title: string
  date: string
  startTime: string
  plannedDuration: LessonDuration
  actualDurationMinutes: LessonDuration | null
  students: LessonStudent[]
  notes: string
  completed: boolean

  repeatWeekly: boolean
  repeatWeeks: number
}