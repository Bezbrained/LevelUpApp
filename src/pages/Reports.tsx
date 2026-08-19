import { useMemo, useState } from 'react'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

import type {
  Student,
  Teacher,
} from '../types'

import type {
  Lesson,
} from '../types'


type ReportsProps = {
  lessons: Lesson[]
  students: Student[]
   teacher: Teacher
}


function formatDate(date: Date) {
  const year = date.getFullYear()

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, '0')

  const day = String(
    date.getDate(),
  ).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function getWeekStart(date: Date) {
  const result = new Date(date)

  const day = result.getDay()

  const diff =
    day === 0
      ? -6
      : 1 - day

  result.setDate(
    result.getDate() + diff,
  )

  result.setHours(0, 0, 0, 0)

  return result
}


function addDays(
  date: Date,
  amount: number,
) {
  const result = new Date(date)

  result.setDate(
    result.getDate() + amount,
  )

  return result
}


function formatDay(date: Date) {
  return date.toLocaleDateString(
    'en-US',
    {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    },
  )
}


function durationMultiplier(
  minutes: number,
) {
  if (minutes === 30) return 0.75

  if (minutes === 40) return 1

  if (minutes === 60) return 1.5

  return 1
}


function getSalary(
  lesson: Lesson,
   teacher: Teacher,
) {
  const attended =
    lesson.students.filter(
      student =>
        student.attended,
    ).length

  if (attended === 0) {
    return 0
  }

  let rate: number

  if (attended === 1) {
    rate = teacher.rate1Student
  } else if (attended === 2) {
    rate = teacher.rate2Students
  } else if (attended === 3) {
    rate = teacher.rate3Students
  } else if (attended === 4) {
    rate = teacher.rate4Students
  } else {
    rate = teacher.rate5PlusStudents
  }

  return (
    rate *
    durationMultiplier(
      lesson.plannedDuration,
    )
  )
}

function getLessonType(
  lesson: Lesson,
) {
  const count =
    lesson.students.length


  if (count >= 3) {
    return 'Group'
  }

  if (count === 2) {
    return 'Pair'
  }

  return 'Individual'
}

function getLessonColor(
  lesson: Lesson,
) {
  const attended =
    lesson.students.filter(
      student =>
        student.attended,
    ).length

  if (attended === 1) {
    return 'border-green-500/30 bg-green-500/10'
  }

  if (attended === 2) {
    return 'border-yellow-500/30 bg-yellow-500/10'
  }

  if (attended === 3) {
    return 'border-purple-500/30 bg-purple-500/10'
  }

  if (attended === 4) {
    return 'border-sky-400/30 bg-sky-400/10'
  }

  if (attended >= 5) {
    return 'border-blue-500/30 bg-blue-500/10'
  }

  return 'border-zinc-800 bg-zinc-950'
}

