

export interface IUpdateClientInfoPayload {
  name?: string;
  profilePhoto?: string;
  contactNumber?: string;
  address?: string;
}

export interface IUpdateClientProfilePayload {
  occupation?: string;
  companyName?: string;
  address?: string;
  dateOfBirth?: Date;
  nationalId?: string;
  emergencyContact?: string;
  legalHistory?: string;
  preferredLanguage?: string;
}

export interface IUpdateClientPayload {
  clientInfo?: IUpdateClientInfoPayload;
  clientProfile?: IUpdateClientProfilePayload;
}