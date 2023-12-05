import { Box, Button, ClickAwayListener, Drawer, IconButton, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useQueue } from "../../hooks/useQueue";
import { cardData, companyConfigs, message, notificationDrawerOpen, queueCardSize } from "../../store/signalsStore";
import { effect } from "@preact/signals-react";
import { messageMaxLength } from "../../store/constants";
import LoadingMask from "../LoadingMask/LoadingMask";
import CloseIcon from "@mui/icons-material/Close";

export default function NotificationDrawer() {
  const { notifyQueue, isLoading } = useQueue();

  const { t } = useTranslation();

  const defaultMessages = companyConfigs.value?.formFieldsData?.defaultMessages;

  let clickAwayCount = 0;

  effect(() => {
    if (notificationDrawerOpen.value === false) {
      if (message.value !== "") message.value = "";
    }
  });

  function handleClickAway() {
    clickAwayCount++;
    if (queueCardSize.value === "small" && clickAwayCount < 2) {
      return;
    }
    notificationDrawerOpen.value = false;
  }

  function handleSubmit(messageId?: number | string) {
    if (cardData.value?.id) {
      const dataToSubmit = {
        id: cardData.value?.id,
        actionId: 2,
        destinationId: cardData.value?.currentDestinationId,
        ...(messageId ? { messageId: Number(messageId) } : { message: message.value }),
      };
      notifyQueue(dataToSubmit);
    }
  }

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Drawer className="rightDrawer" anchor="right" variant="persistent" open={notificationDrawerOpen.value}>
        {isLoading && <LoadingMask />}

        <div className="drawerTitle">
          <IconButton onClick={() => (notificationDrawerOpen.value = false)}>
            <CloseIcon />
          </IconButton>

          <Typography variant="h6">{t("FORM_LABEL_SEND_MESSAGE")}</Typography>
        </div>

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
            value={message.value}
            onChange={(e) => (message.value = e.target.value)}
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
