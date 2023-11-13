import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ordinationsOptions } from "../../store/constants";
import SortIcon from "@mui/icons-material/Sort";

export default function QueueOrdinations() {
  const { t } = useTranslation();

  return (
    <div className="queueOrdinationContainer">
      {ordinationsOptions?.map((ordinationOption) => (
        <Typography key={ordinationOption} variant="body2" className="queueOrdinationOption">
          {t(ordinationOption)}
          <SortIcon className="queueOrdinationOptionIcon inverted" />
        </Typography>
      ))}
    </div>
  );
}
