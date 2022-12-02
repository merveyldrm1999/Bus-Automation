import { Remove } from "@mui/icons-material";
import axios from "axios";
import Router from "next/router";

const instance = axios.create({
  baseURL: "http://192.168.0.197/api/",
  timeout: 1000,
  headers: {
    Authorization:
      typeof window !== "undefined" ? localStorage.getItem("jwt") : "",
  },
});

instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    localStorage.removeItem("jwt");
    // Router.push("/");
    // window.location.href = "/";
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export default instance;
