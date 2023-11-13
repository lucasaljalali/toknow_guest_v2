import { MouseEvent, TouchEvent } from "react";
import { ITransformedInQueueData } from "../../pages/Home/utils/transformInQueueData";
import { Button, Typography } from "@mui/material";
import { useQueue } from "../../contexts/QueueContext";
import { InQueueItem } from "../../services/api/dtos/Queue";
import DeviceIcon from "../DeviceIcon/DeviceIcon";

interface IQueueLongCard {
  data: ITransformedInQueueData;
}

export default function QueueCard({ data }: IQueueLongCard) {
  const { notifyQueue, notifyQueueRequestBody } = useQueue();
  const doubleTouchThreshold = 300;
  let firstTouchTimestamp = 0;

  function handleDeviceClick(event: MouseEvent | TouchEvent, data: InQueueItem) {
    event.stopPropagation();
    event.preventDefault();

    if (firstTouchTimestamp === 0) {
      firstTouchTimestamp = event.timeStamp;
    } else {
      const timeDifference = event.timeStamp - firstTouchTimestamp;

      if (timeDifference <= doubleTouchThreshold) {
        // This is a double touch
        const clickedDevice = event.currentTarget?.querySelector(".deviceIcon");
        clickedDevice?.classList.add("active");
        setTimeout(() => {
          clickedDevice?.classList.remove("active");
        }, 2000);
        handleNotifyDevice(data?.id, 2, data?.currentDestinationId, 2);

        // Reset the timestamp
        firstTouchTimestamp = 0;
        return;
      }
    }

    // If it's not a double touch, reset the timestamp
    firstTouchTimestamp = event.timeStamp;

    if (event.detail === 2) {
      const clickedDevice = event.currentTarget?.querySelector(".deviceIcon");
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
    <div className="queueCard queueLongCardContainer">
      <div className="queueCardItem">
        <Typography className="partySizeTag">{data?.partySize}</Typography>
      </div>
      <div className="queueCardItem">
        <Typography variant="subtitle1">{data?.name}</Typography>
      </div>
      <div className="queueCardItem">
        <div className="arrayToStringLines">
          {data?.prioritiesLabels?.map((priority, index) => (
            <Typography key={index} variant="caption">
              {priority}
            </Typography>
          ))}
        </div>
      </div>
      <div className="queueCardItem">
        <Typography variant="h5">{data?.waitingTimeInMinutes ? `${data.waitingTimeInMinutes}m` : undefined}</Typography>
      </div>
      <div className="queueCardItem">
        <Typography variant="h5">{data?.estimatedTime ? `${data.estimatedTime}m` : undefined}</Typography>
      </div>
      <div className="queueCardItem">
        <Button onClick={(e) => handleDeviceClick(e, data)} onTouchEnd={(e) => handleDeviceClick(e, data)}>
          <DeviceIcon
            lastNotificationTimeInMinutes={data?.lastNotificationTimeInMinutes}
            useSMS={data?.useSMS}
            deviceLabel={data?.deviceLabel}
            notifed={data?.notifed}
          ></DeviceIcon>
        </Button>
      </div>
    </div>
  );
}
