// import { InQueueItem } from "../../services/api/dtos/Queue";

import { IconButton, Typography } from "@mui/material";

interface IQueueLongCard {
  //   data: InQueueItem;
  data: {
    id: number;
  };
}

const name = "Lucas Moreira";
const priorities = ["Grávida", "Criança de colo"];
const waitingTimeInMin = 20;
const estimateTime = "4:15pm";
const notificationTime = "00:15:00";
const notificationDays = 2;
const useSMS = false;
const deviceLabel = "1";
const background = undefined;

export default function QueueLongCard({ data }: IQueueLongCard) {
  return (
    <div className="queueCardContainer">
      <div className="queueCardItem">
        <IconButton className="partySizeTag">
          <Typography>{data.id}</Typography>
        </IconButton>
      </div>
      <div className="queueCardItem">
        <Typography variant="subtitle1">{name}</Typography>
      </div>
      <div className="queueCardItem">
        <div className="arrayToStringLines">
          {priorities?.map((priority) => (
            <Typography key={priority} variant="caption">
              {priority}
            </Typography>
          ))}
        </div>
      </div>
      <div className="queueCardItem">
        <Typography variant="h5">{`${waitingTimeInMin}m`}</Typography>
      </div>
      <div className="queueCardItem">
        <Typography variant="h5">{estimateTime}</Typography>
      </div>
      <div className="queueCardItem">
        <div className="deviceIcon">
          <Typography variant="h1" style={{ background: background }}>
            {useSMS ? <i className="pi pi-phone"></i> : deviceLabel}
            <Typography variant="caption">
              {notificationTime?.slice(0, -3)}
              {notificationDays >= 1 && <Typography variant="caption">{"+" + notificationDays + " "}</Typography>}
            </Typography>
          </Typography>
        </div>
      </div>
    </div>
  );
}
