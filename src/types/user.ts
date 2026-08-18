export type UserRole =
  | 'teacher'
  | 'admin'

export type User = {
  id: string
  name: string
  role: UserRole
  teacherId?: string | null
}