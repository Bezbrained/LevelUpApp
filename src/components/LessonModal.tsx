import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  Pencil,
  Search,
  X,
} from 'lucide-react'

import type {
  Student,
} from '../types'

import type {
  Lesson,
  LessonDuration,
} from '../types'

import type { LessonChanges } from '../types/lessonChanges'

type LessonModalProps = {
  lesson: Lesson
  previousLessonNotes?: string | null
  students:Student[]

  onSave: (
    lessonId: string,
    changes: LessonChanges,
  ) => void

  onCreate?: (
    changes: LessonChanges,
  ) => void

  onClose: () => void

  onDelete?: (
  mode: 'single' | 'following',
) => void

  initialMode?: Mode

  isCreating?: boolean
}

type Mode =
  | 'info'
  | 'edit'

function getLessonType(
  studentsList: Lesson['students'],
) {
  const attended =
    studentsList.filter(
      student =>
        student.attended,
    ).length

  if (attended === 0) {
    return 'Skipped'
  }

  if (attended === 1) {
    return 'Individual'
  }

  if (attended === 2) {
    return 'Pair'
  }

  return 'Group'
}

function LessonModal({
  lesson,
  students,
   previousLessonNotes,
  onSave,
  onDelete,
  onCreate,
  onClose,
  initialMode = 'info',
  isCreating = false,
}: LessonModalProps) {
  const [mode, setMode] =
    useState<Mode>(
      initialMode,
    )

  const [title, setTitle] =
    useState(lesson.title)

  const [date, setDate] =
    useState(lesson.date)

  const [startTime, setStartTime] =
    useState(lesson.startTime)

  const [duration, setDuration] =
    useState<LessonDuration>(
      lesson.plannedDuration,
    )

  const [notes, setNotes] =
    useState(lesson.notes)

    const [repeatWeekly, setRepeatWeekly] =
  useState(false)

const [repeatWeeks, setRepeatWeeks] =
  useState(1)

  const [
    selectedStudents,
    setSelectedStudents,
  ] = useState(
    lesson.students,
  )

  const [search, setSearch] =
    useState('')

  const filteredStudents =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase()

      if (!query) {
        return []
      }

      return students.filter(
        student =>
          student.name
            .toLowerCase()
            .includes(query),
      )
    }, [search])

  const selectedIds = new Set(
    selectedStudents.map(
      student =>
        student.studentId,
    ),
  )

  const attendedCount =
    selectedStudents.filter(
      student =>
        student.attended,
    ).length

  const lessonType =
    getLessonType(
      selectedStudents,
    )

  const addStudent = (
    studentId: string,
  ) => {
    if (
      selectedIds.has(
        studentId,
      )
    ) {
      return
    }

    setSelectedStudents(
      current => [
        ...current,
        {
          studentId,
          attended: false,
        },
      ],
    )

    setSearch('')
  }

  const removeStudent = (
    studentId: string,
  ) => {
    setSelectedStudents(
      current =>
        current.filter(
          student =>
            student.studentId !==
            studentId,
        ),
    )
  }

  const toggleAttendance = (
    studentId: string,
  ) => {
    setSelectedStudents(
      current =>
        current.map(
          student =>
            student.studentId ===
            studentId
              ? {
                  ...student,
                  attended:
                    !student.attended,
                }
              : student,
        ),
    )
  }

  const buildChanges =
    (): LessonChanges => ({
      title: title.trim(),
      date,
      startTime,
      plannedDuration:
        duration,
      actualDurationMinutes:
        isCreating
          ? null
          : lesson.actualDurationMinutes ??
            duration,
      students:
        selectedStudents,
      notes,
      completed:
  selectedStudents.length > 0 &&
  selectedStudents.some(
    student => student.attended,
  ),

       repeatWeekly,
  repeatWeeks,
    })


  const saveLesson = () => {
    if (!title.trim()) {
      return
    }

    if (isCreating) {
  if (onCreate) {
    onCreate(
      buildChanges(),
    )
  }

  return
}

    onSave(
      lesson.id,
      buildChanges(),
    )

    onClose()
  }

  const saveChanges = () => {
    if (!title.trim()) {
      return
    }

    onSave(
      lesson.id,
      buildChanges(),
    )

    setMode('info')
  }

  if (mode === 'info') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">

        <div className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl">

          <div className="space-y-5 p-6">

            {/* Lesson heading */}

            <div className="flex items-start justify-between gap-4">

              <div className="min-w-0">

                <h2 className="truncate text-xl font-semibold text-white">
                  {lesson.title}
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  {lesson.date}
                  {' · '}
                  {lesson.startTime}
                  {' · '}
                  {lesson.plannedDuration}
                  {' min'}
                </p>

              </div>

              <div className="flex shrink-0 items-center gap-2">

                <button
                  onClick={() =>
                    setMode('edit')
                  }
                  className="flex items-center gap-2 rounded-lg border border-zinc-800 px-3 py-2 text-xs text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                >
                  <Pencil size={14} />
                  Edit
                </button>

                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-800 hover:text-white"
                >
                  <X size={18} />
                </button>

              </div>

            </div>

            {/* Students */}

            <div>

              <div className="mb-2 text-xs font-medium text-zinc-400">
                Students
              </div>

              <div className="space-y-2">

                {selectedStudents.map(
                  selected => {
                    const student =
                      students.find(
                        item =>
                          item.id ===
                          selected.studentId,
                      )

                    if (!student) {
                      return null
                    }

                    return (
                      <label
                        key={
                          student.id
                        }
                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5"
                      >

                        <input
                          type="checkbox"
                          checked={
                            selected.attended
                          }
                          onChange={() =>
                            toggleAttendance(
                              student.id,
                            )
                          }
                          className="h-4 w-4 accent-orange-500"
                        />

                        <span className="text-sm text-zinc-200">
                          {student.name}
                        </span>

                        <span className="ml-auto text-xs text-zinc-600">
                          {selected.attended
                            ? 'Attended'
                            : 'Absent'}
                        </span>

                      </label>
                    )
                  },
                )}

                {selectedStudents.length ===
                  0 && (
                  <div className="rounded-lg border border-dashed border-zinc-800 px-3 py-4 text-center text-sm text-zinc-600">
                    No students added
                  </div>
                )}

              </div>

            </div>

            {/* Attendance */}

            <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5">

              <div className="flex items-center gap-3">

                <span className="text-sm text-zinc-300">
                  Attendance
                </span>

                <span className="text-sm text-zinc-500">
                  {attendedCount}
                  {' / '}
                  {
                    selectedStudents.length
                  }
                </span>

              </div>

              <span className="rounded-md bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-300">
                {lessonType}
              </span>

            </div>
            
