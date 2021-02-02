import { useState, useCallback, useEffect } from "react";
import axios from "axios";

import { Response, ClassInfo, StudentInfo } from "./Response";
import { formatClassInfo, generateHtmlTable } from "./Helper";

import "./App.scss";

const API_URL = "https://schedule-uet.herokuapp.com/get-schedule";
const month = new Date().getUTCMonth() + 1;
const year = new Date().getFullYear();
const semester = month >= 7 ? 1 : 2;

const App = () => {
  const [studentCode, setStudentCode] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [classes, setClasses] = useState<ClassInfo[] | null>(null);
  const [scheduleHTML, setScheduleHTML] = useState<string>("");

  const handleChangeStudentCode: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void = (event) => {
    setStudentCode(event.target.value);
  };

  const getSchedule = useCallback<() => void>(() => {
    setIsFetching(true);
    axios
      .post(API_URL, {
        studentCode: studentCode,
      })
      .then((res) => {
        const json = res.data as Response;
        if (!json.data.length) {
          setStudentInfo(null);
          setClasses(null);
        } else {
          const firstItem = json.data[0];
          setStudentInfo({
            MaSV: firstItem.MaSV,
            HoVaTen: firstItem.HoVaTen,
            LopKhoaHoc: firstItem.LopKhoaHoc,
            NgaySinh: firstItem.NgaySinh,
          });
          const result = formatClassInfo(json.data);
          setClasses(result);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setStudentCode("");
        setIsFetching(false);
      });
  }, [studentCode]);

  const handleSubmitStudentCode: (
    event: React.FormEvent<HTMLFormElement>
  ) => void = (event) => {
    event.preventDefault();
    getSchedule();
  };

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
          <button className="form--button" onClick={getSchedule}>
            Lấy thời khóa biểu
          </button>
        </form>
      </div>
      <div
        className="fetching"
        style={{ display: isFetching ? "block" : "none" }}
      >
        Loading...
      </div>

      {studentInfo && (
        <div className="student">
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
