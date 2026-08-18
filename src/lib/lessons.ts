import { supabase } from './supabase'
import type { Lesson } from '../types'


export async function getLessons(
    teacherId: string = '',
): Promise<Lesson[]> {

  const {
    data,
    error,
  } = await supabase
    .from('lessons')
    .select(`
      *,
      lesson_students (
        student_id,
        attended
      )
    `)
    .eq(
  'teacher_id',
  teacherId,
)
    .order('date')
    .order('start_time')


  if (error) {
    console.error(
      'Error loading lessons:',
      error,
    )

    return []
  }


  return data.map(
    lesson => ({
      id: lesson.id,
      title: lesson.title,
      date: lesson.date,
      startTime: lesson.start_time,
      plannedDuration: lesson.planned_duration,
      actualDurationMinutes:
        lesson.actual_duration_minutes,
        recurrenceId:
  lesson.recurrence_id,
  teacherId:
  lesson.teacher_id,

      students:
        (lesson.lesson_students ?? []).map(
          (item: any) => ({
            studentId:
              item.student_id,

            attended:
              item.attended,
          }),
        ),

      completed:
        lesson.completed,

      notes:
        lesson.notes ?? '',
    }),
  )
}



export async function createLesson(
  lesson: {
    title: string
    date: string
    startTime: string
    plannedDuration: number
    actualDurationMinutes: number | null
    notes: string
    completed: boolean
    recurrenceId?: string | null
    teacherId: string
    students: {
      studentId: string
      attended: boolean
    }[]
  },
) {


  const {
    data,
    error,
  } =
    await supabase
      .from('lessons')
      .insert({
        title:
          lesson.title,

        date:
          lesson.date,

        start_time:
          lesson.startTime,

        planned_duration:
          lesson.plannedDuration,

        actual_duration_minutes:
          lesson.actualDurationMinutes,

        notes:
          lesson.notes,

          teacher_id:
  lesson.teacherId,

        completed:
          lesson.completed,




          recurrence_id: lesson.recurrenceId,
      })
      .select()
      .single()


  if (error) {
    console.error(
      'Error creating lesson:',
      error,
    )

    return null
  }


  if (lesson.students.length > 0) {

    const rows =
      lesson.students.map(student => ({
        lesson_id:
          data.id,

        student_id:
          student.studentId,

        attended:
          student.attended,
      }))


    const {
      error: studentsError,
    } =
      await supabase
        .from('lesson_students')
        .insert(rows)


    if (studentsError) {
      console.error(
        'Error adding students:',
        studentsError,
      )
    }
  }


  return data
}



export async function updateLesson(
  lessonId: string,

  lesson: {
    title: string
    date: string
    startTime: string
    plannedDuration: number
    actualDurationMinutes: number | null
    notes: string
    completed: boolean
    students: {
      studentId: string
      attended: boolean
    }[]
  },
) {


  const {
    error,
  } =
    await supabase
      .from('lessons')
      .update({
        title:
          lesson.title,

        date:
          lesson.date,

        start_time:
          lesson.startTime,

        planned_duration:
          lesson.plannedDuration,

        actual_duration_minutes:
          lesson.actualDurationMinutes,

        notes:
          lesson.notes,

        completed:
          lesson.completed,
      })
      .eq(
        'id',
        lessonId,
      )


  if (error) {
    console.error(
      'Error updating lesson:',
      error,
    )

    return false
  }



  await supabase
    .from('lesson_students')
    .delete()
    .eq(
      'lesson_id',
      lessonId,
    )



  if (lesson.students.length > 0) {

    const rows =
      lesson.students.map(student => ({
        lesson_id:
          lessonId,

        student_id:
          student.studentId,

        attended:
          student.attended,
      }))


    const {
      error: insertError,
    } =
      await supabase
        .from('lesson_students')
        .insert(rows)


    if (insertError) {
      console.error(
        'Error saving students:',
        insertError,
      )

      return false
    }
  }


  return true
}

export async function deleteLesson(
  id: string,
  recurrenceId?: string | null,
) {

  if (recurrenceId) {

    const {
      error,
    } = await supabase
      .from('lessons')
      .delete()
      .eq(
        'recurrence_id',
        recurrenceId,
      )


    if (error) {
      console.error(
        'Error deleting recurring lessons:',
        error,
      )

      return false
    }


    return true
  }


  const {
    error,
  } = await supabase
    .from('lessons')
    .delete()
    .eq(
      'id',
      id,
    )


  if (error) {
    console.error(
      'Error deleting lesson:',
      error,
    )

    return false
  }


  return true
}



export async function deleteRecurringLessonsFromDate(
  recurrenceId: string,
  fromDate: string,
) {
  const { error } =
    await supabase
      .from('lessons')
      .delete()
      .eq(
        'recurrence_id',
        recurrenceId,
      )
      .gte(
        'date',
        fromDate,
      )

  if (error) {
    console.error(
      error,
    )

    return false
  }

  return true
}

export async function createRecurringLessons(
  lesson: {
    title: string
    date: string
    startTime: string
    plannedDuration: number
    actualDurationMinutes: number | null
    notes: string
    teacherId: string
    completed: boolean
        recurrenceId?: string | null
    students: {
      studentId: string
      attended: boolean
    }[]
  },
  weeks: number,
) {
  const created = []

  for (let i = 0; i < weeks; i++) {

    const date = new Date(
      lesson.date,
    )

    date.setDate(
      date.getDate() + i * 7,
    )


    const result =
      await createLesson({
        ...lesson,
        date:
          date
            .toISOString()
            .split('T')[0],
      })


    if (result) {
      created.push(result)
    }
  }


  return created
}