export interface IUserLoginData {
  _id?: string;
  name?: string;
    email: string;
    password: string;
    role?: 'student' | 'instructor' | 'admin';
    profile?: {
      phone?: string;
      dob?: string;
      address?: string;
      gender?: string;
      profileImage?: string;
      };
      qualification?: string;
      cv?: string;
      isApproved?: boolean;
      isRequested?: boolean;
      isRejected?: boolean;
      isBlocked?: boolean;
      verified?: boolean;
  }