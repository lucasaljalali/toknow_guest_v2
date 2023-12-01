import { signal } from "@preact/signals-react";
import { TQueueCardSize } from "./types";
import { InCompanyConfigs } from "../services/api/dtos/CompanyConfigs";
import { ITransformedInQueueData } from "../pages/Home/utils/transformInQueueData";
import { KeycloakTokenParsed } from "keycloak-js";
import { PaletteMode } from "@mui/material";

export const isToFetchConfigs = signal(false);

export const companyConfigs = signal<InCompanyConfigs | null>(null);

export const company = signal<string | null>(null);

export const accessToken = signal<string | null>(null);

export const user = signal<KeycloakTokenParsed | null>(null);

export const themeMode = signal<PaletteMode>("light");

export const windowWidth = signal(window.innerWidth);

export const sideDrawerOpen = signal(false);

export const filtersOpen = signal(false);

const persistentFiltersSelection = sessionStorage.getItem("filtersSelection");

export const filtersSelection = signal(persistentFiltersSelection ? JSON.parse(persistentFiltersSelection) : {});

export const filterBadgeValue = signal(0);

export const persistentQueueCardSize = sessionStorage.getItem("queueCardSize") as TQueueCardSize;

export const queueCardSize = signal<TQueueCardSize>(persistentQueueCardSize ? persistentQueueCardSize : "large");

export const notificationDrawerOpen = signal(false);

export const alert = signal<{ [key: string]: string } | null>(null);

export const cardData = signal<ITransformedInQueueData | null>(null);
