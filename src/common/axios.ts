import axios, { AxiosRequestConfig } from "axios";

import { CLASSMEMBERS, SCHEDULES } from "../constants";
import { displayOverlay } from "./helpers";

const overlayInterceptor = (config: AxiosRequestConfig): AxiosRequestConfig => {
  displayOverlay(true);
  return config;
};

const axiosSchedulesInstance = axios.create({
  baseURL: SCHEDULES,
});
const axiosClassMembersInstance = axios.create({
  baseURL: CLASSMEMBERS,
});

axiosSchedulesInstance.interceptors.request.use(overlayInterceptor);
axiosSchedulesInstance.interceptors.response.use(
  (value) => {
    displayOverlay(false);
    return value;
  },
  (error) => {
    displayOverlay(false);
    return error;
  }
);

axiosClassMembersInstance.interceptors.request.use(overlayInterceptor);
axiosClassMembersInstance.interceptors.response.use(
  (value) => {
    displayOverlay(false);
    return value;
  },
  (error) => {
    displayOverlay(false);
    return error;
  }
);

export { axiosSchedulesInstance, axiosClassMembersInstance };
