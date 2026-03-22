import z from "zod";

const updateClientZodSchema = z.object({
  clientInfo: z
    .object({
      name: z.string().min(1).max(100).optional(),
      profilePhoto: z.url().optional(),
      contactNumber: z.string().min(1).max(20).optional(),
      address: z.string().min(1).max(200).optional(),
    })
    .optional(),

  clientProfile: z
    .object({
      occupation: z.string().optional(),
      companyName: z.string().optional(),
      address: z.string().optional(),
      dateOfBirth: z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), {
          message: "Invalid date format",
        })
        .optional(),
      nationalId: z.string().optional(),
      emergencyContact: z.string().optional(),
      legalHistory: z.string().optional(),
      preferredLanguage: z.string().optional(),
    })
    .optional(),
});

export const ClientValidation = {
  updateClientZodSchema,
};