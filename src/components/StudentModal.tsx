import { useState } from 'react'
import type { Student } from '../data/mockData'


type StudentChanges = {
  name: string
  school: string
  grade: string
  notes: string
  age?: number
  books: string
  contact: string
}


type StudentModalProps = {
  student?: Student | null

  onSave: (
    changes: StudentChanges,
  ) => void

  onClose: () => void
}


function StudentModal({
  student,
  onSave,
  onClose,
}: StudentModalProps) {


  const [form, setForm] =
    useState<StudentChanges>({
      name:
        student?.name ?? '',
      school:
        student?.school ?? '',
      grade:
        student?.grade ?? '',
      notes:
        student?.notes ?? '',
      age:
        student?.age,
      books:
        student?.books ?? '',
      contact:
        student?.contact ?? '',
    })


  const updateField = (
    field: keyof StudentChanges,
    value: string,
  ) => {

    setForm(
      current => ({
        ...current,
        [field]:
          value,
      }),
    )
  }


  const handleSubmit = () => {

    if (!form.name.trim()) {
      window.alert(
        'Student name is required',
      )

      return
    }


    onSave(form)
  }


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

      <div className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-900 p-6">

        <h2 className="mb-5 text-lg font-semibold text-white">
          {student
            ? 'Edit Student'
            : 'New Student'}
        </h2>


        <div className="space-y-3">


          <input
            placeholder="Name"
            value={form.name}
            onChange={e =>
              updateField(
                'name',
                e.target.value,
              )
            }
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
          />


          <input
            placeholder="School"
            value={form.school}
            onChange={e =>
              updateField(
                'school',
                e.target.value,
              )
            }
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
          />


          <input
            placeholder="Grade"
            value={form.grade}
            onChange={e =>
              updateField(
                'grade',
                e.target.value,
              )
            }
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
          />


          <input
            placeholder="Books"
            value={form.books}
            onChange={e =>
              updateField(
                'books',
                e.target.value,
              )
            }
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
          />


          <input
            placeholder="Contact"
            value={form.contact}
            onChange={e =>
              updateField(
                'contact',
                e.target.value,
              )
            }
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
          />


          <textarea
            placeholder="Notes"
            value={form.notes}
            onChange={e =>
              updateField(
                'notes',
                e.target.value,
              )
            }
            className="h-24 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
          />

        </div>


        <div className="mt-6 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-zinc-400 hover:bg-zinc-800"
          >
            Cancel
          </button>


          <button
            onClick={handleSubmit}
            className="rounded-lg bg-orange-500 px-4 py-2 font-medium text-white"
          >
            Save
          </button>

        </div>

      </div>

    </div>
  )
}


export default StudentModal