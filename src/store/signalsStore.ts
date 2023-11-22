import { signal } from "@preact/signals-react";
import { TQueueCardSize } from "./types";

export const windowWidth = signal(window.innerWidth);

export const sideDrawerOpen = signal(false);

export const filtersOpen = signal(false);

const persistentFiltersSelection = sessionStorage.getItem("filtersSelection");

export const filtersSelection = signal(persistentFiltersSelection ? JSON.parse(persistentFiltersSelection) : {});

export const filterBadgeValue = signal(0);

export const persistentQueueCardSize = sessionStorage.getItem("queueCardSize") as TQueueCardSize;

export const queueCardSize = signal<TQueueCardSize>(persistentQueueCardSize ? persistentQueueCardSize : "large");
