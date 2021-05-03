import { createContext, PropsWithChildren, useState } from "react";

import { SchedulesResponse } from "../types/SchedulesResponse";

type StudentInfo = Omit<SchedulesResponse, "classes">;
type ClassesInfo = Pick<SchedulesResponse, "classes">["classes"];

export type SchedulesContextData = {
  studentInfo: StudentInfo | null | undefined;
  classesInfo: ClassesInfo | null | undefined;
  setStudentInfo: (studentInfo: StudentInfo | null | undefined) => any;
  setClassesInfo: (classesInfo: ClassesInfo | null | undefined) => any;
};

export const SchedulesContext = createContext<SchedulesContextData | null | undefined>(null);

export const SchedulesProvider: React.FC<PropsWithChildren<{}>> = (props: PropsWithChildren<{}>) => {
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null | undefined>(null);
  const [classesInfo, setClassesInfo] = useState<ClassesInfo | null | undefined>(null);

  return (
    <SchedulesContext.Provider value={{ studentInfo, classesInfo, setStudentInfo, setClassesInfo }}>
      {props.children}
    </SchedulesContext.Provider>
  );
};
