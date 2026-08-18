import { useState,useEffect } from 'react'
import {
  CalendarDays,
  ChartNoAxesColumn,
  Users,
} from 'lucide-react'

import {
  getLessons,
  deleteLesson,
  createLesson,
  deleteRecurringLessonsFromDate,
  createRecurringLessons,
  updateLesson} from './lib/lessons'

import {
  getUsers,
  type AppUser,
} from './lib/users'

import {
  getStudents,
  } from './lib/students'

  import type { LessonChanges } from './types/lessonChanges'

  import { getTeachers } from './lib/teachers'

import type {
  Lesson,
  LessonDuration,
  Student,
  Teacher,
} from './types'

import Calendar from './pages/Calendar'
import Students from './pages/Students'
import Reports from './pages/Reports'
import Admin from './pages/Admin'



type Page =
  | 'calendar'
  | 'students'
  | 'reports'



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

const [studentLessons, setStudentLessons] =
  useState<Lesson[]>([])


    const [students, setStudents] =
  useState<Student[]>([])

  const [teachers, setTeachers] =
  useState<Teacher[]>([])

const [currentTeacherId, setCurrentTeacherId] =
  useState<string | null>(
    localStorage.getItem('currentTeacherId'),
  )

const [currentUserId, setCurrentUserId] =
  useState<string | null>(
    localStorage.getItem('currentUserId'),
  )

const isAdmin =
  currentUserId !== null &&
  currentTeacherId === null

   useEffect(() => {

  async function loadTeachers() {
    const teachersData =
      await getTeachers()

    setTeachers(
      teachersData,
    )
  }

  loadTeachers()

}, [])

useEffect(() => {

  async function loadUsers() {

    const usersData =
      await getUsers()

    setUsers(usersData)
  }

  loadUsers()

}, [])

useEffect(() => {

  if (!currentTeacherId) {
    return
  }

  async function loadData() {

    console.log('loading data')

    const lessonsData =
      await getLessons(
        currentTeacherId ?? undefined,
      )

      const allLessonsData =
  await getLessons()

    const studentsData =
      await getStudents()

    setLessons(
      lessonsData,
    )

    setStudentLessons(
  allLessonsData,
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

}, [currentTeacherId])

const currentTeacher =
  teachers.find(
    teacher =>
      teacher.id ===
      currentTeacherId,
  )

  const [
  users,
  setUsers,
] = useState<AppUser[]>([])

const reloadStudents = async () => {
  const data =
    await getStudents()

  setStudents(data)
}

const handleLogout = () => {
  localStorage.removeItem(
    'currentTeacherId',
  )

  localStorage.removeItem(
    'currentUserId',
  )

  setCurrentTeacherId(null)
  setCurrentUserId(null)
  setLessons([])
  setStudentLessons([])
}

const handleDeleteLesson = async (
  lessonId: string,
  mode: 'single' | 'following',
) => {

  const lesson =
    lessons.find(
      lesson =>
        lesson.id === lessonId,
    )

  if (!lesson) {
    return
  }

  let success = false

  if (
    mode === 'following' &&
    lesson.recurrenceId
  ) {

    success =
      await deleteRecurringLessonsFromDate(
        lesson.recurrenceId,
        lesson.date,
      )

  } else {

    success =
      await deleteLesson(
        lessonId,
      )

  }

  if (!success) {
    window.alert(
      'Failed to delete lesson',
    )

    return
  }

  const refreshedLessons =
    await getLessons(
      currentTeacherId!,
    )

  setLessons(
    refreshedLessons,
  )
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
  await getLessons( currentTeacherId!)


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

  let createdLesson


if (
  changes.repeatWeekly
) {

 const recurrenceId =
    crypto.randomUUID()

  createdLesson =
    await createRecurringLessons(
      {...changes,
         teacherId:
        currentTeacherId!,
       recurrenceId,
      },
      changes.repeatWeeks,
    )

} else {

  createdLesson =
    await createLesson({
    ...changes,
    teacherId:
      currentTeacherId!,
})

}


if ( !createdLesson ||
  createdLesson.length === 0
) { 
  window.alert(
    'Failed to create lesson'
  )
  return
}


const refreshedLessons =
  await getLessons( currentTeacherId!)


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

  if (isAdmin) {
  return (
    <Admin />
  )
}

if (!currentTeacherId || !currentTeacher) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-6 text-zinc-100">
      <div className="w-full max-w-md">

<h1 className="text-2xl font-semibold text-white">
  Select account
</h1>

<p className="mt-2 text-sm text-zinc-500">
  Choose your account to continue.
</p>

<div className="mt-6 space-y-2">

  {users.map(user => (

    <button
      key={user.id}
      onClick={() => {

        if (
  user.role === 'teacher' &&
  user.teacherId
) {
  localStorage.setItem(
    'currentTeacherId',
    user.teacherId,
  )

  localStorage.setItem(
    'currentUserId',
    user.id,
  )

  setCurrentUserId(user.id)

  setCurrentTeacherId(
    user.teacherId,
  )

  return
}

    if (user.role === 'admin') {
  localStorage.setItem(
    'currentUserId',
    user.id,
  )

  localStorage.removeItem(
    'currentTeacherId',
  )

  setCurrentUserId(user.id)

  setCurrentTeacherId(null)
}

      }}
      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-left text-sm text-zinc-200 transition hover:border-orange-500 hover:bg-zinc-800"
    >

      {user.name}

      {user.role === 'admin' && (
        <span className="ml-2 text-xs text-zinc-500">
          in development
        </span>
      )}

    </button>

  ))}

</div>

      </div>
    </div>
  )
}

  return (

    
    <div className="min-h-screen bg-zinc-950 text-zinc-100">

      <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-zinc-800/80 bg-zinc-900">

        <div className="flex h-20 items-center border-b border-zinc-800/80 px-6">

          <div>

            <div className="text-lg font-semibold tracking-tight text-white">
              LevelUp
            </div>

            <div className="mt-0.5 text-xs text-zinc-500">
              test
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
              {currentTeacher.name}
            </div>

            <button
  onClick={handleLogout}
  className="rounded-lg px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
>
  Logout
</button>

          </div>

        </div>

      </aside>

      <main className="min-h-screen pl-64">

        {page === 'calendar' && (
          <Calendar
            lessons={lessons}
            students={students}
            onSaveLesson={
              handleSaveLesson
            }
            onDeleteLesson={handleDeleteLesson}
            onCreateLesson={
              handleCreateLesson
            }
          />
        )}

        {page === 'students' && (
          <Students
            lessons={studentLessons}
             teacherLessons={lessons}
            students={students}
            onSaveLesson={
              handleSaveLesson
            }
            onDeleteLesson={handleDeleteLesson}
            onStudentsChanged={reloadStudents}
          />
        )}

        {page === 'reports' && (
  <Reports
    lessons={lessons}
    students={students}
  />
)}

      </main>

    </div>
  )
}

export default App
