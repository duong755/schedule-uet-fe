export const NOT_IMPLEMENTED = "Tính năng này chưa được cài đặt";

export const API_GET_SCHEDULE = "https://schedule-uet.herokuapp.com/get-schedule";
export const API_EXCEL = "https://schedule-uet.herokuapp.com/export-schedule-excel";

export const PERIODS = [...Array<string>(14)].map((_, index) => {
  return `${index + 7}h - ${index + 7}h50'`;
});
