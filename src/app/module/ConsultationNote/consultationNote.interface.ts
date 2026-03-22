
export interface ICreateConsultationNotePayload {
    appointmentId: string;
    followUpDate?: Date;
    notes: string;
}

export interface IUpdateConsultationNotePayload {
    followUpDate?: Date;
    notes?: string;
}
