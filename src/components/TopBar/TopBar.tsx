import { useState } from "react";
import { IconButton, Typography } from "@mui/material";
import { useQueue } from "../../contexts/QueueContext";
import { useCompany } from "../../contexts/CompanyContext";
import { useTranslation } from "react-i18next";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import keycloak from "../../services/keycloak/keycloak";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import QrCodeIcon from "@mui/icons-material/QrCode";
import hanamiLogo from "../../assets/images/hanami.png";
import PagerCard from "../PagerCard/PagerCard";

export default function TopBar() {
  const [devicesOpen, setDevicesOpen] = useState(false);
  const { companyConfigs } = useCompany();
  const { queue, addQueue, addQueueRequestBody } = useQueue();
  const { t } = useTranslation();

  const availableDevices = companyConfigs?.formFieldsData?.devices?.filter((device) => device.isAvailable);
  const noAvailableDevices = availableDevices?.length === 0;

  function logout() {
    keycloak.logout();
  }

  function handleAddDeviceInQueue(deviceId: number | string) {
    const deviceToRemoveFromTopBar = document.getElementById(`${deviceId}`);
    if (deviceToRemoveFromTopBar) deviceToRemoveFromTopBar.style.display = "none";
    addQueueRequestBody.current = { ...addQueueRequestBody.current, deviceId: deviceId };
    addQueue();
  }

  return (
    <div className="topBarContainer">
      <div className="buttonsContainer">
        <ClickAwayListener onClickAway={() => setDevicesOpen(false)}>
          <IconButton className="roundedPrimaryIconButton" onClick={() => setDevicesOpen((prev) => !prev)}>
            <AddIcon />
            <div className={devicesOpen ? "topBarDevicesOptionsContainer active" : "topBarDevicesOptionsContainer"}>
              {noAvailableDevices && <Typography color={"text.primary"}>{t("GLOBAL_NO_AVAILABLE_OPTIONS")}</Typography>}
              {availableDevices?.map((device) => {
                const notAlreadyInQueue = !queue?.some((queueDevice) => queueDevice.id === device.id);
                if (device?.isAvailable && notAlreadyInQueue) {
                  return (
                    <div
                      key={device?.id}
                      id={`${device?.id}`}
                      onClick={() => handleAddDeviceInQueue(device?.id)}
                      className="topBarAddDeviceButton"
                    >
                      <PagerCard deviceLabel={device?.id} />
                    </div>
                  );
                }
              })}
            </div>
          </IconButton>
        </ClickAwayListener>
        <IconButton className="roundedPrimaryIconButton">
          <QrCodeIcon />
        </IconButton>
      </div>

      <img onClick={logout} src={hanamiLogo} className="mainLogo" />

      <div className="buttonsContainer">
        <IconButton className="roundedSecondaryIconButton">
          <VisibilityIcon />
        </IconButton>
        <IconButton className="roundedSecondaryIconButton">
          <FilterAltIcon />
        </IconButton>
        <IconButton className="roundedSecondaryIconButton">{queue?.length}</IconButton>
      </div>
    </div>
  );
}
