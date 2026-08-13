import { useEffect, useMemo, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react'

import type {
  Lesson,
  Student,
  LessonDuration,
} from '../types'

import LessonModal from '../components/LessonModal'

type LessonChanges = {
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
}

type CalendarProps = {
  lessons: Lesson[]
  students: Student[]

  onSaveLesson: (
    lessonId: string,
    changes: LessonChanges,
  ) => void

  onCreateLesson: (
    changes: LessonChanges,
  ) => void
}

type ViewMode = 1 | 3 | 7

const startHour = 8
const endHour = 21
const hourHeight = 72

const dayNames = [
  'MON',
  'TUE',
  'WED',
  'THU',
  'FRI',
  'SAT',
  'SUN',
]

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

function getMonday(date: Date) {
  const result = new Date(date)

  const day = result.getDay()

  const diff =
    day === 0
      ? -6
      : 1 - day

  result.setDate(
    result.getDate() + diff,
  )

  result.setHours(
    0,
    0,
    0,
    0,
  )

  return result
}

function getPosition(time: string) {
  const [
    hours,
    minutes,
  ] = time
    .split(':')
    .map(Number)

  return (
    (hours -
      startHour +
      minutes / 60) *
    hourHeight
  )
}

function formatRange(
  days: Date[],
) {
  const first = days[0]
  const last =
    days[days.length - 1]

  if (
    first.getMonth() ===
    last.getMonth()
  ) {
    return `${first.getDate()} - ${last.getDate()} ${first.toLocaleDateString(
      'en-US',
      {
        month: 'long',
      },
    )}`
  }

  return `${first.toLocaleDateString(
    'en-US',
    {
      day: 'numeric',
      month: 'short',
    },
  )} - ${last.toLocaleDateString(
    'en-US',
    {
      day: 'numeric',
      month: 'short',
    },
  )}`
}

function getRoundedCurrentTime() {
  const now = new Date()

  let minutes =
    Math.ceil(
      now.getMinutes() / 5,
    ) * 5

  let hours = now.getHours()

  if (minutes === 60) {
    minutes = 0
    hours += 1
  }

  if (hours >= 24) {
    hours = 23
    minutes = 55
  }

  return `${String(hours).padStart(
    2,
    '0',
  )}:${String(minutes).padStart(
    2,
    '0',
  )}`
}

function Calendar({
  lessons,
  students,
  onSaveLesson,
  onCreateLesson,
}: CalendarProps) {
  const now = new Date()

  const [viewMode, setViewMode] =
    useState<ViewMode>(7)

  const [currentTime, setCurrentTime] =
    useState(new Date())

  const [startDate, setStartDate] =
    useState(getMonday(now))

  const [selectedLesson, setSelectedLesson] =
    useState<Lesson | null>(null)

  const [creatingLesson, setCreatingLesson] =
    useState(false)

  useEffect(() => {
    const timer =
      window.setInterval(
        () =>
          setCurrentTime(
            new Date(),
          ),
        60000,
      )

    return () =>
      window.clearInterval(timer)
  }, [])

  const visibleDays =
    useMemo(() => {
      return Array.from(
        {
          length: viewMode,
        },
        (_, index) => {
          const date =
            new Date(startDate)

          date.setDate(
            date.getDate() +
              index,
          )

          return date
        },
      )
    }, [
      startDate,
      viewMode,
    ])

  function openToday(
    mode: ViewMode,
  ) {
    const today = new Date()

    if (mode === 7) {
      setStartDate(
        getMonday(today),
      )
    }

    if (mode === 3) {
      const start =
        new Date(today)

      start.setDate(
        today.getDate() - 1,
      )

      setStartDate(start)
    }

    if (mode === 1) {
      setStartDate(today)
    }
  }

  function changeView(
    mode: ViewMode,
  ) {
    setViewMode(mode)
    openToday(mode)
  }

  function move(
    direction: number,
  ) {
    const next =
      new Date(startDate)

    const amount =
      viewMode === 7
        ? 7
        : 1

    next.setDate(
      next.getDate() +
        direction *
        amount,
    )

    setStartDate(next)
  }

  function openCreateLesson() {
    setCreatingLesson(true)
  }

  const isToday = (
    date: Date,
  ) =>
    formatDate(date) ===
    formatDate(currentTime)

  const currentLinePosition =
    (
      currentTime.getHours() -
        startHour +
        currentTime.getMinutes() /
          60
    ) *
    hourHeight

  return (
    <div className="flex h-screen flex-col bg-zinc-950">

      {/* Calendar toolbar */}

      <header className="flex h-20 items-center justify-between border-b border-zinc-800 px-6">

        <div className="flex items-center gap-3">

          <button
            onClick={() =>
              move(-1)
            }
            className="rounded-lg border border-zinc-800 p-2 text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
          >
            <ChevronLeft
              size={18}
            />
          </button>

          <div className="min-w-[180px] text-center text-sm font-semibold text-zinc-200">
            {formatRange(
              visibleDays,
            )}
          </div>

          <button
            onClick={() =>
              move(1)
            }
            className="rounded-lg border border-zinc-800 p-2 text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
          >
            <ChevronRight
              size={18}
            />
          </button>

          <button
            onClick={() =>
              openToday(
                viewMode,
              )
            }
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-xs font-medium text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-800 hover:text-white"
          >
            Today
          </button>

        </div>

        <div className="flex items-center gap-2">

          <select
            value={viewMode}
            onChange={e =>
              changeView(
                Number(
                  e.target.value,
                ) as ViewMode,
              )
            }
            className="cursor-pointer rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-200 outline-none transition hover:border-zinc-600 hover:bg-zinc-800 focus:border-orange-500"
          >
            <option value={7}>
              7 days
            </option>

            <option value={3}>
              3 days
            </option>

            <option value={1}>
              1 day
            </option>
          </select>

          <button
            onClick={
              openCreateLesson
            }
            title="Add lesson"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-400 transition hover:border-zinc-600 hover:bg-zinc-800 hover:text-white"
          >
            <Plus size={18} />
          </button>

        </div>

      </header>

      {/* Day header */}

      <div
        className="grid border-b border-zinc-800"
        style={{
          gridTemplateColumns:
            `64px repeat(${visibleDays.length},1fr)`,
        }}
      >
        <div />

        {visibleDays.map(
          day => (
            <div
              key={formatDate(day)}
              className="py-3 text-center"
            >
              <div className="text-xs text-zinc-500">
                {
                  dayNames[
                    day.getDay() === 0
                      ? 6
                      : day.getDay() - 1
                  ]
                }
              </div>

              <div
                className={
                  isToday(day)
                    ? 'mx-auto mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 font-medium text-white'
                    : 'mt-1 text-zinc-300'
                }
              >
                {day.getDate()}
              </div>
            </div>
          ),
        )}
      </div>

      {/* Calendar */}

      <div className="flex-1 overflow-auto">

        <div
          className="grid"
          style={{
            gridTemplateColumns:
              `64px repeat(${visibleDays.length},1fr)`,

            height:
              (endHour -
                startHour) *
              hourHeight,
          }}
        >

          {/* Time column */}

          <div className="border-r border-zinc-800">

            {Array.from(
              {
                length:
                  endHour -
                  startHour,
              },
              (_, i) => (
                <div
                  key={i}
                  className="h-[72px] border-b border-zinc-900 pr-2 text-right text-xs text-zinc-600"
                >
                  {startHour + i}:00
                </div>
              ),
            )}

          </div>

          {/* Days */}

          {visibleDays.map(
            day => {
              const dayLessons =
                lessons.filter(
                  lesson =>
                    lesson.date ===
                    formatDate(day),
                )

              return (
                <div
                  key={formatDate(day)}
                  className="relative border-r border-zinc-900"
                >

                  {/* Hour grid */}

                  {Array.from(
                    {
                      length:
                        endHour -
                        startHour,
                    },
                    (_, i) => (
                      <div
                        key={i}
                        className="h-[72px] border-b border-zinc-900"
                      />
                    ),
                  )}

                  {/* Current time line */}

                  {isToday(day) &&
                    currentLinePosition >=
                      0 &&
                    currentLinePosition <
                      (endHour -
                        startHour) *
                        hourHeight && (
                      <div
                        className="absolute left-0 right-0 z-20 flex items-center"
                        style={{
                          top:
                            currentLinePosition,
                        }}
                      >
                        <div className="h-2 w-2 rounded-full bg-red-500" />

                        <div className="h-px flex-1 bg-red-500" />
                      </div>
                    )}

                  {/* Lessons */}

                  {dayLessons.map(
                    lesson => (
                      <button
                        key={lesson.id}
                        onClick={() =>
                          setSelectedLesson(
                            lesson,
                          )
                        }
                        className={`absolute left-1 right-1 rounded-md border px-2 py-1 text-left transition ${
                          lesson.completed
                            ? 'border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/15'
                            : 'border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/15'
                        }`}
                        style={{
                          top:
                            getPosition(
                              lesson.startTime,
                            ),

                          height:
                            Math.max(
                              (lesson.plannedDuration /
                                60) *
                                hourHeight,
                              42,
                            ),
                        }}
                      >
                        <div className="truncate text-xs font-semibold text-zinc-100">
                          {lesson.title}
                        </div>

                        <div className="text-[11px] text-zinc-400">
                          {lesson.startTime}
                        </div>
                      </button>
                    ),
                  )}

                </div>
              )
            },
          )}

        </div>

      </div>

      {/* Existing lesson modal */}

      {selectedLesson && (
        <LessonModal
          lesson={
            selectedLesson
          }
          students={students}
          onSave={
            onSaveLesson
          }
          onCreate={
            onCreateLesson
          }
          onClose={() =>
            setSelectedLesson(
              null,
            )
          }
        />
      )}

      {/* Create lesson modal */}

      {creatingLesson && (
        <LessonModal
          lesson={{
            id: '',
            title: '',
            date: formatDate(
              new Date(),
            ),
            startTime:
              getRoundedCurrentTime(),
            plannedDuration: 40,
            actualDurationMinutes:
              null,
            students: [],
            completed: false,
            notes: '',
          }}
          initialMode="edit"
          isCreating
          students={students}
          onSave={
            onSaveLesson
          }
          onCreate={
            changes => {
              onCreateLesson(
                changes,
              )
              setCreatingLesson(
                false,
              )
            }
          }
          onClose={() =>
            setCreatingLesson(
              false,
            )
          }
        />
      )}

    </div>
  )
}

export default Calendar