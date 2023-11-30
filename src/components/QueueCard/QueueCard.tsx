import { MouseEvent, TouchEvent } from "react";
import { ITransformedInQueueData } from "../../pages/Home/utils/transformInQueueData";
import { Button, Typography } from "@mui/material";
import { useQueue } from "../../hooks/useQueue";
import { InQueueItem } from "../../services/api/dtos/Queue";
import { notificationDrawerOpen, queueCardSize } from "../../store/signalsStore";
import DeviceIcon from "../DeviceIcon/DeviceIcon";

interface IQueueLongCard {
  data: ITransformedInQueueData;
}

export default function QueueCard({ data }: IQueueLongCard) {
  const { notifyQueue } = useQueue();
  const doubleTouchThreshold = 300;
  const longPressThreshold = 2000;
  let firstTouchTimestamp = 0;
  let pressTimer: number | null = null;

  function handleDeviceMouseDown(event: MouseEvent | TouchEvent) {
    if (event.type === "mousedown" || event.type === "touchstart") {
      pressTimer = setTimeout(() => {
        notificationDrawerOpen.value = !notificationDrawerOpen.value;
        pressTimer = null;
      }, longPressThreshold);
    }
  }

  function handleDeviceMouseUp(event: MouseEvent | TouchEvent) {
    if (event.type === "mouseup" || event.type === "touchend") {
      if (pressTimer) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }
    }
  }

  function handleDeviceClick(event: MouseEvent | TouchEvent, data: InQueueItem) {
    event.preventDefault();

    if (event.type === "mouseup" || event.type === "touchend") {
      if (pressTimer) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }
    }

    if (firstTouchTimestamp === 0) {
      firstTouchTimestamp = event.timeStamp;
    } else {
      const timeDifference = event.timeStamp - firstTouchTimestamp;

      if (timeDifference <= doubleTouchThreshold) {
        // This is a double touch
        event.stopPropagation();
        const clickedDevice = event.currentTarget?.querySelector(".deviceIcon");
        clickedDevice?.classList.add("active");
        setTimeout(() => {
          clickedDevice?.classList.remove("active");
        }, 2000);
        handleNotifyDevice(data?.id, 2, data?.currentDestinationId, 1);

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
      handleNotifyDevice(data?.id, 2, data?.currentDestinationId, 1);
    }
  }

  function handleNotifyDevice(queueId?: string | number, actionId?: number, destinationId?: number, messageId?: number) {
    if (queueId) {
      const dataToSubmit = { id: queueId, actionId: actionId, destinationId: destinationId, messageId: messageId };
      notifyQueue(dataToSubmit);
    }
  }

  return (
    <div className={`queueCard`}>
      {queueCardSize.value !== "small" && (
        <div className="queueCardItem">
          <Typography className="partySizeTag">{data?.partySize}</Typography>
        </div>
      )}
      {queueCardSize.value === "large" && (
        <>
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
        </>
      )}
      {queueCardSize.value !== "small" && (
        <div className="queueCardItem">
          <Typography variant="h5">{data?.waitingTimeInMinutes ? `${data.waitingTimeInMinutes}m` : undefined}</Typography>
        </div>
      )}
      {queueCardSize.value === "large" && (
        <div className="queueCardItem">
          <Typography variant="h5">{data?.estimatedTime ? `${data.estimatedTime}m` : undefined}</Typography>
        </div>
      )}
      <div className="queueCardItem">
        <Button
          onClick={(e) => handleDeviceClick(e, data)}
          onTouchStart={handleDeviceMouseDown}
          onTouchEnd={(e) => handleDeviceClick(e, data)}
          onMouseDown={handleDeviceMouseDown}
          onMouseUp={handleDeviceMouseUp}
        >
          <DeviceIcon
            time={queueCardSize.value === "small" ? data?.waitingTimeInMinutes : data?.lastNotificationTimeInMinutes}
            useSMS={data?.useSMS}
            deviceLabel={data?.deviceLabel}
            notifed={data?.notifed}
          ></DeviceIcon>
        </Button>
      </div>
    </div>
  );
}
