import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { PaymentService } from "./payment.service";
import { envVars } from "../../../config/env";
import { stripe } from "../../../config/stripe.config";

const createPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.createPayment(req.body);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Payment created successfully",
    data: result,
  });
});

const getAllPayments = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.getAllPayments();

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Payments retrieved successfully",
    data: result,
  });
});

const getSinglePayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.getSinglePayment(req.params.id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Payment retrieved successfully",
    data: result,
  });
});


const handleStripeWebhookEvent = catchAsync(async (req, res) => {
  const sig = req.headers["stripe-signature"] as string;

  const event = stripe.webhooks.constructEvent(
    req.body,
    sig,
    envVars.STRIPE.STRIPE_WEBHOOK_SECRET
  );

  const result = await PaymentService.handleStripeWebhookEvent(event);

  sendResponse(res, {
    success: true,
    httpStatusCode: 200,
    message: "Webhook handled",
    data: result,
  });
});
export const PaymentController = {
  createPayment,
  getAllPayments,
  getSinglePayment,
  handleStripeWebhookEvent
};