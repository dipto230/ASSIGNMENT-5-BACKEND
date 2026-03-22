// consultationNote.validation.ts
import { z } from 'zod';

const createConsultationNoteZodSchema = z.object({
    appointmentId: z.string("Appointment ID is required"),
    notes: z.string("Notes is required").min(1, "Notes cannot be empty"),
    followUpDate: z.string("Follow-up date must be a valid date").optional(),
});

const updateConsultationNoteZodSchema = z.object({
    notes: z.string("Notes is required").min(1, "Notes cannot be empty").optional(),
    followUpDate: z.string("Follow-up date must be a valid date").optional(),
});

export const ConsultationNoteValidation = {
    createConsultationNoteZodSchema,
    updateConsultationNoteZodSchema
};
