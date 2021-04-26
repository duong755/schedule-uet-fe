import { useState, useCallback, useEffect, useContext, useRef } from "react";

import { ScheduleResponse } from "../../types/ScheduleResponse";
import { setPageTitle, displayOverlay } from "../../common/helpers";
import { axiosCommonInstance } from "../../common/axios";

import { generateTableBody } from "./Schedule.utils";

import "./Schedule.scss";
import { ScheduleContext, ScheduleContextData } from "../../context/ScheduleContext";

const Schedule: React.FC = () => {
  const studentIdInput = useRef<HTMLInputElement>(null);
  const scheduleContext = useContext<ScheduleContextData | null | undefined>(ScheduleContext);
  const [studentId, setStudentId] = useState("");

  const handleChangeStudentCode: (event: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
    setStudentId(event.target.value);
  };

  const getSchedule = useCallback<() => Promise<void>>(async () => {
    try {
      const res = await axiosCommonInstance({
        url: "api/v2/schedules",
        params: {
          studentId: studentId,
        },
        method: "GET",
      });
      const json = res.data as ScheduleResponse;

      const { classes, ...studentInfo } = json;
      scheduleContext?.setStudentInfo(studentInfo);
      scheduleContext?.setClassesInfo(classes);
    } catch (err) {
      displayOverlay(false);
      console.error(err);
    } finally {
      setStudentId("");
    }
  }, [studentId, scheduleContext]);

  const handleSubmitStudentCode: (event: React.FormEvent<HTMLFormElement>) => void = (event) => {
    event.preventDefault();
    if (!/^\s*\d{8}\s*$/.test(studentId)) {
      alert("Mã sinh viên không đúng định dạng");
    } else {
      setStudentId(studentId.trim());
      getSchedule();
    }
  };

  const handleDownloadExcel = async () => {
    alert("Tính năng này đang được cập nhật. Xin lỗi vì sự cố này :(((");
  };

  useEffect(() => {
    studentIdInput.current?.focus();
    setPageTitle("Thời khóa biểu");
  }, []);

  return (
    <>
      <form onSubmit={handleSubmitStudentCode}>
        <input
          ref={studentIdInput}
          type="text"
          placeholder="Nhập mã số sinh viên"
          className="form--input"
          value={studentId}
          onChange={handleChangeStudentCode}
        />
        <button type="submit" className="btn btn-default form--button">
          Lấy thời khóa biểu
        </button>
      </form>

      {scheduleContext?.studentInfo && (
        <div className="student">
          <div>
            <div>
              <span className="student--name">{scheduleContext?.studentInfo?.studentName}</span>/
              <span className="student--id">{scheduleContext?.studentInfo?.studentId}</span>
            </div>
            <div>
              Lớp: <span className="student--class">{scheduleContext?.studentInfo?.studentCourse}</span>
            </div>
            <div>
              Ngày sinh: <span className="student--birthday">{scheduleContext?.studentInfo?.studentBirthday}</span>
            </div>
          </div>
          <button className="btn btn-excel student--excel" onClick={handleDownloadExcel}>
            Export Excel
          </button>
        </div>
      )}

      {scheduleContext?.classesInfo && (
        <div className="classes">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>2</th>
                <th>3</th>
                <th>4</th>
                <th>5</th>
                <th>6</th>
                <th>7</th>
                <th>CN</th>
              </tr>
            </thead>
            <tbody>{generateTableBody(scheduleContext?.classesInfo)}</tbody>
          </table>
        </div>
      )}
    </>
  );
};

Schedule.displayName = "Schedule";
export { Schedule };
