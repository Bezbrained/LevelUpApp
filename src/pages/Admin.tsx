import {
  useEffect,
  useState,
} from 'react'

import type { Teacher } from '../types'

import {
  getTeachers,
  updateTeacherRates,
} from '../lib/teachers'

export default function Admin() {

  const [
    teachers,
    setTeachers,
  ] = useState<Teacher[]>([])

  const [
    savingId,
    setSavingId,
  ] = useState<string | null>(null)

  useEffect(() => {

    async function load() {

      const data =
        await getTeachers()

      setTeachers(data)
    }

    load()

  }, [])

  const updateRate = (
    teacherId: string,
    field:
      | 'rate1Student'
      | 'rate2Students'
      | 'rate3Students'
      | 'rate4Students'
      | 'rate5PlusStudents',
    value: string,
  ) => {

    setTeachers(
      current =>
        current.map(
          teacher =>
            teacher.id === teacherId
              ? {
                  ...teacher,
                  [field]:
                    Number(value),
                }
              : teacher,
        ),
    )
  }

  const saveRates = async (
    teacher: Teacher,
  ) => {

    setSavingId(
      teacher.id,
    )

    await updateTeacherRates(
      teacher.id,
      {
        rate1Student:
          teacher.rate1Student,

        rate2Students:
          teacher.rate2Students,

        rate3Students:
          teacher.rate3Students,

        rate4Students:
          teacher.rate4Students,

        rate5PlusStudents:
          teacher.rate5PlusStudents,
      },
    )

    setSavingId(null)
  }

  return (
    <div className="p-6">

      <h1 className="mb-6 text-2xl font-semibold">
        Teacher rates
      </h1>

      <div className="space-y-4">

        {teachers.map(
          teacher => (

            <div
              key={teacher.id}
              className="rounded-xl border border-white/10 bg-white/5 p-5"
            >

              <div className="mb-4 text-lg font-medium">
                {teacher.name}
              </div>

              <div className="grid grid-cols-5 gap-3">

                {[
                  [
                    '1 student',
                    'rate1Student',
                  ],
                  [
                    '2 students',
                    'rate2Students',
                  ],
                  [
                    '3 students',
                    'rate3Students',
                  ],
                  [
                    '4 students',
                    'rate4Students',
                  ],
                  [
                    '5+ students',
                    'rate5PlusStudents',
                  ],
                ].map(
                  ([label, field]) => (

                    <label
                      key={field}
                      className="text-sm text-gray-400"
                    >

                      {label}

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={
                          teacher[
                            field as keyof Teacher
                          ] as number
                        }
                        onChange={event =>
                          updateRate(
                            teacher.id,
                            field as
                              | 'rate1Student'
                              | 'rate2Students'
                              | 'rate3Students'
                              | 'rate4Students'
                              | 'rate5PlusStudents',
                            event.target.value,
                          )
                        }
                        className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-white outline-none"
                      />

                    </label>

                  ),
                )}

              </div>

              <button
                onClick={() =>
                  saveRates(teacher)
                }
                disabled={
                  savingId === teacher.id
                }
                className="mt-4 rounded-lg bg-white/10 px-4 py-2 text-sm hover:bg-white/15 disabled:opacity-50"
              >
                {savingId === teacher.id
                  ? 'Saving...'
                  : 'Save rates'}
              </button>

            </div>

          ),
        )}

      </div>

    </div>
  )
}