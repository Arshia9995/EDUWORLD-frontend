export interface IStudentData {
    _id?: string;
    name?: string;
    role?: string;
    email?: string;
    password?: string;
    isBlocked?: boolean;
    verified?: boolean;
    created_at?: string;
    updated_at?: string;
    student_details?: {
        enrolledCourses?: any[]; 
    };
    instructor_details?: {
        createdCourses?: any[]; 
        profit?: {
            $numberDecimal?: string;
        };
        rating?: {
            $numberDecimal?: string;
        };
    };
}
