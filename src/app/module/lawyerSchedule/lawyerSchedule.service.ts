import { LawyerSchedules, Prisma } from "../../../generated/prisma/client";
import { IQueryParams } from "../../interfaces/query.interface";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilder";
import {
  lawyerScheduleFilterableFields,
  lawyerScheduleIncludeConfig,
  lawyerScheduleSearchableFields,
} from "./lawyerSchedule.constant";
import {
  ICreateLawyerSchedulePayload,
  IUpdateLawyerSchedulePayload,
} from "./lawyerSchedule.interface";

// ✅ CREATE
const createMyLawyerSchedule = async (
  user: IRequestUser,
  payload: ICreateLawyerSchedulePayload
) => {
  const lawyerData = await prisma.lawyer.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const data = payload.scheduleIds.map((scheduleId) => ({
    lawyerId: lawyerData.id,
    scheduleId,
  }));

  await prisma.lawyerSchedules.createMany({
    data,
  });

  const result = await prisma.lawyerSchedules.findMany({
    where: {
      lawyerId: lawyerData.id,
      scheduleId: {
        in: payload.scheduleIds,
      },
    },
    include: {
      schedule: true,
    },
  });

  return result;
};

// ✅ GET MY
const getMyLawyerSchedules = async (
  user: IRequestUser,
  query: IQueryParams
) => {
  const lawyerData = await prisma.lawyer.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const queryBuilder = new QueryBuilder<
    LawyerSchedules,
    Prisma.LawyerSchedulesWhereInput,
    Prisma.LawyerSchedulesInclude
  >(
    prisma.lawyerSchedules,
    {
      lawyerId: lawyerData.id,
      ...query,
    },
    {
      filterableFields: lawyerScheduleFilterableFields,
      searchableFields: lawyerScheduleSearchableFields,
    }
  );

  const result = await queryBuilder
    .search()
    .filter()
    .paginate()
    .include({
      schedule: true,
      lawyer: {
        include: {
          user: true,
        },
      },
    })
    .sort()
    .fields()
    .dynamicInclude(lawyerScheduleIncludeConfig)
    .execute();

  return result;
};

// ✅ GET ALL
const getAllLawyerSchedules = async (query: IQueryParams) => {
  const queryBuilder = new QueryBuilder<
    LawyerSchedules,
    Prisma.LawyerSchedulesWhereInput,
    Prisma.LawyerSchedulesInclude
  >(prisma.lawyerSchedules, query, {
    filterableFields: lawyerScheduleFilterableFields,
    searchableFields: lawyerScheduleSearchableFields,
  });

  return await queryBuilder
    .search()
    .filter()
    .paginate()
    .dynamicInclude(lawyerScheduleIncludeConfig)
    .sort()
    .execute();
};

// ✅ GET BY ID
const getLawyerScheduleById = async (
  lawyerId: string,
  scheduleId: string
) => {
  return await prisma.lawyerSchedules.findUnique({
    where: {
      lawyerId_scheduleId: {
        lawyerId,
        scheduleId,
      },
    },
    include: {
      schedule: true,
      lawyer: true,
    },
  });
};

// ✅ UPDATE
const updateMyLawyerSchedule = async (
  user: IRequestUser,
  payload: IUpdateLawyerSchedulePayload
) => {
  const lawyerData = await prisma.lawyer.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const deleteIds = payload.scheduleIds
    .filter((s) => s.shouldDelete)
    .map((s) => s.id);

  const createIds = payload.scheduleIds
    .filter((s) => !s.shouldDelete)
    .map((s) => s.id);

  return await prisma.$transaction(async (tx) => {
    await tx.lawyerSchedules.deleteMany({
      where: {
        isBooked: false,
        lawyerId: lawyerData.id,
        scheduleId: { in: deleteIds },
      },
    });

    const data = createIds.map((id) => ({
      lawyerId: lawyerData.id,
      scheduleId: id,
    }));

    return await tx.lawyerSchedules.createMany({ data });
  });
};

// ✅ DELETE
const deleteMyLawyerSchedule = async (
  id: string,
  user: IRequestUser
) => {
  const lawyerData = await prisma.lawyer.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  await prisma.lawyerSchedules.deleteMany({
    where: {
      isBooked: false,
      lawyerId: lawyerData.id,
      scheduleId: id,
    },
  });
};

export const LawyerScheduleService = {
  createMyLawyerSchedule,
  getMyLawyerSchedules,
  getAllLawyerSchedules,
  getLawyerScheduleById,
  updateMyLawyerSchedule,
  deleteMyLawyerSchedule,
};
