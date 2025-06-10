// src/pages/chat/components/Messages/MessageActions.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  MoreVertical,
  Reply,
  Edit,
  Trash2,
  Copy,
  Forward,
  Pin,
  Star,
  Download,
  Link,
  Flag,
  Eye,
  EyeOff,
  Bookmark,
  Share,
  MessageSquare,
  Heart,
  ThumbsUp,
  Smile,
  Laugh,
  Angry,
} from "lucide-react";
import Button from "../UI/Button";
import Tooltip from "../UI/Tooltip";
import useChat from "../../hooks/useChat";
import { copyToClipboard, downloadFile } from "../../utils/helper";
import { REACTION_EMOJIS } from "../../utils/constants";

const MessageActions = ({
  message,
  isFromCurrentUser = false,
  canEdit = false,
  canDelete = false,
  canPin = false,
  onReply = null,
  onEdit = null,
  onDelete = null,
  onForward = null,
  onPin = null,
  onReaction = null,
  className = "",
  position = "right", // 'left' | 'right' | 'top' | 'bottom'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [showSuccess, setShowSuccess] = useState("");
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const { removeMessage, editMessage } = useChat();

  // ======================
  // MENU POSITIONING
  // ======================

  const getMenuPosition = () => {
    const positions = {
      right: "left-0 top-0",
      left: "right-0 top-0",
      top: "left-0 bottom-full mb-2",
      bottom: "left-0 top-full mt-2",
    };
    return positions[position] || positions.right;
  };

  // ======================
  // OUTSIDE CLICK HANDLER
  // ======================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setShowReactions(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  // ======================
  // ACTION HANDLERS
  // ======================

  const showSuccessMessage = (text) => {
    setShowSuccess(text);
    setTimeout(() => setShowSuccess(""), 2000);
  };

  const handleReply = useCallback(() => {
    if (onReply) {
      onReply(message);
    }
    setIsOpen(false);
  }, [onReply, message]);

  const handleEdit = useCallback(() => {
    if (onEdit) {
      onEdit(message);
    }
    setIsOpen(false);
  }, [onEdit, message]);

  const handleDelete = useCallback(async () => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        if (onDelete) {
          await onDelete(message);
        } else {
          await removeMessage(message._id);
        }
        showSuccessMessage("Message deleted");
      } catch (error) {
        console.error("Failed to delete message:", error);
      }
    }
    setIsOpen(false);
  }, [onDelete, message, removeMessage]);

  const handleCopy = useCallback(async () => {
    try {
      await copyToClipboard(message.content);
      showSuccessMessage("Copied to clipboard");
    } catch (error) {
      console.error("Failed to copy message:", error);
    }
    setIsOpen(false);
  }, [message.content]);

  const handleForward = useCallback(() => {
    if (onForward) {
      onForward(message);
    }
    setIsOpen(false);
  }, [onForward, message]);

  const handlePin = useCallback(() => {
    if (onPin) {
      onPin(message);
    }
    showSuccessMessage("Message pinned");
    setIsOpen(false);
  }, [onPin, message]);

  const handleDownload = useCallback(() => {
    if (message.attachments && message.attachments.length > 0) {
      message.attachments.forEach((attachment) => {
        downloadFile(attachment.url, attachment.name);
      });
      showSuccessMessage("Download started");
    }
    setIsOpen(false);
  }, [message.attachments]);

  const handleGetLink = useCallback(async () => {
    const messageLink = `${window.location.origin}/chat/${message.chatId}/${message._id}`;
    try {
      await copyToClipboard(messageLink);
      showSuccessMessage("Link copied");
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
    setIsOpen(false);
  }, [message]);

  const handleReaction = useCallback(
    (emoji) => {
      if (onReaction) {
        onReaction(message, emoji);
      }
      showSuccessMessage(`Reacted with ${emoji}`);
      setShowReactions(false);
      setIsOpen(false);
    },
    [onReaction, message]
  );

  const handleReport = useCallback(() => {
    // In a real app, this would open a report dialog
    console.log("Report message:", message._id);
    showSuccessMessage("Message reported");
    setIsOpen(false);
  }, [message._id]);

  // ======================
  // RENDER MENU ITEMS
  // ======================

  const renderQuickReactions = () => (
    <div className="flex gap-1 p-2 border-b border-gray-200 dark:border-gray-600">
      {REACTION_EMOJIS.slice(0, 6).map((emoji) => (
        <button
          key={emoji}
          onClick={() => handleReaction(emoji)}
          className="w-8 h-8 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors flex items-center justify-center text-lg hover:scale-110 transform"
          title={`React with ${emoji}`}
        >
          {emoji}
        </button>
      ))}
      <button
        onClick={() => setShowReactions(!showReactions)}
        className="w-8 h-8 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors flex items-center justify-center"
        title="More reactions"
      >
        <Smile className="w-4 h-4" />
      </button>
    </div>
  );

  const renderMenuItem = (
    icon,
    text,
    onClick,
    danger = false,
    disabled = false
  ) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed ${
        danger
          ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          : "text-gray-700 dark:text-gray-300"
      }`}
    >
      {React.createElement(icon, { className: "w-4 h-4" })}
      {text}
    </button>
  );

  // ======================
  // RENDER
  // ======================

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <div ref={buttonRef}>
        <Tooltip content="Message actions">
          <Button
            variant="ghost"
            size="xs"
            icon={MoreVertical}
            onClick={() => setIsOpen(!isOpen)}
            className={`opacity-0 group-hover:opacity-100 transition-opacity ${
              isOpen ? "opacity-100" : ""
            }`}
          />
        </Tooltip>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="absolute top-0 left-0 transform -translate-y-full bg-green-500 text-white px-2 py-1 rounded text-xs whitespace-nowrap z-50">
          {showSuccess}
        </div>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className={`absolute ${getMenuPosition()} bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-40 min-w-48 animate-in fade-in-0 zoom-in-95 duration-200`}
        >
          {/* Quick Reactions */}
          {renderQuickReactions()}

          {/* Main Actions */}
          <div className="py-1">
            {renderMenuItem(Reply, "Reply", handleReply)}

            {canEdit && renderMenuItem(Edit, "Edit", handleEdit)}

            {renderMenuItem(Copy, "Copy text", handleCopy)}

            {onForward && renderMenuItem(Forward, "Forward", handleForward)}

            {message.attachments?.length > 0 &&
              renderMenuItem(Download, "Download", handleDownload)}

            {renderMenuItem(Link, "Copy link", handleGetLink)}
          </div>

          {/* Secondary Actions */}
          <div className="py-1 border-t border-gray-200 dark:border-gray-600">
            {canPin && renderMenuItem(Pin, "Pin message", handlePin)}

            {renderMenuItem(Bookmark, "Save message", () => {
              showSuccessMessage("Message saved");
              setIsOpen(false);
            })}

            {renderMenuItem(Share, "Share", () => {
              if (navigator.share) {
                navigator.share({
                  title: "Shared message",
                  text: message.content,
                });
              }
              setIsOpen(false);
            })}
          </div>

          {/* Danger Zone */}
          <div className="py-1 border-t border-gray-200 dark:border-gray-600">
            {!isFromCurrentUser &&
              renderMenuItem(Flag, "Report", handleReport, true)}

            {canDelete && renderMenuItem(Trash2, "Delete", handleDelete, true)}
          </div>
        </div>
      )}

      {/* Extended Reactions Menu */}
      {showReactions && (
        <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 z-50 animate-in fade-in-0 zoom-in-95 duration-200">
          <div className="grid grid-cols-8 gap-1 max-w-64">
            {REACTION_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleReaction(emoji)}
                className="w-8 h-8 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors flex items-center justify-center text-lg hover:scale-110 transform"
                title={`React with ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageActions;
