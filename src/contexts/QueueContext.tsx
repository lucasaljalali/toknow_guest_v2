import { MutableRefObject, createContext, useContext, useEffect, useRef, useState } from "react";
import { axiosInstance } from "../services/api/baseConfigs";
import { useQuery } from "react-query";
import { useCompany } from "./CompanyContext";
import { InQueueItem } from "../services/api/dtos/Queue";

const QueueContext = createContext({} as QueueContextData);

export function useQueue() {
  return useContext(QueueContext);
}

type Props = { children: JSX.Element | JSX.Element[] };

interface IAddQueueRequestBody {
  clientsId: number[];
  subClientsId: number[];
  destinationId: number;
  deviceId: number | string;
  carPlateNumber: string;
  observations: string;
  useSMS: boolean;
}

interface INotifyQueueRequestBody {
  id?: number | string;
  actionId?: number;
  destinationId?: number;
  messageId?: number;
}
interface QueueContextData {
  queue: InQueueItem[];
  addQueue: () => Promise<any>;
  addQueueRequestBody: MutableRefObject<IAddQueueRequestBody>;
  notifyQueue: () => Promise<any>;
  notifyQueueRequestBody: MutableRefObject<INotifyQueueRequestBody>;
}

export function QueueProvider({ children }: Props) {
  const [queue, setQueue] = useState<InQueueItem[]>([]);

  const addQueueRequestBody = useRef<IAddQueueRequestBody>({
    clientsId: [1],
    subClientsId: [1],
    destinationId: 1,
    deviceId: 4,
    carPlateNumber: "1", //workaround to use premium api as partySize
    observations: "", //workaround to use premium api as estimatedTime
    useSMS: false,
  });

  const notifyQueueRequestBody = useRef<INotifyQueueRequestBody>({
    id: undefined,
    actionId: undefined,
    destinationId: undefined,
    messageId: undefined,
  });

  const getQueue = async () => {
    const response = await axiosInstance.get("queues");
    return response.data.data;
  };

  const addQueue = async () => {
    const response = await axiosInstance.post("queues", addQueueRequestBody?.current);
    refetchGetQueue();
    return response.data.data;
  };

  const notifyQueue = async () => {
    const response = await axiosInstance.put(`queues/${notifyQueueRequestBody?.current?.id}/notify`, notifyQueueRequestBody?.current);
    refetchGetQueue();
    return response.data.data;
  };

  // const dataToApi: OutQueueItem = {
  //   id: data.id,
  //   deviceId: data.deviceId,
  //   useSMS: data.useSMS,
  //   destinationId: data.destinationId,
  //   clientsId: data.clients,
  //   subClientsId: data.clients2,
  //   scheduleId: data.schedulingId,
  //   driverName: data.driverName,
  //   driverLocaleId: data.driverLocaleId,
  //   driverId: data.driverId,
  //   driverPhonePrefix: data.driverPhonePrefix,
  //   driverPhone: data.driverPhone,
  //   carPlateNumber: data.carPlate,
  //   carBackPlateNumber: data.carBackPlate,
  //   prioritiesId: data.priorities,
  //   serviceId: data.serviceId,
  //   observations: data.observations,
  // };

  const {} = useQuery(["notifyQueue"], notifyQueue, {
    enabled: false,
    onSuccess: (data) => {
      setQueue(data);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const { refetch: refetchGetQueue } = useQuery(["getQueue"], getQueue, {
    retry: true,
    retryDelay: 5000,
    refetchInterval: 5000,
    onSuccess: (data) => {
      setQueue(data);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const value: QueueContextData = {
    queue,
    addQueue,
    addQueueRequestBody,
    notifyQueue,
    notifyQueueRequestBody,
  };

  return <QueueContext.Provider value={value}>{children}</QueueContext.Provider>;
}
