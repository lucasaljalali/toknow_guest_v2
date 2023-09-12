export interface InQueueItemScheduling {
    id: number;
    start: string;
    end: string;
    schedulingStateId: number;
    destinationId: number;
    createdDate: string;
    createdBy: string;
    routeId?: number;
}

export interface InQueueItemHistory {
    id: number;
    createdDate: string;
    actionId: number;
    destinationId: number;
    message: string;
    translatedMessage: string;
    notificationStatus: "ACCEPTED" | "DELIVERED" | "ERROR" | "IN_PROCESS" | "REJECTED" | "SCHEDULED" | "VIEWED" | "UNDEFINED" | "UNKNOWN";
    notificationTimestamp: string;
    createdBy: string;
}
export interface InQueueItem {
    id: number;
    deviceId?: number;
    isDisabled: boolean;
    useSMS: boolean;
    clientsId: number[];
    subClientsId: number[];
    currentDestinationId: number;
    queueStateId: number;
    lastMessage: string;
    lastActionId: number;
    createdDate: string;
    createdBy: string;
    history: InQueueItemHistory[];
    currentScheduleId?: number;
    routeId?: number;
    scheduling?: InQueueItemScheduling[];
    driverName?: string;
    driverLocaleId?: string;
    driverId?: string;
    driverPhonePrefix?: string;
    driverPhone?: string;
    carPlate?: string;
    carBackPlate?: string;
    priorities?: number[];
    serviceId?: number;
    observations?: string;
    canceledReason?: string;
}