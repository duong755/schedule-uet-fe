export interface Class {
  _id: string;
  subjectId: string;
  subjectName: string;
  credit: {
    $numberDouble: string;
  };
  classId: string;
  teacher: string;
  numberOfStudents: {
    $numberDouble: string;
  };
  session: string;
  weekDay: {
    $numberDouble: string;
  };
  periods: {
    $numberDouble: string;
  }[];
  place: string;
  note: string;
}

export interface SchedulesResponse {
  _id: string;
  studentId: string;
  studentName: string;
  studentBirthday: string;
  studentCourse: string;
  classes: Class[];
}
