import { axiosInstance } from "../services/api/axiosInstance";
import { UseMutateFunction, useMutation, useQuery, useQueryClient } from "react-query";
import { InQueueItem } from "../services/api/dtos/Queue";
import { companyConfigs, notificationDrawerOpen, sideDrawerOpen } from "../store/signalsStore";

export interface IQueueRequestBody {
  clientsId: number[];
  subClientsId: number[];
  destinationId: number;
  deviceId?: number | string | null;
  carPlateNumber: string;
  carBackPlateNumber?: string;
  driverName?: string;
  driverPhonePrefix?: string;
  driverPhone?: string;
  prioritiesId?: number[];
  observations?: string;
  useSMS: boolean;
  id?: number | null;
}

export interface INotifyQueueRequestBody {
  id?: number | string;
  actionId?: number;
  destinationId?: number;
  messageId?: number;
  message?: string;
}
export interface QueueContextData {
  queue: InQueueItem[] | undefined;
  addQueue: UseMutateFunction<any, unknown, IQueueRequestBody, unknown>;
  updateQueue: UseMutateFunction<any, unknown, IQueueRequestBody, unknown>;
  notifyQueue: UseMutateFunction<any, unknown, INotifyQueueRequestBody, unknown>;
  isLoading: boolean;
}
export function useQueue() {
  const queryClient = useQueryClient();

  const { data: queue, isLoading: isQueueLoading } = useQuery(["queue"], {
    queryFn: async () => {
      const response = await axiosInstance?.get("queues");
      return response?.data.data as InQueueItem[];
    },
    enabled: companyConfigs.value !== null,
    retry: true,
    retryDelay: 5000,
    refetchInterval: 5000,
  });

  const { mutate: addQueue, isLoading: isAddQueueLoading } = useMutation({
    mutationFn: async (queueRequestBody: IQueueRequestBody) => {
      const response = await axiosInstance?.post("queues", queueRequestBody);
      return response?.data.data;
    },
    onSuccess: () => {
      if (sideDrawerOpen.value) sideDrawerOpen.value = false;
      queryClient.invalidateQueries(["queue"]);
      //TODO: implement optimistic update
    },
  });

  const { mutate: updateQueue, isLoading: isUpdateQueueLoading } = useMutation({
    mutationFn: async (queueRequestBody: IQueueRequestBody) => {
      const response = await axiosInstance?.put(`queues/${queueRequestBody?.id}`, queueRequestBody);
      return response?.data.data as InQueueItem;
    },
    onSuccess: () => {
      if (sideDrawerOpen.value) sideDrawerOpen.value = false;
      queryClient.invalidateQueries(["queue"]);
      //TODO: implement optimistic update
    },
  });

  const { mutate: notifyQueue, isLoading: isNotifyQueueLoading } = useMutation({
    mutationFn: async (notifyQueueRequestBody: INotifyQueueRequestBody) => {
      const response = await axiosInstance?.put(`queues/${notifyQueueRequestBody?.id}/notify`, notifyQueueRequestBody);
      return response?.data;
    },
    onSuccess: () => {
      if (notificationDrawerOpen.value) notificationDrawerOpen.value = false;
      queryClient.invalidateQueries(["queue"]);
      //TODO: implement optimistic update
    },
  });

  const isLoading = isQueueLoading || isAddQueueLoading || isUpdateQueueLoading || isNotifyQueueLoading;

  return {
    queue,
    addQueue,
    updateQueue,
    notifyQueue,
    isLoading,
  };
}
