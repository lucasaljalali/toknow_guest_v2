import { Badge, Typography } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";

interface IPagerCard {
  useSMS?: boolean;
  deviceLabel?: string | number;
  time?: number | string;
  notified?: boolean;
  notifiedTimes?: number;
}

export default function DeviceIcon({ useSMS, deviceLabel, time, notified, notifiedTimes }: IPagerCard) {
  return (
    <div className="deviceIcon" title={useSMS ? `${deviceLabel}` : undefined}>
      <Typography variant="h1" style={{ background: notified ? "#22657A" : undefined }}>
        {useSMS ? <PhoneIcon /> : deviceLabel}
        {<Typography variant="caption">{time ? `${time}m` : undefined}</Typography>}
      </Typography>
      {notifiedTimes != undefined && notifiedTimes > 0 && <Badge id={"deviceIconBadge"} badgeContent={String(notifiedTimes)} />}
    </div>
  );
}
