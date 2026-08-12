import type {
  Lesson,
  LessonDuration,
} from '../data/mockData'


export const defaultSalaryRates = {
  1: 460,
  2: 540,
  3: 600,
  4: 700,
  5: 800,
} as const



export function getDurationMultiplier(
  duration: LessonDuration,
) {
  if (duration === 30) return 0.75
  if (duration === 40) return 1
  if (duration === 60) return 1.5

  return 1
}



export function getAttendedStudentCount(
  lesson: Lesson,
) {
  return lesson.students.filter(
    student =>
      student.attended,
  ).length
}



export function getLessonSalary(
  lesson: Lesson,
  salaryRates = defaultSalaryRates,
) {
  /*
   * Only completed lessons count.
   * Planned lessons have no salary.
   */

  if (!lesson.completed) {
    return 0
  }


  const attendedCount =
    getAttendedStudentCount(
      lesson,
    )


  if (attendedCount === 0) {
    return 0
  }


  /*
   * If later more than 5 students
   * are allowed, admin settings
   * can replace this.
   */

  const baseRate =
    salaryRates[
      attendedCount as keyof typeof salaryRates
    ]


  if (!baseRate) {
    return 0
  }


  const multiplier =
    getDurationMultiplier(
      lesson.actualDurationMinutes ??
        lesson.plannedDuration,
    )


  return Math.round(
    baseRate * multiplier,
  )
}



export function getWeekRange(
  date: Date,
) {
  const day =
    date.getDay()


  const diff =
    day === 0
      ? -6
      : 1 - day


  const monday =
    new Date(date)


  monday.setDate(
    date.getDate() + diff,
  )


  monday.setHours(
    0,
    0,
    0,
    0,
  )


  const sunday =
    new Date(monday)


  sunday.setDate(
    monday.getDate() + 6,
  )


  sunday.setHours(
    23,
    59,
    59,
    999,
  )


  return {
    monday,
    sunday,
  }
}



export function isLessonInWeek(
  lesson: Lesson,
  monday: Date,
  sunday: Date,
) {
  const lessonDate =
    new Date(lesson.date)


  return (
    lessonDate >= monday &&
    lessonDate <= sunday
  )
}



export function getWeeklySalary(
  lessons: Lesson[],
  weekDate: Date,
) {
  const {
    monday,
    sunday,
  } = getWeekRange(
    weekDate,
  )


  return lessons
    .filter(
      lesson =>
        isLessonInWeek(
          lesson,
          monday,
          sunday,
        ),
    )
    .reduce(
      (total, lesson) =>
        total +
        getLessonSalary(
          lesson,
        ),
      0,
    )
}