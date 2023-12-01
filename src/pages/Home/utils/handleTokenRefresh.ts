import { handleInitialConfigs } from "./handleInitialConfigs";
import keycloak from "../../../services/auth/keycloak";

export async function handleTokenRefresh() {
  try {
    const refreshed = await keycloak.updateToken(5);
    handleInitialConfigs();
    console.log(refreshed ? "Token has been refreshed" : "Token refresh failed");
  } catch (error) {
    console.error("Error refreshing token:", error);
  }
}
