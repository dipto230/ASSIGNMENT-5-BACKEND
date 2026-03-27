import { Request, Response } from "express";
import status from "http-status";
import { IQueryParams } from "../../interfaces/query.interface";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { ScheduleService } from "./schedule.service";

const createSchedule = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await ScheduleService.createSchedule(payload);

  sendResponse(res, {
    success: true,
    httpStatusCode: status.CREATED,
    message: "Schedule created successfully",
    data: result,
  });
});

const getAllSchedules = catchAsync(async (req: Request, res: Response) => {

  const query = req.query as unknown as IQueryParams;

  const result = await ScheduleService.getAllSchedules(query);

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "Schedules retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getScheduleById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await ScheduleService.getScheduleById(id as string);

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "Schedule retrieved successfully",
    data: result,
  });
});

const updateSchedule = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;

  const result = await ScheduleService.updateSchedule(id as string, payload);

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "Schedule updated successfully",
    data: result,
  });
});

const deleteSchedule = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await ScheduleService.deleteSchedule(id as string);

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "Schedule deleted successfully",
    data: result, 
  });
});

export const ScheduleController = {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
};