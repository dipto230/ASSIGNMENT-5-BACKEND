import z from "zod";

const createScheduleZodSchema = z.object({
  startDate: z
    .string("Start date is required")
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid start date format",
    }),

  endDate: z
    .string("End date is required")
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid end date format",
    }),

  startTime: z
    .string("Start time is required")
    .refine((time) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time), {
      message: "Invalid start time format (HH:MM)",
    }),

  endTime: z
    .string("End time is required")
    .refine((time) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time), {
      message: "Invalid end time format (HH:MM)",
    }),
});

const updateScheduleZodSchema = z.object({
  startDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid start date format",
    })
    .optional(),

  endDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid end date format",
    })
    .optional(),

  startTime: z
    .string()
    .refine((time) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time), {
      message: "Invalid start time format (HH:MM)",
    })
    .optional(),

  endTime: z
    .string()
    .refine((time) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time), {
      message: "Invalid end time format (HH:MM)",
    })
    .optional(),
});

export const ScheduleValidation = {
  createScheduleZodSchema,
  updateScheduleZodSchema,
};