import { z } from "zod";

export const createPaymentValidation = z.object({
  body: z.object({
    appointmentId: z
      .string()
      .min(1, "Appointment ID is required"),

    amount: z
      .number()
      .min(1, "Amount must be greater than 0"),
  }),
});
