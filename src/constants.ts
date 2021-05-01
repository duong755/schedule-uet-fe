export const NOT_IMPLEMENTED = "Tính năng này chưa được cài đặt";

export const SCHEDULES =
  "https://ap-southeast-1.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/schedule-app-lovnk/service/schedules/incoming_webhook/schedules";

export const CLASSMEMBERS =
  "https://ap-southeast-1.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/schedule-app-lovnk/service/classmembers/incoming_webhook/classmembers";

export const API_DOMAIN = "https://schedule-uet.herokuapp.com";

export const PERIODS = [...Array<string>(14)].map((_, index) => {
  return `${index + 7}h - ${index + 7}h50'`;
});
