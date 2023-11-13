import { Badge, Button, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { filterBadgeValue, filtersOpen, filtersSelection } from "../../store/signalsStore";
// import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { filtersOptions } from "../../store/constants";
import { useTranslation } from "react-i18next";
import { useQueue } from "../../contexts/QueueContext";
import { transformInQueueData } from "../../pages/Home/utils/transformInQueueData";
import { useCompany } from "../../contexts/CompanyContext";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { effect } from "@preact/signals-react";

export default function Filters() {
  const { t } = useTranslation();
  const { queue } = useQueue();
  const { companyConfigs } = useCompany();

  const transformedQueue = queue?.map((item) => transformInQueueData(item, companyConfigs));

  function handleChange(event: SelectChangeEvent) {
    filtersSelection.value = {
      ...filtersSelection.value,
      [event.target.name]: event.target.value,
    };

    const newKeyValue = filtersSelection.value[event.target.name as keyof object] as any[];

    if (Array.isArray(newKeyValue) && newKeyValue.length === 0) {
      delete filtersSelection.value[event.target.name as keyof object];
    }
  }

  function handleClear() {
    filtersSelection.value = {};
  }

  effect(() => {
    filterBadgeValue.value = Object.keys(filtersSelection.value).length || 0;
    sessionStorage.setItem("filtersSelection", JSON.stringify(filtersSelection.value));
  });

  return (
    <div className="filterContainer">
      <IconButton className="roundedSecondaryIconButton" onClick={() => (filtersOpen.value = !filtersOpen.value)}>
        <FilterAltIcon />
      </IconButton>

      <Badge badgeContent={String(filterBadgeValue.value)}></Badge>

      {filtersOpen.value === true && (
        // <ClickAwayListener onClickAway={() => (filtersOpen.value = false)}>
        <div className="filterDropdown glass">
          {filtersOptions.map((filter) => {
            const options = transformedQueue?.flatMap((obj) => obj[filter.queueValueKey as keyof object]);
            const uniqueOptions = [...new Set(options)];

            return (
              <FormControl fullWidth key={filter.label}>
                <InputLabel id={filter.label}>{t(filter.label)}</InputLabel>
                <Select
                  multiple
                  labelId={filter.label}
                  name={filter.queueValueKey}
                  value={filtersSelection.value[filter.queueValueKey as keyof object] || []}
                  label={t(filter.label)}
                  onChange={handleChange}
                >
                  {uniqueOptions?.map((option, index) => (
                    <MenuItem value={option} key={index}>
                      {t(option)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            );
          })}
          <Button color={"primary"} variant="outlined" onClick={handleClear}>
            {t("GLOBAL_LABEL_CLEAR")}
          </Button>
        </div>
        // </ClickAwayListener>
      )}
    </div>
  );
}