{previousLessonNotes && (
    <div>
        <label className="mb-2 block text-xs font-medium text-zinc-400">
              Previous lesson notes
                  </label>

                      <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-300 whitespace-pre-wrap">
                            {previousLessonNotes}
                                </div>
                                  </div>
                                  )}

            {/* Notes */}

            <div>

              <label className="mb-2 block text-xs font-medium text-zinc-400">
                Lesson notes
              </label>

              <textarea
                value={notes}
                onChange={e =>
                  setNotes(
                    e.target.value,
                  )
                }
                rows={4}
                placeholder="What happened in the lesson?"
                className="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-orange-500"
              />

            </div>

            {/* Footer */}

            <div className="flex justify-end">

              <button
                onClick={
                  saveLesson
                }
                className="rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-orange-400"
              >
                Save lesson
              </button>

            </div>

          </div>

        </div>

      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">

      <div className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl">

        <div className="space-y-5 p-6">

          {/* Edit heading */}

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              {!isCreating && (
                <button
                  onClick={() =>
                    setMode('info')
                  }
                  className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-800 hover:text-white"
                >
                  <ArrowLeft
                    size={18}
                  />
                </button>
              )}

              <h2 className="text-lg font-semibold text-white">
                {isCreating
                  ? 'Add lesson'
                  : 'Edit lesson'}
              </h2>

            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-800 hover:text-white"
            >
              <X size={18} />
            </button>

          </div>

          {/* Lesson name */}

          <div>

            <label className="mb-1.5 block text-xs font-medium text-zinc-400">
              Lesson name
            </label>

            <input
              value={title}
              onChange={e =>
                setTitle(
                  e.target.value,
                )
              }
              autoFocus
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-orange-500"
            />

          </div>

          {/* Date and time */}

          <div className="grid grid-cols-2 gap-3">

            <div>

              <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                Date
              </label>

              <input
                type="date"
                value={date}
                onChange={e =>
                  setDate(
                    e.target.value,
                  )
                }
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-orange-500"
              />

            </div>

            <div>

              <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                Start time
              </label>

              <input
                type="time"
                value={startTime}
                onChange={e =>
                  setStartTime(
                    e.target.value,
                  )
                }
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-orange-500"
              />

            </div>

          </div>

          {/* Duration */}

          <div>

            <label className="mb-1.5 block text-xs font-medium text-zinc-400">
              Planned duration
            </label>

            <select
              value={duration}
              onChange={e =>
                setDuration(
                  Number(
                    e.target.value,
                  ) as LessonDuration,
                )
              }
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-orange-500"
            >
              <option value={30}>
                30 minutes
              </option>

              <option value={40}>
                40 minutes
              </option>

              <option value={60}>
                60 minutes
              </option>
            </select>

          </div>

