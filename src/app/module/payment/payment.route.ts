import express from "express";
import { PaymentController } from "./payment.controller";

import { createPaymentValidation } from "./payment.validation";
import { validateRequest } from "../../middleware/validateRequest";

const router = express.Router();

router.post(
  "/",
  validateRequest(createPaymentValidation),
  PaymentController.createPayment
);

router.get("/", PaymentController.getAllPayments);

router.get("/:id", PaymentController.getSinglePayment);

export const PaymentRoutes = router;
