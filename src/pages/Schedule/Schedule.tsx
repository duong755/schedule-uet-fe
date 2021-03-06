import { useState, useCallback, useEffect, useContext, useRef } from "react";

import { ScheduleResponse } from "../../types/ScheduleResponse";
import { setPageTitle, displayOverlay } from "../../common/helpers";
import { axiosCommonInstance } from "../../common/axios";

import { generateTableBody } from "./Schedule.utils";

import "./Schedule.scss";
import { ScheduleContext, ScheduleContextData } from "../../context/ScheduleContext";

const Schedule: React.FC = () => {
  const studentCodeInput = useRef<HTMLInputElement>(null);
  const scheduleContext = useContext<ScheduleContextData | null | undefined>(ScheduleContext);
  const [studentCode, setStudentCode] = useState("");

  const handleChangeStudentCode: (event: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
    setStudentCode(event.target.value);
  };

  const getSchedule = useCallback<() => Promise<void>>(async () => {
    try {
      const res = await axiosCommonInstance({
        url: "api/v1/get-schedule",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          studentCode: studentCode,
        },
      });
      const json = res.data as ScheduleResponse.Response;
      if (!json.data) {
        scheduleContext?.setStudentInfo(null);
        scheduleContext?.setClassesInfo(null);
      } else {
        scheduleContext?.setStudentInfo(json.data.studentInfo);
        scheduleContext?.setClassesInfo(json.data.classes);
      }
    } catch (err) {
      displayOverlay(false);
      console.error(err);
    } finally {
      setStudentCode("");
    }
  }, [studentCode, scheduleContext]);

  const handleSubmitStudentCode: (event: React.FormEvent<HTMLFormElement>) => void = (event) => {
    event.preventDefault();
    if (!/^\s*\d{8}\s*$/.test(studentCode)) {
      alert("Nhập mã sinh viên đúng định dạng vào bạn ơi !!!");
    } else {
      setStudentCode(studentCode.trim());
      getSchedule();
    }
  };

  const handleDownloadExcel = async () => {
    const res = await axiosCommonInstance({
      method: "POST",
      url: "api/v1/export-schedule-excel",
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "arraybuffer",
      data: {
        studentCode: scheduleContext?.studentInfo?.MaSV,
      },
    });

    const url = window.URL.createObjectURL(
      new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Schedule.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    studentCodeInput.current?.focus();
    setPageTitle("Thời khóa biểu");
  }, []);

  return (
    <>
      <form onSubmit={handleSubmitStudentCode}>
        <input
          ref={studentCodeInput}
          type="text"
          placeholder="Nhập mã số sinh viên"
          className="form--input"
          value={studentCode}
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
              <span className="student--name">{scheduleContext?.studentInfo?.HoVaTen}</span>/
              <span className="student--id">{scheduleContext?.studentInfo?.MaSV}</span>
            </div>
            <div>
              Lớp: <span className="student--class">{scheduleContext?.studentInfo?.LopKhoaHoc}</span>
            </div>
            <div>
              Ngày sinh: <span className="student--birthday">{scheduleContext?.studentInfo?.NgaySinh}</span>
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