{/* Recurrence */}

{isCreating && (
  <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">

    <label className="flex items-center gap-3 text-sm text-zinc-300">

      <input
        type="checkbox"
        checked={repeatWeekly}
        onChange={e =>
          setRepeatWeekly(
            e.target.checked,
          )
        }
        className="h-4 w-4 accent-orange-500"
      />

      Repeat weekly

    </label>


    {repeatWeekly && (
      <div className="mt-3">

        <label className="mb-1.5 block text-xs font-medium text-zinc-400">
          Number of weeks
        </label>

        <input
          type="number"
          min={1}
          max={52}
          value={repeatWeeks}
          onChange={e =>
            setRepeatWeeks(
              Number(e.target.value),
            )
          }
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-orange-500"
        />

      </div>
    )}

  </div>
)}
          {/* Student search */}

          <div>

            <label className="mb-1.5 block text-xs font-medium text-zinc-400">
              Students
            </label>

            <div className="relative">

              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
              />

              <input
                value={search}
                onChange={e =>
                  setSearch(
                    e.target.value,
                  )
                }
                placeholder="Search student..."
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 py-2.5 pl-9 pr-3 text-sm text-white outline-none transition focus:border-orange-500"
              />

              {filteredStudents.length >
                0 && (
                <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow-xl">

                  {filteredStudents.map(
                    student => (
                      <button
                        key={
                          student.id
                        }
                        onClick={() =>
                          addStudent(
                            student.id,
                          )
                        }
                        className="block w-full px-3 py-2.5 text-left transition hover:bg-zinc-800"
                      >

                        <div className="text-sm text-white">
                          {student.name}
                        </div>

                        <div className="text-xs text-zinc-500">
                          {
                            student.school
                          }
                          {' · Grade '}
                          {
                            student.grade
                          }
                        </div>

                      </button>
                    ),
                  )}

                </div>
              )}

            </div>

            <div className="mt-3 space-y-2">

              {selectedStudents.map(
                selected => {
                  const student =
                    students.find(
                      item =>
                        item.id ===
                        selected.studentId,
                    )

                  if (!student) {
                    return null
                  }

                  return (
                    <div
                      key={
                        student.id
                      }
                      className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5"
                    >

                      <span className="text-sm text-zinc-200">
                        {student.name}
                      </span>

                      <button
                        onClick={() =>
                          removeStudent(
                            student.id,
                          )
                        }
                        className="text-zinc-600 transition hover:text-red-400"
                      >
                        <X
                          size={15}
                        />
                      </button>

                    </div>
                  )
                },
              )}

            </div>

          </div>

          {/* Footer */}

<div className="flex justify-between">

 {!isCreating && onDelete && (
  <button
    onClick={() => {
      if (lesson.recurrenceId) {
        const deleteFollowing =
          window.confirm(
            'Delete this lesson and all following recurring lessons?\n\n' +
            'Click Cancel to delete only this lesson.',
          )

        onDelete(
          deleteFollowing
            ? 'following'
            : 'single',
        )

        return
      }

      const confirmed =
        window.confirm(
          'Delete this lesson permanently?',
        )

      if (confirmed) {
        onDelete('single')
      }
    }}
    className="rounded-lg px-4 py-2.5 text-sm text-red-400 transition hover:bg-red-500/10"
  >
    Delete lesson
  </button>
)}

  <div className="flex gap-3">

    <button
      onClick={onClose}
      className="rounded-lg border border-zinc-800 px-4 py-2.5 text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
    >
      Cancel
    </button>

    <button
      onClick={
        isCreating
          ? saveLesson
          : saveChanges
      }
      disabled={!title.trim()}
      className="rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {isCreating
        ? 'Add lesson'
        : 'Save changes'}
    </button>

  </div>

</div>

        </div>

      </div>

    </div>
  )
}

export default LessonModal