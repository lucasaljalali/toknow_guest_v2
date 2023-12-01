import { Autocomplete, Box, Button, ClickAwayListener, Drawer, FormControlLabel, Switch, TextField, Typography } from "@mui/material";
import { Key, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { phonePrefixs } from "../../configuration/phonePrefixs";
import { IQueueRequestBody, useQueue } from "../../hooks/useQueue";
import { ITransformedInQueueData } from "../../pages/Home/utils/transformInQueueData";
import { axiosInstance } from "../../services/api/axiosInstance";
import { alert, cardData, companyConfigs, notificationDrawerOpen, sideDrawerOpen } from "../../store/signalsStore";

export default function RightDrawer() {
  const [data, setData] = useState<ITransformedInQueueData | null>(null);
  const [codeId, setCodeId] = useState<number | null>(null);
  const [isCodeVerified, setIsCodeVerified] = useState<boolean | null>(null);
  const [countdown, setCountdown] = useState<number>(0);

  let clickAwayCount = 0;

  const { addQueue, updateQueue } = useQueue();
  const { t } = useTranslation();

  const isEditQueue = cardData.value?.id != undefined && `${cardData.value?.id}`.length > 0;

  const availableDevices = companyConfigs.value?.formFieldsData?.devices?.filter((device) => device.isAvailable === true);

  const handleChange = (key: string, value: any) => {
    setData((prevData) => (prevData ? { ...prevData, [key]: value } : ({ [key]: value } as ITransformedInQueueData)));
  };

  useEffect(() => {
    if (sideDrawerOpen.value === false && data) {
      setData(null);
      setCountdown(0);
      setCodeId(null);
      setIsCodeVerified(null);

      document.querySelectorAll(".queueCard")?.forEach((card) => card.classList.remove("active"));

      if (notificationDrawerOpen.value === false) cardData.value = null;
      return;
    }
    if (sideDrawerOpen.value === true && cardData.value?.id) {
      if (cardData.value) {
        setData(cardData.value);
        if (cardData.value?.useSMS) {
          setIsCodeVerified(true);
        }
      }

      const clickedCard = document.getElementById(`${cardData.value?.id}`)?.querySelector(".queueCard");
      clickedCard?.classList.add("active");
      return;
    }
  }, [sideDrawerOpen.value]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    setCodeId(null);
  }, [countdown]);

  function handleSubmit() {
    const dataToSubmit: IQueueRequestBody = {
      clientsId: [1],
      subClientsId: [1],
      destinationId: 1,
      deviceId: !data?.useSMS ? data?.deviceId || availableDevices?.[0]?.id : undefined,
      useSMS: data?.useSMS || false,
      prioritiesId: data?.priorities && data.priorities.length > 0 ? data.priorities : undefined,
      driverName: data?.name,
      driverPhonePrefix: data?.phonePrefix || "+351",
      driverPhone: data?.phoneNumber,
      carPlateNumber: data?.partySize || "1",
      carBackPlateNumber: data?.estimatedTime || "",
      observations: data?.observations,
      id: data?.id,
    };

    isEditQueue ? updateQueue(dataToSubmit) : addQueue(dataToSubmit);
  }

  async function handleVerifyCode() {
    const codeBodyRequest = {
      id: codeId,
      phoneNumberPrefix: data?.phonePrefix || "+351",
      phoneNumber: data?.phoneNumber,
      passCode: data?.verifyCode,
      // translateTo: data?.locale,
    };

    if (codeId) {
      try {
        const response = await axiosInstance.put(`phoneverification/verify`, codeBodyRequest);
        if (response?.data?.isValid) {
          setIsCodeVerified(true);
          setCountdown(0);
          alert.value = { success: t("GLOBAL_SUCCESS_MESSAGE") };
          return;
        }
        setIsCodeVerified(false);
        alert.value = { error: t("GLOBAL_ERROR_MESSAGE") };
        return;
      } catch (error: any) {
        setIsCodeVerified(false);
        alert.value = { error: t("GLOBAL_ERROR_MESSAGE") };
        return;
      }
    }

    try {
      const response = await axiosInstance.post(`phoneverification/generate`, codeBodyRequest);
      setCodeId(response?.data?.id);
      setCountdown(120);
      alert.value = { success: t("GLOBAL_SUCCESS_MESSAGE") };
      return;
    } catch (error: any) {
      alert.value = { error: t("GLOBAL_ERROR_MESSAGE") };
      return;
    }
  }

  function handleClickAway() {
    clickAwayCount++;
    if (clickAwayCount > 1) {
      sideDrawerOpen.value = false;
    }
  }

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Drawer className="rightDrawer" anchor="right" variant="persistent" open={sideDrawerOpen.value}>
        <Typography variant="h6" className="drawerTitle">
          {isEditQueue
            ? `${t("FORM_LABEL_ARRIVED_AT")} ${data?.createdDate?.split("T")?.[1]?.slice(0, -3)}`
            : t("FORM_LABEL_ADD_TO_QUEUE")}
        </Typography>

        <Box component="form" autoComplete="off">
          <FormControlLabel
            inputMode="none"
            name="useSMS"
            label={t("FORM_LABEL_USE_SMS")}
            labelPlacement="start"
            control={<Switch color="primary" />}
            value={data?.useSMS || (!isEditQueue && availableDevices?.length === 0) ? true : false}
            checked={data?.useSMS || (!isEditQueue && availableDevices?.length === 0) ? true : false}
            onChange={(_event, checked) => handleChange("useSMS", checked)}
            disabled={isEditQueue || (!isEditQueue && availableDevices?.length === 0)}
          />

          <TextField
            fullWidth
            variant="outlined"
            type="text"
            inputProps={{ inputMode: "text" }}
            name="name"
            label={t("FORM_LABEL_NAME")}
            value={data?.name || ""}
            onChange={(e) => handleChange("name", e.target.value?.replace(/[^A-Za-z\s]/g, "")?.slice(0, 50))}
          />

          <TextField
            fullWidth
            variant="outlined"
            type="text"
            inputProps={{ inputMode: "decimal" }}
            name="partySize"
            label={t("FORM_LABEL_PARTY_SIZE")}
            value={data?.partySize || ""}
            onChange={(e) => handleChange("partySize", e.target.value?.replace(/\D/g, "")?.slice(0, 3))}
          />

          <div className="formPhoneContainer">
            <Autocomplete
              disableClearable
              fullWidth
              inputMode="none"
              options={phonePrefixs?.map((prefix) => prefix.id)}
              value={data?.phonePrefix || "+351"}
              onChange={(_event, value) => handleChange("phonePrefix", value)}
              renderInput={(params) => <TextField {...params} type="text" name="phonePrefix" label={t("FORM_LABEL_PREFIX")} />}
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option}>
                    {t(phonePrefixs?.find((prefix) => prefix.id === option)?.label || "")}
                  </li>
                );
              }}
              disabled={(isEditQueue && data?.useSMS) || isCodeVerified === true}
            />

            <TextField
              fullWidth
              variant="outlined"
              type="text"
              inputProps={{ inputMode: "tel" }}
              name="phoneNumber"
              label={t("FORM_LABEL_PHONE_NUMBER")}
              value={data?.phoneNumber || ""}
              onChange={(e) => handleChange("phoneNumber", e.target.value?.replace(/\D/g, "")?.slice(0, 11))}
              disabled={(isEditQueue && data?.useSMS) || isCodeVerified === true}
            />
          </div>

          {data?.useSMS || availableDevices?.length === 0
            ? !isEditQueue && (
                <div className="formPhoneContainer">
                  <Button
                    id="verifyCodeButton"
                    variant="outlined"
                    onClick={handleVerifyCode}
                    disabled={
                      data?.phoneNumber == undefined ||
                      data?.phonePrefix?.length === 0 ||
                      data?.phoneNumber?.length === 0 ||
                      (codeId && !data?.verifyCode) ||
                      (data?.verifyCode && data?.verifyCode?.length < 6) ||
                      isCodeVerified === true
                    }
                    className={isCodeVerified === true ? "verified" : isCodeVerified === false ? "unverified" : undefined}
                  >
                    {isCodeVerified
                      ? t("FORM_LABEL_VERIFIED")
                      : codeId
                      ? `${t("FORM_LABEL_VERIFY")} (${countdown})`
                      : t("FORM_LABEL_GET_CODE")}
                  </Button>
                  <TextField
                    fullWidth
                    type="text"
                    inputProps={{ inputMode: "decimal" }}
                    variant="outlined"
                    name="verifyCode"
                    label={t("FORM_LABEL_VERIFY_CODE")}
                    value={data?.verifyCode || ""}
                    onChange={(e) => handleChange("verifyCode", e.target.value?.replace(/\D/g, "")?.slice(0, 6))}
                    disabled={!codeId || isCodeVerified === true}
                  />
                </div>
              )
            : ((availableDevices && availableDevices.length > 0) || (isEditQueue && data?.deviceId)) && (
                <Autocomplete
                  disableClearable
                  fullWidth
                  inputMode="none"
                  options={
                    isEditQueue
                      ? [
                          companyConfigs.value?.formFieldsData?.devices?.find((device) => device.id === data?.deviceId)?.id,
                          ...(availableDevices?.map((device) => device.id) || []),
                        ] || []
                      : availableDevices?.map((device) => device.id) || []
                  }
                  value={data?.deviceId || availableDevices?.[0]?.id}
                  onChange={(_event, value) => handleChange("deviceId", value)}
                  renderInput={(params) => <TextField {...params} type="text" name="device" label={t("FORM_LABEL_DEVICE")} required />}
                  getOptionLabel={(option) => `${option}`}
                  renderOption={(props, option) => {
                    return (
                      <li {...props} key={option as Key}>
                        {companyConfigs.value?.formFieldsData?.devices?.find((device) => device.id === option)?.label}
                      </li>
                    );
                  }}
                  disabled={isEditQueue}
                />
              )}

          <Autocomplete
            disableClearable
            fullWidth
            multiple
            inputMode="none"
            options={companyConfigs.value?.formFieldsData?.priorities?.map((priority) => priority.id) || []}
            value={data?.priorities || []}
            onChange={(_event, value) => handleChange("priorities", value)}
            renderInput={(params) => <TextField {...params} type="text" name="priorities" label={t("FORM_LABEL_PRIORITIES")} />}
            getOptionLabel={(option) =>
              t(companyConfigs.value?.formFieldsData?.priorities?.find((priority) => priority.id === option)?.label || "")
            }
            renderOption={(props, option) => {
              return (
                <li {...props} key={option}>
                  {t(companyConfigs.value?.formFieldsData?.priorities?.find((priority) => priority.id === option)?.label || "")}
                </li>
              );
            }}
          />

          <TextField
            fullWidth
            variant="outlined"
            type="text"
            inputProps={{ inputMode: "text" }}
            name="observations"
            label={t("FORM_LABEL_OBSERVATIONS")}
            value={data?.observations || ""}
            onChange={(e) => handleChange("observations", e.target.value)}
          />

          <Autocomplete
            disableClearable
            fullWidth
            inputMode="none"
            options={["", "0", "15", "30", "60"]}
            value={data?.estimatedTime || ""}
            onChange={(_event, value) => handleChange("estimatedTime", value)}
            renderInput={(params) => (
              <TextField {...params} type="text" name="estimatedTime" label={t("FORM_LABEL_ESTIMATED_TIME_IN_MIN")} />
            )}
            renderOption={(props, option) => {
              if (option?.length > 0)
                return (
                  <li {...props} key={option}>
                    {option}
                  </li>
                );
            }}
          />

          <Button
            id="formSubmitButton"
            variant="contained"
            onClick={handleSubmit}
            disabled={data?.useSMS && (!data?.phoneNumber || data?.phoneNumber?.length === 0)}
          >
            {isEditQueue ? t("FORM_LABEL_SAVE") : t("FORM_LABEL_ADD")}
          </Button>
        </Box>
      </Drawer>
    </ClickAwayListener>
  );
}
