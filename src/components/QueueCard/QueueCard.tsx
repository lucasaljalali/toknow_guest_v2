import { MouseEvent, TouchEvent } from "react";
import { ITransformedInQueueData } from "../../pages/Home/utils/transformInQueueData";
import { Typography } from "@mui/material";
import DeviceIcon from "../DeviceIcon/DeviceIcon";

interface IQueueLongCard {
  data: ITransformedInQueueData;
  onCardClick: (event: MouseEvent | TouchEvent, data: ITransformedInQueueData) => void;
  onDeviceClick: (event: MouseEvent | TouchEvent, data: ITransformedInQueueData) => void;
}

export default function QueueCard({ data, onCardClick, onDeviceClick }: IQueueLongCard) {
  return (
    <div className="queueCard queueLongCardContainer" onClick={(e) => onCardClick(e, data)} onTouchEnd={(e) => onCardClick(e, data)}>
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
      <div className="queueCardItem" onClick={(e) => onDeviceClick(e, data)} onTouchEnd={(e) => onDeviceClick(e, data)}>
        <DeviceIcon
          lastNotificationTimeInMinutes={data?.lastNotificationTimeInMinutes}
          useSMS={data?.useSMS}
          deviceLabel={data?.deviceLabel}
          notifed={data?.notifed}
        />
      </div>
    </div>
  );
}
