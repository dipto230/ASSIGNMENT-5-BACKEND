import { PaymentMethod } from "../../../generated/prisma/enums";

export interface ICreatePaymentPayload {
  appointmentId: string;
  amount: number;
  paymentMethod?: PaymentMethod;
}
