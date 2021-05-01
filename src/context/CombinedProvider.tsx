import { PropsWithChildren } from "react";

import { SchedulesProvider } from "./SchedulesContext";
import { ClassMembersProvider } from "./ClassMembersContext";

export const CombinedProvider: React.FC<PropsWithChildren<{}>> = (props) => {
  return (
    <SchedulesProvider>
      <ClassMembersProvider>{props.children}</ClassMembersProvider>
    </SchedulesProvider>
  );
};
