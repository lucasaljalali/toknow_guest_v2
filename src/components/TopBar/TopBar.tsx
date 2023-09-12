import { IconButton } from "@mui/material";
import { useQueue } from "../../contexts/QueueContext";
import keycloak from "../../services/keycloak/keycloak";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import QrCodeIcon from "@mui/icons-material/QrCode";
import hanamiLogo from "../../assets/images/hanami.png";

export default function TopBar() {
  const { queue } = useQueue();

  function logout() {
    keycloak.logout();
  }

  return (
    <div className="topBarContainer">
      <div className="buttonsContainer">
        <IconButton className="roundedPrimaryIconButton">
          <AddIcon />
        </IconButton>
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
