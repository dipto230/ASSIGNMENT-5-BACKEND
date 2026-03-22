import { z } from "zod";

const create = z.object({
  body: z.object({
    scheduleIds: z.array(z.string()).nonempty(),
  }),
});

const update = z.object({
  body: z.object({
    scheduleIds: z.array(
      z.object({
        id: z.string(),
        shouldDelete: z.boolean(),
      })
    ),
  }),
});

export const LawyerScheduleValidation = {
  create,
  update,
};
