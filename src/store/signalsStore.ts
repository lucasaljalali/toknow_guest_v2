import { signal } from "@preact/signals-react";

export const sideDrawerOpen = signal(false);

export const filtersOpen = signal(false);

const persistentFiltersSelection = sessionStorage.getItem("filtersSelection");

export const filtersSelection = signal(persistentFiltersSelection ? JSON.parse(persistentFiltersSelection) : {});

export const filterBadgeValue = signal(0);
