import { MouseEvent, TouchEvent, useEffect, useRef, useState } from "react";
import { Button, IconButton, Typography } from "@mui/material";
import { useQueue } from "../../hooks/useQueue";
import { useTranslation } from "react-i18next";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { useGesture } from "@use-gesture/react";
import { companyConfigs, queueCardSize, sideDrawerOpen, windowWidth } from "../../store/signalsStore";
import { TQueueCardSize } from "../../store/types";
import { useQueryClient } from "react-query";
import { InQueueItem } from "../../services/api/dtos/Queue";
import keycloak from "../../services/auth/keycloak";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
// import QrCodeIcon from "@mui/icons-material/QrCode";
// import hanamiLogo from "../../assets/images/hanami.png";
import continenteLogo from "../../assets/images/continente.png";
// import auchanLogo from "../../assets/images/auchan.png"
import DeviceIcon from "../DeviceIcon/DeviceIcon";
import Filters from "../Filters/Filters";
import Loading from "../Loading/Loading";
import useCompany from "../../hooks/useCompany";

export default function TopBar() {
  const [devicesOpen, setDevicesOpen] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const { addQueue, isLoading: isQueueLoading } = useQueue();
  const { isLoading: isConfigLoading } = useCompany();
  const { t } = useTranslation();

  const isLoading = isQueueLoading || isConfigLoading;

  const queue = useQueryClient().getQueryData("queue") as InQueueItem[];

  const pressTimerRef = useRef<number | null>(null);
  const longPressDuration = 2000;

  const availableDevices = companyConfigs.value?.formFieldsData?.devices?.filter((device) => device.isAvailable);
  const noAvailableDevices = availableDevices?.length === 0;

  const bindAddIcon = useGesture({
    onPointerDown: () => {
      pressTimerRef.current = setTimeout(() => {
        // Long press
        sideDrawerOpen.value = !sideDrawerOpen.value;
        pressTimerRef.current = null;
      }, longPressDuration);
    },
    onPointerUp: () => {
      if (pressTimerRef.current !== null) {
        if (pressTimerRef.current < longPressDuration) {
          // Fast click
          setDevicesOpen((prev) => !prev);
          if (sideDrawerOpen.value === true) sideDrawerOpen.value = false;
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

  useEffect(() => {
    setScrolling(false);
  }, [devicesOpen]);

  function logout() {
    keycloak.logout();
  }

  function handleDeviceClick(event: MouseEvent | TouchEvent, deviceId: number | string) {
    event.preventDefault();
    event.stopPropagation();

    const deviceToRemoveFromTopBar = document.getElementById(`${deviceId}`);
    if (deviceToRemoveFromTopBar) deviceToRemoveFromTopBar.style.display = "none";

    const dataToSubmit = {
      clientsId: [1],
      subClientsId: [1],
      destinationId: 1,
      deviceId: deviceId,
      carPlateNumber: "1",
      useSMS: false,
    };

    addQueue(dataToSubmit);

    setDevicesOpen(false);
  }

  function handleMouseMove(event: MouseEvent) {
    const container = document.querySelector(".topBarDevicesOptionsContainer");

    if (container && scrolling) {
      container.scrollLeft -= event.movementX;
    }
  }

  function handleEyeClick() {
    const options = windowWidth.value < 768 ? ["medium", "small"] : ["large", "medium", "small"];
    const currentIndex = options.indexOf(queueCardSize.value);

    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % options.length;
      const nextOption = options[nextIndex] as TQueueCardSize;
      queueCardSize.value = nextOption;
      sessionStorage.setItem("queueCardSize", nextOption);
    }
  }

  return (
    <>
      <div className="smallScreenMainLogoContainer">
        <img onClick={logout} src={continenteLogo} className="smallScreenMainLogo" />
      </div>

      <div className="topBarContainer">
        <div className="buttonsContainer">
          <ClickAwayListener onClickAway={() => setDevicesOpen(false)}>
            <IconButton className="addDeviceButton" {...bindAddIcon()} disabled={isLoading}>
              {isLoading ? <Loading size={1.5} /> : <AddIcon />}
            </IconButton>
          </ClickAwayListener>
          {/* <IconButton className="addDeviceButton">
            <QrCodeIcon />
          </IconButton> */}

          <div
            className={devicesOpen ? "topBarDevicesOptionsContainer active" : "topBarDevicesOptionsContainer"}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
            onMouseDown={() => setScrolling(true)}
            onMouseUp={() => setScrolling(false)}
            onMouseMove={handleMouseMove}
          >
            {noAvailableDevices && <Typography color={"text.primary"}>{t("GLOBAL_NO_AVAILABLE_OPTIONS")}</Typography>}
            {availableDevices?.map((device) => {
              const notAlreadyInQueue = !queue?.some((queueDevice) => queueDevice.id === device.id);
              if (device?.isAvailable && notAlreadyInQueue) {
                return (
                  <Button
                    key={device?.id}
                    id={`${device?.id}`}
                    className="topBarAddDeviceButton"
                    onClick={(e) => handleDeviceClick(e, device?.id)}
                    onMouseDown={() => setScrolling(true)}
                    onMouseUp={() => setScrolling(false)}
                    onMouseMove={handleMouseMove}
                  >
                    <DeviceIcon deviceLabel={device?.id} />
                  </Button>
                );
              }
            })}
          </div>
        </div>

        <img onClick={logout} src={continenteLogo} className="mainLogo" style={{ display: sideDrawerOpen.value ? "none" : "block" }} />

        <div className="buttonsContainer">
          <IconButton className="roundedSecondaryIconButton defaultCursor">
            {isLoading ? <Loading size={1.5} /> : queue?.length || 0}
          </IconButton>

          <Filters />

          <IconButton className="roundedSecondaryIconButton" onClick={handleEyeClick}>
            <VisibilityIcon />
          </IconButton>
        </div>
      </div>
    </>
  );
}
