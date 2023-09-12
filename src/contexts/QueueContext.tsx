import { createContext, useContext, useEffect, useState } from "react";
import { axiosInstance } from "../services/api/baseConfigs";
import { useQuery } from "react-query";
import { useCompany } from "./CompanyContext";
import { InQueueItem } from "../services/api/dtos/Queue";

const QueueContext = createContext({} as QueueContextData);

export function useQueue() {
  return useContext(QueueContext);
}

type Props = { children: JSX.Element | JSX.Element[] };

interface QueueContextData {
  queue: InQueueItem[];
}

export function QueueProvider({ children }: Props) {
  const [queue, setQueue] = useState<InQueueItem[]>([]);

  const { companyConfigs, accessToken } = useCompany();

  const fetchData = async () => {
    const response = await axiosInstance.get("queues");
    return response.data.data;
  };

  const { refetch: refetchQueue } = useQuery(["queues"], fetchData, {
    enabled: false,
    retry: true,
    retryDelay: 5000,
    onSuccess: (data) => {
      setQueue(data);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  useEffect(() => {
    if (companyConfigs && accessToken) {
      refetchQueue();
    }
  }, [companyConfigs, accessToken]);

  const value = {
    queue,
    setQueue,
  };

  return <QueueContext.Provider value={value}>{children}</QueueContext.Provider>;
}
