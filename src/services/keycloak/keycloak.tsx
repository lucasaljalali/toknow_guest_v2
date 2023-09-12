import Keycloak from "keycloak-js";
const keycloak = new Keycloak({
  url: "https://authdev.totalexpansion.pt/",
  realm: "toknow_premium",
  clientId: "vercel",
});

export default keycloak;
