import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { AppointmentService } from "./appointment.service";

const bookAppointment = catchAsync(async (req: Request, res: Response) => {
  const result = await AppointmentService.bookAppointment(req.body, req.user);

  sendResponse(res, {
    success: true,
    httpStatusCode: status.CREATED,
    message: "Appointment booked successfully",
    data: result,
  });
});

const getMyAppointments = catchAsync(async (req: Request, res: Response) => {
  const result = await AppointmentService.getMyAppointments(req.user);

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "Appointments retrieved successfully",
    data: result,
  });
});

const getMySingleAppointment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  const result = await AppointmentService.getMySingleAppointment(id, req.user);

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "Appointment retrieved successfully",
    data: result,
  });
});

const changeAppointmentStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  const result = await AppointmentService.changeAppointmentStatus(
    id,
    req.body.status,
    req.user
  );

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "Appointment status updated successfully",
    data: result,
  });
});

const getAllAppointments = catchAsync(async (_req: Request, res: Response) => {
  const result = await AppointmentService.getAllAppointments();

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "All appointments retrieved successfully",
    data: result,
  });
});

export const AppointmentController = {
  bookAppointment,
  getMyAppointments,
  getMySingleAppointment,
  changeAppointmentStatus,
  getAllAppointments,
};
