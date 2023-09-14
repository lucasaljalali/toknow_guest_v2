import { MouseEvent } from "react";
import { InQueueItem } from "../../services/api/dtos/Queue";
import { Typography } from "@mui/material";
import { useQueue } from "../../contexts/QueueContext";
import { useCompany } from "../../contexts/CompanyContext";
import PagerCard from "../PagerCard/PagerCard";

interface IQueueLongCard {
  data: InQueueItem;
}

export default function QueueLongCard({ data }: IQueueLongCard) {
  const { notifyQueue, notifyQueueRequestBody } = useQueue();
  const { companyConfigs } = useCompany();
  const partySize = data?.carPlate; //workaround to use premium api
  const name = data?.driverName; //workaround to use premium api
  const estimateDate = data?.observations; //workaround to use premium api
  const priorities = data?.priorities?.map(
    (priority) => companyConfigs?.formFieldsData?.priorities?.find((item) => item.id === priority)?.label
  );
  const createdDate = data.createdDate && new Date(data.createdDate);
  const currentDate = new Date();
  const waitingTimeInMs = createdDate && currentDate.getTime() - createdDate.getTime();
  const waitingTimeInMinutes = waitingTimeInMs && Math.floor(waitingTimeInMs / (1000 * 60));
  const estimateTimeInMs = estimateDate && createdDate && new Date(estimateDate).getTime() - createdDate.getTime();
  const estimateTimeInMinutes = estimateTimeInMs ? Math.floor(estimateTimeInMs / (1000 * 60)) : undefined;
  const lastNotification = data?.history?.find((action) => action.actionId === 2);
  const lastNotificationTime = lastNotification?.createdDate;
  const lastNotificationTimeInMs = lastNotificationTime && currentDate.getTime() - new Date(lastNotificationTime).getTime();
  const lastNotificationTimeInMinutes = lastNotificationTimeInMs ? Math.floor(lastNotificationTimeInMs / (1000 * 60)) : undefined;
  const useSMS = data?.useSMS;
  const deviceLabel = data?.deviceId;
  const notifed = lastNotification != undefined;

  function handleClick(event: MouseEvent) {
    event.stopPropagation();
    if (event.detail === 2) {
      const clickedDevice = event.currentTarget.querySelector(".deviceIcon");
      clickedDevice?.classList.add("active");
      setTimeout(() => {
        clickedDevice?.classList.remove("active");
      }, 2000);
      handleNotifyDevice(data?.id, 2, data?.currentDestinationId, 2);
    }
  }

  function handleNotifyDevice(queueId?: string | number, actionId?: number, destinationId?: number, messageId?: number) {
    if (queueId) {
      notifyQueueRequestBody.current = { id: queueId, actionId: actionId, destinationId: destinationId, messageId: messageId };
      notifyQueue();
    }
  }

  return (
    <div className="queueLongCardContainer">
      <div className="queueCardItem">
        <Typography className="partySizeTag">{partySize}</Typography>
      </div>
      <div className="queueCardItem">
        <Typography variant="subtitle1">{name}</Typography>
      </div>
      <div className="queueCardItem">
        <div className="arrayToStringLines">
          {priorities?.map((priority, index) => (
            <Typography key={index} variant="caption">
              {priority}
            </Typography>
          ))}
        </div>
      </div>
      <div className="queueCardItem">
        <Typography variant="h5">{waitingTimeInMinutes ? `${waitingTimeInMinutes}m` : undefined}</Typography>
      </div>
      <div className="queueCardItem">
        <Typography variant="h5">{estimateTimeInMinutes ? `${estimateTimeInMinutes}m` : undefined}</Typography>
      </div>
      <div className="queueCardItem" onClick={handleClick}>
        <PagerCard
          lastNotificationTimeInMinutes={lastNotificationTimeInMinutes}
          useSMS={useSMS}
          deviceLabel={deviceLabel}
          notifed={notifed}
        />
      </div>
    </div>
  );
}
