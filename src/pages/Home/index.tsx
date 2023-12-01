import { useEffect } from "react";
import { Alert, AlertColor, Snackbar } from "@mui/material";
import { accessToken, alert, company, notificationDrawerOpen, sideDrawerOpen, windowWidth } from "../../store/signalsStore";
import { handleInitialConfigs } from "./utils/handleInitialConfigs";
import { handleTokenRefresh } from "./utils/handleTokenRefresh";
import { handleLimitSize } from "./utils/handleLimitSize";
import { axiosInstance } from "../../services/api/axiosInstance";
import TopBar from "../../components/TopBar/TopBar";
import RightDrawer from "../../components/RightDrawer/RightDrawer";
import QueueOrdinations from "../../components/Ordinations/QueueOrdinations";
import NotificationDrawer from "../../components/NotificationDrawer/NotificationDrawer";
import Queue from "../../components/Queue/Queue";
import keycloak from "../../services/auth/keycloak";
import i18n from "../../services/translations/i18n";
import useCompany from "../../hooks/useCompany";
import Loading from "../../components/Loading/Loading";

export default function Home() {
  const drawerWidth = document?.querySelector(".rightDrawer")?.querySelector(".MuiPaper-root")?.clientWidth;

  const changeContainerWidth = (sideDrawerOpen.value || notificationDrawerOpen.value) && windowWidth.value > 900;

  const { refetch: refetchConfigs, isLoading: isConfigsLoading } = useCompany();

  useEffect(() => {
    keycloak.onAuthSuccess = handleInitialConfigs;
    keycloak.onTokenExpired = handleTokenRefresh;

    return () => {
      keycloak.onTokenExpired = undefined;
      keycloak.onAuthSuccess = undefined;
    };
  }, [keycloak]);

  useEffect(() => {
    if (company.value && accessToken.value) {
      axiosInstance.defaults.headers.common = {
        locale: i18n?.language,
        tenant: company.value,
        Authorization: `Bearer ${accessToken.value}`,
      };
      refetchConfigs();
    }
  }, [company.value, accessToken.value]);

  useEffect(() => {
    window.addEventListener("resize", () => handleLimitSize(window.innerWidth));

    return () => {
      window.removeEventListener("resize", () => handleLimitSize(window.innerWidth));
    };
  }, [window.innerWidth]);

  return (
    <>
      <div id={"queueMainContainer"} style={{ marginRight: changeContainerWidth ? drawerWidth : 0 }}>
        <TopBar />

        <QueueOrdinations />

        <Queue />

        <Snackbar open={alert.value !== null} autoHideDuration={6000} onClose={() => (alert.value = null)}>
          <Alert variant="filled" severity={alert.value ? (Object.keys(alert.value)[0] as AlertColor) : undefined}>
            {alert.value?.[Object.keys(alert.value)[0]]}
          </Alert>
        </Snackbar>
      </div>

      <RightDrawer />

      <NotificationDrawer />

      {isConfigsLoading && <Loading />}
    </>
  );
}
