import { useState, useCallback, useEffect, useContext } from "react";
import axios from "axios";

import { Response } from "../Response";
import { generateHtmlTable, setPageTitle } from "../Helper";
import { API_GET_SCHEDULE, API_EXCEL } from "../constants";

import "./Schedule.scss";
import { ScheduleContext, ScheduleContextData } from "../context/ScheduleContext";

const displayOverlay: (show: boolean) => void = (show) => {
  const overlay = document.querySelector(".overlay") as HTMLDivElement;
  if (show) {
    overlay.style.display = "flex";
  } else {
    overlay.style.display = "none";
  }
};

const Schedule: React.FC = () => {
  const scheduleContext = useContext<ScheduleContextData | null | undefined>(ScheduleContext);
  const [studentCode, setStudentCode] = useState("");
  const [scheduleHTML, setScheduleHTML] = useState<string>("");

  const handleChangeStudentCode: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void = (event) => {
    setStudentCode(event.target.value);
  };

  const getSchedule = useCallback<() => Promise<void>>(async () => {
    try {
      const res = await axios({
        url: API_GET_SCHEDULE,
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          studentCode: studentCode
        }
      });
      const json = res.data as Response;
      if (!json.data) {
        scheduleContext?.setStudentInfo(null);
        scheduleContext?.setClassesInfo(null);
      } else {
        scheduleContext?.setStudentInfo(json.data.studentInfo);
        scheduleContext?.setClassesInfo(json.data.classes);
      }
    } catch(err) {
      displayOverlay(false);
      console.error(err);
    } finally {
      setStudentCode("");
    }
  }, [studentCode, scheduleContext]);

  const handleSubmitStudentCode: (
    event: React.FormEvent<HTMLFormElement>
  ) => void = (event) => {
    event.preventDefault();
    getSchedule();
  };

  const handleDownloadExcel = async () => {
    const res = await axios({
      method: "POST",
      url: API_EXCEL,
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
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
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
    setPageTitle("Thời khóa biểu");
    axios.interceptors.request.use(
      (config) => {
        displayOverlay(true);
        return config;
      },
      (error) => {
        throw error;
      }
    );
    axios.interceptors.response.use((value) => {
      displayOverlay(false);
      return value;
    });
  }, []);

  useEffect(() => {
    const htmlTable = generateHtmlTable(scheduleContext?.classesInfo);
    setScheduleHTML(htmlTable);
  }, [scheduleContext?.classesInfo]);

  return (
    <>
      <div>
        <form onSubmit={handleSubmitStudentCode}>
          <input
            type="text"
            placeholder="Nhập mã số sinh viên"
            className="form--input"
            value={studentCode}
            onChange={handleChangeStudentCode}
          />
          <button
            className="btn btn-default form--button"
            onClick={getSchedule}
          >
            Lấy thời khóa biểu
          </button>
        </form>
      </div>

      {scheduleContext?.studentInfo && (
        <div className="student">
          <div>
            <div>
              <span className="student--name">{scheduleContext?.studentInfo?.HoVaTen}</span>/
              <span className="student--id">{scheduleContext?.studentInfo?.MaSV}</span>
            </div>
            <div>
              Lớp:{" "}
              <span className="student--class">{scheduleContext?.studentInfo?.LopKhoaHoc}</span>
            </div>
            <div>
              Ngày sinh:{" "}
              <span className="student--birthday">{scheduleContext?.studentInfo?.NgaySinh}</span>
            </div>
          </div>
          <button
            className="btn btn-excel student--excel"
            onClick={handleDownloadExcel}
          >
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
            <tbody dangerouslySetInnerHTML={{ __html: scheduleHTML }}></tbody>
          </table>
        </div>
      )}
    </>
  );
};

Schedule.displayName = "Schedule";
export { Schedule };
