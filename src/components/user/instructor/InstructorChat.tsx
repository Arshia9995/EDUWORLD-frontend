import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiSend,
  FiMessageSquare,
  FiUsers,
  FiSearch,
  FiInfo,
  FiCalendar,
  FiPaperclip,
} from "react-icons/fi";
import InstructorSidebar from "../../../common/InstructorSidebar";
import { api } from "../../../config/api";
import toast from "react-hot-toast";
import { useSocketContext } from "../../../context/SocketContext";

interface Message {
  _id: string;
  chatId: string;
  senderId: {
    _id: string;
    name: string;
    profile?: {
      profileImage?: string;
    };
  };
  content?: string;
  media?: {
    url: string;
    type: "image" | "video" | "file";
    displayUrl?: string;
  };
  sentAt: string;
  isRead: boolean;
}

interface Chat {
  _id: string;
  courseId: {
    _id: string;
    title: string;
  };
  instructorId: string;
  participants: Array<{
    _id: string;
    name: string;
  }>;
  createdAt: string;
  lastMessage?: {
    content?: string;
    media?: {
      url: string;
      type: "image" | "video" | "file";
      displayUrl?: string;
    };
    sentAt: string;
    senderId?: {
      _id: string;
      name: string;
    };
  };
  unreadCount?: number;
}

