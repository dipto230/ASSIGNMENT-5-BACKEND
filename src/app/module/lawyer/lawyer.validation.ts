import z from "zod";

export const updateLawyerZodSchema = z.object({
    lawyer: z.object({
        name: z.string().min(5).max(30).optional(),
        profilePhoto: z.url().optional(),
        contactNumber: z.string().min(11).max(14).optional(),
        address: z.string().min(10).max(100).optional(),
        experience: z.int().nonnegative().optional(),
        consultationFee: z.number().nonnegative().optional(),
        qualification: z.string().min(2).max(50).optional(),
        currentFirm: z.string().min(2).max(50).optional(),
        designation: z.string().min(2).max(50).optional(),
    }).optional(),

    practiceAreas: z.array(z.object({
        practiceAreaId: z.uuid(),
        shouldDelete: z.boolean().optional(),
    })).optional()
});