import { PropsWithChildren } from "react";

import { ScheduleProvider } from "./ScheduleContext";
import { ClassMembersProvider } from "./ClassMembersContext";

export const CombinedProvider: React.FC<PropsWithChildren<{}>> = (props) => {
  return (
    <ScheduleProvider>
      <ClassMembersProvider>
        {props.children}
      </ClassMembersProvider>
    </ScheduleProvider>
  );
};
