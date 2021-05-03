import { createContext, PropsWithChildren, useState } from "react";

import { ClassMembersResponse } from "../types/ClassMembersResponse";

type ClassInfo = Omit<ClassMembersResponse, "students">;
type StudentsInfo = Pick<ClassMembersResponse, "students">["students"];

export type ClassMembersContextData = {
  classInfo: ClassInfo | null | undefined;
  studentsInfo: StudentsInfo | null | undefined;
  setClassInfo: (classInfo: ClassInfo | null | undefined) => any;
  setStudentsInfo: (studentsInfo: StudentsInfo | null | undefined) => any;
};

export const ClassMembersContext = createContext<ClassMembersContextData | null | undefined>(null);

export const ClassMembersProvider: React.FC<PropsWithChildren<{}>> = (props) => {
  const [classInfo, setClassInfo] = useState<ClassInfo | null | undefined>(null);
  const [studentsInfo, setStudentsInfo] = useState<StudentsInfo | null | undefined>(null);

  return (
    <ClassMembersContext.Provider value={{ classInfo, studentsInfo, setClassInfo, setStudentsInfo }}>
      {props.children}
    </ClassMembersContext.Provider>
  );
};
