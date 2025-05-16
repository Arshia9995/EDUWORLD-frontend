import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiX, FiMessageCircle, FiUsers, FiPaperclip } from 'react-icons/fi';
import { api } from '../../../config/api';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useSocketContext } from '../../../context/SocketContext';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  instructorId?: string;
  userId: string;
  userName: string;
  courseTitle: string;
  setUnreadCount?: (countOrUpdater: number | ((prev: number) => number)) => void;
}

interface Message {
  _id: string;
  chatId?: string;
  senderId: {
    _id: string;
    name: string;
    role: string;
  };
  content?: string;
  media?: {
    url: string;
    type: 'image' | 'video' | 'file';
    displayUrl?: string;
  };
  sentAt: Date | string;
  isRead: boolean;
  readBy: Array<{ userId: string; readAt: Date }>;
  isTemporary?: boolean;
  mediaStatus?: 'uploading' | 'error';
}

const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  courseId,
  instructorId,
  userName,
  courseTitle,
  setUnreadCount,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [participants, setParticipants] = useState<Array<{ _id: string; name: string; role: string }>>([]);
  const [showParticipants, setShowParticipants] = useState(false);
  const { user } = useSelector((state: any) => state.user);
  const userId = user?._id ?? '';
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { socket, joinChat } = useSocketContext();
  const [processedMessageIds, setProcessedMessageIds] = useState<Set<string>>(new Set());

  const isDev = process.env.NODE_ENV === 'development';

  if (!user) {
    return <div className="text-red-600 p-4">Error: User not found. Please log in.</div>;
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && courseId) {
      fetchChatData();
    }
  }, [isOpen, courseId]);

  useEffect(() => {
    if (chatId && socket) {
      joinChat(chatId);
    }
  }, [chatId, socket, joinChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket || !chatId) return;

    const handleNewMessage = (message: any) => {
      if (!message || !message.chatId || !message._id || !message.senderId) {
        console.error('Invalid message structure:', message);
        toast.error('Received invalid message');
        return;
      }
    
      if (message.chatId !== chatId) {
        isDev && console.log(`Message for different chat ${message.chatId}, ignoring.`);
        return;
      }
    
      // Skip if the message is from the current user and already processed
      if (message.senderId._id === userId && processedMessageIds.has(message._id)) {
        isDev && console.log(`Skipping own message ${message._id} as it was already processed.`);
        return;
      }
    
      if (processedMessageIds.has(message._id)) {
        isDev && console.log(`Message ${message._id} already processed, skipping.`);
        return;
      }
    
      let media: Message['media'] = undefined;
      if (message.media) {
        const validMediaTypes = ['image', 'video', 'file'];
        if (
          !message.media.url ||
          !message.media.type ||
          !validMediaTypes.includes(message.media.type)
        ) {
          console.error('Invalid media structure:', message.media);
          toast.error('Received message with invalid media');
          return;
        }
        media = {
          url: message.media.url,
          type: message.media.type as 'image' | 'video' | 'file',
          displayUrl: message.media.displayUrl,
        };
      }
    
      const normalizedMessage: Message = {
        _id: message._id,
        chatId: message.chatId,
        senderId:
          typeof message.senderId === 'string'
            ? { _id: message.senderId, name: 'Unknown', role: 'unknown' }
            : {
                _id: message.senderId._id,
                name: message.senderId.name || 'Unknown',
                role: message.senderId.role || 'unknown',
              },
        content: message.content,
        media,
        sentAt: message.sentAt,
        isRead: message.isRead || false,
        readBy: message.readBy || [],
      };
    
      setProcessedMessageIds((prev) => new Set(prev).add(message._id));
      setMessages((prev) => [...prev, normalizedMessage]);
    };

    socket.on('message', handleNewMessage);

    socket.on('error', (error: { message: string }) => {
      console.error('Socket error:', error.message);
      toast.error(error.message);
    });

    return () => {
      socket.off('message', handleNewMessage);
      socket.off('error');
    };
  }, [socket, chatId, processedMessageIds]);

  useEffect(() => {
    if (isOpen && chatId) {
      const markAsRead = async () => {
        try {
          const response = await api.put(`/users/messages/${chatId}/read`, {}, { withCredentials: true });
          if (response.data.success) {
            if (setUnreadCount) setUnreadCount(0);
            setMessages((prevMessages) =>
              prevMessages.map((msg) => ({
                ...msg,
                readBy: [...msg.readBy, { userId, readAt: new Date() }],
              }))
            );
          }
        } catch (err: any) {
          console.error('Error marking messages as read:', err);
          toast.error(err.response?.data?.message || 'Failed to mark messages as read');
        }
      };
      markAsRead();
    }
  }, [isOpen, chatId, userId, setUnreadCount]);

  const fetchChatData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/users/getchat/${courseId}`, { withCredentials: true });

      if (response.data.success) {
        setChatId(response.data.chat._id);
        setParticipants(response.data.chat.participants || []);
        if (setUnreadCount && response.data.unreadCount !== undefined) {
          setUnreadCount(response.data.unreadCount);
        }

        if (response.data.chat._id) {
          const messagesResponse = await api.get(`/users/${response.data.chat._id}/getmessages`, { withCredentials: true });
          if (messagesResponse.data.success) {
            const fetchedMessages = messagesResponse.data.messages;

            const messageIds = new Set<string>(processedMessageIds);
            fetchedMessages.forEach((msg: Message) => messageIds.add(msg._id));
            setProcessedMessageIds(messageIds);

            setMessages(fetchedMessages);
          }
        }
      } else {
        await createNewChat();
      }
      setError(null);
    } catch (err: any) {
      console.error('Error fetching chat data:', err);
      setError(err.response?.data?.message || 'Failed to load chat data');
      if (err.response?.status === 404) {
        await createNewChat();
      }
    } finally {
      setLoading(false);
    }
  };

  const createNewChat = async () => {
    try {
      const response = await api.post('/users/createchat', {
        courseId,
        participants: [userId, instructorId],
      }, { withCredentials: true });

      if (response.data.success) {
        setChatId(response.data.chat._id);
        setMessages([]);
        setParticipants(response.data.chat.participants || []);
        if (setUnreadCount) setUnreadCount(0);
      }
    } catch (err: any) {
      console.error('Error creating new chat:', err);
      setError(err.response?.data?.message || 'Failed to create chat');
    }
  };

  const uploadToS3 = async (file: File) => {
    try {
      const { data } = await api.post(
        `/users/get-s3-url`,
        {
          fileName: file.name,
          fileType: file.type,
          folder: 'chat-media',
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      isDev && console.log('Received S3 URL response:', data);

      if (!data.url) {
        console.error('No S3 URL received:', data);
        throw new Error('Failed to get S3 URL from server');
      }

      await api({
        method: 'put',
        url: data.url,
        data: file,
        headers: { 'Content-Type': file.type },
      });
      isDev && console.log('File successfully uploaded to S3:', data.imageUrl);

      return { permanentUrl: data.imageUrl, downloadUrl: data.downloadUrl };
    } catch (error: any) {
      console.error('S3 upload error:', error.response?.data || error.message);
      let errorMessage = 'Failed to upload file to S3';
      if (error.response?.status === 403) {
        errorMessage = 'Permission denied while uploading file';
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid file or request';
      } else if (!navigator.onLine) {
        errorMessage = 'No internet connection';
      }
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const refreshMediaUrl = async (messageId: string, mediaUrl: string) => {
    try {
      const response = await api.post(
        `/users/refresh-s3-url`,
        { mediaUrl },
        { withCredentials: true }
      );
      if (response.data.success) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === messageId
              ? {
                  ...msg,
                  media: { ...msg.media, displayUrl: response.data.downloadUrl } as Message['media'],
                }
              : msg
          )
        );
      }
    } catch (err) {
      console.error('Failed to refresh media URL:', err);
      toast.error('Failed to load media');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatId || (!newMessage.trim() && !selectedFile)) return;

    const tempMessageId = `temp-${Date.now()}`;

    try {
      const tempMessage: Message = {
        _id: tempMessageId,
        chatId,
        senderId: {
          _id: userId,
          name: userName,
          role: 'student',
        },
        content: newMessage.trim() || undefined,
        sentAt: new Date(),
        isRead: false,
        readBy: [],
        isTemporary: true,
      };

      if (selectedFile) {
        tempMessage.mediaStatus = 'uploading';
        tempMessage.media = {
          url: '',
          type: selectedFile.type.startsWith('image/')
            ? 'image'
            : selectedFile.type.startsWith('video/')
              ? 'video'
              : 'file',
        };
      }

      setMessages((prevMessages) => [...prevMessages, tempMessage]);
      setNewMessage('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      const fileToUpload = selectedFile;
      setSelectedFile(null);

      let media: { url: string; type: 'image' | 'video' | 'file'; displayUrl?: string } | undefined;
      let downloadUrl: string | undefined;

      if (fileToUpload) {
        setUploading(true);
        try {
          const { permanentUrl, downloadUrl: fetchedDownloadUrl } = await uploadToS3(fileToUpload);
          downloadUrl = fetchedDownloadUrl;
          const fileType = fileToUpload.type;
          let mediaType: 'image' | 'video' | 'file';
          if (fileType.startsWith('image/')) {
            mediaType = 'image';
          } else if (fileType.startsWith('video/')) {
            mediaType = 'video';
          } else {
            mediaType = 'file';
          }
          media = { url: permanentUrl, type: mediaType, displayUrl: downloadUrl };
        } catch (err) {
          console.error('Error uploading file:', err);
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg._id === tempMessageId
                ? { ...msg, mediaStatus: 'error' }
                : msg
            )
          );
          throw err;
        } finally {
          setUploading(false);
        }
      }

      const response = await api.post(
        `/users/${chatId}/createmessages`,
        {
          content: tempMessage.content,
          media,
          senderId: userId,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        let updatedMessage = response.data.messages;
        updatedMessage.chatId = chatId;
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

        console.log("from student updateddddd",updatedMessage);

        if (socket) {
          socket.emit('newMessage', updatedMessage);
        } else {
          console.error('Socket not connected');
          toast.error('Real-time messaging unavailable: Socket not connected');
        }

        if (setUnreadCount) {
          const incrementUnreadCount = async () => {
            try {
              const countResponse = await api.get(`/users/messages/${chatId}/unreadcount`, { withCredentials: true });
              if (countResponse.data.success) {
                setUnreadCount(countResponse.data.unreadCount);
              }
            } catch (err: any) {
              console.error('Error getting unread count:', err);
            }
          };
          incrementUnreadCount();
        }
      } else {
        throw new Error(response.data.message || 'Failed to send message');
      }
    } catch (err: any) {
      console.error('Error sending message:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      const errorMessage = err.response?.data?.message || 'Failed to send message';
      setError(errorMessage);
      toast.error(errorMessage);
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg._id !== tempMessageId)
      );
    }
  };

  const toggleParticipantsList = () => {
    setShowParticipants(!showParticipants);
  };

  const getNameInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatTime = (date: Date | string) => {
    const messageDate = new Date(date);
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size exceeds 10MB limit');
        return;
      }
      const validTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'video/mp4',
        'video/webm',
        'application/pdf',
        'text/plain',
      ];
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.webm', '.pdf', '.txt'];
      const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
      if (!validTypes.includes(file.type) || !validExtensions.includes(fileExtension)) {
        toast.error('Unsupported file type. Use images, videos, PDFs, or text files.');
        return;
      }
      setSelectedFile(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const renderMessageContent = (message: Message) => {
    if (message.isTemporary && message.mediaStatus === 'uploading') {
      return (
        <div className="text-sm text-gray-500 flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-900 mr-2"></div>
          Uploading {message.media?.type || 'file'}...
        </div>
      );
    }

    if (message.isTemporary && message.mediaStatus === 'error') {
      return (
        <div className="text-sm text-red-500">
          Failed to upload {message.media?.type || 'file'}. Please try again.
        </div>
      );
    }

    if (message.content) {
      return <p className="break-words text-sm">{message.content}</p>;
    }

    if (message.media?.url) {
      const mediaUrl = message.media.displayUrl || message.media.url;

      if (message.media.type === 'image') {
        return (
          <div>
            <img
              src={mediaUrl}
              alt="Chat image"
              className="max-w-full h-auto rounded-lg shadow-sm"
              onError={(e) => {
                console.error('Failed to load image:', mediaUrl);
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML += '<p className="text-sm text-red-600">Failed to load image. Retrying...</p>';
                refreshMediaUrl(message._id, mediaUrl);
              }}
            />
          </div>
        );
      } else if (message.media.type === 'video') {
        return (
          <div>
            <video
              src={mediaUrl}
              controls
              className="max-w-full h-auto rounded-lg shadow-sm"
              onError={(e) => {
                console.error('Failed to load video:', mediaUrl);
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML += '<p className="text-sm text-red-600">Failed to load video. Retrying...</p>';
                refreshMediaUrl(message._id, mediaUrl);
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
            {message.media.type === 'file' ? 'Download File' : 'View File'}
          </a>
        );
      }
    }

    return <p className="text-sm text-gray-400">[No content]</p>;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden">
        <div className="bg-blue-900 text-white p-4 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FiMessageCircle className="h-6 w-6" />
              <h3 className="font-bold">{courseTitle || 'Course Chat'}</h3>
            </div>
            <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
              <FiX className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-2">
            <button
              onClick={toggleParticipantsList}
              className="flex items-center space-x-1 text-sm text-gray-200 hover:text-white transition-colors"
            >
              <FiUsers className="h-4 w-4" />
              <span>
                {participants.length} {participants.length === 1 ? 'participant' : 'participants'}
              </span>
            </button>
            {showParticipants && (
              <div className="mt-2 bg-blue-800 rounded-lg p-3">
                <ul className="text-sm text-gray-200">
                  {participants.map((participant) => (
                    <li key={participant._id} className="flex items-center space-x-2 py-1">
                      <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium">
                        {getNameInitials(participant.name)}
                      </div>
                      <span>
                        {participant.name}
                        {participant.role ? ` (${participant.role})` : ''}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          {loading && messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-900"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-center">
              {error}
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <FiMessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((message) => {
                const isCurrentUser = message.senderId._id === userId;
                return (
                  <div
                    key={message._id}
                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex max-w-[80%] ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                      {!isCurrentUser && (
                        <div className="flex-shrink-0 mr-2">
                          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium">
                            {getNameInitials(message.senderId.name)}
                          </div>
                        </div>
                      )}
                      <div>
                        <div
                          className={`rounded-lg p-3 ${
                            isCurrentUser
                              ? 'bg-blue-600 text-white mr-2'
                              : 'bg-white border border-gray-200'
                          }`}
                        >
                          {renderMessageContent(message)}
                        </div>
                        <div
                          className={`text-xs text-gray-500 mt-1 ${
                            isCurrentUser ? 'text-right mr-2' : ''
                          }`}
                        >
                          <span>{message.senderId.name}</span> • {formatTime(message.sentAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={triggerFileInput}
              disabled={uploading}
              className="p-2 text-gray-600 hover:text-blue-900 disabled:text-gray-400 transition-colors"
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
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 border border-gray-300 rounded-l-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={uploading}
            />
            <button
              type="submit"
              disabled={uploading || (!newMessage.trim() && !selectedFile) || !chatId}
              className={`bg-blue-900 text-white rounded-r-lg p-2 ${
                uploading || (!newMessage.trim() && !selectedFile) || !chatId
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-blue-800'
              }`}
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
                  if (fileInputRef.current) fileInputRef.current.value = '';
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
        </form>
      </div>
    </div>
  );
};

export default ChatModal;