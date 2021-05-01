import { useContext, useEffect, useRef, useState, Fragment } from "react";

import "./ClassMembers.scss";

import { setPageTitle, displayOverlay, getGroupName } from "../../common/helpers";
import { ClassMembersContext, ClassMembersContextData } from "../../context/ClassMembersContext";
import { axiosClassMembersInstance } from "../../common/axios";
import { ClassMembersResponse } from "../../types/ClassMembersResponse";

export const ClassMembers: React.FC<{}> = () => {
  const classIdInput = useRef<HTMLInputElement>(null);
  const [classId, setClassId] = useState<string>("");
  const classMembersContext = useContext<ClassMembersContextData | null | undefined>(ClassMembersContext);
  const [group, setGroup] = useState<string>("CL");

  const handleChangeClassId: (event: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
    setClassId(event.target.value);
  };

  const handleChangeGroup: (event: React.ChangeEvent<HTMLSelectElement>) => void = (event) => {
    setGroup(event.target.value);
  };

  useEffect(() => {
    setPageTitle("Danh sách lớp");
    classIdInput.current?.focus();
  }, []);

  const getClassMembers = async () => {
    try {
      const res = await axiosClassMembersInstance({
        method: "GET",
        params: {
          classId: classId.toUpperCase(),
        },
      });
      const json = res.data as ClassMembersResponse;
      classMembersContext?.setClassInfo({
        _id: json._id,
        classId: json.classId,
        credit: json.credit,
        subjectId: json.subjectId,
        subjectName: json.subjectName,
        groups: json.groups,
      });
      classMembersContext?.setStudentsInfo(json.students);
    } catch (err) {
      displayOverlay(false);
      console.error(err);
    } finally {
      setClassId("");
    }
  };

  const handleSubmitClassId: (event: React.FormEvent<HTMLFormElement>) => void = (event) => {
    event.preventDefault();
    getClassMembers();
  };

  return (
    <>
      <form onSubmit={handleSubmitClassId}>
        <input
          ref={classIdInput}
          type="text"
          placeholder="Nhập mã lớp môn học"
          className="form--input"
          value={classId}
          onChange={handleChangeClassId}
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
            Mã lớp môn học: <span className="class--class-id">{classMembersContext.classInfo.classId}</span>
          </div>
          <div>
            Số tín chỉ: <span className="class--credit">{classMembersContext.classInfo.credit.$numberInt}</span>
          </div>
          <div className="class--group">
            <dl>
              {classMembersContext.classInfo.groups.map((group, groupIndex) => {
                return (
                  <Fragment key={groupIndex}>
                    <dt>{getGroupName(group.note)}:</dt>
                    <dd>Thứ {group.weekDay.$numberInt}</dd>
                    <dd>Tiết {group.periods.map((period) => period.$numberInt).join(", ")}</dd>
                    <dd>Giảng đường: {group.place}</dd>
                    <dd>Giảng viên: {group.teacher}</dd>
                  </Fragment>
                );
              })}
            </dl>
          </div>
        </div>
      )}

      {classMembersContext?.studentsInfo && classMembersContext?.studentsInfo.length && (
        <div className="students">
          {classMembersContext?.classInfo?.groups && classMembersContext.classInfo.groups.length > 1 && (
            <div className="students--filter">
              <select value={group} onChange={handleChangeGroup}>
                {classMembersContext?.classInfo?.groups.map((group, groupIndex) => {
                  return (
                    <option key={groupIndex} value={group.note}>
                      {getGroupName(group.note)}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
          <table>
            <thead>
              <tr>
                <th title="Mã số sinh viên">MSSV</th>
                <th>Họ và tên</th>
                <th>Ngày sinh</th>
                <th>Lớp khóa học</th>
                <th>Nhóm</th>
                <th>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {classMembersContext.studentsInfo
                ?.filter((student) => {
                  if (group !== "CL") {
                    return student.classNote === group;
                  }
                  return true;
                })
                .map((student) => {
                  return (
                    <tr key={student.studentId}>
                      <td>{student.studentId}</td>
                      <td>{student.studentName}</td>
                      <td>{student.studentBirthday}</td>
                      <td>{student.studentBirthday}</td>
                      <td>{student.classNote}</td>
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
