// import { string } from "yup";

export interface IAdminLoginData {
    email: string;
    password: string;
    id?:string;
    role?:string;
    token?: string;
    refreshToken?: string;
  }