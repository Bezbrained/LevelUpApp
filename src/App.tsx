import { useState,useEffect } from 'react'
import {
  CalendarDays,
  ChartNoAxesColumn,
  Users,
} from 'lucide-react'

import {
  getLessons,
  createLesson,
  updateLesson} from './lib/lessons'

import {
  getStudents,
  } from './lib/students'


import type {
  Lesson,
  LessonDuration,
  Student,
} from './data/mockData'

import Calendar from './pages/Calendar'
import Students from './pages/Students'
import Reports from './pages/Reports'


type Page =
  | 'calendar'
  | 'students'
  | 'reports'

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

function timeToMinutes(
  time: string,
) {
  const [
    hours,
    minutes,
  ] = time
    .split(':')
    .map(Number)

  return (
    hours * 60 +
    minutes
  )
}

function lessonsOverlap(
  first: {
    date: string
    startTime: string
    plannedDuration: LessonDuration
  },
  second: {
    date: string
    startTime: string
    plannedDuration: LessonDuration
  },
) {
  if (
    first.date !==
    second.date
  ) {
    return false
  }

  const firstStart =
    timeToMinutes(
      first.startTime,
    )

  const firstEnd =
    firstStart +
    first.plannedDuration

  const secondStart =
    timeToMinutes(
      second.startTime,
    )

  const secondEnd =
    secondStart +
    second.plannedDuration

  return (
    firstStart <
      secondEnd &&
    firstEnd >
      secondStart
  )
}

function App() {
  const [page, setPage] =
    useState<Page>(
      'calendar',
    )


    
  const [lessons, setLessons] =
    useState<Lesson[]>([])

    const [students, setStudents] =
  useState<Student[]>([])

    useEffect(() => {

  async function loadData(){

    console.log('loading data')


    const lessonsData =
      await getLessons()


    const studentsData =
      await getStudents()


    setLessons(
      lessonsData,
    )


    setStudents(
      studentsData,
    )


    console.log(
      'lessons:',
      lessonsData,
    )


    console.log(
      'students:',
      studentsData,
    )

  }


  loadData()

}, [])

const reloadStudents = async () => {
  const data =
    await getStudents()

  setStudents(data)
}


  const handleSaveLesson = async(
    lessonId: string,
    changes: LessonChanges,
  ) => {
    const existingLesson =
      lessons.find(
        lesson =>
          lesson.id ===
          lessonId,
      )

    if (!existingLesson) {
      return
    }

    const overlaps =
      lessons.some(
        lesson =>
          lesson.id !==
            lessonId &&
          lessonsOverlap(
            {
              date:
                changes.date,
              startTime:
                changes.startTime,
              plannedDuration:
                changes.plannedDuration,
            },
            {
              date:
                lesson.date,
              startTime:
                lesson.startTime,
              plannedDuration:
                lesson.plannedDuration,
            },
          ),
      )

    if (overlaps) {
      window.alert(
        'This lesson overlaps with another lesson on the same date. Please choose a different time.',
      )

      return
    }

const success =
  await updateLesson(
    lessonId,
    changes,
  )


if (!success) {
  window.alert(
    'Failed to save lesson'
  )
  return
}


const refreshedLessons =
  await getLessons()


setLessons(
  refreshedLessons,
)
  }

  const handleCreateLesson = async (
    changes: LessonChanges,
  ) => {
    const overlaps =
      lessons.some(
        lesson =>
          lessonsOverlap(
            {
              date:
                changes.date,
              startTime:
                changes.startTime,
              plannedDuration:
                changes.plannedDuration,
            },
            {
              date:
                lesson.date,
              startTime:
                lesson.startTime,
              plannedDuration:
                lesson.plannedDuration,
            },
          ),
      )

    if (overlaps) {
      window.alert(
        'This lesson overlaps with another lesson on the same date. Please choose a different time.',
      )

      return
    }

    const createdLesson =
  await createLesson(
    changes,
  )


if (!createdLesson) {
  window.alert(
    'Failed to create lesson'
  )
  return
}


const refreshedLessons =
  await getLessons()


setLessons(
  refreshedLessons,
)
  }

  const navigation = [
    {
      id: 'calendar' as Page,
      label: 'Calendar',
      icon: CalendarDays,
    },

    {
      id: 'students' as Page,
      label: 'Students',
      icon: Users,
    },

    {
      id: 'reports' as Page,
      label: 'Reports',
      icon: ChartNoAxesColumn,
    },
  ]

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">

      <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-zinc-800/80 bg-zinc-900">

        <div className="flex h-20 items-center border-b border-zinc-800/80 px-6">

          <div>

            <div className="text-lg font-semibold tracking-tight text-white">
              Teacher App
            </div>

            <div className="mt-0.5 text-xs text-zinc-500">
              Lesson management
            </div>

          </div>

        </div>

        <nav className="flex-1 px-3 py-6">

          <div className="mb-3 px-3 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
            Workspace
          </div>

          <div className="space-y-1">

            {navigation.map(
              ({
                id,
                label,
                icon: Icon,
              }) => {
                const active =
                  page === id

                return (
                  <button
                    key={id}
                    onClick={() =>
                      setPage(id)
                    }
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                      active
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
                    }`}
                  >

                    <Icon
                      size={18}
                      strokeWidth={
                        active
                          ? 2.25
                          : 1.9
                      }
                    />

                    <span>
                      {label}
                    </span>

                  </button>
                )
              },
            )}

          </div>

        </nav>

        <div className="border-t border-zinc-800/80 p-4">

          <div className="rounded-lg bg-zinc-950/60 px-3 py-3">

            <div className="text-xs text-zinc-500">
              Account
            </div>

            <div className="mt-1 text-sm font-medium text-zinc-200">
              Teacher
            </div>

          </div>

        </div>

      </aside>

      <main className="min-h-screen pl-64">

        {page === 'calendar' && (
          <Calendar
            lessons={lessons}
            onSaveLesson={
              handleSaveLesson
            }
            onCreateLesson={
              handleCreateLesson
            }
          />
        )}

        {page === 'students' && (
          <Students
            lessons={lessons}
            students={students}
            onSaveLesson={
              handleSaveLesson
            }
            onStudentsChanged={reloadStudents}
          />
        )}

        {page === 'reports' && (
  <Reports
    lessons={lessons}
  />
)}

      </main>

    </div>
  )
}

export default App