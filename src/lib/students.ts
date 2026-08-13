import { supabase } from './supabase'
import type { Student } from '../types'


export async function getStudents(): Promise<Student[]> {

  const {
    data,
    error,
  } = await supabase
    .from('students')
    .select('*')
    .order('name')


  if (error) {
    console.error(
      'Error loading students:',
      error,
    )

    return []
  }


  return data.map(student => ({
    id: student.id,
    name: student.name,
    school: student.school ?? '',
    grade: student.grade ?? '',
    notes: student.notes ?? '',
    age: student.age ?? undefined,
    books: student.books ?? '',
    contact: student.contact ?? '',
  }))
}



export async function createStudent(
  student: {
    name: string
    school: string
    grade: string
    notes: string
    age?: number
    books: string
    contact: string
  }
) {

  const {
    data,
    error,
  } = await supabase
    .from('students')
    .insert({
      name: student.name,
      school: student.school,
      grade: student.grade,
      notes: student.notes,
      age: student.age ?? null,
      books: student.books,
      contact: student.contact,
    })
    .select()
    .single()


  if (error) {

    console.error(
      'Error creating student:',
      error,
    )

    return null
  }


  return data
}



export async function updateStudent(
  id: string,
  student: {
    name: string
    school: string
    grade: string
    notes: string
    age?: number
    books: string
    contact: string
  }
) {

  const {
    error,
  } = await supabase
    .from('students')
    .update({
      name: student.name,
      school: student.school,
      grade: student.grade,
      notes: student.notes,
      age: student.age ?? null,
      books: student.books,
      contact: student.contact,
    })
    .eq(
      'id',
      id,
    )


  if (error) {

    console.error(
      'Error updating student:',
      error,
    )

    return false
  }


  return true
}