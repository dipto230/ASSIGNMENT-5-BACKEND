import { Prisma } from "../../../generated/prisma/client";

export const scheduleFilterableFields = [
  "id",
  "startDateTime",
  "endDateTime",
  // "appointments.lawyer.id", // optional (future use)
];

export const scheduleSearchableFields = [
  "id",
  "startDateTime",
  "endDateTime",
];

export const scheduleIncludeConfig: Partial<
  Record<
    keyof Prisma.ScheduleInclude,
    Prisma.ScheduleInclude[keyof Prisma.ScheduleInclude]
  >
> = {
  appointments: {
    include: {
      lawyer: true,
      client: true,
      payment: true,
      consultationNote: true,
    },
  },
  lawyerSchedules: true,
};