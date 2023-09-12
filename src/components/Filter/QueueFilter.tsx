import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import SortIcon from "@mui/icons-material/Sort";

export default function QueueFilter() {
  const { t } = useTranslation();

  const filterOptions = [
    "FILTER_LABEL_QTD",
    "FILTER_LABEL_NAME",
    "FILTER_LABEL_PRIORITY",
    "FILTER_LABEL_WAITING",
    "FILTER_LABEL_ESTIMATED",
    "FILTER_LABEL_DEVICE",
  ];

  return (
    <div className="queueFilterContainer">
      {filterOptions?.map((filterOption) => (
        <Typography key={filterOption} variant="body2" className="queueFilterOption">
          {t(filterOption)}
          <SortIcon className="queueFilterOptionIcon inverted" />
        </Typography>
      ))}
    </div>
  );
}
