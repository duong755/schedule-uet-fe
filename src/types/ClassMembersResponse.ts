interface ClassGroup {
  session: string;
  weekDay: {
    $numberInt: number;
  };
  periods: {
    $numberInt: string;
  }[];
  place: string;
  teacher: string;
  note: string;
}

interface Student {
  _id: {
    $oid: string;
  };
  studentId: string;
  studentName: string;
  studentBirthday: string;
  studentCourse: string;
  classId: string;
  classNote: string;
  studentNote: string;
}

export interface ClassMembersResponse {
  _id: {
    $oid: string;
  };
  classId: string;
  subjectId: string;
  subjectName: string;
  credit: {
    $numberInt: string;
  };
  groups: ClassGroup[];
  students: Student[];
}
