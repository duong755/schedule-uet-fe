import axios, { AxiosRequestConfig } from "axios";

import { API_DOMAIN } from "../constants";
import { displayOverlay } from "./helpers";

const overlayInterceptor = (config: AxiosRequestConfig): AxiosRequestConfig => {
  displayOverlay(true);
  return config;
};

const axiosCommonInstance = axios.create({
  baseURL: API_DOMAIN
});

axiosCommonInstance.interceptors.request.use(overlayInterceptor);
axiosCommonInstance.interceptors.response.use(
  (value) => {
    displayOverlay(false);
    return value; 
  },
  (error) => {
    displayOverlay(false);
    return error;
  });

export { axiosCommonInstance };
