import { Box, Button, ClickAwayListener, Drawer, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueue } from "../../hooks/useQueue";
import { cardData, companyConfigs, notificationDrawerOpen, sideDrawerOpen } from "../../store/signalsStore";
import { effect } from "@preact/signals-react";
import { messageMaxLength } from "../../store/constants";

export default function NotificationDrawer() {
  const [message, setMessage] = useState("");
  const { notifyQueue } = useQueue();

  const { t } = useTranslation();

  const defaultMessages = companyConfigs.value?.formFieldsData?.defaultMessages;

  function handleSubmit(messageId?: number | string) {
    if (cardData.value?.id) {
      const dataToSubmit = {
        id: cardData.value?.id,
        actionId: 2,
        destinationId: cardData.value?.currentDestinationId,
        ...(messageId ? { messageId: Number(messageId) } : { message: message }),
      };
      notifyQueue(dataToSubmit);
    }
  }

  effect(() => {
    if (notificationDrawerOpen.value === false) {
      if (message !== "") setMessage("");
      if (sideDrawerOpen.value === false) cardData.value = null;
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
