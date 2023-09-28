import { Dispatch, MouseEvent, SetStateAction, TouchEvent, useRef, useState } from "react";
import { IconButton, Typography } from "@mui/material";
import { useQueue } from "../../contexts/QueueContext";
import { useCompany } from "../../contexts/CompanyContext";
import { useTranslation } from "react-i18next";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { useGesture } from "@use-gesture/react";
import keycloak from "../../services/keycloak/keycloak";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import QrCodeIcon from "@mui/icons-material/QrCode";
import hanamiLogo from "../../assets/images/hanami.png";
import DeviceIcon from "../DeviceIcon/DeviceIcon";

interface ITopBar {
  setSideDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

export default function TopBar({ setSideDrawerOpen }: ITopBar) {
  const [devicesOpen, setDevicesOpen] = useState(false);
  const { companyConfigs } = useCompany();
  const { queue, addQueue, addQueueRequestBody } = useQueue();
  const { t } = useTranslation();

  const pressTimerRef = useRef<number | null>(null);
  const longPressDuration = 2000;

  const availableDevices = companyConfigs?.formFieldsData?.devices?.filter((device) => device.isAvailable);
  const noAvailableDevices = availableDevices?.length === 0;

  const bind = useGesture({
    onPointerDown: () => {
      pressTimerRef.current = setTimeout(() => {
        // Long press
        setSideDrawerOpen((prev) => !prev);
      }, longPressDuration);
    },
    onPointerUp: () => {
      if (pressTimerRef.current !== null) {
        if (pressTimerRef.current < longPressDuration) {
          // Fast click
          setDevicesOpen((prev) => !prev);
          setSideDrawerOpen((prev) => (prev ? false : prev));
        }
        clearTimeout(pressTimerRef.current);
        pressTimerRef.current = null;
      }
    },
    onPointerLeave: () => {
      if (pressTimerRef.current !== null) {
        clearTimeout(pressTimerRef.current);
        pressTimerRef.current = null;
      }
    },
  });

  function logout() {
    keycloak.logout();
  }

  function handleAddDeviceInQueue(event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>, deviceId: number | string) {
    event.stopPropagation();
    const deviceToRemoveFromTopBar = document.getElementById(`${deviceId}`);
    if (deviceToRemoveFromTopBar) deviceToRemoveFromTopBar.style.display = "none";

    addQueueRequestBody.current = {
      clientsId: [1],
      subClientsId: [1],
      destinationId: 1,
      deviceId: deviceId,
      carPlateNumber: "1",
      carBackPlateNumber: "",
      observations: "",
      useSMS: false,
    };

    addQueue().then(() => (addQueueRequestBody.current = null));
  }

  return (
    <div className="topBarContainer">
      <div className="buttonsContainer">
        <ClickAwayListener onClickAway={() => setDevicesOpen(false)}>
          <IconButton className="roundedPrimaryIconButton" {...bind()}>
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
                      onClick={(e) => handleAddDeviceInQueue(e, device?.id)}
                      onTouchEnd={(e) => handleAddDeviceInQueue(e, device?.id)}
                      className="topBarAddDeviceButton"
                    >
                      <DeviceIcon deviceLabel={device?.id} />
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
