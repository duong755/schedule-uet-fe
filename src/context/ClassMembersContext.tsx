import { createContext, PropsWithChildren, useState } from "react";

import { ClassMembersResponse } from "../types/ClassMembersResponse";

export type ClassMembersContextData = {
  classInfo: ClassMembersResponse.ClassInfo | null | undefined;
  studentsInfo: ClassMembersResponse.StudentInfo[] | null | undefined;
  setClassInfo: (classInfo: ClassMembersResponse.ClassInfo | null | undefined) => any;
  setStudentsInfo: (studentsInfo: ClassMembersResponse.StudentInfo[] | null | undefined) => any;
};

export const ClassMembersContext = createContext<ClassMembersContextData | null | undefined>(null);

export const ClassMembersProvider: React.FC<PropsWithChildren<{}>> = (props) => {
  const [classInfo, setClassInfo] = useState<ClassMembersResponse.ClassInfo | null | undefined>(null);
  const [studentsInfo, setStudentsInfo] = useState<ClassMembersResponse.StudentInfo[] | null | undefined>(null);

  return (
    <ClassMembersContext.Provider value={{ classInfo, studentsInfo, setClassInfo, setStudentsInfo }}>
      {props.children}
    </ClassMembersContext.Provider>
  );
};
