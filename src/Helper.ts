import { ClassInfo } from "./Response";

export function setPageTitle(title: string): void {
  document.title = title;
}

export function generateHtmlTable(
  classes: ClassInfo[] | null | undefined
): string {
  const defaultRow: string[] = [...Array(8)].map(() => "<td></td>");
  const table: string[][] = [...Array<string[]>(14)].map((_, rowIndex) => {
    const newRow: string[] = defaultRow.slice(0);
    newRow[0] = `<td class="period">${rowIndex + 1}</td>`;
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
          ] = `<td class="subject" rowspan="${lastPeriod - firstPeriod + 1}">
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
