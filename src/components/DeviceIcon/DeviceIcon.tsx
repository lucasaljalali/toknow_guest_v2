import { Typography } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";

interface IPagerCard {
  useSMS?: boolean;
  deviceLabel?: string | number;
  time?: number | string;
  notifed?: boolean;
}

export default function DeviceIcon({ useSMS, deviceLabel, time, notifed }: IPagerCard) {
  return (
    <div className="deviceIcon" title={useSMS ? `${deviceLabel}` : undefined}>
      <Typography variant="h1" style={{ background: notifed ? "#22657A" : undefined }}>
        {useSMS ? <PhoneIcon /> : deviceLabel}
        {<Typography variant="caption">{time ? `${time}m` : undefined}</Typography>}
      </Typography>
    </div>
  );
}
