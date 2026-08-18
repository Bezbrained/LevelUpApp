import { supabase } from './supabase'

export type AppUser = {
  id: string
  name: string
  role: 'admin' | 'teacher'
  teacherId: string | null
}

export async function getUsers(): Promise<AppUser[]> {

  const {
    data,
    error,
  } = await supabase
    .from('users')
    .select('*')

  if (error) {
    console.error(
      'Error loading users:',
      error,
    )

    return []
  }

  return data.map(
    user => ({
      id: user.id,
      name: user.name,
      role:
        user.role === 'admin'
          ? 'admin'
          : 'teacher',
      teacherId:
        user.teacher_id,
    }),
  )
}