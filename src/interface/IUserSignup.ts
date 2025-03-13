export interface IUserSignupData {
 
    name?: string | null;             
    email?: string | null;            
    password?: string | null; 
    _id?: string;
    isBlocked?: boolean;        
    role?: 'student' | 'instructor' | 'admin'; 
    otp?: string | null;  
    profile?: {
    phone?: string;
    dob?: string;
    address?: string;
    gender?: string;
    profileImage?: string;
    },
    cv?: string | null; // Add CV field
    qualification?: string;
    isApproved?: boolean;
    isRequested?: boolean;
    isRejected?: boolean;
    verified?: boolean;
    

  }