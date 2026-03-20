import z from "zod";
import { Gender } from "../../../generated/prisma/enums";

export const createLawyerZodSchema = z.object({
    password: z
        .string("Password is required")
        .min(6, "Password must be at least 6 characters")
        .max(20, "Password must be at most 20 characters"),

    lawyer: z.object({
        name: z
            .string("Name is required and must be string")
            .min(5, "Name must be at least 5 characters")
            .max(30, "Name must be at most 30 characters"),

        email: z.email("Invalid email address"),

        contactNumber: z
            .string("Contact number is required")
            .min(11, "Contact number must be at least 11 characters")
            .max(14, "Contact number must be at most 14 characters"),

        address: z
            .string("Address is required")
            .min(10, "Address must be at least 10 characters")
            .max(100, "Address must be at most 100 characters")
            .optional(),

        barRegistrationNumber: z
            .string("Bar registration number is required"),

        experience: z
            .int("Experience must be an integer")
            .nonnegative("Experience cannot be negative")
            .optional(),

        gender: z.enum(
            [Gender.MALE, Gender.FEMALE],
            "Gender must be either MALE or FEMALE"
        ),

        consultationFee: z
            .number("Consultation fee must be a number")
            .nonnegative("Consultation fee cannot be negative"),

        qualification: z
            .string("Qualification is required")
            .min(2, "Qualification must be at least 2 characters")
            .max(50, "Qualification must be at most 50 characters"),

        currentFirm: z
            .string("Current working place is required")
            .min(2, "Current working place must be at least 2 characters")
            .max(50, "Current working place must be at most 50 characters"),

        designation: z
            .string("Designation is required")
            .min(2, "Designation must be at least 2 characters")
            .max(50, "Designation must be at most 50 characters"),
    }),

    practiceAreas: z
        .array(z.uuid(), "PracticeAreas must be an array of UUID")
        .min(1, "At least one practice area is required"),
});