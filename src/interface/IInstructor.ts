export interface IInstructorData {
    _id?: string;
    name?: string;
    role?: string;
    email?: string;
    password?: string;
    isBlocked?: boolean;
    verified?: boolean;
    created_at?: string;
    updated_at?: string;
    isRequested?: boolean;
    isApproved?: boolean;
    isRejected?: boolean;
    qualification?: string;
    cv?: string
    profile?: {
      phone?: string;
      dob?: string;
      address?: string;
      gender?: string;
    };
    student_details?: {
      enrolledCourses?: string[];
    };
    instructor_details?: {
      createdCourses?: string[];
      profit?: { $numberDecimal: string };
      rating?: { $numberDecimal: string };
    };
  }