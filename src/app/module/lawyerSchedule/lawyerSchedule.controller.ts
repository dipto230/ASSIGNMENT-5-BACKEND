import { Request, Response } from "express";
import status from "http-status";
import { IQueryParams } from "../../interfaces/query.interface";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { LawyerScheduleService } from "./lawyerSchedule.service";

const createMyLawyerSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await LawyerScheduleService.createMyLawyerSchedule(
    req.user,
    req.body
  );

  sendResponse(res, {
    success: true,
    httpStatusCode: status.CREATED,
    message: "Lawyer schedule created successfully",
    data: result,
  });
});

const getMyLawyerSchedules = catchAsync(async (req: Request, res: Response) => {
  const result = await LawyerScheduleService.getMyLawyerSchedules(
    req.user,
    req.query as IQueryParams
  );

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "Lawyer schedules retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getAllLawyerSchedules = catchAsync(async (req: Request, res: Response) => {
  const result = await LawyerScheduleService.getAllLawyerSchedules(
    req.query as IQueryParams
  );

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "All lawyer schedules retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getLawyerScheduleById = catchAsync(async (req: Request, res: Response) => {
    const { lawyerId, scheduleId } = req.params as {
       lawyerId: string;
    scheduleId: string;
  };

  const result = await LawyerScheduleService.getLawyerScheduleById(
    lawyerId ,
    scheduleId
  );

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "Lawyer schedule retrieved successfully",
    data: result,
  });
});

const updateMyLawyerSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await LawyerScheduleService.updateMyLawyerSchedule(
    req.user,
    req.body
  );

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "Lawyer schedule updated successfully",
    data: result,
  });
});

const deleteMyLawyerSchedule = catchAsync(async (req: Request, res: Response) => {
      const { id } = req.params as { id: string };
  await LawyerScheduleService.deleteMyLawyerSchedule(
    id,
    req.user
  );

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "Lawyer schedule deleted successfully",
  });
});

export const LawyerScheduleController = {
  createMyLawyerSchedule,
  getMyLawyerSchedules,
  getAllLawyerSchedules,
  getLawyerScheduleById,
  updateMyLawyerSchedule,
  deleteMyLawyerSchedule,
};
