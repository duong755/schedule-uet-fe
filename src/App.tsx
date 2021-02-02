import { useState, useCallback, useEffect } from "react";
import axios from "axios";

import { Response, ClassInfo, StudentInfo } from "./Response";
import { generateHtmlTable } from "./Helper";

import "./App.scss";

const API_GET_SCHEDULE = "https://schedule-uet.herokuapp.com/get-schedule";
const API_EXCEL = "https://schedule-uet.herokuapp.com/export-schedule-excel";
const month = new Date().getUTCMonth() + 1;
const year = new Date().getFullYear();
const semester = month >= 7 ? 1 : 2;

const App = () => {
  const [studentCode, setStudentCode] = useState("");
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [classes, setClasses] = useState<ClassInfo[] | null>(null);
  const [scheduleHTML, setScheduleHTML] = useState<string>("");

  const handleChangeStudentCode: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void = (event) => {
    setStudentCode(event.target.value);
  };

  const getSchedule = useCallback<() => void>(() => {
    axios
      .post(API_GET_SCHEDULE, {
        studentCode: studentCode,
      })
      .then((res) => {
        const json = res.data as Response;
        if (!json.data) {
          setStudentInfo(null);
          setClasses(null);
        } else {
          setStudentInfo(json.data.studentInfo);
          setClasses(json.data.classes);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setStudentCode("");
      });
  }, [studentCode]);

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
        studentCode: studentInfo?.MaSV,
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
    axios.interceptors.request.use(
      (config) => {
        const overlay = document.querySelector(".overlay") as HTMLDivElement;
        overlay.style.display = "flex";
        return config;
      },
      (error) => {
        throw error;
      }
    );
    axios.interceptors.response.use((value) => {
      const overlay = document.querySelector(".overlay") as HTMLDivElement;
      overlay.style.display = "none";
      return value;
    });
  }, []);

  useEffect(() => {
    const htmlTable = generateHtmlTable(classes);
    setScheduleHTML(htmlTable);
  }, [classes]);

  return (
    <>
      <div className="header">
        <div className="header--title">
          <h3>
            Thời khóa biểu UET, học kì {semester}, năm học{" "}
            {semester === 1 ? year : year - 1}-
            {semester === 1 ? year + 1 : year}
          </h3>
        </div>
        <div className="header--credit">
          <div>
            <a href="https://github.com/hoangnx30/schedule-uet">
              Nguyễn Xuân Hoàng
            </a>
          </div>
          <div>
            <a href="https://github.com/duong755/schedule-uet-fe">
              Ngô Quang Dương
            </a>
          </div>
        </div>
      </div>
      <div>
        <form onSubmit={handleSubmitStudentCode}>
          <input
            type="text"
            placeholder="Nhập mã số sinh viên"
            className="form--input"
            value={studentCode}
            onChange={handleChangeStudentCode}
          />
          <button className="btn btn-default form--button" onClick={getSchedule}>
            Lấy thời khóa biểu
          </button>
        </form>
      </div>

      {studentInfo && (
        <div className="student">
          <div>
            <div>
              <span className="student--name">{studentInfo?.HoVaTen}</span>/
              <span className="student--id">{studentInfo?.MaSV}</span>
            </div>
            <div>
              Lớp:{" "}
              <span className="student--class">{studentInfo?.LopKhoaHoc}</span>
            </div>
            <div>
              Ngày sinh:{" "}
              <span className="student--birthday">{studentInfo?.NgaySinh}</span>
            </div>
          </div>
          <button className="btn btn-excel student--excel" onClick={handleDownloadExcel}>
            Export Excel
          </button>
        </div>
      )}

      {classes && (
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

export default App;
