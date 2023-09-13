import { createContext, useContext, useEffect, useState } from "react";
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, useQuery } from "react-query";
import { axiosInstance } from "../services/api/baseConfigs";
import { InCompanyConfigs } from "../services/api/dtos/CompanyConfigs";
import keycloak from "../services/keycloak/keycloak";
import { KeycloakTokenParsed } from "keycloak-js";
import i18n from "../services/translations/i18n";
import Loading from "../components/Loading/Loading";

const CompanyContext = createContext({} as CompanyContextData);

export function useCompany() {
  return useContext(CompanyContext);
}

type Props = { children: JSX.Element | JSX.Element[] };

interface CompanyContextData {
  accessToken: string | undefined;
  companyConfigs: InCompanyConfigs | undefined;
  user: KeycloakTokenParsed | undefined;
  updateCompany: Function;
  updateLocale: Function;
  refetchConfigs: (
    options?: (RefetchOptions & RefetchQueryFilters<unknown>) | undefined
  ) => Promise<QueryObserverResult<any, unknown>>;
}

export function CompanyProvider({ children }: Props) {
  const [accessToken, setAccessToken] = useState<string>();
  const [user, setUser] = useState<KeycloakTokenParsed>();
  const [companyConfigs, setCompanyConfigs] = useState<InCompanyConfigs>();
  const [company, setCompany] = useState<string>();

  const fetchData = async () => {
    const response = await axiosInstance.get("config");
    return response.data.data;
  };

  const { refetch: refetchConfigs } = useQuery(["configs"], fetchData, {
    enabled: false,
    retry: true,
    retryDelay: 5000,
    onSuccess: (data) => {
      setCompanyConfigs(data);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  useEffect(() => {
    keycloak.onAuthSuccess = handleSetInitialConfigs;
    keycloak.onTokenExpired = handleTokenRefresh;

    return () => {
      keycloak.onTokenExpired = undefined;
      keycloak.onAuthSuccess = undefined;
    };
  }, [keycloak]);

  useEffect(() => {
    if (company && accessToken) {
      axiosInstance.defaults.headers.common = {
        locale: i18n?.language,
        tenant: company,
        Authorization: `Bearer ${accessToken}`,
      };
      refetchConfigs();
    }
  }, [company, accessToken]);

  async function handleTokenRefresh() {
    try {
      const refreshed = await keycloak.updateToken(5);
      handleSetInitialConfigs();
      console.log(refreshed ? "Token has been refreshed" : "Token refresh failed");
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  }

  function handleSetInitialConfigs() {
    setAccessToken(keycloak?.token);
    setUser(keycloak?.tokenParsed);
    setCompany(keycloak?.tokenParsed?.tenants?.[0]);
  }

  function updateCompany(newCompany: string) {
    const companyExistsInCompaniesList = companyConfigs?.companiesList?.find((c) => c.value === newCompany);
    if (companyExistsInCompaniesList) {
      if (company !== undefined && company !== newCompany) {
        setCompany(newCompany);
      }
    } else {
      console.error(`Invalid company selected: ${newCompany}`);
    }
  }

  function updateLocale(newLocale: string) {
    if (newLocale !== i18n.language) {
      i18n.changeLanguage(newLocale);
    }
  }

  const value = {
    accessToken,
    companyConfigs,
    user,
    updateCompany,
    updateLocale,
    refetchConfigs,
  };

  return <CompanyContext.Provider value={value}>{user && companyConfigs ? children : <Loading />}</CompanyContext.Provider>;
}
