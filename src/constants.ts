export const NOT_IMPLEMENTED = "Tính năng này chưa được cài đặt";

export const API_DOMAIN = "https://schedule-uet.herokuapp.com";

export const PERIODS = [...Array<string>(14)].map((_, index) => {
  return `${index + 7}h - ${index + 7}h50'`;
});
