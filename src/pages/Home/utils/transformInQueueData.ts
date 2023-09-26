import { InCompanyConfigs } from "../../../services/api/dtos/CompanyConfigs";
import { InQueueItem } from "../../../services/api/dtos/Queue";

export interface ITransformedInQueueData extends InQueueItem{
    partySize?: string,
    name?: string,
    estimatedTime?: string,
    prioritiesLabels?: (string | undefined)[] ,
    waitingTimeInMinutes?: number | string,
    lastNotificationTimeInMinutes?: number | string,
    deviceLabel?: number | string,
    notifed?: boolean
    phonePrefix?: string;
    phoneNumber?: string;
    verifyCode?: string;
}

export function transformInQueueData (data: InQueueItem, companyConfigs?: InCompanyConfigs): ITransformedInQueueData {
    
    const partySize = data?.carPlate; //workaround to use premium api
    const name = data?.driverName; //workaround to use premium api
    const estimatedTime = data?.carBackPlate; //workaround to use premium api
    const prioritiesLabels = data?.priorities?.map(
      (priority) => companyConfigs?.formFieldsData?.priorities?.find((item) => item.id === priority)?.label
    );
    const createdDate = data?.createdDate && new Date(data.createdDate);
    const currentDate = new Date();
    const waitingTimeInMs = createdDate && currentDate.getTime() - createdDate.getTime();
    const waitingTimeInMinutes = waitingTimeInMs && Math.floor(waitingTimeInMs / (1000 * 60));
    const lastNotification = data?.history?.find((action) => action.actionId === 2);
    const lastNotificationTime = lastNotification?.createdDate;
    const lastNotificationTimeInMs = lastNotificationTime && currentDate.getTime() - new Date(lastNotificationTime).getTime();
    const lastNotificationTimeInMinutes = lastNotificationTimeInMs ? Math.floor(lastNotificationTimeInMs / (1000 * 60)) : undefined;
    const useSMS = data?.useSMS;
    const deviceLabel = data?.deviceId ? data?.deviceId : `${data?.driverPhonePrefix} ${data?.driverPhone}`;
    const notifed = lastNotification != undefined;
    const phonePrefix = data?.driverPhonePrefix;
    const phoneNumber = data?.driverPhone;

    const newData = {
        ...data,
        partySize: partySize,
        name: name,
        estimatedTime: estimatedTime,
        prioritiesLabels: prioritiesLabels,
        waitingTimeInMinutes: waitingTimeInMinutes,
        lastNotificationTimeInMinutes: lastNotificationTimeInMinutes,
        useSMS: useSMS,
        deviceLabel: deviceLabel,
        notifed: notifed,
        phonePrefix: phonePrefix,
        phoneNumber: phoneNumber
    }

    return newData;
}