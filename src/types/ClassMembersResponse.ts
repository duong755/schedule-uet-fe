interface Student {
  _id: string;
  studentId: string;
  studentName: string;
  studentBirthday: string;
  studentCourse: string;
  studentNote: string;
}

export interface ClassMembersResponse {
  _id: string;
  subjectId: string;
  subjectName: string;
  credit: number;
  classId: string;
  teacher: string;
  numberOfStudents: number;
  session: string;
  weekDay: number;
  periods: number[];
  place: string;
  note: string;
  students: Student[];
}
