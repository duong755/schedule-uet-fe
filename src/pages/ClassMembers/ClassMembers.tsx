import { useContext, useEffect, useRef, useState, Fragment } from "react";

import "./ClassMembers.scss";

import { setPageTitle, displayOverlay } from "../../common/helpers";
import { ClassMembersContext, ClassMembersContextData } from "../../context/ClassMembersContext";
import { axiosCommonInstance } from "../../common/axios";
import { ClassMembersResponse } from "../../types/ClassMembersResponse";

export const ClassMembers: React.FC<{}> = () => {
  const classIdInput = useRef<HTMLInputElement>(null);
  const [classId, setClassId] = useState<string>("");
  const classMembersContext = useContext<ClassMembersContextData | null | undefined>(ClassMembersContext);
  // const [group, setGroup] = useState<string>("CL");

  const handleChangeClassCode: (event: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
    setClassId(event.target.value);
  };

  // const handleChangeGroup: (event: React.ChangeEvent<HTMLSelectElement>) => void = (event) => {
  //   setGroup(event.target.value);
  // };

  useEffect(() => {
    setPageTitle("Danh sách lớp");
    classIdInput.current?.focus();
  }, []);

  const getClassMembers = async () => {
    try {
      const res = await axiosCommonInstance({
        url: "api/v2/classmembers",
        params: {
          classId: classId.toUpperCase(),
        },
        method: "GET",
      });
      const json = res.data as ClassMembersResponse;
      const { students: extractedStudentsInfo, ...extractedClassInfo } = json;
      classMembersContext?.setClassInfo(extractedClassInfo);
      classMembersContext?.setStudentsInfo(extractedStudentsInfo);
    } catch (err) {
      displayOverlay(false);
      console.error(err);
    } finally {
      setClassId("");
    }
  };

  const handleSubmitClassCode: (event: React.FormEvent<HTMLFormElement>) => void = (event) => {
    event.preventDefault();
    setClassId(classId.trim());
    getClassMembers();
  };

  return (
    <>
      <form onSubmit={handleSubmitClassCode}>
        <input
          ref={classIdInput}
          type="text"
          placeholder="Nhập mã lớp môn học"
          className="form--input"
          value={classId}
          onChange={handleChangeClassCode}
        />
        <button type="submit" className="btn btn-default form--button">
          Lấy danh sách lớp
        </button>
      </form>

      {classMembersContext?.classInfo && (
        <div className="class">
          <div>
            Tên môn học: <span className="class--subject-name">{classMembersContext.classInfo.subjectName}</span>
          </div>
          <div>
            Mã lớp môn học: <span className="class--class-code">{classMembersContext.classInfo.classId}</span>
          </div>
          <div>
            Số tín chỉ: <span className="class--credit">{classMembersContext.classInfo.credit}</span>
          </div>
          <div className="class--group"></div>
        </div>
      )}

      {classMembersContext?.studentsInfo && classMembersContext?.studentsInfo.length && (
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
                  <tr key={student.studentId}>
                    <td>{student.studentId}</td>
                    <td>{student.studentName}</td>
                    <td>{student.studentBirthday}</td>
                    <td>{student.studentCourse}</td>
                    <td>{student.studentNote}</td>
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
