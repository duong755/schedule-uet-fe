import { createContext, PropsWithChildren, useState } from "react";

import { ScheduleResponse } from "../types/ScheduleResponse";

type StudentInfo = Omit<ScheduleResponse, "classes">;
type ClassesInfo = Pick<ScheduleResponse, "classes">["classes"];

export type ScheduleContextData = {
  studentInfo: StudentInfo | null | undefined;
  classesInfo: ClassesInfo | null | undefined;
  setStudentInfo: (studentInfo: StudentInfo | null | undefined) => any;
  setClassesInfo: (classesInfo: ClassesInfo | null | undefined) => any;
};

export const ScheduleContext = createContext<ScheduleContextData | null | undefined>(null);

export const ScheduleProvider: React.FC<PropsWithChildren<{}>> = (props: PropsWithChildren<{}>) => {
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null | undefined>(null);
  const [classesInfo, setClassesInfo] = useState<ClassesInfo | null | undefined>(null);

  return (
    <ScheduleContext.Provider value={{ studentInfo, classesInfo, setStudentInfo, setClassesInfo }}>
      {props.children}
    </ScheduleContext.Provider>
  );
};
