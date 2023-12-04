import { signal } from "@preact/signals-react";
import { TQueueCardSize } from "./types";
import { InCompanyConfigs, InInputConfigs } from "../services/api/dtos/CompanyConfigs";
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

export const message = signal("");

export const countdown = signal<number>(0);

export const isCodeVerified = signal<boolean | null>(null);

export const codeId = signal<number | null>(null);

export const availableDevices = signal<InInputConfigs[] | undefined>(undefined);

export const isDragging = signal<boolean>(false);

export const devicesOpen = signal(false);

export const devicesOpenScrolling = signal(false);
