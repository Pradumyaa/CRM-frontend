// src/pages/chat/components/Chat/ChatContainer.jsx
import React, { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "../Messages/MessageList";
import MessageInput from "../Input/MessageInput";
import TypingIndicator from "../Messages/TypingIndicator";
import useChatStore from "../../store/chatStore";

const ChatContainer = () => {
  const containerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  const [isNearBottom, setIsNearBottom] = useState(true);

  const {
    selectedChat,
    selectedChatType,
    messages,
    currentUser,
    typingUsers,
    channels,
    directMessages,
  } = useChatStore();

  // Get current chat info
  const currentChat = selectedChat
    ? selectedChatType === "channel"
      ? channels.find((c) => c._id === selectedChat)
      : directMessages.find((dm) => dm._id === selectedChat)
    : null;

  const currentMessages = messages[selectedChat] || [];
  const currentTypingUsers = typingUsers[selectedChat] || [];

  // Filter out current user from typing indicators
  const otherTypingUsers = currentTypingUsers.filter(
    (userId) => userId !== currentUser?._id
  );

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (isAutoScrollEnabled && isNearBottom) {
      scrollToBottom();
    }
  }, [currentMessages.length, isAutoScrollEnabled, isNearBottom]);

  // Scroll to bottom function
  const scrollToBottom = (smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: smooth ? "smooth" : "instant",
        block: "end",
      });
    }
  };

  // Handle scroll events to detect if user is near bottom
  const handleScroll = (e) => {
    const element = e.target;
    const threshold = 100; // pixels from bottom
    const isNear =
      element.scrollHeight - element.scrollTop - element.clientHeight <
      threshold;

    setIsNearBottom(isNear);
    setIsAutoScrollEnabled(isNear);
  };

  // Scroll to bottom when chat changes
  useEffect(() => {
    if (selectedChat) {
      setTimeout(() => {
        scrollToBottom(false);
        setIsAutoScrollEnabled(true);
        setIsNearBottom(true);
      }, 100);
    }
  }, [selectedChat]);

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-2xl">💬</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Select a chat to start messaging
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Choose from your channels or direct messages on the left
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 flex flex-col h-full bg-white dark:bg-gray-900 relative"
    >
      {/* Fixed Header */}
      <div className="shrink-0 border-b border-gray-200 dark:border-gray-700">
        <ChatHeader chat={currentChat} chatType={selectedChatType} />
      </div>

      {/* Scrollable Messages Area */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        {/* Messages Container */}
        <div
          className="flex-1 overflow-y-auto overflow-x-hidden"
          onScroll={handleScroll}
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#CBD5E0 transparent",
          }}
        >
          <div className="min-h-full flex flex-col justify-end">
            {currentMessages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <span className="text-xl">👋</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Start the conversation
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Be the first to send a message in{" "}
                    {selectedChatType === "channel" ? "#" : ""}
                    {currentChat?.name}
                  </p>
                </div>
              </div>
            ) : (
              <MessageList
                messages={currentMessages}
                currentUser={currentUser}
              />
            )}

            {/* Typing Indicator */}
            {otherTypingUsers.length > 0 && (
              <div className="px-4 py-2">
                <TypingIndicator users={otherTypingUsers} />
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} className="h-1" />
          </div>
        </div>

        {/* Scroll to bottom button */}
        {!isNearBottom && (
          <div className="absolute bottom-20 right-4 z-10">
            <button
              onClick={() => {
                scrollToBottom();
                setIsAutoScrollEnabled(true);
                setIsNearBottom(true);
              }}
              className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all transform hover:scale-105"
              aria-label="Scroll to bottom"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Fixed Input Area */}
      <div className="shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="p-4">
          <MessageInput
            placeholder={`Message ${selectedChatType === "channel" ? "#" : ""}${
              currentChat?.name || "chat"
            }...`}
            onSend={() => {
              // Scroll to bottom after sending
              setTimeout(() => {
                scrollToBottom();
                setIsAutoScrollEnabled(true);
                setIsNearBottom(true);
              }, 100);
            }}
          />
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background-color: #cbd5e0;
          border-radius: 3px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background-color: #a0aec0;
        }

        .dark .overflow-y-auto::-webkit-scrollbar-thumb {
          background-color: #4a5568;
        }

        .dark .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background-color: #2d3748;
        }
      `}</style>
    </div>
  );
};

export default ChatContainer;
