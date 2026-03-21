export interface IUpdateLawyerPracticeAreaPayload {
    practiceAreaId: string;
    shouldDelete?: boolean;
}

export interface IUpdateLawyerPayload {
    lawyer?: {
        name?: string;
        profilePhoto?: string;
        contactNumber?: string;
        address?: string;
        experience?: number;

        consultationFee?: number;
        qualification?: string;
        currentFirm?: string;
        designation?: string;
    };
    practiceAreas?: IUpdateLawyerPracticeAreaPayload[];
}