import { Dispatch, MutableRefObject, SetStateAction, createContext, useContext, useMemo, useRef, useState } from "react";
import { axiosInstance } from "../services/api/baseConfigs";
import { useQuery } from "react-query";
import { InQueueItem } from "../services/api/dtos/Queue";
import isEqual from "lodash/isEqual";

const QueueContext = createContext({} as QueueContextData);

export function useQueue() {
  return useContext(QueueContext);
}

type Props = { children: JSX.Element | JSX.Element[] };

interface IAddQueueRequestBody {
  clientsId: number[];
  subClientsId: number[];
  destinationId: number;
  deviceId?: number | string;
  carPlateNumber: string;
  carBackPlateNumber?: string;
  observations?: string;
  useSMS: boolean;
  id?: number;
}

interface INotifyQueueRequestBody {
  id?: number | string;
  actionId?: number;
  destinationId?: number;
  messageId?: number;
  message?: string;
}
interface QueueContextData {
  queue: InQueueItem[];
  addQueue: () => Promise<any>;
  updateQueue: () => Promise<any>;
  addQueueRequestBody: MutableRefObject<IAddQueueRequestBody | null>;
  notifyQueue: () => Promise<any>;
  notifyQueueRequestBody: MutableRefObject<INotifyQueueRequestBody>;
  queueAlert: { [key: string]: string } | null;
  setQueueAlert: Dispatch<SetStateAction<{ [key: string]: string } | null>>;
}
export function QueueProvider({ children }: Props) {
  const [queue, setQueue] = useState<InQueueItem[]>([]);
  const [queueAlert, setQueueAlert] = useState<{ [key: string]: string } | null>(null);

  const addQueueRequestBody = useRef<IAddQueueRequestBody | null>(null);

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

  const updateQueue = async () => {
    const response = await axiosInstance.put(`queues/${addQueueRequestBody?.current?.id}`, addQueueRequestBody?.current);
    refetchGetQueue();
    return response.data.data;
  };

  const notifyQueue = async () => {
    const response = await axiosInstance.put(`queues/${notifyQueueRequestBody?.current?.id}/notify`, notifyQueueRequestBody?.current);

    if (response?.data?.code === 1000) {
      setQueueAlert({ success: response?.data?.message });
      refetchGetQueue();
      return response.data;
    }

    setQueueAlert({ error: response?.data?.message });
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

  const { refetch: refetchGetQueue } = useQuery(["getQueue"], getQueue, {
    retry: true,
    retryDelay: 5000,
    refetchInterval: 5000,
    onSuccess: (data) => {
      if (!isEqual(queue, data)) {
        setQueue(data);
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const value: QueueContextData = useMemo(
    () => ({
      queue,
      addQueue,
      updateQueue,
      addQueueRequestBody,
      notifyQueue,
      notifyQueueRequestBody,
      queueAlert,
      setQueueAlert,
    }),
    [queue, queueAlert]
  );

  return <QueueContext.Provider value={value}>{children}</QueueContext.Provider>;
}
