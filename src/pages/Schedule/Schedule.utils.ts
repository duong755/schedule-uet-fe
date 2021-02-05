import { ScheduleResponse } from "../../types/ScheduleResponse";
import { PERIODS } from "../../constants";

export function generateHtmlTable(
  classes: ScheduleResponse.ClassInfo[] | null | undefined
): string {
  const defaultRow: string[] = [...Array(8)].map(() => "<td></td>");
  const table: string[][] = [...Array<string[]>(14)].map((_, rowIndex) => {
    const newRow: string[] = defaultRow.slice(0);
    newRow[0] = `<td class="period">${PERIODS[rowIndex]}</td>`;
    return newRow;
  });

  if (classes) {
    for (let classIndex = 0; classIndex < classes.length; classIndex++) {
      const classItem = classes[classIndex];
      const {
        MaLopMH,
        GiangDuong,
        GiaoVien,
        TenMonHoc,
        SoSV,
        GhiChu,
      } = classItem;
      const { Thu, Tiet } = classItem as { Thu: number; Tiet: number[] };
      const firstPeriod = Tiet[0];
      const lastPeriod = Tiet.slice(0).pop() as number;
      for (let periodIndex = 0; periodIndex < Tiet.length; periodIndex++) {
        if (periodIndex === 0) {
          table[Tiet[periodIndex] - 1][
            Thu - 1
          ] = `<td class="subject" data-subject-id="${MaLopMH}" rowspan="${lastPeriod - firstPeriod + 1}">
              <div>
                <strong>${MaLopMH} (${GhiChu})</strong>
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
      for (let cellIndex = 0; cellIndex < table[rowIndex].length; cellIndex++) {
        htmlRow += table[rowIndex][cellIndex];
      }
      htmlRow = `<tr>${htmlRow}</tr>`;
      htmlTable += htmlRow;
    }
    return htmlTable;
  }
  return "";
}
