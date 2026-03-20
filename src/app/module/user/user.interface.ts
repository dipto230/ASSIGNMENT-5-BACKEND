import { Gender } from "../../../generated/prisma/client";

export interface ICreateLawyerPayload {
    password: string;
    lawyer: {
        name: string;
        email: string;
        profilePhoto?: string;
        contactNumber?: string;
        address?: string;

        barRegistrationNumber: string;
        experience?: number;
        gender: Gender;

        consultationFee: number;
        qualification: string;
        currentFirm: string; // ✅ schema match
        designation: string;
    };
    practiceAreas: string[];
}