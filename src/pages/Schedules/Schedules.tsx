import { useState, useCallback, useEffect, useContext, useRef } from "react";

import { SchedulesResponse } from "../../types/SchedulesResponse";
import { setPageTitle, displayOverlay } from "../../common/helpers";
import { axiosSchedulesInstance } from "../../common/axios";

import { generateTableBody } from "./Schedules.utils";

import "./Schedules.scss";
import { SchedulesContext, SchedulesContextData } from "../../context/SchedulesContext";

const Schedule: React.FC = () => {
  const studentIdInput = useRef<HTMLInputElement>(null);
  const schedulesContext = useContext<SchedulesContextData | null | undefined>(SchedulesContext);
  const [studentId, setStudentId] = useState("");

  const handleChangeStudentId: (event: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
    setStudentId(event.target.value);
  };

  const getSchedule = useCallback<() => Promise<void>>(async () => {
    try {
      const res = await axiosSchedulesInstance({
        params: {
          studentId: studentId
        },
        method: "GET",
      });
      const json = res.data as SchedulesResponse;
      schedulesContext?.setStudentInfo({ _id: json._id, studentId: json.studentId, studentName: json.studentName, studentCourse: json.studentCourse, studentBirthday: json.studentBirthday });
      schedulesContext?.setClassesInfo(json.classes);
    } catch (err) {
      displayOverlay(false);
      console.error(err);
    } finally {
      setStudentId("");
    }
  }, [studentId, schedulesContext]);

  const handleSubmitStudentId: (event: React.FormEvent<HTMLFormElement>) => void = (event) => {
    event.preventDefault();
    if (!/^\s*\d{8}\s*$/.test(studentId)) {
      alert("Nhập mã sinh viên đúng định dạng vào bạn ơi !!!");
    } else {
      setStudentId(studentId.trim());
      getSchedule();
    }
  };

  // const handleDownloadExcel = async () => {
  //   const res = await axiosCommonInstance({
  //     method: "POST",
  //     url: "api/v1/export-schedule-excel",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     responseType: "arraybuffer",
  //     data: {
  //       StudentId: scheduleContext?.studentInfo?.MaSV,
  //     },
  //   });

  //   const url = window.URL.createObjectURL(
  //     new Blob([res.data], {
  //       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //     })
  //   );
  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.setAttribute("download", "Schedule.xlsx");
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  useEffect(() => {
    studentIdInput.current?.focus();
    setPageTitle("Thời khóa biểu");
  }, []);

  return (
    <>
      <form onSubmit={handleSubmitStudentId}>
        <input
          ref={studentIdInput}
          type="text"
          placeholder="Nhập mã số sinh viên"
          className="form--input"
          value={studentId}
          onChange={handleChangeStudentId}
        />
        <button type="submit" className="btn btn-default form--button">
          Lấy thời khóa biểu
        </button>
      </form>

      {schedulesContext?.studentInfo && (
        <div className="student">
          <div>
            <div>
              <span className="student--name">{schedulesContext?.studentInfo?.studentName}</span>/
              <span className="student--id">{schedulesContext?.studentInfo?.studentId}</span>
            </div>
            <div>
              Lớp: <span className="student--class">{schedulesContext?.studentInfo?.studentCourse}</span>
            </div>
            <div>
              Ngày sinh: <span className="student--birthday">{schedulesContext?.studentInfo?.studentBirthday}</span>
            </div>
          </div>
          <button className="btn btn-excel student--excel">
            Export Excel
          </button>
        </div>
      )}

      {schedulesContext?.classesInfo && (
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
            <tbody>{generateTableBody(schedulesContext?.classesInfo)}</tbody>
          </table>
        </div>
      )}
    </>
  );
};

Schedule.displayName = "Schedule";
export { Schedule };
