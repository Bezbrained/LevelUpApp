import { supabase } from './supabase'
import type { Teacher } from '../types'



export async function getTeachers(): Promise<Teacher[]> {

  const {
    data,
    error,
  } = await supabase
    .from('teachers')
    .select('*')
    .eq(
      'active',
      true,
    )


  if (error) {
    console.error(
      'Error loading teachers:',
      error,
    )

    return []
  }


 return data.map(
  teacher => ({
    id: teacher.id,
    name: teacher.name,

    rate1Student:
      teacher.rate_1_student,

    rate2Students:
      teacher.rate_2_students,

    rate3Students:
      teacher.rate_3_students,

    rate4Students:
      teacher.rate_4_students,

    rate5PlusStudents:
      teacher.rate_5_plus_students,

    active:
      teacher.active,
  }),
)
}


export async function getTeacher(
  id: string,
): Promise<Teacher | null> {

  const {
    data,
    error,
  } = await supabase
    .from('teachers')
    .select('*')
    .eq(
      'id',
      id,
    )
    .single()


  if (error) {
    console.error(
      'Error loading teacher:',
      error,
    )

    return null
  }

return {
  id: data.id,
  name: data.name,

  rate1Student:
    data.rate_1_student,

  rate2Students:
    data.rate_2_students,

  rate3Students:
    data.rate_3_students,

  rate4Students:
    data.rate_4_students,

  rate5PlusStudents:
    data.rate_5_plus_students,

  active:
    data.active,
}
}

export async function updateTeacherRates(
  teacherId: string,
  rates: {
    rate1Student: number
    rate2Students: number
    rate3Students: number
    rate4Students: number
    rate5PlusStudents: number
  },
): Promise<boolean> {

  const {
    error,
  } = await supabase
    .from('teachers')
    .update({
      rate_1_student:
        rates.rate1Student,

      rate_2_students:
        rates.rate2Students,

      rate_3_students:
        rates.rate3Students,

      rate_4_students:
        rates.rate4Students,

      rate_5_plus_students:
        rates.rate5PlusStudents,
    })
    .eq(
      'id',
      teacherId,
    )

  if (error) {
    console.error(
      'Error updating teacher rates:',
      error,
    )

    return false
  }

  return true
}