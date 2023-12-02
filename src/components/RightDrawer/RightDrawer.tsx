import { Autocomplete, Box, Button, ClickAwayListener, Drawer, FormControlLabel, Switch, TextField, Typography } from "@mui/material";
import { Key, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { phonePrefixs } from "../../configuration/phonePrefixs";
import { IQueueRequestBody, useQueue } from "../../hooks/useQueue";
import { axiosInstance } from "../../services/api/axiosInstance";
import {
  alert,
  availableDevices,
  cardData,
  codeId,
  companyConfigs,
  countdown,
  isCodeVerified,
  sideDrawerOpen,
} from "../../store/signalsStore";
import { useFormik } from "formik";
import { transformInQueueData } from "../../pages/Home/utils/transformInQueueData";
import { initialValues, validationSchema } from "./utils/validationSchema";
import { getCleanData } from "./utils/handleCleanData";

export default function RightDrawer() {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  const { addQueue, updateQueue } = useQueue();
  const { t } = useTranslation();

  let clickAwayCount = 0;

  const isEditQueue = cardData.value?.id != undefined && `${cardData.value?.id}`.length > 0;

  useEffect(() => {
    if (sideDrawerOpen.value === false) {
      formik.resetForm();
      countdown.value = 0;
      codeId.value = null;
      isCodeVerified.value = null;

      document.querySelectorAll(".queueCard")?.forEach((card) => card.classList.remove("active"));
    }
    if (sideDrawerOpen.value === true) {
      if (cardData.value && cardData.value?.id) {
        formik.setValues(transformInQueueData(cardData.value));

        if (cardData.value?.useSMS) {
          isCodeVerified.value = true;
        }
      } else if (availableDevices.value) {
        formik.setFieldValue("deviceId", availableDevices.value?.[0]?.id);
      }

      const clickedCard = document.getElementById(`${cardData.value?.id}`)?.querySelector(".queueCard");
      clickedCard?.classList.add("active");
    }
  }, [sideDrawerOpen.value]);

  useEffect(() => {
    if (countdown.value > 0) {
      const timer = setTimeout(() => (countdown.value = countdown.value - 1), 1000);
      return () => clearTimeout(timer);
    }
    codeId.value = null;
  }, [countdown.value]);

  function handleSubmit() {
    const dataToSubmit: IQueueRequestBody = {
      clientsId: [1],
      subClientsId: [1],
      destinationId: 1,
      deviceId: formik.values.useSMS ? undefined : formik.values.deviceId,
      useSMS: formik.values.useSMS,
      prioritiesId: formik.values.priorities,
      driverName: formik.values.name,
      driverPhonePrefix: formik.values.phoneNumber ? formik.values.phonePrefix : undefined,
      driverPhone: formik.values.phoneNumber,
      carPlateNumber: formik.values.partySize,
      carBackPlateNumber: formik.values.estimatedTime,
      observations: formik.values.observations,
      id: formik.values.id,
    };

    const cleanDataToSubmit = getCleanData(dataToSubmit);

    isEditQueue ? updateQueue(cleanDataToSubmit) : addQueue(cleanDataToSubmit);
  }

  async function handleVerifyCode() {
    const codeBodyRequest = {
      id: codeId.value,
      phoneNumberPrefix: formik.values.phonePrefix,
      phoneNumber: formik.values.phoneNumber,
      passCode: formik.values.verifyCode,
      // translateTo: data?.locale,
    };

    if (codeId.value) {
      try {
        const response = await axiosInstance.put(`phoneverification/verify`, codeBodyRequest);
        if (response?.data?.isValid) {
          isCodeVerified.value = true;
          countdown.value = 0;
          alert.value = { success: t("GLOBAL_SUCCESS_MESSAGE") };
          return;
        }
        isCodeVerified.value = false;
        alert.value = { error: t("GLOBAL_ERROR_MESSAGE") };
        return;
      } catch (error: any) {
        isCodeVerified.value = false;
        alert.value = { error: t("GLOBAL_ERROR_MESSAGE") };
        return;
      }
    }

    try {
      const response = await axiosInstance.post(`phoneverification/generate`, codeBodyRequest);
      codeId.value = response?.data?.id;
      countdown.value = 120;
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
            ? `${t("FORM_LABEL_ARRIVED_AT")} ${cardData.value?.createdDate?.split("T")?.[1]?.slice(0, -3)}`
            : t("FORM_LABEL_ADD_TO_QUEUE")}
        </Typography>

        <Box component="form" autoComplete="off" onSubmit={formik.handleSubmit}>
          <FormControlLabel
            id="useSMS"
            name="useSMS"
            inputMode="none"
            label={t("FORM_LABEL_USE_SMS")}
            labelPlacement="start"
            control={<Switch color="primary" />}
            value={formik.values.useSMS || (!isEditQueue && availableDevices.value?.length === 0) ? true : false}
            checked={formik.values.useSMS || (!isEditQueue && availableDevices.value?.length === 0) ? true : false}
            onChange={(_event, checked) => formik.setFieldValue("useSMS", checked)}
            disabled={isEditQueue || (!isEditQueue && availableDevices.value?.length === 0)}
          />

          <TextField
            id="name"
            name="name"
            fullWidth
            variant="outlined"
            type="text"
            inputProps={{ inputMode: "text" }}
            label={t("FORM_LABEL_NAME")}
            value={formik.values.name}
            onChange={(e) => formik.setFieldValue("name", e.target.value?.replace(/[^A-Za-z\s]/g, "")?.slice(0, 50))}
          />

          <TextField
            id="partySize"
            name="partySize"
            fullWidth
            variant="outlined"
            type="text"
            inputProps={{ inputMode: "decimal" }}
            label={t("FORM_LABEL_PARTY_SIZE")}
            value={formik.values.partySize}
            onChange={(e) => formik.setFieldValue("partySize", e.target.value?.replace(/\D/g, "")?.slice(0, 3))}
          />

          <div className="formPhoneContainer">
            <Autocomplete
              disableClearable
              fullWidth
              inputMode="none"
              options={phonePrefixs?.map((prefix) => prefix.id)}
              value={formik.values.phonePrefix}
              onChange={(_, value) => formik.setFieldValue("phonePrefix", value)}
              renderInput={(params) => (
                <TextField {...params} type="text" id="phonePrefix" name="phonePrefix" label={t("FORM_LABEL_PREFIX")} />
              )}
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option}>
                    {t(phonePrefixs?.find((prefix) => prefix.id === option)?.label || "")}
                  </li>
                );
              }}
              disabled={(isEditQueue && formik.values.useSMS) || isCodeVerified.value === true}
            />

            <TextField
              id="phoneNumber"
              name="phoneNumber"
              fullWidth
              variant="outlined"
              type="text"
              inputProps={{ inputMode: "tel" }}
              label={t("FORM_LABEL_PHONE_NUMBER")}
              value={formik.values.phoneNumber}
              onChange={(e) => formik.setFieldValue("phoneNumber", e.target.value?.replace(/\D/g, "")?.slice(0, 11))}
              disabled={(isEditQueue && formik.values.useSMS) || isCodeVerified.value === true}
            />
          </div>

          {formik.values.useSMS || availableDevices.value?.length === 0
            ? !isEditQueue && (
                <div className="formPhoneContainer">
                  <Button
                    id="verifyCodeButton"
                    variant="outlined"
                    onClick={handleVerifyCode}
                    disabled={
                      formik.values.phoneNumber == undefined ||
                      formik.values.phonePrefix?.length === 0 ||
                      formik.values.phoneNumber?.length === 0 ||
                      (codeId.value && !formik.values.verifyCode) ||
                      (formik.values.verifyCode && formik.values.verifyCode?.length < 6) ||
                      isCodeVerified.value === true
                    }
                    className={isCodeVerified.value === true ? "verified" : isCodeVerified.value === false ? "unverified" : undefined}
                  >
                    {isCodeVerified.value
                      ? t("FORM_LABEL_VERIFIED")
                      : codeId.value
                      ? `${t("FORM_LABEL_VERIFY")} (${countdown.value})`
                      : t("FORM_LABEL_GET_CODE")}
                  </Button>
                  <TextField
                    id="verifyCode"
                    name="verifyCode"
                    fullWidth
                    type="text"
                    inputProps={{ inputMode: "decimal" }}
                    variant="outlined"
                    label={t("FORM_LABEL_VERIFY_CODE")}
                    value={formik.values.verifyCode}
                    onChange={(e) => formik.setFieldValue("verifyCode", e.target.value?.replace(/\D/g, "")?.slice(0, 6))}
                    disabled={!codeId.value || isCodeVerified.value === true}
                  />
                </div>
              )
            : ((availableDevices.value && availableDevices.value.length > 0) || (isEditQueue && formik.values.deviceId)) && (
                <Autocomplete
                  disableClearable
                  fullWidth
                  inputMode="none"
                  options={
                    isEditQueue
                      ? [formik.values.deviceId, ...(availableDevices.value?.map((device) => device.id) || [])]
                      : availableDevices.value?.map((device) => device.id) || []
                  }
                  value={formik.values.deviceId as NonNullable<number | null>}
                  onChange={(_, value) => formik.setFieldValue("deviceId", value)}
                  renderInput={(params) => (
                    <TextField {...params} type="text" id="deviceId" name="deviceId" label={t("FORM_LABEL_DEVICE")} required />
                  )}
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
            value={formik.values.priorities}
            onChange={(_, value) => formik.setFieldValue("priorities", value)}
            renderInput={(params) => (
              <TextField {...params} type="text" id="priorities" name="priorities" label={t("FORM_LABEL_PRIORITIES")} />
            )}
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
            id="observations"
            name="observations"
            fullWidth
            variant="outlined"
            type="text"
            inputProps={{ inputMode: "text" }}
            label={t("FORM_LABEL_OBSERVATIONS")}
            value={formik.values.observations}
            onChange={formik.handleChange}
          />

          <Autocomplete
            disableClearable
            fullWidth
            inputMode="none"
            options={["", "0", "15", "30", "60"]}
            value={formik.values.estimatedTime}
            onChange={(_, value) => formik.setFieldValue("estimatedTime", value)}
            renderInput={(params) => (
              <TextField
                {...params}
                type="text"
                id="estimatedTime"
                name="estimatedTime"
                label={t("FORM_LABEL_ESTIMATED_TIME_IN_MIN")}
              />
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
            type="submit"
            disabled={formik.values.useSMS && (!formik.values.phoneNumber || formik.values.phoneNumber?.length === 0)}
          >
            {isEditQueue ? t("FORM_LABEL_SAVE") : t("FORM_LABEL_ADD")}
          </Button>
        </Box>
      </Drawer>
    </ClickAwayListener>
  );
}
