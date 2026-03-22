import { Prisma } from "../../../generated/prisma/client";

export const appointmentSearchableFields = [
  "id",
  "clientId",
  "lawyerId",
  "scheduleId",
];

export const appointmentFilterableFields = [
  "id",
  "clientId",
  "lawyerId",
  "scheduleId",
  "status",
  "paymentStatus",
  "createdAt",
  "updatedAt",
  "schedule.startDateTime",
  "schedule.endDateTime",
];

export const appointmentIncludeConfig: Partial<
  Record<
    keyof Prisma.AppointmentInclude,
    Prisma.AppointmentInclude[keyof Prisma.AppointmentInclude]
  >
> = {
  client: true,
  lawyer: true,
  schedule: true,
  payment: true,
};
