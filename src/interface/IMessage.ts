export interface IMessage {
    _id?: string;
    chatId: string;
    senderId: {
      _id: string;
      name: string;
      email?: string;
    };
    content?: string;
    media?: {
      url: string;
      type: "image" | "video" | "file";
    };
    sentAt: string | Date;
    isRead: boolean;
    createdAt?: string | Date;
    updatedAt?: string | Date;
  }