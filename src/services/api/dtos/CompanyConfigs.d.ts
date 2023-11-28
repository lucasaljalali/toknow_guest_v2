import { KeyFilterType } from "primereact/keyfilter";

export interface InTableColumns {
  field: string;
  header: string;
  sortField?: string;
  editor?: string;
}

export interface InReportTemplate {
  dialogTitle: string;
  dataPath: string;
  fields: InTableColumns[];
}

export interface InDynamicFormField {
  component:
    | "Ocult"
    | "MultiSelect"
    | "Dropdown"
    | "InputText"
    | "InputNumber"
    | "InputMask"
    | "SelectButton"
    | "Calendar"
    | "InputGroup"
    | "InputSwitch"
    | "FileUpload";
  width: string;
  label: string;
  name: string;
  showClear?: boolean;
  isDisabled?: boolean | string;
  isRequired?: boolean;
  isRegister?: boolean;
  showTime?: boolean;
  showIncrement?: boolean;
  timeOnly?: boolean;
  min?: number;
  max?: number;
  maxLength?: number;
  keyfilter?: "pint" | "int" | "pnum" | "money" | "num" | "hex" | "email" | "alpha" | "alphanum" | RegExp;
  mask?: string;
  tooltip?: string;
  disabledTooltip?: string;
  extraFieldsOnFill?: boolean;
  childFields?: InDynamicFormField[];
}

export interface InDynamicFormTemplate {
  dialogTitle: string;
  onDataSubmit: string;
  submitButtonLabel: "FORM_LABEL_INSERT" | "FORM_LABEL_SAVE" | "FORM_LABEL_NOTIFY" | "FORM_LABEL_CONFIRM";
  submitButtonIcon: string;
  cancelButton?: boolean;
  deleteButton?: boolean;
  fields: InDynamicFormField[];
}

export interface InRolesConfigs {
  id: number;
  label: string;
  permissions: {
    featureId: number;
    permissions: number[];
  }[];
}

export interface InUserConfigs {
  id: string;
  label: string;
  imageBase64: string;
  email: string;
  rolesId: number[];
}

export interface InFeaturesConfigs {
  index: number;
  label: string;
  permissions: number[];
  icon?: string;
  children?: InFeaturesConfigs[];
}

export interface InInputConfigs {
  id: string | number;
  label: string;
  matchCode?: string;
  icon?: string;
  color?: string;
  vip?: boolean;
  typeId?: number;
  full?: boolean;
  isAvailable?: boolean;
}

export interface InDestinationConfigs extends InInputConfigs {
  maxOccupancy: number;
  full: boolean;
  map: boolean;
  sectorId: number;
  responsible?: number[];
}

export interface InSelectItemConfigs {
  label?: string;
  value?: any;
  className?: string;
  icon?: IconType<SelectItem>;
  title?: string;
  disabled?: boolean;
}

export interface InCompaniesList {
  id: number;
  value: string;
  label: string;
  isCurrent: boolean;
  timezone: string;
}

export interface InClientsList {
  id: number;
  number: number;
  label: string;
  matchCode: string;
  taxNumber: string;
  vip: boolean;
  active: boolean;
}

export interface InActionsMenuItemConfigs {
  id: number;
  label: string;
  color: string;
  queueStateId: number;
  defaultMessageId?: number;
  sms?: boolean;
  command?: string;
}

export interface InQueueStatesConfigs extends InInputConfigs {
  actions?: number[];
}

export interface InDefaultMessagesConfigs extends InInputConfigs {
  localeId: string;
  messageLocales: {
    localeId: string;
    value: string;
  }[];
}

export interface InTransmittersConfigs {
  id: number;
  ip: string;
  port: number;
  systemId: number;
  label?: string;
}

export interface InTimingStateConfigs extends InInputConfigs {
  tolerance: number;
}

export interface InServicesConfigs extends InInputConfigs {
  icon: string;
}

export interface InFormFieldsConfigs {
  clients: InClientsList[];
  clients2: InClientsList[];
  transmitters: InTransmittersConfigs[];
  devices: InInputConfigs[];
  sectors: InInputConfigs[];
  destinations: InDestinationConfigs[];
  driverLocale: InInputConfigs[];
  defaultMessages: InDefaultMessagesConfigs[];
  priorities: InInputConfigs[];
  services: InServicesConfigs[];
  actionsMenu: InActionsMenuItemConfigs[];
  queueStates: InQueueStatesConfigs[];
  responsibility: InInputConfigs[];
  schedulingStates: InInputConfigs[];
  timingState: InTimingStateConfigs[];
  roles: InRolesConfigs[];
  users: InUserConfigs[];
}

export interface InCompanyConfigs {
  companiesList: InCompaniesList[];
  scheduleMinDurationInMinutes: number;
  scheduleMaxDurationInMinutes: number;
  locale: string;
  localesList: InSelectItemConfigs[];
  featureList: InFeaturesConfigs[];
  formFieldsData: InFormFieldsConfigs;
  logoBase64: string;
}
