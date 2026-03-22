export interface ICreateSchedulePayload {
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    interval?: number; // optional (default 30 min)
}

export interface IUpdateSchedulePayload {
    startDate?: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
}