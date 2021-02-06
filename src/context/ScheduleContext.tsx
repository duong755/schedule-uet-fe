import { createContext, PropsWithChildren, useState } from "react";

import { ScheduleResponse } from "../types/ScheduleResponse";

export type ScheduleContextData = {
  studentInfo: ScheduleResponse.StudentInfo | null | undefined;
  classesInfo: ScheduleResponse.ClassInfo[] | null | undefined;
  setStudentInfo: (studentInfo: ScheduleResponse.StudentInfo | null | undefined) => any;
  setClassesInfo: (classesInfo: ScheduleResponse.ClassInfo[] | null | undefined) => any;
};

export const ScheduleContext = createContext<ScheduleContextData | null | undefined>(null);

export const ScheduleProvider: React.FC<PropsWithChildren<{}>> = (
  props: PropsWithChildren<{}>
) => {
  const [studentInfo, setStudentInfo] = useState<ScheduleResponse.StudentInfo | null | undefined>(null);
  const [classesInfo, setClassesInfo] = useState<ScheduleResponse.ClassInfo[] | null | undefined>(null);

  return (
    <ScheduleContext.Provider value={{ studentInfo, classesInfo, setStudentInfo, setClassesInfo }}>
      {props.children}
    </ScheduleContext.Provider>
  );
};
