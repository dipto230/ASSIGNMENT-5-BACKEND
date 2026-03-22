import { Prisma } from "../../../generated/prisma/client";

export const lawyerScheduleSearchableFields = [
  "lawyerId",
  "scheduleId",
];

export const lawyerScheduleFilterableFields = [
  "lawyerId",
  "scheduleId",
  "isBooked",
  "createdAt",
  "updatedAt",
  "schedule.startDateTime",
  "schedule.endDateTime",
];

export const lawyerScheduleIncludeConfig: Partial<
  Record<
    keyof Prisma.LawyerSchedulesInclude,
    Prisma.LawyerSchedulesInclude[keyof Prisma.LawyerSchedulesInclude]
  >
> = {
  lawyer: {
    include: {
      user: true,
      
    },
  },
  schedule: true,
};
