import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSelector } from "react-redux";
// import { log } from "console";

interface UserState {
  user: {
    _id: string;
    name: string;
    role: string;
  } | null;
}

interface RootState {
  user: UserState;
}

interface SocketContextType {
  socket: Socket | null;
  sendMessage: (
    chatId: string,
    content: string,
    media?: { url: string; type: "image" | "video" | "file" }
  ) => void;
  joinChat: (chatId: string) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  sendMessage: () => {},
  joinChat: () => {},
});

export const useSocketContext = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useSelector((state: RootState) => state.user);
  console.log("userrrrrrrrrrr from socketcontext", user);
  

  const userId = user?._id || "";
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io("https://api.eduworld.space", {
      auth: { userId },
    });

    newSocket.on("connect", () => {
      console.log("Connected to socket server");
      setSocket(newSocket);
    });

    newSocket.on("error", (error: { message: string }) => {
      console.error("Socket error:", error.message);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  const sendMessage = (
    chatId: string,
    content: string,
    media?: { url: string; type: "image" | "video" | "file" }
  ) => {
    if (socket) {
      socket.emit("newMessage", { chatId, content, media });
    }
  };

  const joinChat = (chatId: string) => {
    if (socket) {
      socket.emit("joinRoom", chatId);
      console.log(`Joined chat room: ${chatId}`);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, sendMessage, joinChat }}>
      {children}
    </SocketContext.Provider>
  );
};