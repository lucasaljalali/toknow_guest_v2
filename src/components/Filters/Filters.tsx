import { Badge, Button, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { filterBadgeValue, filtersOpen, filtersSelection } from "../../store/signalsStore";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { filtersOptions } from "../../store/constants";
import { useTranslation } from "react-i18next";
import { useQueue } from "../../hooks/useQueue";
import { transformInQueueData } from "../../pages/Home/utils/transformInQueueData";
import { useCompany } from "../../hooks/CompanyContext";
import { effect } from "@preact/signals-react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

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
    filtersOpen.value === false;
  }

  function handleClickAway(event: MouseEvent | TouchEvent) {
    //condition is a workaround because when clicking the MUI Select it's clicking on the body tag
    if (event.target !== document.body) {
      filtersOpen.value = false;
    }
  }

  effect(() => {
    filterBadgeValue.value = Object.keys(filtersSelection.value).length || 0;
    sessionStorage.setItem("filtersSelection", JSON.stringify(filtersSelection.value));
  });

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div className="filterContainer">
        <IconButton className="roundedSecondaryIconButton" onClick={() => (filtersOpen.value = !filtersOpen.value)}>
          <FilterAltIcon />
        </IconButton>

        {filterBadgeValue.value > 0 && <Badge id={"filterBadge"} badgeContent={String(filterBadgeValue.value)} />}

        <div id="filterDropdown" className={filtersOpen.value === true ? "open glass" : "glass"}>
          {filtersOptions.map((filter) => {
            const options = transformedQueue?.flatMap((obj) => obj[filter.queueValueKey as keyof object]);
            const uniqueOptions = [...new Set(options)];

            return (
              <FormControl fullWidth key={filter.label} disabled={uniqueOptions?.length === 0}>
                <InputLabel id={filter.label}>{t(filter.label)}</InputLabel>
                <Select
                  multiple
                  id={filter.queueValueKey}
                  name={filter.queueValueKey}
                  labelId={filter.label}
                  label={t(filter.label)}
                  value={filtersSelection.value[filter.queueValueKey as keyof object] || []}
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
      </div>
    </ClickAwayListener>
  );
}
