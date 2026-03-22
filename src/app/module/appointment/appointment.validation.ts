import { z } from "zod";

export const bookAppointmentSchema = z.object({
  body: z.object({
    lawyerId: z.string(),
    scheduleId: z.string(),
  }),
});

export const updateAppointmentSchema = z.object({
  body: z.object({
    status: z.string().optional(),
  }),
});
