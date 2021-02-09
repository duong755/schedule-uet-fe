import { PropsWithChildren } from "react";

import { ScheduleResponse } from "../../types/ScheduleResponse";
import { PERIODS } from "../../constants";
import { getGroupName } from "../../common/helpers";

type ScheduleCellProps = {
  className?: string;
  classCode?: string;
  lecturer?: string;
  subjectName?: string;
  numberOfStudents?: string | number;
  room?: string;
  note?: string;
  periods?: number;
};

type ScheduleCellPropsWithChildren = PropsWithChildren<ScheduleCellProps>;

const EmptyCell: React.FC<PropsWithChildren<ScheduleCellProps>> = () => {
  return <td></td>;
};

const ScheduleCell: React.FC<ScheduleCellProps> = (props) => {
  const handleMouseEnter: (event: React.MouseEvent<HTMLTableCellElement>) => void = (event) => {
    const subjectId = event.currentTarget.dataset.subjectId as string;
    document.querySelectorAll(`td[data-subject-id="${subjectId}"]`).forEach((matchSubject) => {
      matchSubject.classList.add("focus");
    });
  };
  const handleMouseLeave: (event: React.MouseEvent<HTMLTableCellElement>) => void = (event) => {
    const subjectId = event.currentTarget.dataset.subjectId as string;
    document.querySelectorAll(`td[data-subject-id="${subjectId}"]`).forEach((matchSubject) => {
      matchSubject.classList.remove("focus");
    });
  };
  const { classCode, periods, lecturer, subjectName, numberOfStudents, room, note, className } = props;
  return (
    <td
      className={className}
      data-subject-id={classCode}
      rowSpan={periods}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div>
        <strong>
          {classCode} ({getGroupName(note as string)})
        </strong>
        <div className="subject--name">{subjectName}</div>
        <div className="subject--room">{room}</div>
        <div className="subject--lecturer">{lecturer}</div>
        <div>Số sinh viên: {numberOfStudents}</div>
      </div>
    </td>
  );
};

export function generateTableBody(classes: ScheduleResponse.ClassInfo[] | null | undefined): React.ReactNode {
  const defaultRow: (ScheduleCellPropsWithChildren | null)[] = [...Array(8)].map(() => ({}));
  const tablePropsValues: (ScheduleCellPropsWithChildren | null)[][] = [
    ...Array<(ScheduleCellPropsWithChildren | null)[]>(14),
  ].map((_, rowIndex) => {
    const newRow: (ScheduleCellPropsWithChildren | null)[] = defaultRow.slice(0);
    newRow[0] = { className: "period", children: PERIODS[rowIndex] };
    return newRow;
  });

  if (classes) {
    for (let classIndex = 0; classIndex < classes.length; classIndex++) {
      const classItem = classes[classIndex];
      const { MaLopMH, GiangDuong, GiaoVien, TenMonHoc, SoSV, GhiChu } = classItem;
      const { Thu, Tiet } = classItem as { Thu: number; Tiet: number[] };
      const firstPeriod = Tiet[0];
      const lastPeriod = Tiet.slice(0).pop() as number;
      for (let periodIndex = 0; periodIndex < Tiet.length; periodIndex++) {
        if (periodIndex === 0) {
          tablePropsValues[Tiet[periodIndex] - 1][Thu - 1] = {
            className: "subject",
            classCode: MaLopMH,
            note: GhiChu,
            periods: lastPeriod - firstPeriod + 1,
            subjectName: TenMonHoc,
            room: GiangDuong,
            lecturer: GiaoVien,
            numberOfStudents: SoSV,
          };
        } else {
          tablePropsValues[Tiet[periodIndex] - 1][Thu - 1] = null;
        }
      }
    }

    const htmlTable: React.ReactNode = (
      <>
        {tablePropsValues.map((rowProps, rowIndex) => {
          return (
            <tr key={rowIndex}>
              {rowProps.map((cellProps, cellIndex) => {
                if (cellProps === null) {
                  return null;
                }
                switch (cellProps.className) {
                  case "subject": {
                    return <ScheduleCell key={cellIndex} {...cellProps} />;
                  }
                  case "period": {
                    return <td key={cellIndex} {...cellProps}></td>;
                  }
                  default: {
                    return <EmptyCell key={cellIndex} />;
                  }
                }
              })}
            </tr>
          );
        })}
      </>
    );
    return htmlTable;
  }
  return "";
}
