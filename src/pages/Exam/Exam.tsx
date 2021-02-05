import { useEffect } from "react";
import { NOT_IMPLEMENTED } from "../../constants";
import { setPageTitle } from "../../common/helpers";

export const Exam: React.FC<{}> = () => {
  useEffect(() => {
    setPageTitle("Lịch thi");
  }, []);

  return (
    <div className="not-implemented">{NOT_IMPLEMENTED}</div>
  );
};

Exam.displayName = "Exam";
