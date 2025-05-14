export interface IChat {
    _id?: string;
    courseId: {
      _id: string;
      title: string; // Assuming the Course has a title field; adjust based on your Course schema
    };
    instructorId: {
      _id: string;
      name: string;
      email?: string; // Similar to senderId in IMessage
    };
    createdAt: string | Date;
    participants: Array<{
      _id: string;
      name: string;
      email?: string; // Assuming participants are Users with these fields
    }>;
    updatedAt?: string | Date;
  }