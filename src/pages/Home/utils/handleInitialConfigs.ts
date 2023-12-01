import { accessToken, company, user } from "../../../store/signalsStore";
import keycloak from "../../../services/auth/keycloak";

export function handleInitialConfigs() {
  accessToken.value = keycloak?.token || null;
  user.value = keycloak?.tokenParsed || null;
  company.value = keycloak?.tokenParsed?.tenants?.[0];
}
