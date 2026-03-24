export interface IChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
}
export interface ILoginUserPayload {
    email: string;
    password: string;
}
export interface IRegisterClientPayload {
    name: string;
    email: string;
    password: string;
}       