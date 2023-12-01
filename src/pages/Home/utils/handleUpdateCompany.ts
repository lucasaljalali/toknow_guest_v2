import { company, companyConfigs } from "../../../store/signalsStore";

export function updateCompany(newCompany: string) {
  const companyExistsInCompaniesList = companyConfigs.value?.companiesList?.find((c) => c.value === newCompany);
  if (companyExistsInCompaniesList) {
    if (company.value !== undefined && company.value !== newCompany) {
      company.value = newCompany;
    }
  } else {
    console.error(`Invalid company selected: ${newCompany}`);
  }
}
