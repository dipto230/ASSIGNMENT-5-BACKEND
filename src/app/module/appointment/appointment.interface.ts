export interface IBookAppointmentPayload {
  lawyerId: string;
  scheduleId: string;
}

export interface IUpdateAppointmentPayload {
  lawyerId?: string;
  scheduleId?: string;
  status?: string;
}
