interface Class {
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
  studentNote: string;
}

export interface ScheduleResponse {
  _id: string;
  studentId: string;
  studentName: string;
  studentBirthday: string;
  studentCourse: string;
  classes: Class[];
}
