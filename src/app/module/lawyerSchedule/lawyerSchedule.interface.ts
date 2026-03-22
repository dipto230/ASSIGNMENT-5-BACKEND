export interface ICreateLawyerSchedulePayload {
  scheduleIds: string[];
}

export interface IUpdateLawyerSchedulePayload {
  scheduleIds: {
    shouldDelete: boolean;
    id: string;
  }[];
}
