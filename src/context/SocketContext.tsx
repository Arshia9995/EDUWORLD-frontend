// import React, { createContext, useContext, useEffect, useState } from "react";
// import { io, Socket } from "socket.io-client";
// import { IMessage } from "../interface/IMessage";
// import { useSelector } from "react-redux";

// interface SocketContextType {
//   socket: Socket | null;
//   messages: IMessage[];
//   sendMessage: (chatId: string, content: string) => void;
//   joinChat: (chatId: string) => void;
// }

// const SocketContext = createContext<SocketContextType>({
//     socket: null,
//     messages: [],
//     sendMessage: (chatId: string, content: string) => {}, // No-op function
//     joinChat: (chatId: string) => {}, // No-op function
//   });
  
//   export const useSocketContext  = (): SocketContextType => {
//     return useContext(SocketContext);
//   }

// export const SocketProvider: React.FC<{ children: React.ReactNode}> = ({
//   children,
 
// }) => {
//   const { user } =  useSelector((state: any) => state.user)
//   const userId = user._id
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [messages, setMessages] = useState<IMessage[]>([]);

//   useEffect(() => {
//     const newSocket = io( "http://localhost:3000", {
//       auth: { userId },
//     });

//     newSocket.on("connect", () => {
//       console.log("Connected to socket server");
//       setSocket(newSocket);
//     });

//     newSocket.on("message", (message: IMessage) => {
//       setMessages((prev) => [...prev, message]);
//     });

//     newSocket.on("error", (error: { message: string }) => {
//       console.error("Socket error:", error.message);
//     });

//     return () => {
//       newSocket.disconnect();
//     };
//   }, [userId]);

//   const sendMessage = (chatId: string, content: string) => {
//     if (socket) {
//       socket.emit("sendMessage", { chatId, content });
//     }
//   };

//   const joinChat = (chatId: string) => {
//     if (socket) {
//       socket.emit("joinChat", chatId);
//     }
//   };

//   return (
//     <SocketContext.Provider value={{ socket, messages, sendMessage, joinChat }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

// export const useSocket = () => {
//   const context = useContext(SocketContext);
//   if (!context) {
//     throw new Error("useSocket must be used within a SocketProvider");
//   }
//   return context;
// };



import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client"
import { useSelector } from "react-redux";


interface SocketContextType {
  socket: any | null;
  messages: any[]; 
  onlineUsers: any[];
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  messages: [],
  onlineUsers: [],
});

export const useSocketContext  = (): SocketContextType => {
  return useContext(SocketContext);
}



export const SocketProvider = ({ children }: any) => {
  console.log("Recahed inside socket Provider")
  const { user} = useSelector((state: any) => state.user);
  const id = user.id
 
  
  const [socket, setSocket] = useState<any | null>(null);
  const [onlineUsers, setOnlineUsers] = useState([]);


  useEffect(() => {
    if(user){
      const newSocket = io("http://localhost:3000",{
        query:{
          userId: id
        }
      })
      setSocket(newSocket)

      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users)
      })
      console.log("🚀 ~ file: SocketContext.tsx:55 ~ useEffect ~ newSocket:", newSocket)

      return () => {
        newSocket.close();
      }
    } else {
      if(socket) {
        socket.close()
      }
      setSocket(null)
    }
  },[user])

  const contextValue: SocketContextType = {
    socket, onlineUsers,
    messages: []
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  )
}