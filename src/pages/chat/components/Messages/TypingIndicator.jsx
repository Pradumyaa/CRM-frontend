// src/pages/chat/components/Messages/TypingIndicator.jsx
import React, { useMemo } from "react";
import Avatar from "../UI/Avatar";

const TypingIndicator = ({
  users = [],
  className = "",
  showAvatars = true,
  maxDisplayUsers = 3,
}) => {
  // ======================
  // COMPUTED VALUES
  // ======================

  const displayText = useMemo(() => {
    if (!users || users.length === 0) return "";

    const userCount = users.length;
    const displayUsers = users.slice(0, maxDisplayUsers);
    const hasMore = userCount > maxDisplayUsers;

    if (userCount === 1) {
      return `${displayUsers[0].name} is typing...`;
    } else if (userCount === 2) {
      return `${displayUsers[0].name} and ${displayUsers[1].name} are typing...`;
    } else if (userCount === 3 && !hasMore) {
      return `${displayUsers[0].name}, ${displayUsers[1].name} and ${displayUsers[2].name} are typing...`;
    } else {
      const visibleNames = displayUsers.map((user) => user.name).join(", ");
      const remaining = userCount - maxDisplayUsers;
      return `${visibleNames} and ${remaining} other${
        remaining > 1 ? "s" : ""
      } are typing...`;
    }
  }, [users, maxDisplayUsers]);

  // ======================
  // TYPING DOTS ANIMATION
  // ======================

  const TypingDots = () => (
    <div className="flex items-center space-x-1">
      <div
        className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
        style={{ animationDelay: "0ms", animationDuration: "1.4s" }}
      />
      <div
        className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
        style={{ animationDelay: "200ms", animationDuration: "1.4s" }}
      />
      <div
        className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
        style={{ animationDelay: "400ms", animationDuration: "1.4s" }}
      />
    </div>
  );

  // ======================
  // RENDER
  // ======================

  if (!users || users.length === 0) {
    return null;
  }

  return (
    <div
      className={`flex items-center gap-3 px-4 py-2 animate-in slide-in-from-bottom-2 fade-in-0 duration-300 ${className}`}
    >
      {/* User Avatars */}
      {showAvatars && (
        <div className="flex -space-x-2">
          {users.slice(0, maxDisplayUsers).map((user, index) => (
            <Avatar
              key={user._id}
              src={user.avatar}
              alt={user.name}
              size="xs"
              className="ring-2 ring-white dark:ring-gray-800"
              style={{ zIndex: maxDisplayUsers - index }}
            />
          ))}
          {users.length > maxDisplayUsers && (
            <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-400 ring-2 ring-white dark:ring-gray-800">
              +{users.length - maxDisplayUsers}
            </div>
          )}
        </div>
      )}

      {/* Typing Bubble */}
      <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-3">
        <TypingDots />
        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          {displayText}
        </div>
      </div>

      {/* Custom CSS for smooth animations */}
      <style jsx>{`
        @keyframes typing-fade-in {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .typing-indicator {
          animation: typing-fade-in 0.3s ease-out;
        }

        .typing-dot {
          animation: typing-bounce 1.4s ease-in-out infinite;
        }

        .typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing-bounce {
          0%,
          60%,
          100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
};

export default TypingIndicator;
