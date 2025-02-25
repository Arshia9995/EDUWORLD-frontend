export interface IUserSignupData {
    name?: string | null;             
    email?: string | null;            
    password?: string | null; 
    _id?: string;
    isBlocked?: boolean;        
    role?: 'student' | 'instructor'; 
    otp?: string | null;  
    profile?: {
    phone?: string;
    dob?: string;
    address?: string;
    gender?: string;
    },
    qualification?: string
    

  }