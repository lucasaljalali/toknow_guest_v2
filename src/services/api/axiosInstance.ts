import { accessToken, company } from "../../store/signalsStore";
import axios from "axios";
import i18n from "../translations/i18n";

export const axiosInstance = axios.create({
  baseURL: "https://dev.totalexpansion.pt/devapi/v2/",
  headers: {
    common: {
      locale: i18n?.language,
      tenant: company.value,
      Authorization: `Bearer ${accessToken.value}`,
    },
  },
});
