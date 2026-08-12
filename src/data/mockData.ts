export type LessonDuration = 30 | 40 | 60

export type LessonStudent = {
  studentId: string
  attended: boolean
}

export type Student = {
  id: string
  name: string
  school: string
  grade: string
  notes: string
  age?: number
  books?: string
  contact?: string
}

export type Lesson = {
  id: string
  title: string
  date: string
  startTime: string
  plannedDuration: LessonDuration
  actualDurationMinutes: LessonDuration | null
  students: LessonStudent[]
  completed: boolean
  notes: string
}

export const students: Student[] = [
  {
    id: 'student-1',
    name: 'Anna Petrova',
    school: 'Central School',
    grade: '8',
    notes: 'Enjoys speaking activities.',
    age: 14,
    books: 'English File 5th Edition',
    contact: '+49 170 1234567',
  },
  {
    id: 'student-2',
    name: 'Michael Smith',
    school: 'Central School',
    grade: '9',
    notes: 'Needs more grammar practice.',
    age: 15,
    books: 'English File 5th Edition',
    contact: '+49 170 2345678',
  },
  {
    id: 'student-3',
    name: 'Sofia Ivanova',
    school: 'West School',
    grade: '7',
    notes: 'Strong vocabulary.',
    age: 13,
    books: 'Solutions Intermediate',
    contact: '+49 170 3456789',
  },
  {
    id: 'student-4',
    name: 'Daniel Brown',
    school: 'Central School',
    grade: '10',
    notes: 'Preparing for an English exam.',
    age: 16,
    books: 'Complete First',
    contact: '+49 170 4567890',
  },
]

export const lessons: Lesson[] = [
  {
    id: 'lesson-1',
    title: 'English File Unit 5',
    date: '2026-08-10',
    startTime: '16:00',
    plannedDuration: 40,
    actualDurationMinutes: 40,
    students: [
      {
        studentId: 'student-1',
        attended: true,
      },
      {
        studentId: 'student-2',
        attended: true,
      },
    ],
    completed: true,
    notes: 'Worked on speaking and pronunciation.',
  },

  {
    id: 'lesson-2',
    title: 'Grammar Revision',
    date: '2026-08-11',
    startTime: '16:00',
    plannedDuration: 40,
    actualDurationMinutes: 40,
    students: [
      {
        studentId: 'student-1',
        attended: true,
      },
    ],
    completed: true,
    notes: 'Reviewed grammar exercises.',
  },

  {
    id: 'lesson-3',
    title: 'Vocabulary Builder Unit 3',
    date: '2026-08-12',
    startTime: '16:20',
    plannedDuration: 40,
    actualDurationMinutes: null,
    students: [
      {
        studentId: 'student-1',
        attended: false,
      },
      {
        studentId: 'student-2',
        attended: false,
      },
    ],
    completed: false,
    notes: '',
  },

  {
    id: 'lesson-4',
    title: 'Speaking Practice',
    date: '2026-08-12',
    startTime: '15:00',
    plannedDuration: 60,
    actualDurationMinutes: null,
    students: [
      {
        studentId: 'student-1',
        attended: false,
      },
      {
        studentId: 'student-3',
        attended: false,
      },
      {
        studentId: 'student-4',
        attended: false,
      },
    ],
    completed: false,
    notes: '',
  },

  {
    id: 'lesson-5',
    title: 'Exam Preparation',
    date: '2026-08-12',
    startTime: '18:00',
    plannedDuration: 40,
    actualDurationMinutes: null,
    students: [
      {
        studentId: 'student-4',
        attended: false,
      },
    ],
    completed: false,
    notes: '',
  },
]

export const salaryRatePerAcademicHour = 25

export const academicHoursFromMinutes = (
  minutes: LessonDuration,
): number => {
  if (minutes === 30) return 0.75
  if (minutes === 40) return 1
  return 1.5
}