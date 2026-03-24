import { v7 as uuidv7 } from "uuid";
import status from "http-status";
import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import { PaymentStatus } from "../../../generated/prisma/enums";
import { ICreatePaymentPayload } from "./payment.interface";

const createPayment = async (payload: ICreatePaymentPayload) => {
  const { appointmentId, amount } = payload;

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment) {
    throw new AppError(status.NOT_FOUND, "Appointment not found");
  }

  if (appointment.paymentStatus === PaymentStatus.PAID) {
    throw new AppError(status.BAD_REQUEST, "Already paid");
  }

  const existingPayment = await prisma.payment.findUnique({
    where: { appointmentId },
  });

  if (existingPayment) {
    throw new AppError(status.BAD_REQUEST, "Payment already exists");
  }

  const result = await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.create({
      data: {
        appointmentId,
        amount,
        transactionId: uuidv7(),
      },
    });

    await tx.appointment.update({
      where: { id: appointmentId },
      data: {
        paymentStatus: PaymentStatus.UNPAID,
      },
    });

    return payment;
  });

  return result;
};

const getAllPayments = async () => {
  return prisma.payment.findMany({
    include: {
      appointment: true,
    },
  });
};

const getSinglePayment = async (id: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: { appointment: true },
  });

  if (!payment) {
    throw new AppError(status.NOT_FOUND, "Payment not found");
  }

  return payment;
};

const handleStripeWebhookEvent = async (event: any) => {

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const appointmentId = session.metadata.appointmentId;
    const paymentId = session.metadata.paymentId;

    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: PaymentStatus.PAID,
        paymentGatewayData: session,
      },
    });

    await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        paymentStatus: PaymentStatus.PAID,
      },
    });

    // 👉 ekhane invoice generate + email add korte parba later
  }

  return { message: "ok" };
};
export const PaymentService = {
  createPayment,
  getAllPayments,
  getSinglePayment,
    handleStripeWebhookEvent
  
};
