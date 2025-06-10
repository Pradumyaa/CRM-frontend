// src/pages/chat/components/Messages/MessageList.jsx
import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
  useMemo,
} from "react";
import { ChevronDown, Loader2, ArrowUp } from "lucide-react";
import Message from "./Message";
import TypingIndicator from "./TypingIndicator";
import MessageActions from "./MessageActions";
import Button from "../UI/Button";
import LoadingSpinner from "../UI/LoadingSpinner";
import useChat from "../../hooks/useChat";
import {
  formatMessageTime,
  isToday,
  scrollToElement,
} from "../../utils/helper";
import { MESSAGE_TYPES } from "../../utils/constants";

const MessageList = ({
  className = "",
  showScrollToBottom = true,
  loadMoreThreshold = 100,
  groupMessagesByDate = true,
  virtualized = false,
  autoScroll = true,
}) => {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const [selectedMessageId, setSelectedMessageId] = useState(null);

  const {
    currentMessages,
    currentTypingUsers,
    currentChat,
    selectedChat,
    getMessageSender,
    isMessageFromCurrentUser,
    canEditMessage,
    canDeleteMessage,
    editMessage,
    removeMessage,
    replyToMessage,
  } = useChat();

  // ======================
  // SCROLL MANAGEMENT
  // ======================

  const scrollToBottom = useCallback((smooth = true) => {
    if (messagesEndRef.current) {
      scrollToElement(messagesEndRef.current, smooth ? "smooth" : "auto");
    }
  }, []);

  const scrollToTop = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    // Check if user is near bottom (within 100px)
    const nearBottom = distanceFromBottom < 100;
    setIsAtBottom(nearBottom);
    setShowScrollButton(!nearBottom && showScrollToBottom);

    // Reset new message count when at bottom
    if (nearBottom && newMessageCount > 0) {
      setNewMessageCount(0);
    }

    // Load more messages when near top
    if (scrollTop < loadMoreThreshold && !isLoadingMore) {
      loadMoreMessages();
    }
  }, [showScrollToBottom, newMessageCount, loadMoreThreshold, isLoadingMore]);

  const loadMoreMessages = useCallback(async () => {
    if (!selectedChat || isLoadingMore || currentMessages.length === 0) return;

    setIsLoadingMore(true);

    try {
      // Store current scroll position
      const container = messagesContainerRef.current;
      const scrollHeight = container.scrollHeight;

      // Simulate loading more messages (replace with actual API call)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, you would:
      // await loadMoreChatMessages(selectedChat, currentMessages[0]?.timestamp);

      // Restore scroll position after new messages load
      setTimeout(() => {
        if (container) {
          const newScrollHeight = container.scrollHeight;
          const scrollDifference = newScrollHeight - scrollHeight;
          container.scrollTop = scrollDifference;
        }
      }, 50);
    } catch (error) {
      console.error("Failed to load more messages:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [selectedChat, isLoadingMore, currentMessages.length]);

  // ======================
  // MESSAGE GROUPING
  // ======================

  const groupedMessages = useMemo(() => {
    if (!currentMessages.length) return [];

    const groups = [];
    let currentGroup = null;
    let currentDate = null;

    currentMessages.forEach((message, index) => {
      const messageDate = new Date(message.timestamp);
      const messageDateString = messageDate.toDateString();
      const sender = getMessageSender(message);
      const isFromCurrentUser = isMessageFromCurrentUser(message);

      // Check if we need a new date separator
      if (groupMessagesByDate && messageDateString !== currentDate) {
        if (currentGroup) {
          groups.push(currentGroup);
        }

        // Add date separator
        groups.push({
          type: "date",
          date: messageDate,
          id: `date-${messageDateString}`,
        });

        currentDate = messageDateString;
        currentGroup = null;
      }

      // Check if we can group this message with the previous one
      const prevMessage = currentMessages[index - 1];
      const canGroup =
        prevMessage &&
        prevMessage.senderId === message.senderId &&
        new Date(message.timestamp) - new Date(prevMessage.timestamp) <
          5 * 60 * 1000 && // 5 minutes
        prevMessage.type === MESSAGE_TYPES.TEXT &&
        message.type === MESSAGE_TYPES.TEXT &&
        !prevMessage.replyTo &&
        !message.replyTo;

      if (canGroup && currentGroup && currentGroup.messages.length > 0) {
        // Add to existing group
        currentGroup.messages.push(message);
      } else {
        // Start new group
        if (currentGroup) {
          groups.push(currentGroup);
        }

        currentGroup = {
          type: "messages",
          id: `group-${message._id}`,
          sender,
          isFromCurrentUser,
          messages: [message],
          timestamp: message.timestamp,
        };
      }
    });

    // Add the last group
    if (currentGroup) {
      groups.push(currentGroup);
    }

    return groups;
  }, [
    currentMessages,
    getMessageSender,
    isMessageFromCurrentUser,
    groupMessagesByDate,
  ]);

  // ======================
  // MESSAGE ACTIONS
  // ======================

  const handleMessageReply = useCallback((message) => {
    console.log("Reply to message:", message._id);
    // This would typically set reply state in parent or store
  }, []);

  const handleMessageEdit = useCallback((message) => {
    setSelectedMessageId(message._id);
    // This could trigger edit mode in the Message component
  }, []);

  const handleMessageDelete = useCallback(
    async (message) => {
      try {
        await removeMessage(message._id);
      } catch (error) {
        console.error("Failed to delete message:", error);
      }
    },
    [removeMessage]
  );

  const handleMessageForward = useCallback((message) => {
    console.log("Forward message:", message._id);
    // This would open a forward dialog
  }, []);

  const handleMessagePin = useCallback((message) => {
    console.log("Pin message:", message._id);
    // This would pin the message
  }, []);

  const handleMessageReaction = useCallback((message, emoji) => {
    console.log("React to message:", message._id, "with:", emoji);
    // This would add/remove reaction
  }, []);

  // ======================
  // EFFECTS
  // ======================

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (autoScroll && isAtBottom && currentMessages.length > 0) {
      setTimeout(() => scrollToBottom(), 50);
    } else if (!isAtBottom && autoScroll) {
      // Increment new message count if not at bottom
      setNewMessageCount((prev) => prev + 1);
    }
  }, [currentMessages.length, isAtBottom, scrollToBottom, autoScroll]);

  // Scroll to bottom when chat changes
  useEffect(() => {
    if (selectedChat) {
      setTimeout(() => scrollToBottom(false), 100);
      setNewMessageCount(0);
      setSelectedMessageId(null);
    }
  }, [selectedChat, scrollToBottom]);

  // Setup scroll listener
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // ======================
  // RENDER HELPERS
  // ======================

  const renderDateSeparator = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let dateText;
    if (isToday(date)) {
      dateText = "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateText = "Yesterday";
    } else {
      dateText = date.toLocaleDateString([], {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    return (
      <div
        key={`date-${date.toDateString()}`}
        className="flex items-center justify-center my-6"
      >
        <div className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
          {dateText}
        </div>
      </div>
    );
  };

  const renderMessageGroup = (group) => {
    const { sender, isFromCurrentUser, messages } = group;

    return (
      <div
        key={group.id}
        className={`flex gap-3 mb-6 ${
          isFromCurrentUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Avatar (only for others' messages) */}
        {!isFromCurrentUser && (
          <div className="flex-shrink-0 self-end">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-sm">
              {sender.name.charAt(0).toUpperCase()}
            </div>
          </div>
        )}

        {/* Messages */}
        <div
          className={`flex flex-col gap-1 max-w-[70%] ${
            isFromCurrentUser ? "items-end" : "items-start"
          }`}
        >
          {/* Sender name (only for others' messages and first message in group) */}
          {!isFromCurrentUser && (
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400 px-3 mb-1">
              {sender.name}
            </div>
          )}

          {/* Messages in group */}
          {messages.map((message, index) => (
            <div key={message._id} className="relative group">
              <Message
                message={message}
                sender={sender}
                isFromCurrentUser={isFromCurrentUser}
                isFirstInGroup={index === 0}
                isLastInGroup={index === messages.length - 1}
                showAvatar={false} // Avatar is shown at group level
                showSender={false} // Sender is shown at group level
                canEdit={canEditMessage(message)}
                canDelete={canDeleteMessage(message)}
              />

              {/* Message Actions */}
              <div
                className={`absolute top-0 ${
                  isFromCurrentUser
                    ? "left-0 -translate-x-full"
                    : "right-0 translate-x-full"
                } opacity-0 group-hover:opacity-100 transition-opacity z-10`}
              >
                <MessageActions
                  message={message}
                  isFromCurrentUser={isFromCurrentUser}
                  canEdit={canEditMessage(message)}
                  canDelete={canDeleteMessage(message)}
                  canPin={true}
                  position={isFromCurrentUser ? "left" : "right"}
                  onReply={handleMessageReply}
                  onEdit={handleMessageEdit}
                  onDelete={handleMessageDelete}
                  onForward={handleMessageForward}
                  onPin={handleMessagePin}
                  onReaction={handleMessageReaction}
                />
              </div>
            </div>
          ))}

          {/* Timestamp (shown for last message in group) */}
          <div
            className={`text-xs text-gray-500 dark:text-gray-400 px-3 mt-1 ${
              isFromCurrentUser ? "text-right" : "text-left"
            }`}
          >
            {formatMessageTime(messages[messages.length - 1].timestamp)}
          </div>
        </div>
      </div>
    );
  };

  // ======================
  // RENDER EMPTY STATES
  // ======================

  if (!currentChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center text-gray-500 dark:text-gray-400 max-w-md">
          <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">💬</span>
          </div>
          <h3 className="text-xl font-semibold mb-3">Welcome to Chat</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Select a conversation from the sidebar to start messaging, or create
            a new chat to get started.
          </p>
        </div>
      </div>
    );
  }

  if (currentMessages.length === 0 && currentTypingUsers.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center text-gray-500 dark:text-gray-400 max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🚀</span>
          </div>
          <h3 className="text-lg font-semibold mb-3">Start the conversation</h3>
          <p className="text-gray-600 dark:text-gray-400">
            No messages yet. Send the first message to get the conversation
            started!
          </p>
        </div>
      </div>
    );
  }

  // ======================
  // MAIN RENDER
  // ======================

  return (
    <div
      className={`flex-1 flex flex-col relative bg-white dark:bg-gray-900 ${className}`}
    >
      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-2 scroll-smooth"
      >
        {/* Loading More Indicator */}
        {isLoadingMore && (
          <div className="flex justify-center py-4">
            <LoadingSpinner
              type="dots"
              size="sm"
              text="Loading more messages..."
            />
          </div>
        )}

        {/* Message Groups */}
        {groupedMessages.map((group) =>
          group.type === "date"
            ? renderDateSeparator(group.date)
            : renderMessageGroup(group)
        )}

        {/* Typing Indicator */}
        {currentTypingUsers.length > 0 && (
          <div className="mb-4">
            <TypingIndicator
              users={currentTypingUsers}
              showAvatars={true}
              maxDisplayUsers={3}
            />
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
        {/* Scroll to Top Button (when far from top) */}
        {messagesContainerRef.current?.scrollTop > 500 && (
          <Tooltip content="Scroll to top">
            <Button
              variant="secondary"
              size="sm"
              icon={ArrowUp}
              onClick={scrollToTop}
              className="rounded-full shadow-lg hover:shadow-xl"
            />
          </Tooltip>
        )}

        {/* Scroll to Bottom Button */}
        {showScrollButton && (
          <Tooltip content="Scroll to bottom">
            <Button
              variant="primary"
              size="sm"
              icon={ChevronDown}
              onClick={() => scrollToBottom()}
              className="rounded-full shadow-lg hover:shadow-xl"
            >
              {newMessageCount > 0 && (
                <span className="ml-1 bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs font-bold min-w-[20px]">
                  {newMessageCount > 99 ? "99+" : newMessageCount}
                </span>
              )}
            </Button>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default MessageList;
