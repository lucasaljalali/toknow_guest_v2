import {
  Autocomplete,
  Box,
  Button,
  ClickAwayListener,
  FormControlLabel,
  SwipeableDrawer,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { phonePrefixs } from "../../configuration/phonePrefixs";
import { useCompany } from "../../contexts/CompanyContext";
import { useQueue } from "../../contexts/QueueContext";
import { InInputConfigs } from "../../services/api/dtos/CompanyConfigs";

interface IRightDrawer {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

interface IData {
  useSMS?: boolean;
  name?: string;
  partySize?: string;
  phonePrefix?: { id: string; label: string };
  phoneNumber?: string;
  verifyCode?: string;
  device?: InInputConfigs;
  priorities?: { id: string; label: string }[];
  observations?: string;
  estimatedTime?: string;
}

export default function RightDrawer({ open, setOpen }: IRightDrawer) {
  const [data, setData] = useState<IData | null>(null);
  const [hasCode, setHasCode] = useState(false);
  const { companyConfigs } = useCompany();
  const { addQueue, addQueueRequestBody } = useQueue();
  const { t } = useTranslation();

  const firstAvailableDevice = companyConfigs?.formFieldsData?.devices?.find((device) => device.isAvailable === true);

  const handleChange = (key: string, value: any) => {
    setData((prevData) => ({ ...prevData, [key]: value }));
  };

  function handleSubmit() {
    const dataToSubmit = {
      ...addQueueRequestBody.current,
      deviceId: data?.device?.id || firstAvailableDevice?.id || 0,
      useSMS: data?.useSMS || false,
      prioritiesId: data?.priorities?.map((priority) => priority.id),
      driverName: data?.name,
      driverPhonePrefix: data?.phonePrefix?.id,
      driverPhone: data?.phoneNumber,
      carPlateNumber: data?.partySize || "1",
      carBackPlateNumber: data?.estimatedTime || "",
      observations: data?.observations,
    };
    console.log(dataToSubmit);
    addQueueRequestBody.current = dataToSubmit;
    addQueue();
    setOpen(false);
    setHasCode(false);
    setData(null);
  }

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <SwipeableDrawer
        id="rightDrawer"
        variant="persistent"
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
      >
        <Typography variant="h6" className="drawerTitle">
          {t("FORM_LABEL_ADD_TO_QUEUE")}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <FormControlLabel
            label={t("FORM_LABEL_USE_SMS")}
            labelPlacement="start"
            control={<Switch color="primary" />}
            value={data?.useSMS || false}
            onChange={(_event, checked) => handleChange("useSMS", checked)}
          />

          <TextField
            fullWidth
            variant="outlined"
            name="name"
            label={t("FORM_LABEL_NAME")}
            value={data?.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
          />

          <TextField
            fullWidth
            variant="outlined"
            name="partySize"
            label={t("FORM_LABEL_PARTY_SIZE")}
            value={data?.partySize || ""}
            onChange={(e) => handleChange("partySize", e.target.value?.replace(/\D/g, ""))}
          />

          <div className="formPhoneContainer">
            <Autocomplete
              disableClearable
              fullWidth
              options={phonePrefixs}
              value={data?.phonePrefix || { id: "+351", label: t("+351 FORM_LABEL_PORTUGAL") }}
              onChange={(_event, value) => handleChange("phonePrefix", value)}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              getOptionLabel={(option) => option.id}
              renderInput={(params) => <TextField {...params} name="phonePrefix" label={t("FORM_LABEL_PREFIX")} />}
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.id}>
                    {t(option.label)}
                  </li>
                );
              }}
            />

            <TextField
              fullWidth
              variant="outlined"
              name="phoneNumber"
              label={t("FORM_LABEL_PHONE_NUMBER")}
              value={data?.phoneNumber || ""}
              onChange={(e) => handleChange("phoneNumber", e.target.value?.replace(/\D/g, ""))}
            />
          </div>

          {data?.useSMS ? (
            <div className="formPhoneContainer">
              <Button id="verifyCodeButton" variant="outlined">
                {hasCode ? t("FORM_LABEL_VERIFY") : t("FORM_LABEL_GET_CODE")}
              </Button>
              <TextField
                required
                fullWidth
                variant="outlined"
                name="verifyCode"
                label={t("FORM_LABEL_VERIFY_CODE")}
                value={data?.verifyCode || ""}
                onChange={(e) => handleChange("verifyCode", e.target.value?.replace(/\D/g, ""))}
              />
            </div>
          ) : (
            <Autocomplete
              disableClearable
              fullWidth
              options={companyConfigs?.formFieldsData?.devices || []}
              value={data?.device || firstAvailableDevice}
              onChange={(_event, value) => handleChange("device", value)}
              renderInput={(params) => <TextField {...params} name="device" label={t("FORM_LABEL_DEVICE")} required />}
              renderOption={(props, option) => {
                const availableOptions = option.isAvailable;
                if (availableOptions) {
                  return (
                    <li {...props} key={option.id}>
                      {option.label}
                    </li>
                  );
                }
              }}
            />
          )}

          <Autocomplete
            disableClearable
            fullWidth
            multiple
            options={companyConfigs?.formFieldsData?.priorities || []}
            onChange={(_event, value) => handleChange("priorities", value)}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => <TextField {...params} name="priorities" label={t("FORM_LABEL_PRIORITIES")} />}
            renderOption={(props, option) => {
              return (
                <li {...props} key={option.id}>
                  {option.label}
                </li>
              );
            }}
          />

          <TextField
            fullWidth
            variant="outlined"
            type="text"
            name="observations"
            label={t("FORM_LABEL_OBSERVATIONS")}
            value={data?.observations || ""}
            onChange={(e) => handleChange("observations", e.target.value)}
          />

          <Autocomplete
            disableClearable
            fullWidth
            options={["0", "15", "30", "60"]}
            onChange={(_event, value) => handleChange("estimatedTime", value)}
            renderInput={(params) => <TextField {...params} name="estimatedTime" label={t("FORM_LABEL_ESTIMATED_TIME_IN_MIN")} />}
            renderOption={(props, option) => {
              return (
                <li {...props} key={option}>
                  {option}
                </li>
              );
            }}
          />

          <Button id="formSubmitButton" variant="contained" type="submit">
            {t("FORM_LABEL_ADD")}
          </Button>
        </Box>
      </SwipeableDrawer>
    </ClickAwayListener>
  );
}
