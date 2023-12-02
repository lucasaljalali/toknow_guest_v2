import { useQuery } from "react-query";
import { axiosInstance } from "../services/api/axiosInstance";
import { availableDevices, companyConfigs } from "../store/signalsStore";

export default function useCompany() {
  return useQuery(["configs"], {
    queryFn: async () => {
      const response = await axiosInstance?.get("config");
      return response?.data.data;
    },
    enabled: false,
    retry: true,
    retryDelay: 5000,
    onSuccess: (data) => {
      companyConfigs.value = data;
      availableDevices.value = companyConfigs.value?.formFieldsData?.devices?.filter((device) => device.isAvailable === true);
    },
  });
}
