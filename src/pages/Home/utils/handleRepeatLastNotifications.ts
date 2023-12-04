import { UseMutateFunction } from "react-query";
import { InQueueItem } from "../../../services/api/dtos/Queue";
import { INotifyQueueRequestBody } from "../../../hooks/useQueue";

export function handleRepeatLastNotifications(
  queue: InQueueItem[] | undefined,
  interval: number,
  notifyQueue: UseMutateFunction<any, unknown, INotifyQueueRequestBody, unknown>
) {
  queue?.forEach((item: InQueueItem) => {
    const isNotified = item?.lastActionId !== 1;

    if (isNotified) {
      const lastNotification = item?.history?.[item?.history?.length - 1];
      const lastNotificationTime = lastNotification?.createdDate ? new Date(lastNotification.createdDate)?.getTime() : null;
      const shouldRenotify = lastNotificationTime && (Date.now() - lastNotificationTime) / 60000 >= interval;

      if (shouldRenotify) {
        const dataToSubmit = item?.id
          ? {
              id: item.id,
              actionId: 2,
              destinationId: item.currentDestinationId,
              message: item.lastMessage,
            }
          : null;

        const clickedDevice = document.getElementById(`${item.id}`)?.querySelector(".deviceIcon");
        clickedDevice?.classList.add("active");
        setTimeout(() => {
          clickedDevice?.classList.remove("active");
        }, 2000);

        dataToSubmit && notifyQueue(dataToSubmit);
      }
    }
  });
}
