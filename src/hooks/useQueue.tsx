import { createContext, useContext } from "react";
import { axiosInstance } from "../services/api/baseConfigs";
import { UseMutateFunction, useMutation, useQuery, useQueryClient } from "react-query";
import { InQueueItem } from "../services/api/dtos/Queue";
import { notificationDrawerOpen, sideDrawerOpen } from "../store/signalsStore";

const QueueContext = createContext({} as QueueContextData);

export function useQueue() {
  return useContext(QueueContext);
}

type Props = { children: JSX.Element | JSX.Element[] };

export interface IQueueRequestBody {
  clientsId: number[];
  subClientsId: number[];
  destinationId: number;
  deviceId?: number | string;
  carPlateNumber: string;
  carBackPlateNumber?: string;
  driverName?: string;
  driverPhonePrefix?: string;
  driverPhone?: string;
  prioritiesId?: number[];
  observations?: string;
  useSMS: boolean;
  id?: number;
}

export interface INotifyQueueRequestBody {
  id?: number | string;
  actionId?: number;
  destinationId?: number;
  messageId?: number;
  message?: string;
}
export interface QueueContextData {
  queue?: InQueueItem[];
  addQueue: UseMutateFunction<any, unknown, IQueueRequestBody, unknown>;
  updateQueue: UseMutateFunction<any, unknown, IQueueRequestBody, unknown>;
  notifyQueue: UseMutateFunction<any, unknown, INotifyQueueRequestBody, unknown>;
  isLoading: boolean;
}
export function QueueProvider({ children }: Props) {
  const queryClient = useQueryClient();

  const { data: queue, isLoading: isQueueLoading } = useQuery(["queue"], {
    queryFn: async () => {
      const response = await axiosInstance.get("queues");
      return response.data.data as InQueueItem[];
    },
    retry: true,
    retryDelay: 5000,
    refetchInterval: 5000,
  });

  const { mutate: addQueue, isLoading: isAddQueueLoading } = useMutation({
    mutationFn: async (queueRequestBody: IQueueRequestBody) => {
      const response = await axiosInstance.post("queues", queueRequestBody);
      return response.data.data;
    },
    onSuccess: () => {
      if (sideDrawerOpen.value) sideDrawerOpen.value = false;
      queryClient.invalidateQueries(["queue"]);
      //TODO: implement optimistic update
    },
  });

  const { mutate: updateQueue, isLoading: isUpdateQueueLoading } = useMutation({
    mutationFn: async (queueRequestBody: IQueueRequestBody) => {
      const response = await axiosInstance.put(`queues/${queueRequestBody?.id}`, queueRequestBody);
      return response.data.data as InQueueItem;
    },
    onSuccess: () => {
      if (sideDrawerOpen.value) sideDrawerOpen.value = false;
      queryClient.invalidateQueries(["queue"]);
      //TODO: implement optimistic update
    },
  });

  const { mutate: notifyQueue, isLoading: isNotifyQueueLoading } = useMutation({
    mutationFn: async (notifyQueueRequestBody: INotifyQueueRequestBody) => {
      const response = await axiosInstance.put(`queues/${notifyQueueRequestBody?.id}/notify`, notifyQueueRequestBody);
      console.log({ response });
      return response.data;
    },
    onSuccess: () => {
      if (notificationDrawerOpen.value) notificationDrawerOpen.value = false;
      queryClient.invalidateQueries(["queue"]);
      //TODO: implement optimistic update
    },
  });

  const isLoading = isQueueLoading || isAddQueueLoading || isUpdateQueueLoading || isNotifyQueueLoading;

  const value: QueueContextData = {
    queue,
    addQueue,
    updateQueue,
    notifyQueue,
    isLoading,
  };

  return <QueueContext.Provider value={value}>{children}</QueueContext.Provider>;
}