function Reports({
  lessons,
  students,
  teacher,
}: ReportsProps) {
  const [weekStart, setWeekStart] =
    useState(
      getWeekStart(
        new Date(),
      ),
    )


  const [expandedDays, setExpandedDays] =
    useState<
      Record<string, boolean>
    >({})


  const weekDays =
    useMemo(() => {
      return Array.from(
        {
          length: 7,
        },
        (_, index) =>
          addDays(
            weekStart,
            index,
          ),
      )
    }, [
      weekStart,
    ])



  const weekLessons =
  lessons.filter(
    lesson =>
      lesson.date >=
        formatDate(weekStart) &&
      lesson.date <=
        formatDate(
          addDays(weekStart, 6),
        ) &&
      lesson.completed,
  )



  const total =
    weekLessons.reduce(
      (
        sum,
        lesson,
      ) =>
        sum +
        getSalary(
          lesson,
          teacher,
        ),
      0,
    )


  const lessonsByDay =
    weekDays.map(
      day => {
        const date =
          formatDate(day)

        return {
          date,
          day,
          lessons:
            weekLessons.filter(
              lesson =>
                lesson.date === date,
            ),
        }
      },
    )



  return (
    <div className="min-h-screen bg-zinc-950 p-8 text-zinc-100">

      <div className="mx-auto max-w-5xl">


        <h1 className="text-2xl font-semibold text-white">
          Reports
        </h1>


        <p className="mt-1 text-sm text-zinc-500">
          Weekly salary report
        </p>



        <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900 p-4">


          <div className="flex items-center justify-between">


            <button
              onClick={() =>
                setWeekStart(
                  addDays(
                    weekStart,
                    -7,
                  ),
                )
              }
              className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-800 hover:text-white"
            >
              <ChevronLeft size={18}/>
            </button>



            <div className="text-sm text-zinc-300">
              {weekStart.toLocaleDateString()}
              {' - '}
              {addDays(
                weekStart,
                6,
              ).toLocaleDateString()}
            </div>



            <button
              onClick={() =>
                setWeekStart(
                  addDays(
                    weekStart,
                    7,
                  ),
                )
              }
              className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-800 hover:text-white"
            >
              <ChevronRight size={18}/>
            </button>


          </div>


        </div>



        <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5">


          <div className="text-sm text-zinc-500">
            Total salary
          </div>


          <div className="mt-1 text-3xl font-semibold text-white">
            {total.toFixed(0)} ₽
          </div>


        </div>



        <div className="mt-6 space-y-3">


          {lessonsByDay.map(
            ({
              date,
              day,
              lessons,
            }) => {


              const dayTotal =
                lessons.reduce(
                  (
                    sum,
                    lesson,
                  ) =>
                    sum +
                    getSalary(

                      lesson,
                      teacher,
                    ),
                  0,
                )


              const expanded =
                expandedDays[date]



              return (
                <div
                  key={date}
                  className="rounded-xl border border-zinc-800 bg-zinc-900"
                >


                  <button
                    onClick={() =>
                      setExpandedDays(
                        current => ({
                          ...current,
                          [date]:
                            !current[date],
                        }),
                      )
                    }
                    className="flex w-full items-center justify-between px-4 py-4"
                  >

                    <div className="text-left">

                      <div className="text-sm font-medium text-white">
                        {formatDay(day)}
                      </div>

                      <div className="text-xs text-zinc-500">
                        {lessons.length}
                        {' '}
                        lessons
                      </div>

                    </div>


                    <div className="flex items-center gap-3">

                      <span className="text-sm text-zinc-300">
                        {dayTotal.toFixed(0)} ₽
                      </span>


                      <ChevronDown
                        size={18}
                        className={
                          expanded
                            ? 'rotate-180'
                            : ''
                        }
                      />

                    </div>


                  </button>



                  {expanded && (

                    <div className="border-t border-zinc-800 p-4 space-y-3">

                      {lessons.length === 0 && (
                        <div className="text-sm text-zinc-600">
                          No lessons
                        </div>
                      )}



                      {lessons.map(
                        lesson => {


                          const attended =
                            lesson.students.filter(
                              student =>
                                student.attended,
                            ).length


                          const salary =
                            getSalary(
                               
                              lesson,
                              teacher,
                            )


                          return (
                          <div
  key={lesson.id}
  className={`rounded-lg border p-4 ${getLessonColor(
    lesson,
  )}`}
>

                              <div className="flex justify-between">

                                <div>

                                  <div className="text-sm text-white">
                                    {lesson.title}
                                  </div>


                                  <div className="mt-1 text-xs text-zinc-500">
                                    {lesson.startTime}
                                    {' · '}
                                    {getLessonType(
                                      lesson,
                                    )}
                                    {' · '}
                                    {lesson.plannedDuration}
                                    min
                                  </div>

                                </div>


                                <div className="text-sm text-zinc-300">

                                  {salary === 0
                                    ? 'Cancelled · 0 ₽'
                                    : `${salary.toFixed(0)} ₽`
                                  }

                                </div>


                              </div>


<div className="mt-3 text-xs text-zinc-500">

  <div>
    Attended:
    {' '}
    {attended}
    {' '}
    students
  </div>


  <div className="mt-1">
    Students:
    {' '}
    {lesson.students
      .filter(
        student =>
          student.attended,
      )
      .map(student => {
        return (
          students.find(
            item =>
              item.id ===
              student.studentId,
          )?.name ??
          'Unknown'
        )
      })
      .join(', ')
    }
  </div>

</div>

                            </div>
                          )
                        },
                      )}

                    </div>

                  )}


                </div>
              )
            },
          )}

        </div>


      </div>

    </div>
  )
}


export default Reports