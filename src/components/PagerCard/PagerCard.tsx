import { Typography } from "@mui/material";

interface IPagerCard {
  useSMS?: boolean;
  deviceLabel?: string | number;
  lastNotificationTimeInMinutes?: number;
  notifed?: boolean;
}

export default function PagerCard({ useSMS, deviceLabel, lastNotificationTimeInMinutes, notifed }: IPagerCard) {
  return (
    <div className="deviceIcon">
      <Typography variant="h1" style={{ background: notifed ? "#22657A" : undefined }}>
        {useSMS ? <i className="pi pi-phone"></i> : deviceLabel}
        {lastNotificationTimeInMinutes && <Typography variant="caption">{`${lastNotificationTimeInMinutes}m`}</Typography>}
      </Typography>
    </div>
  );
}
