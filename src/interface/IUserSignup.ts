export interface IUserSignupData {
    name?: string | null;             
    email?: string | null;            
    password?: string | null;         
    role?: 'student' | 'instructor'; 
    otp?: string | null;  
    

  }