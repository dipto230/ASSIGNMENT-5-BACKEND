import status from "http-status";
import { v7 as uuidv7 } from "uuid";
import { prisma } from "../../lib/prisma";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { IBookAppointmentPayload } from "./appointment.interface";
import { AppointmentStatus, PaymentStatus, Role } from "../../../generated/prisma/enums";
import AppError from "../../errorHelpers/AppError";

const bookAppointment = async (payload: IBookAppointmentPayload, user: IRequestUser) => {
  const clientData = await prisma.client.findUniqueOrThrow({
    where: { email: user.email },
  });

  const lawyerData = await prisma.lawyer.findUniqueOrThrow({
    where: { id: payload.lawyerId },
  });

  const scheduleData = await prisma.schedule.findUniqueOrThrow({
    where: { id: payload.scheduleId },
  });

  const lawyerSchedule = await prisma.lawyerSchedules.findUniqueOrThrow({
    where: {
      lawyerId_scheduleId: {
        lawyerId: lawyerData.id,
        scheduleId: scheduleData.id,
      },
    },
  });
if (lawyerSchedule.isBooked) {
  throw new AppError(status.BAD_REQUEST, "Schedule already booked");
}
  const videoCallingId = String(uuidv7());

  const result = await prisma.$transaction(async (tx) => {
    const appointment = await tx.appointment.create({
      data: {
        clientId: clientData.id,
        lawyerId: payload.lawyerId,
        scheduleId: payload.scheduleId,
        videoCallingId,
      },
    });

    await tx.lawyerSchedules.update({
      where: {
        lawyerId_scheduleId: {
          lawyerId: payload.lawyerId,
          scheduleId: payload.scheduleId,
        },
      },
      data: { isBooked: true },
    });

    const payment = await tx.payment.create({
      data: {
        appointmentId: appointment.id,
        amount: 0, // customize if needed
            transactionId: String(uuidv7()),
          status: PaymentStatus.UNPAID,
      },
    });

    return { appointment, payment };
  });

  return result;
};

const getMyAppointments = async (user: IRequestUser) => {
  const client = await prisma.client.findUnique({
    where: { email: user.email },
  });

  const lawyer = await prisma.lawyer.findUnique({
    where: { email: user.email },
  });

  if (client) {
    return prisma.appointment.findMany({
      where: { clientId: client.id },
      include: { lawyer: true, schedule: true },
    });
  }

  if (lawyer) {
    return prisma.appointment.findMany({
      where: { lawyerId: lawyer.id },
      include: { client: true, schedule: true },
    });
  }

  throw new AppError(status.NOT_FOUND, "User not found");
};

const getMySingleAppointment = async (id: string, user: IRequestUser) => {
  const client = await prisma.client.findUnique({
    where: { email: user.email },
  });

  const lawyer = await prisma.lawyer.findUnique({
    where: { email: user.email },
  });

  let appointment;

  if (client) {
    appointment = await prisma.appointment.findFirst({
      where: { id, clientId: client.id },
      include: { lawyer: true, schedule: true },
    });
  } else if (lawyer) {
    appointment = await prisma.appointment.findFirst({
      where: { id, lawyerId: lawyer.id },
      include: { client: true, schedule: true },
    });
  }

  if (!appointment) {
    throw new AppError(status.NOT_FOUND, "Appointment not found");
  }

  return appointment;
};

const changeAppointmentStatus = async (
  id: string,
  statusData: AppointmentStatus,
  user: IRequestUser
) => {
  const appointment = await prisma.appointment.findUniqueOrThrow({
    where: { id },
    include: { lawyer: true },
  });

  if (user.role === Role.LAWYER && user.email !== appointment.lawyer.email) {
    throw new AppError(status.BAD_REQUEST, "Not your appointment");
  }

  return prisma.appointment.update({
    where: { id },
    data: { status: statusData },
  });
};

const getAllAppointments = async () => {
  return prisma.appointment.findMany({
    include: {
      client: true,
      lawyer: true,
      schedule: true,
      payment: true,
    },
  });
};


const cancelUnpaidAppointments = async () => {
  const unpaidAppointments = await prisma.appointment.findMany({
    where: {
      status: AppointmentStatus.SCHEDULED,
      createdAt: {
        lte: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes আগে
      },
      payment: {
        status: PaymentStatus.UNPAID,
      },
    },
    include: {
      schedule: true,
    },
  });

  const result = await prisma.$transaction(async (tx) => {
    for (const appointment of unpaidAppointments) {
    
      await tx.appointment.update({
        where: { id: appointment.id },
        data: { status: AppointmentStatus.CANCELLED },
      });

      
      await tx.lawyerSchedules.update({
        where: {
          lawyerId_scheduleId: {
            lawyerId: appointment.lawyerId,
            scheduleId: appointment.scheduleId,
          },
        },
        data: { isBooked: false },
      });
    }
  });

  return result;
};



export const AppointmentService = {
  bookAppointment,
  getMyAppointments,
  getMySingleAppointment,
  changeAppointmentStatus,
    getAllAppointments,
  cancelUnpaidAppointments
};
