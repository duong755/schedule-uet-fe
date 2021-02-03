import { useEffect } from "react";
import { NOT_IMPLEMENTED } from "../constants";
import { setPageTitle } from "../Helper";

export const ClassMembers: React.FC<{}> = () => {
  useEffect(() => {
    setPageTitle("Danh sách lớp");
  }, []);

  return (
    <div className="not-implemented">{NOT_IMPLEMENTED}</div>
  );
};

ClassMembers.displayName = "ClassMembers";
