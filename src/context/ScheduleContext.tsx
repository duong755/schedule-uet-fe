import { createContext, PropsWithChildren, useState } from "react";

import { ClassInfo, StudentInfo } from "../Response";

export type ScheduleContextData = {
  studentInfo: StudentInfo | null | undefined;
  classesInfo: ClassInfo[] | null | undefined;
  setStudentInfo: (React.Dispatch<React.SetStateAction<StudentInfo | null | undefined>>) | ((studentInfo: StudentInfo | null | undefined) => any);
  setClassesInfo: (React.Dispatch<React.SetStateAction<ClassInfo[] | null | undefined>>) | ((classesInfo: ClassInfo[] | null | undefined) => any);
};

export const ScheduleContext = createContext<ScheduleContextData | null | undefined>(null);

export const ScheduleProvider: React.FC<PropsWithChildren<{}>> = (
  props: PropsWithChildren<{}>
) => {
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null | undefined>(null);
  const [classesInfo, setClassesInfo] = useState<ClassInfo[] | null | undefined>(null);

  return (
    <ScheduleContext.Provider value={{ studentInfo, classesInfo, setStudentInfo, setClassesInfo }}>
      <ScheduleContext.Consumer>
        {(scheduleProps) => props.children}
      </ScheduleContext.Consumer>
    </ScheduleContext.Provider>
  );
};
