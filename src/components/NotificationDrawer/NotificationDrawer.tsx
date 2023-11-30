import { Box, Button, ClickAwayListener, Drawer, TextField, Typography } from "@mui/material";
import { MutableRefObject, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueue } from "../../hooks/useQueue";
import { notificationDrawerOpen, sideDrawerOpen } from "../../store/signalsStore";
import { ITransformedInQueueData } from "../../pages/Home/utils/transformInQueueData";
import { effect } from "@preact/signals-react";
import { messageMaxLength } from "../../store/constants";
import { useCompany } from "../../hooks/CompanyContext";

interface INotificationDrawer {
  cardData: MutableRefObject<ITransformedInQueueData | null>;
}

export default function NotificationDrawer({ cardData }: INotificationDrawer) {
  const [message, setMessage] = useState("");
  const { notifyQueue } = useQueue();
  const { companyConfigs } = useCompany();
  const { t } = useTranslation();

  const defaultMessages = companyConfigs?.formFieldsData?.defaultMessages;

  function handleSubmit(messageId?: number | string) {
    if (cardData.current?.id) {
      const dataToSubmit = {
        id: cardData.current?.id,
        actionId: 2,
        destinationId: cardData.current?.currentDestinationId,
        ...(messageId ? { messageId: Number(messageId) } : { message: message }),
      };
      notifyQueue(dataToSubmit);
    }
  }

  effect(() => {
    if (notificationDrawerOpen.value === false) {
      if (message !== "") setMessage("");
      if (sideDrawerOpen.value === false) cardData.current = null;
    }
  });

  return (
    <ClickAwayListener onClickAway={() => (notificationDrawerOpen.value = false)}>
      <Drawer
        className="rightDrawer"
        anchor="right"
        variant="persistent"
        open={notificationDrawerOpen.value}
        onClose={() => (notificationDrawerOpen.value = false)}
      >
        <Typography variant="h6" className="drawerTitle">
          {t("FORM_LABEL_SEND_MESSAGE")}
        </Typography>

        <Box component="form" autoComplete="off">
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            inputProps={{ maxLength: messageMaxLength }}
            id="message"
            name="message"
            label={t("FORM_LABEL_MESSAGE")}
            helperText={`${t("FORM_HELPER_MAX_LENGTH")}: ${messageMaxLength}`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <Button id="sendMessageButton" fullWidth variant="contained" onClick={() => handleSubmit()}>
            {t("FORM_LABEL_SEND")}
          </Button>

          {defaultMessages?.map((message) => (
            <Button key={message?.id} variant="outlined" fullWidth size="large" onClick={() => handleSubmit(message?.id)}>
              {message?.label}
            </Button>
          ))}
        </Box>
      </Drawer>
    </ClickAwayListener>
  );
}
