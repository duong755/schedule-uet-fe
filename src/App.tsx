import { useState, useCallback, useEffect } from "react";
import axios from "axios";

import { Response, ClassInfo, StudentInfo } from "./Response";
import { convertPeriodsFromStringToArray } from "./Helper";

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

  const getSchedule = useCallback<
    () => void
  >(() => {
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
          if (json.data) {
            const firstItem = json.data[0];
            setStudentInfo({
              MaSV: firstItem.MaSV,
              HoVaTen: firstItem.HoVaTen,
              LopKhoaHoc: firstItem.LopKhoaHoc,
              NgaySinh: firstItem.NgaySinh,
            });

            const result = json.data
              .filter((responseItem) => {
                return !!responseItem.ThongTinLopHoc;
              })
              .map((responseItem) => {
                const convertItem = responseItem.ThongTinLopHoc.map(
                  (item) => {
                    const ThuAsNumber = Number(item.Thu) ? Number(item.Thu) : 8;
                    const TietAsArray = convertPeriodsFromStringToArray(
                      item.Tiet as string
                    );
                    return {
                      ...item,
                      Thu: ThuAsNumber,
                      Tiet: TietAsArray,
                    };
                  }
                );
                return [...convertItem];
              })
              .flat()
              .sort((classItem1, classItem2) => {
                //
                // ORDER BY
                // Tiet: ASCENDING
                // Thu: ASCENDING
                //
                if (classItem1.Tiet[0] === classItem2.Tiet[0]) {
                  return classItem1.Thu - classItem2.Thu;
                }
                return classItem1.Tiet[0] - classItem2.Tiet[0];
              });
            setClasses(result);
          }
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

  useEffect(() => {
    // build HTML string from list of classes
    const defaultRow: string[] = [...Array(8)].map(() => "<td></td>");
    const table: string[][] = [...Array<string[]>(12)].map((_, rowIndex) => {
      const newRow: string[] = defaultRow.slice(0);
      newRow[0] = `<td class="period">${rowIndex + 1}</td>`;
      return newRow;
    });

    if (classes) {
      for (let classIndex = 0; classIndex < classes.length; classIndex++) {
        const classItem = classes[classIndex];
        const { MaLopMH, GiangDuong, GiaoVien, TenMonHoc, SoSV } = classItem;
        const { Thu, Tiet } = classItem as { Thu: number; Tiet: number[] };
        const firstPeriod = Tiet[0];
        const lastPeriod = Tiet.slice(0).pop() as number;
        for (let periodIndex = 0; periodIndex < Tiet.length; periodIndex++) {
          if (periodIndex === 0) {
            table[Tiet[periodIndex] - 1][
              Thu - 1
            ] = `<td class="subject" rowspan="${lastPeriod - firstPeriod + 1}">
              <div>
                <strong>${MaLopMH}</strong>
                <div class="subject--name">${TenMonHoc}</div>
                <div class="subject--room">${GiangDuong}</div>
                <div class="subject--lecturer">${GiaoVien}</div>
                <div>Số sinh viên: ${SoSV}</div>
              </div>
            </td>`;
          } else {
            table[Tiet[periodIndex] - 1][Thu - 1] = "";
          }
        }
      }

      let htmlTable: string = "";
      for (let rowIndex = 0; rowIndex < table.length; rowIndex++) {
        let htmlRow: string = "";
        for (
          let cellIndex = 0;
          cellIndex < table[rowIndex].length;
          cellIndex++
        ) {
          htmlRow += table[rowIndex][cellIndex];
        }
        htmlRow = `<tr>${htmlRow}</tr>`;
        htmlTable += htmlRow;
      }
      setScheduleHTML(htmlTable);
    } else {
      setScheduleHTML("");
    }
  }, [classes]);

  const handleSubmitStudentCode: (event: React.FormEvent<HTMLFormElement>) => void = (event) => {
    event.preventDefault();
    getSchedule();
  };

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
