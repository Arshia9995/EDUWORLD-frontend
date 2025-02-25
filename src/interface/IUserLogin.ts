export interface IUserLoginData {
    email: string;
    password: string;
    profile?: {
      phone?: string;
      dob?: string;
      address?: string;
      gender?: string;
      }
  }