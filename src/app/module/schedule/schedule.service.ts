import { addHours, addMinutes } from "date-fns";
import { Prisma, Schedule } from "../../../generated/prisma/client";
import { IQueryParams } from "../../interfaces/query.interface";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilder";
import {
  scheduleFilterableFields,
  scheduleIncludeConfig,
  scheduleSearchableFields,
} from "./schedule.constant";
import {
  ICreateSchedulePayload,
  IUpdateSchedulePayload,
} from "./schedule.interface";
import { convertDateTime } from "./schedule.utils";

// ✅ helper (safe date parse)
const parseDate = (date?: string) => {
  if (!date) {
    throw new Error("Date is required");
  }
  return new Date(date);
};

const createSchedule = async (payload: ICreateSchedulePayload) => {
  const { startDate, endDate, startTime, endTime } = payload;

  // ✅ validation
  if (!startDate || !endDate || !startTime || !endTime) {
    throw new Error("Missing required fields");
  }

  const interval = 30;

  const currentDate = parseDate(startDate);
  const lastDate = parseDate(endDate);

  const schedules: Schedule[] = [];

  while (currentDate <= lastDate) {
    const baseDate = new Date(currentDate);

    const startDateTime = addMinutes(
      addHours(baseDate, Number(startTime.split(":")[0])),
      Number(startTime.split(":")[1])
    );

    const endDateTime = addMinutes(
      addHours(baseDate, Number(endTime.split(":")[0])),
      Number(endTime.split(":")[1])
    );

    let tempStart = new Date(startDateTime);

    while (tempStart < endDateTime) {
      const s = convertDateTime(tempStart);
      const e = convertDateTime(addMinutes(tempStart, interval));

      const existingSchedule = await prisma.schedule.findFirst({
        where: {
          startDateTime: s,
          endDateTime: e,
        },
      });

      if (!existingSchedule) {
        const result = await prisma.schedule.create({
          data: {
            startDateTime: s,
            endDateTime: e,
          },
        });

        schedules.push(result);
      }

      tempStart = addMinutes(tempStart, interval);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return schedules;
};

const getAllSchedules = async (query: IQueryParams) => {
  const queryBuilder = new QueryBuilder<
    Schedule,
    Prisma.ScheduleWhereInput,
    Prisma.ScheduleInclude
  >(prisma.schedule, query || {}, {
    searchableFields: scheduleSearchableFields,
    filterableFields: scheduleFilterableFields,
  });

  const result = await queryBuilder
    .search()
    .filter()
    .paginate()
    .dynamicInclude(scheduleIncludeConfig) // ✅ now works
    .sort()
    .fields()
    .execute();

  return result;
};

const getScheduleById = async (id: string) => {
  return await prisma.schedule.findUnique({
    where: { id },
  });
};

const updateSchedule = async (
  id: string,
  payload: IUpdateSchedulePayload
) => {
  const { startDate, endDate, startTime, endTime } = payload;

  // ✅ validation
  if (!startDate || !endDate || !startTime || !endTime) {
    throw new Error("Missing required fields");
  }

  const startDateTime = addMinutes(
    addHours(parseDate(startDate), Number(startTime.split(":")[0])),
    Number(startTime.split(":")[1])
  );

  const endDateTime = addMinutes(
    addHours(parseDate(endDate), Number(endTime.split(":")[0])),
    Number(endTime.split(":")[1])
  );

  return await prisma.schedule.update({
    where: { id },
    data: {
      startDateTime,
      endDateTime,
    },
  });
};

const deleteSchedule = async (id: string) => {
  await prisma.schedule.delete({
    where: { id },
  });

  return { message: "Schedule deleted successfully" };
};

export const ScheduleService = {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
};
