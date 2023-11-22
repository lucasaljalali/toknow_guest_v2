import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { largeCardOrdinationsOptions, mediumCardOrdinationsOptions } from "../../store/constants";
import { queueCardSize, windowWidth } from "../../store/signalsStore";
import SortIcon from "@mui/icons-material/Sort";

export default function QueueOrdinations() {
  const { t } = useTranslation();
  const smallCard = queueCardSize.value === "small";
  const mediumCard = queueCardSize.value === "medium";
  const options = smallCard
    ? []
    : mediumCard
    ? windowWidth.value >= 768
      ? [...mediumCardOrdinationsOptions, ...mediumCardOrdinationsOptions]
      : mediumCardOrdinationsOptions
    : largeCardOrdinationsOptions;

  return (
    <div className={`queueOrdinationContainer ${queueCardSize.value}`}>
      {options?.map((ordinationOption: string, index: number) => (
        <Typography key={index} variant="body2" className="queueOrdinationOption">
          {t(ordinationOption)}
          <SortIcon className="queueOrdinationOptionIcon inverted" />
        </Typography>
      ))}
    </div>
  );
}
