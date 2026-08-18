export type LessonDuration = 30 | 40 | 60

export type LessonStudent = {
  studentId: string
  attended: boolean
}

export type Lesson = {
  id: string
    teacherId?: string|null
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