import { useContext, useEffect, useRef, useState, Fragment } from "react";

import "./ClassMembers.scss";

import { setPageTitle, displayOverlay } from "../../common/helpers";
import {
  ClassMembersContext,
  ClassMembersContextData,
} from "../../context/ClassMembersContext";
import { axiosCommonInstance } from "../../common/axios";
import { ClassMembersResponse } from "../../types/ClassMembersResponse";

export const ClassMembers: React.FC<{}> = () => {
  const classCodeInput = useRef<HTMLInputElement>(null);
  const [classCode, setClassCode] = useState<string>("");
  const classMembersContext = useContext<
    ClassMembersContextData | null | undefined
  >(ClassMembersContext);

  const handleChangeClassCode: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void = (event) => {
    setClassCode(event.target.value);
  };

  useEffect(() => {
    setPageTitle("Danh sách lớp");
    classCodeInput.current?.focus();
  }, []);

  const getClassMembers = async () => {
    try {
      const res = await axiosCommonInstance({
        url: "api/v2/get-students",
        method: "GET",
        params: {
          classCode: classCode.toUpperCase(),
        },
      });
      const json = res.data as ClassMembersResponse.Response;
      const extractedClassInfo = json.data.classInfo;
      const extractedStudentsInfo = json.data.students;
      classMembersContext?.setClassInfo(extractedClassInfo);
      classMembersContext?.setStudentsInfo(extractedStudentsInfo);
    } catch (err) {
      displayOverlay(false);
      console.error(err);
    } finally {
      setClassCode("");
    }
  };

  const handleSubmitClassCode: (
    event: React.FormEvent<HTMLFormElement>
  ) => void = (event) => {
    event.preventDefault();
    if (!/^\s*[a-zA-Z]{3}\d{4}\s\d{1,2}\s*/.test(classCode)) {
      alert("Nhập mã lớp môn học đúng định dạng vào bạn ơi !!!");
    } else {
      setClassCode(classCode.trim());
      getClassMembers();
    }
  };

  return (
    <>
      <form onSubmit={handleSubmitClassCode}>
        <input
          ref={classCodeInput}
          type="text"
          placeholder="Nhập mã lớp môn học"
          className="form--input"
          value={classCode}
          onChange={handleChangeClassCode}
        />
        <button type="submit" className="btn btn-default form--button">
          Lấy danh sách lớp
        </button>
      </form>

      {classMembersContext?.classInfo && (
        <div className="class">
          <div>
            Tên môn học:{" "}
            <span className="class--subject-name">
              {classMembersContext.classInfo.TenMonHoc}
            </span>
          </div>
          <div>
            Mã lớp môn học:{" "}
            <span className="class--class-code">
              {classMembersContext.classInfo.MaLMH}
            </span>
          </div>
          <div>
            Số tín chỉ:{" "}
            <span className="class--credit">
              {classMembersContext.classInfo.TinChi}
            </span>
          </div>
          <div className="class--group">
            <dl>
              {classMembersContext.classInfo.Nhom.map((classGroup) => {
                return (
                  <Fragment key={classGroup.Ten}>
                    <dt>{classGroup.Ten}</dt>
                    <dd>Thứ {classGroup.Thu} / Tiết {classGroup.Tiet}</dd>
                    <dd>Giảng đường: {classGroup.GiangDuong}</dd>
                    <dd>Giảng viên: {classGroup.GiaoVien}</dd>
                    <dd>Số sinh viên: {classGroup.SoSV}</dd>
                  </Fragment>
                );
              })}
            </dl>
          </div>
        </div>
      )}

      {classMembersContext?.studentsInfo &&
        classMembersContext?.studentsInfo.length && (
          <div className="students">
            <table>
              <thead>
                <tr>
                  <th title="Mã số sinh viên">MSSV</th>
                  <th>Họ và tên</th>
                  <th>Ngày sinh</th>
                  <th>Lớp khóa học</th>
                  <th>Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {classMembersContext.studentsInfo?.map((student) => {
                  return (
                    <tr key={student._id}>
                      <td>{student.MaSV}</td>
                      <td>{student.HoVaTen}</td>
                      <td>{student.NgaySinh}</td>
                      <td>{student.LopKhoaHoc}</td>
                      <td>{student.GhiChu}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
    </>
  );
};

ClassMembers.displayName = "ClassMembers";