const InstructorChat: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [loadingChats, setLoadingChats] = useState<boolean>(true);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showParticipants, setShowParticipants] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { socket, joinChat } = useSocketContext();
  const [processedMessageIds, setProcessedMessageIds] = useState<Set<string>>(new Set());



  const fetchChats = async () => {
    try {
      setLoadingChats(true);
      const response = await api.get("/users/instructor/chats", {
        withCredentials: true,
      });

      if (response.data.success) {
        console.log("Fetched chats:", response.data.data);
        setChats(response.data.data);
      } else {
        throw new Error(response.data.message || "Failed to fetch chats");
      }
    } catch (err: any) {
      console.error("Error fetching chats:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      const errorMessage = err.response?.data?.message || "Failed to fetch chats";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoadingChats(false);
    }
  };

  const fetchMessages = async (chatId: string) => {
    try {
      setLoadingMessages(true);
      const response = await api.get(`/users/messages/${chatId}`, {
        withCredentials: true,
      });

      if (response.data.success) {
        console.log("Fetched messages with media URLs:", response.data.data);
        const fetchedMessages = response.data.data;

        const messageIds = new Set<string>(processedMessageIds);
        fetchedMessages.forEach((msg: Message) => messageIds.add(msg._id));
        setProcessedMessageIds(messageIds);

        setMessages(fetchedMessages);
      } else {
        throw new Error(response.data.message || "Failed to fetch messages");
      }
    } catch (err: any) {
      console.error("Error fetching messages:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      const errorMessage = err.response?.data?.message || "Failed to fetch messages";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoadingMessages(false);
    }
  };

  const uploadToS3 = async (file: File) => {
    try {
      const { data } = await api.post(
        `/users/get-s3-url`,
        {
          fileName: file.name,
          fileType: file.type,
          folder: "chat-media",
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log("Received S3 URL response:", data);

      if (!data.url) {
        console.error("No S3 URL received:", data);
        throw new Error("Failed to get S3 URL");
      }

      await api({
        method: "put",
        url: data.url,
        data: file,
        headers: { "Content-Type": file.type },
      });
      console.log("File successfully uploaded to S3:", data.imageUrl);

      return { permanentUrl: data.imageUrl, downloadUrl: data.downloadUrl };
    } catch (error: any) {
      console.error("S3 upload error:", error.response?.data || error.message);
      throw new Error("Failed to upload file to S3");
    }
  };

  const sendMessage = async () => {
    if (!selectedChat || (!newMessage.trim() && !selectedFile)) return;

    const tempMessageId = `temp-${Date.now()}`;

    try {
      let media: { url: string; type: "image" | "video" | "file"; displayUrl?: string } | undefined;
      let downloadUrl: string | undefined;

      if (selectedFile) {
        setUploading(true);
        const { permanentUrl, downloadUrl: fetchedDownloadUrl } = await uploadToS3(selectedFile);
        downloadUrl = fetchedDownloadUrl;
        const fileType = selectedFile.type;
        let mediaType: "image" | "video" | "file";
        if (fileType.startsWith("image/")) {
          mediaType = "image";
        } else if (fileType.startsWith("video/")) {
          mediaType = "video";
        } else {
          mediaType = "file";
        }
        media = { url: permanentUrl, type: mediaType, displayUrl: downloadUrl };
      }

      const response = await api.post(
        `/users/${selectedChat._id}/createmessages`,
        {
          content: newMessage.trim() || undefined,
          media,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        let updatedMessage = response.data.messages;
        updatedMessage.isTemporary = false;
        updatedMessage.media = media ? { ...media, displayUrl: downloadUrl } : undefined;

        setProcessedMessageIds((prev) => {
          const newSet = new Set(prev).add(updatedMessage._id);
          setMessages((prevMessages) => {
            const withoutTemp = prevMessages.filter((msg) => msg._id !== tempMessageId);
            return [...withoutTemp, updatedMessage];
          });
          return newSet;
        });

        console.log("from instructor updateddddd", updatedMessage);

        if (socket) {
          socket.emit("newMessage", updatedMessage);
        }

        setNewMessage("");
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";

        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === selectedChat._id
              ? {
                  ...chat,
                  lastMessage: {
                    content: updatedMessage.content,
                    media: updatedMessage.media,
                    sentAt: updatedMessage.sentAt,
                    senderId: updatedMessage.senderId,
                  },
                }
              : chat
          )
        );
      } else {
        throw new Error(response.data.message || "Failed to send message");
      }
    } catch (err: any) {
      console.error("Error sending message:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      const errorMessage = err.response?.data?.message || "Failed to send message";
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (!socket || !selectedChat) return;

    const handleNewMessage = (message: any) => {
      if (!message || !message.chatId || !message._id || !message.senderId) {
        console.error("Invalid message structure:", message);
        return;
      }

      if (message.chatId === selectedChat._id) {
        if (processedMessageIds.has(message._id)) {
          console.log(`Message ${message._id} already processed, skipping.`);
          return;
        }

        const normalizedMessage: Message = {
          _id: message._id,
          chatId: message.chatId,
          senderId: typeof message.senderId === "string" ? { _id: message.senderId, name: "Unknown" } : message.senderId,
          content: message.content,
          media: message.media
            ? {
                url: message.media.url,
                type: message.media.type,
                displayUrl: message.media.displayUrl,
              }
            : undefined,
          sentAt: message.sentAt,
          isRead: message.isRead || false,
        };

        setProcessedMessageIds((prev) => new Set(prev).add(message._id));
        setMessages((prev) => [...prev, normalizedMessage]);

        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === selectedChat._id
              ? {
                  ...chat,
                  lastMessage: {
                    content: message.content,
                    media: message.media,
                    sentAt: message.sentAt,
                    senderId: normalizedMessage.senderId,
                  },
                }
              : chat
          )
        );
      }
    };

    socket.on("message", handleNewMessage);

    socket.on("error", (error: { message: string }) => {
      console.error("Socket error:", error.message);
      toast.error(error.message);
    });

    return () => {
      socket.off("message", handleNewMessage);
      socket.off("error");
    };
  }, [socket, selectedChat, processedMessageIds]);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat._id);
      joinChat(selectedChat._id);
      setShowParticipants(false);
      setProcessedMessageIds(new Set());

      setTimeout(() => {
        messageInputRef.current?.focus();
      }, 100);
    }
  }, [selectedChat, joinChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleBackToDashboard = () => {
    navigate("/instructordashboard");
  };

  const handleChatSelect = async (chat: Chat) => {
    setSelectedChat(chat);
    setMessages([]);
    setProcessedMessageIds(new Set());

    try {
      const response = await api.put(
        `/users/messages/${chat._id}/read`,
        {},
        { withCredentials: true }
      );

      console.log("chatiddddddd", chat._id);

      if (response.data.success) {
        setChats((prevChats) =>
          prevChats.map((c) =>
            c._id === chat._id ? { ...c, unreadCount: 0 } : c
          )
        );
      } else {
        throw new Error(response.data.message || "Failed to mark messages as read");
      }
    } catch (err: any) {
      console.error("Error marking messages as read:", err);
      toast.error(err.response?.data?.message || "Failed to mark messages as read");
    }
  };

  const toggleParticipants = () => {
    setShowParticipants(!showParticipants);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const groupMessagesByDate = () => {
    const groups: { [key: string]: Message[] } = {};
    messages.forEach((message) => {
      const date = formatDate(message.sentAt);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  const filteredChats = chats.filter((chat) =>
    chat.courseId?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getLastMessageContent = (lastMessage?: Chat["lastMessage"]) => {
    if (!lastMessage) return "No messages yet";
    let messageText = "";
    if (lastMessage.senderId?.name) {
      messageText += `${lastMessage.senderId.name}: `;
    }
    if (lastMessage.content) {
      messageText += lastMessage.content;
    } else if (lastMessage.media) {
      messageText +=
        lastMessage.media.type === "image"
          ? "Image"
          : lastMessage.media.type === "video"
          ? "Video"
          : "File";
    } else {
      messageText += "No content";
    }
    return messageText.length > 30
      ? `${messageText.substring(0, 27)}...`
      : messageText;
  };

  const renderMessageContent = (message: Message) => {
    if (message.content) {
      return <p className="text-sm">{message.content}</p>;
    }

    if (message.media?.url) {
      const mediaUrl = message.media.displayUrl || message.media.url;

      if (message.media.type === "image") {
        return (
          <div>
            <img
              src={mediaUrl}
              alt="Chat image"
              className="max-w-full h-auto rounded-lg shadow-sm"
              onError={(e) => {
                console.error("Failed to load image:", mediaUrl);
                e.currentTarget.style.display = "none";
                e.currentTarget.parentElement!.innerHTML +=
                  '<p className="text-sm text-red-600">Failed to load image</p>';
              }}
            />
          </div>
        );
      } else if (message.media.type === "video") {
        return (
          <div>
            <video
              src={mediaUrl}
              controls
              className="max-w-full h-auto rounded-lg shadow-sm"
              onError={(e) => {
                console.error("Failed to load video:", mediaUrl);
                e.currentTarget.style.display = "none";
                e.currentTarget.parentElement!.innerHTML +=
                  '<p className="text-sm text-red-600">Failed to load video</p>';
              }}
            />
          </div>
        );
      } else {
        return (
          <a
            href={mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-black-600 underline"
          >
            {message.media.type === "file" ? "Download File" : "View File"}
          </a>
        );
      }
    }
    return <p className="text-sm text-gray-400">[No content]</p>;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size exceeds 10MB limit");
        return;
      }
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "video/mp4",
        "video/webm",
        "application/pdf",
        "text/plain",
      ];
      if (!validTypes.includes(file.type)) {
        toast.error("Unsupported file type. Use images, videos, PDFs, or text files.");
        return;
      }
      setSelectedFile(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const messageGroups = groupMessagesByDate();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <InstructorSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div
        className="flex-1 min-w-0 transition-all duration-300 ease-in-out relative"
        style={{
          marginLeft: sidebarOpen ? "16rem" : "5rem",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBackToDashboard}
                  className="p-2 bg-white rounded-full shadow-sm text-blue-900 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <FiArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="text-3xl font-bold text-blue-900">Course Chats</h1>
              </div>
              <button
                onClick={handleBackToDashboard}
                className="px-5 py-2.5 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors shadow-md flex items-center space-x-2 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span>Back to Dashboard</span>
              </button>
            </div>
            <p className="text-gray-600 mt-2 ml-11">
              Communicate with students in your course chats
            </p>
          </div>

          {loadingChats ? (
            <div className="flex flex-col items-center justify-center min-h-[600px] bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-900 mb-4"></div>
              <p className="text-gray-600 text-lg">Loading chats...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <svg
                  className="h-6 w-6 text-red-500 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-red-800 font-semibold">{error}</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex h-[700px]">
              <div className="w-1/3 border-r border-gray-200 flex flex-col">
                <div className="bg-blue-50 p-4 border-b border-gray-200">
                  <h2 className="text-lg font-bold text-blue-900 mb-2">Your Courses</h2>
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search courses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>

                <div className="overflow-y-auto flex-1">
                  {filteredChats.length > 0 ? (
                    filteredChats.map((chat) => (
                      <div
                        key={chat._id}
                        onClick={() => handleChatSelect(chat)}
                        className={`p-4 flex items-center space-x-3 cursor-pointer transition-colors hover:bg-blue-50 border-l-4 ${
                          selectedChat?._id === chat._id
                            ? "border-blue-600 bg-blue-50"
                            : "border-transparent"
                        }`}
                      >
                        <div className="relative flex-shrink-0">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold">
                            {chat.courseId?.title?.substring(0, 2).toUpperCase() || "UC"}
                          </div>
                          {chat.unreadCount && chat.unreadCount > 0 ? (
                            <div className="absolute -top-1 -right-1 bg-red-500 rounded-full h-6 w-6 flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                              {chat.unreadCount}
                            </div>
                          ) : (
                            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full h-3 w-3 border-2 border-white"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <p className="text-gray-800 font-semibold truncate">
                              {chat.courseId?.title || "Untitled Course"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(chat.createdAt).split(",")[0]}
                            </p>
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <p className="text-gray-500 text-sm truncate">
                              {getLastMessageContent(chat.lastMessage)}
                            </p>
                            {chat.unreadCount && chat.unreadCount > 0 ? (
                              <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-16 px-4">
                      <FiUsers className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-xl font-medium mb-2">No course chats found</p>
                      <p className="text-gray-400 max-w-xs mx-auto">
                        {searchTerm ? "No courses match your search" : "Create a course to start a chat"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-2/3 flex flex-col">
                {selectedChat ? (
                  <>
                    <div className="bg-blue-50 p-4 border-b border-gray-200 flex items-center justify-between relative">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold">
                          {selectedChat.courseId?.title?.substring(0, 2).toUpperCase() || "UC"}
                        </div>
                        <div>
                          <p
                            onClick={toggleParticipants}
                            className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 flex items-center space-x-1"
                          >
                            <FiUsers className="h-3 w-3" />
                            <span>{selectedChat.participants.length} participants</span>
                          </p>
                          <h2 className="text-lg font-bold text-blue-900">
                            {selectedChat.courseId?.title || "Untitled Course"}
                          </h2>
                          {showParticipants && (
                            <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg p-3 w-64 z-10 border border-gray-200">
                              <h3 className="text-sm font-semibold text-gray-700 mb-2">Participants</h3>
                              <ul className="text-sm text-gray-600">
                                {selectedChat.participants.map((participant) => (
                                  <li
                                    key={participant._id}
                                    className="flex items-center space-x-2 py-1"
                                  >
                                    <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium">
                                      {getInitials(participant.name)}
                                    </div>
                                    <span>{participant.name}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                      <button className="p-2 rounded-full hover:bg-blue-100 text-blue-800">
                        <FiInfo className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                      {loadingMessages ? (
                        <div className="flex justify-center items-center h-full">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-900"></div>
                        </div>
                      ) : messages.length > 0 ? (
                        Object.keys(messageGroups).map((date) => (
                          <div key={date} className="mb-6">
                            <div className="flex justify-center mb-4">
                              <div className="bg-gray-200 rounded-full px-3 py-1 text-xs text-gray-600 flex items-center">
                                <FiCalendar className="mr-1 h-3 w-3" />
                                {date}
                              </div>
                            </div>
                            {messageGroups[date].map((message, index) => {
                              const isInstructor = message.senderId._id === selectedChat.instructorId;
                              const showAvatar =
                                index === 0 ||
                                messageGroups[date][index - 1]?.senderId._id !== message.senderId._id;

                              return (
                                <div
                                  key={message._id}
                                  className={`flex ${isInstructor ? "justify-end" : "justify-start"} ${
                                    !showAvatar && isInstructor ? "pr-12" : ""
                                  } ${!showAvatar && !isInstructor ? "pl-12" : ""} mb-2`}
                                >
                                  {!isInstructor && showAvatar && (
                                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold mr-2 flex-shrink-0">
                                      {getInitials(message.senderId.name)}
                                    </div>
                                  )}
                                  <div
                                    className={`max-w-sm p-3 rounded-2xl ${
                                      isInstructor
                                        ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-br-none"
                                        : "bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-100"
                                    }`}
                                  >
                                    {showAvatar && (
                                      <p
                                        className={`text-xs font-medium mb-1 ${
                                          isInstructor ? "text-blue-100" : "text-blue-600"
                                        }`}
                                      >
                                        {message.senderId.name}
                                      </p>
                                    )}
                                    {renderMessageContent(message)}
                                    <p
                                      className={`text-xs ${
                                        isInstructor ? "text-blue-100" : "text-gray-400"
                                      } text-right mt-1`}
                                    >
                                      {formatTime(message.sentAt)}
                                    </p>
                                  </div>
                                  {isInstructor && showAvatar && (
                                    <div className="h-10 w-10 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold ml-2 flex-shrink-0">
                                      {getInitials(message.senderId.name)}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-gray-500 py-16">
                          <div className="bg-gray-100 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiMessageSquare className="h-12 w-12 text-gray-300" />
                          </div>
                          <p className="text-xl font-medium mb-2">No messages yet</p>
                          <p className="text-gray-400 max-w-xs mx-auto">
                            Be the first to start the conversation with your students!
                          </p>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 border-t border-gray-200 bg-white">
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={triggerFileInput}
                          disabled={uploading}
                          className="p-3 text-gray-600 hover:text-blue-900 disabled:text-gray-400 transition-colors"
                          title="Attach file"
                        >
                          <FiPaperclip className="h-5 w-5" />
                        </button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileSelect}
                          accept="image/jpeg,image/png,image/gif,video/mp4,video/webm,application/pdf,text/plain"
                          className="hidden"
                        />
                        <input
                          ref={messageInputRef}
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                          placeholder="Type your message..."
                          className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-900 bg-gray-50"
                          disabled={uploading}
                        />
                        <button
                          onClick={sendMessage}
                          disabled={uploading || (!newMessage.trim() && !selectedFile)}
                          className="p-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-full hover:opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          <FiSend className="h-5 w-5" />
                        </button>
                      </div>
                      {selectedFile && (
                        <div className="mt-2 text-sm text-gray-600">
                          Selected: {selectedFile.name}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFile(null);
                              if (fileInputRef.current) fileInputRef.current.value = "";
                            }}
                            className="ml-2 text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                      {uploading && (
                        <div className="mt-2 text-sm text-blue-600 flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-900 mr-2"></div>
                          Uploading...
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500 bg-gray-50">
                    <div className="text-center px-8">
                      <div className="bg-white h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                        <FiMessageSquare className="h-12 w-12 text-blue-300" />
                      </div>
                      <h3 className="text-2xl font-medium text-blue-900 mb-3">Select a course chat</h3>
                      <p className="text-gray-500 max-w-md">
                        Choose a course from the left sidebar to view and send messages to your students
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorChat;