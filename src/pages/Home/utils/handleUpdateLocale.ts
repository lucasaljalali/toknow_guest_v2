import i18n from "../../../services/translations/i18n";

export function updateLocale(newLocale: string) {
  if (newLocale !== i18n.language) {
    i18n.changeLanguage(newLocale);
  }
}
