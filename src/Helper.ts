import { ClassInfo, ResponseItem } from "./Response";

export function convertPeriodsFromStringToArray(str: string): number[] {
  const PERIOD_REGEX = new RegExp("^(\\d{1,2})-(\\d{1,2})$");
  if (PERIOD_REGEX.test(str)) {
    str.match(PERIOD_REGEX);
    const first = Number(RegExp.$1);
    const last = Number(RegExp.$2);
    if (first === last) {
      return [first];
    }
    const periods: number[] = [];
    for (
      let i = first;
      i <= last;
      i += (last - first) / Math.abs(last - first)
    ) {
      periods.push(i);
    }
    return periods;
  }
  return [];
}

export function formatClassInfo(
  responseData: ResponseItem[]
): ClassInfo[] | null {
  const mapResult = responseData
    .filter((responseItem) => {
      return !!responseItem.ThongTinLopHoc;
    })
    .map((responseItem) => {
      const convertItem = responseItem.ThongTinLopHoc.map((item) => {
        const ThuAsNumber = Number(item.Thu) ? Number(item.Thu) : 8;
        const TietAsArray = convertPeriodsFromStringToArray(
          item.Tiet as string
        );
        return {
          ...item,
          Thu: ThuAsNumber,
          Tiet: TietAsArray,
        };
      });
      return [...convertItem];
    });
  const flatResult = mapResult.flat();
  const sortResult = flatResult.sort((classItem1, classItem2) => {
    if (classItem1.Tiet[0] === classItem2.Tiet[0]) {
      return classItem1.Thu - classItem2.Thu;
    }
    return classItem1.Tiet[0] - classItem2.Tiet[0];
  });
  return sortResult;
}

export function generateHtmlTable(classes: ClassInfo[] | null): string {
  const defaultRow: string[] = [...Array(8)].map(() => "<td></td>");
  const table: string[][] = [...Array<string[]>(14)].map((_, rowIndex) => {
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
