import React, { useEffect, useRef, useCallback } from "react";
import { Trash2, AlertCircle } from "lucide-react";
import useChatStore from "@/store/chatSlice";

const MessageContainer = () => {
  const { 
    selectedChat, 
    messages, 
    employees, 
    channels, 
    activeTab, 
    deleteMessage,
    employeeId,
  } = useChatStore();

  const messagesEndRef = useRef(null);

  // Initialize the store when component mounts
  useEffect(() => {
    const init = async () => {
      await useChatStore.getState().initialize();
      console.log("After initialization, Employee ID:", useChatStore.getState().employeeId);
    };
    init();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (selectedChat) {
      const chatId = activeTab === "direct"
        ? [employeeId, selectedChat].sort().join('_')
        : selectedChat;
        
      const currentMessages = messages[chatId];
      
      if (currentMessages?.length) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages, selectedChat, activeTab, employeeId]); 
  
  // Handle message deletion
  const handleDeleteMessage = useCallback((messageId) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      const chatId = activeTab === "direct"
        ? [employeeId, selectedChat].sort().join('_')
        : selectedChat;
      
      deleteMessage(chatId, messageId);
    }
  }, [employeeId, selectedChat, activeTab, deleteMessage]);

  // Get Chat Name
  const getChatName = () => {
    if (!selectedChat) return "";
    return activeTab === "direct"
      ? employees.find(emp => emp._id === selectedChat)?.name || "Unknown"
      : `#${channels.find(ch => ch._id === selectedChat || ch.id === selectedChat)?.name || "Unknown"}`;
  };
  
  // Ensure employeeId is available
  if (!employeeId) {
    return (
      <div className="flex-grow flex items-center justify-center bg-white rounded-lg p-4">
        <p className="text-center text-gray-500">Loading chat...</p>
      </div>
    );
  }

  if (!selectedChat) {
    return (
      <div className="flex-grow flex items-center justify-center bg-white rounded-lg p-4">
        <p className="text-center text-gray-500">Select a chat to start messaging</p>
      </div>
    );
  }

  let chatId = activeTab === "direct" 
    ? [employeeId, selectedChat].sort().join('_')
    : selectedChat;
    
  const chatMessages = messages[chatId] || [];

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b bg-white rounded-t-lg shadow-sm flex items-center gap-2">
        <h3 className="font-semibold text-lg">{getChatName()}</h3>
      </div>
      
      {/* Messages Area */}
      <div className="flex-grow p-4 overflow-y-auto bg-white">
        {chatMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>No messages yet</p>
            <p className="text-sm mt-2">Be the first to send a message!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {chatMessages.map((msg) => {
              // Add logging for debugging
              console.log("Rendering message:", msg);
              
              const isCurrentUser = msg.senderId === employeeId || msg.sender === employeeId;
              
              if (msg.deleted) {
                return (
                  <div 
                    key={msg.id || `msg-${msg.timestamp}`}
                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg max-w-[80%] text-gray-400 italic">
                      <AlertCircle size={16} />
                      <span>This message has been deleted</span>
                    </div>
                  </div>
                );
              }
              
              // Find the sender's name - handle different field formats
              let senderName = isCurrentUser
                ? "You"
                : employees.find(emp => 
                    emp._id === (msg.senderId || msg.sender) || 
                    emp.id === (msg.senderId || msg.sender)
                  )?.name || msg.senderName || "Unknown";
              
              // Ensure we have a text property
              const messageText = msg.text || msg.message || "[No message content]";
              
              return (
                <div 
                  key={msg.id || `msg-${msg.timestamp}`}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`p-3 rounded-lg max-w-[80%] ${
                    isCurrentUser 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-800'
                  }`}>
                    {!isCurrentUser && (
                      <p className="font-bold text-xs mb-1">{senderName}</p>
                    )}
                    <p>{messageText}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs opacity-70">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      
                      {isCurrentUser && (
                        <button 
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="ml-2 opacity-50 hover:opacity-100 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageContainer;