import { PropsWithChildren } from "react";

import { Class } from "../../types/SchedulesResponse";
import { PERIODS } from "../../constants";
import { getGroupName } from "../../common/helpers";

type ScheduleCellProps = {
  className?: string;
  classId?: string;
  teacher?: string;
  subjectName?: string;
  numberOfStudents?: number;
  place?: string;
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
  const { classId, periods, teacher, subjectName, numberOfStudents, place, note, className } = props;
  return (
    <td
      className={className}
      data-subject-id={classId}
      rowSpan={periods}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div>
        <strong>
          {classId} ({getGroupName(note as string)})
        </strong>
        <div className="subject--name">{subjectName}</div>
        <div className="subject--place">{place}</div>
        <div className="subject--teacher">{teacher}</div>
        <div>Số sinh viên: {numberOfStudents}</div>
      </div>
    </td>
  );
};

export function generateTableBody(classes: Class[] | null | undefined): React.ReactNode {
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
      const { classId, subjectName, place, numberOfStudents, note, teacher } = classItem;
      const { weekDay, periods } = classItem;
      const firstPeriod = Number(periods[0].$numberDouble);
      const lastPeriod = Number(periods[periods.length - 1].$numberDouble);
      for (let periodIndex = 0; periodIndex < periods.length; periodIndex++) {
        const periodAsNumber = Number(periods[periodIndex].$numberDouble);
        const weekDayAsNumber = Number(weekDay.$numberDouble);
        if (periodIndex === 0) {
          tablePropsValues[periodAsNumber - 1][weekDayAsNumber - 1] = {
            className: "subject",
            classId: classId,
            note: note,
            periods: lastPeriod - firstPeriod + 1,
            subjectName: subjectName,
            place: place,
            teacher: teacher,
            numberOfStudents: Number(numberOfStudents.$numberDouble),
          };
        } else {
          tablePropsValues[periodAsNumber - 1][weekDayAsNumber - 1] = null;
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
