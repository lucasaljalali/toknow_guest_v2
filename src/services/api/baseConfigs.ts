import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://dev.totalexpansion.pt/devapi/v2/",
});
