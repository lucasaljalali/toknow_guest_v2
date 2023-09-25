import { Typography } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";

interface IPagerCard {
  useSMS?: boolean;
  deviceLabel?: string | number;
  lastNotificationTimeInMinutes?: number;
  notifed?: boolean;
}

export default function PagerCard({ useSMS, deviceLabel, lastNotificationTimeInMinutes, notifed }: IPagerCard) {
  return (
    <div className="deviceIcon" title={useSMS ? `${deviceLabel}` : undefined}>
      <Typography variant="h1" style={{ background: notifed ? "#22657A" : undefined }}>
        {useSMS ? <PhoneIcon /> : deviceLabel}
        {<Typography variant="caption">{lastNotificationTimeInMinutes ? `${lastNotificationTimeInMinutes}m` : undefined}</Typography>}
      </Typography>
    </div>
  );
}
