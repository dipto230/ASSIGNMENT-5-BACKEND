import { z } from "zod";

const createPracticeAreaZodSchema = z.object({
    title : z.string("Title is required"),
    description : z.string("Description is required").optional(),
})

export const PracticeAreaValidation = {
    createPracticeAreaZodSchema
}