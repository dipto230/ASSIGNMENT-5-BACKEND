export interface IUpdateLawyerPayload {
    name?: string;
    profilePhoto?: string;
    contactNumber?: string;
    address?: string;
    experience?: number;

    consultationFee?: number;
    currentFirm?: string;
    designation?: string;
}