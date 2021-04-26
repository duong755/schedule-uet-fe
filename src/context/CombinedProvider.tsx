import { PropsWithChildren } from "react";

import { ScheduleProvider } from "../context/ScheduleContext";
import { ClassMembersProvider } from "../context/ClassMembersContext";

export const CombinedProvider: React.FC<PropsWithChildren<{}>> = (props) => {
  return (
    <ScheduleProvider>
      <ClassMembersProvider>{props.children}</ClassMembersProvider>
    </ScheduleProvider>
  );
};
