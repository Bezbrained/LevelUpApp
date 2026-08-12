import { useMemo, useState } from 'react'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

import {
  students,
} from '../data/mockData'

import type {
  Lesson,
} from '../data/mockData'


type ReportsProps = {
  lessons: Lesson[]
}


const rates = {
  1: 460,
  2: 540,
  3: 600,
  4: 700,
  5: 800,
}


function formatDate(date: Date) {
  return date.toISOString().split('T')[0]
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
) {
  const attended =
    lesson.students.filter(
      student =>
        student.attended,
    ).length


  if (attended === 0) {
    return 0
  }


  const rate =
    rates[
      attended as keyof typeof rates
    ] ?? 0


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


function Reports({
  lessons,
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
      lesson => {
        const date =
          new Date(
            lesson.date,
          )

        return (
          date >= weekStart &&
          date <=
            addDays(
              weekStart,
              6,
            ) &&
          lesson.completed
        )
      },
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
                            )


                          return (
                            <div
                              key={lesson.id}
                              className="rounded-lg bg-zinc-950 p-4"
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