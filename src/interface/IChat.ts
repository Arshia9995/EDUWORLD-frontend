export interface IChat {
    _id?: string;
    courseId: {
      _id: string;
      title: string; 
    };
    instructorId: {
      _id: string;
      name: string;
      email?: string; 
    };
    createdAt: string | Date;
    participants: Array<{
      _id: string;
      name: string;
      email?: string; 
    }>;
    updatedAt?: string | Date;
  }