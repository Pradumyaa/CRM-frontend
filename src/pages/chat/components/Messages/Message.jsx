// src/pages/chat/components/Messages/Message.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  Reply,
  Forward,
  Copy,
  Trash2,
  Edit,
  Download,
  Play,
  Pause,
  Check,
  CheckCheck,
  Clock,
  File,
  Image,
  Video,
  Music,
  Heart,
  ThumbsUp,
  Smile,
  Plus,
} from "lucide-react";
import Avatar from "../UI/Avatar";
import Button from "../UI/Button";
import Tooltip from "../UI/Tooltip";
import MessageActions from "./MessageActions";
import useChatStore from "../../store/chatStore";
import { formatRelativeTime, copyToClipboard } from "../../utils/helper";

const Message = ({
  message,
  isFromCurrentUser = false,
  showAvatar = true,
  isGrouped = false,
  onReply = null,
  onForward = null,
  onEdit = null,
  className = "",
}) => {
  const [showActions, setShowActions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const messageRef = useRef(null);
  const audioRef = useRef(null);

  const {
    users,
    currentUser,
    selectedChat,
    addReaction,
    updateMessage,
    deleteMessage,
  } = useChatStore();

  // Get sender info
  const sender = users.find(user => user._id === message.senderId) || {
    _id: message.senderId,
    name: message.senderName || 'Unknown User',
    avatar: message.senderAvatar,
    status: 'offline'
  };

  // Quick reactions
  const quickReactions = ['👍', '❤️', '😊', '😂', '😮', '😢'];
  const allEmojis = ['👍', '👎', '❤️', '😊', '😂', '😮', '😢', '🔥', '🎉', '👏', '💯', '🚀'];

  // ======================
  // EVENT HANDLERS
  // ======================

  const handleReaction = (emoji) => {
    if (selectedChat) {
      addReaction(selectedChat, message._id, emoji);
    }
    setShowReactions(false);
  };

  const handleCopy = async () => {
    try {
      await copyToClipboard(message.content);
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      deleteMessage(selectedChat, message._id);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSaveEdit = () => {
    if (editContent.trim() && editContent !== message.content) {
      updateMessage(selectedChat, message._id, {
        content: editContent.trim(),
        edited: true,
        editedAt: new Date().toISOString(),
      });
    }
    setEditMode(false);
  };

  const handleCancelEdit = () => {
    setEditContent(message.content);
    setEditMode(false);
  };

  const handleReply = () => {
    if (onReply) {
      onReply(message);
    }
  };

  const handleForward = () => {
    if (onForward) {
      onForward(message);
    }
  };

  const handleDownload = (attachment) => {
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePlayAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // ======================
  // RENDER HELPERS
  // ======================

  const renderStatusIcon = () => {
    if (!isFromCurrentUser) return null;

    switch (message.status) {
      case 'sending':
        return <Clock className="w-3 h-3 text-gray-400" />;
      case 'sent':
        return <Check className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default:
        return null;
    }
  };

  const renderAttachment = (attachment) => {
    const { type, name, size, url } = attachment;

    const formatSize = (bytes) => {
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      if (bytes === 0) return '0 Bytes';
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    };

    switch (type) {
      case 'image':
        return (
          <div className="mt-2 max-w-sm">
            <img
              src={url}
              alt={name}
              className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(url, '_blank')}
            />
            <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
              <span>{name}</span>
              <Button
                variant="ghost"
                size="xs"
                icon={Download}
                onClick={() => handleDownload(attachment)}
              />
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="mt-2 max-w-sm">
            <video
              src={url}
              controls
              className="rounded-lg max-w-full h-auto"
            >
              Your browser does not support the video tag.
            </video>
            <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
              <span>{name}</span>
              <Button
                variant="ghost"
                size="xs"
                icon={Download}
                onClick={() => handleDownload(attachment)}
              />
            </div>
          </div>
        );

      case 'audio':
      case 'voice':
        return (
          <div className="mt-2 flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg max-w-xs">
            <Button
              variant="ghost"
              size="sm"
              icon={isPlaying ? Pause : Play}
              onClick={handlePlayAudio}
              className="shrink-0"
            />
            <div className="flex-1">
              <div className="text-sm font-medium">{name}</div>
              {attachment.duration && (
                <div className="text-xs text-gray-500">
                  {Math.floor(attachment.duration / 60)}:{(attachment.duration % 60).toString().padStart(2, '0')}
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="xs"
              icon={Download}
              onClick={() => handleDownload(attachment)}
            />
            <audio
              ref={audioRef}
              src={url}
              onEnded={() => setIsPlaying(false)}
            />
          </div>
        );

      default:
        return (
          <div className="mt-2 flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg max-w-xs">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <File className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{name}</div>
              <div className="text-xs text-gray-500">{formatSize(size)}</div>
            </div>
            <Button
              variant="ghost"
              size="xs"
              icon={Download}
              onClick={() => handleDownload(attachment)}
            />
          </div>
        );
    }
  };

  const renderReplyTo = () => {
    if (!message.replyTo) return null;

    // Find the replied message (simplified - in real app would be from store)
    const repliedMessage = { content: "Original message content", senderName: "User" };

    return (
      <div className="mb-2 pl-3 border-l-2 border-gray-300 dark:border-gray-600">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Replying to {repliedMessage.senderName}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300 truncate">
          {repliedMessage.content}
        </div>
      </div>
    );
  };

  const renderReactions = () => {
    if (!message.reactions || Object.keys(message.reactions).length === 0) {
      return null;
    }

    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {Object.entries(message.reactions).map(([emoji, userIds]) => {
          const hasReacted = userIds.includes(currentUser._id);
          return (
            <button
              key={emoji}
              onClick={() => handleReaction(emoji)}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors ${
                hasReacted
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <span>{emoji}</span>
              <span>{userIds.length}</span>
            </button>
          );
        })}
      </div>
    );
  };

  const renderQuickReactions = () => (
    <div className="absolute bottom-0 right-0 transform translate-y-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 flex gap-1 z-50">
      {quickReactions.map((emoji) => (
        <button
          key={emoji}
          onClick={() => handleReaction(emoji)}
          className="w-8 h-8 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full flex items-center justify-center text-lg transition-colors"
        >
          {emoji}
        </button>
      ))}
      <button
        onClick={() => setShowReactions(true)}
        className="w-8 h-8 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );

  const renderAllReactions = () => (
    <div className="absolute bottom-0 right-0 transform translate-y-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 z-50 w-64">
      <div className="grid grid-cols-6 gap-1">
        {allEmojis.map((emoji) => (
          <button
            key={emoji}
            onClick={() => handleReaction(emoji)}
            className="w-8 h-8 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full flex items-center justify-center text-lg transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );

  // ======================
  // RENDER MAIN COMPONENT
  // ======================

  return (
    <div
      ref={messageRef}
      className={`group flex gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors relative ${
        isFromCurrentUser ? 'flex-row-reverse' : 'flex-row'
      } ${className}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false);
        setShowReactions(false);
      }}
    >
      {/* Avatar */}
      {showAvatar && !isGrouped && (
        <div className={`shrink-0 ${isFromCurrentUser ? 'order-2' : 'order-1'}`}>
          <Avatar
            src={sender.avatar}
            alt={sender.name}
            size="sm"
            status={sender.status}
            showStatus={true}
          />
        </div>
      )}

      {/* Message Content */}
      <div className={`flex-1 min-w-0 ${isFromCurrentUser ? 'order-1' : 'order-2'}`}>
        {/* Sender Name & Time */}
        {!isGrouped && (
          <div className={`flex items-center gap-2 mb-1 ${isFromCurrentUser ? 'justify-end' : 'justify-start'}`}>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {isFromCurrentUser ? 'You' : sender.name}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatRelativeTime(message.timestamp)}
            </span>
            {renderStatusIcon()}
          </div>
        )}

        {/* Reply Context */}
        {renderReplyTo()}

        {/* Message Content */}
        <div className={`relative ${isFromCurrentUser ? 'text-right' : 'text-left'}`}>
          {message.isForwarded && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 italic">
              Forwarded from {message.originalSender}
            </div>
          )}

          {editMode ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                rows={3}
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="xs"
                  onClick={handleSaveEdit}
                  disabled={!editContent.trim()}
                >
                  Save
                </Button>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div
              className={`inline-block max-w-lg p-3 rounded-2xl ${
                isFromCurrentUser
                  ? 'bg-blue-500 text-white ml-auto'
                  : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600'
              }`}
            >
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </div>
              
              {message.edited && (
                <div className="text-xs opacity-70 mt-1">
                  (edited)
                </div>
              )}
            </div>
          )}

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2">
              {message.attachments.map((attachment, index) => (
                <div key={index}>
                  {renderAttachment(attachment)}
                </div>
              ))}
            </div>
          )}

          {/* Reactions */}
          {renderReactions()}

          {/* Quick Actions on Hover */}
          {showActions && !editMode && (
            <div className={`absolute top-0 ${isFromCurrentUser ? 'left-0' : 'right-0'} transform -translate-y-full`}>
              <div className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-1">
                <Tooltip content="Add reaction">
                  <Button
                    variant="ghost"
                    size="xs"
                    icon={Smile}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowReactions(!showReactions);
                    }}
                  />
                </Tooltip>

                <Tooltip content="Reply">
                  <Button
                    variant="ghost"
                    size="xs"
                    icon={Reply}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleReply();
                    }}
                  />
                </Tooltip>

                <Tooltip content="Forward">
                  <Button
                    variant="ghost"
                    size="xs"
                    icon={Forward}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleForward();
                    }}
                  />
                </Tooltip>

                <Tooltip content="Copy">
                  <Button
                    variant="ghost"
                    size="xs"
                    icon={Copy}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleCopy();
                    }}
                  />
                </Tooltip>

                {isFromCurrentUser && (
                  <>
                    <Tooltip content="Edit">
                      <Button
                        variant="ghost"
                        size="xs"
                        icon={Edit}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleEdit();
                        }}
                      />
                    </Tooltip>

                    <Tooltip content="Delete">
                      <Button
                        variant="ghost"
                        size="xs"
                        icon={Trash2}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDelete();
                        }}
                        className="text-red-500 hover:text-red-600"
                      />
                    </Tooltip>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Quick Reactions Popup */}
          {showReactions && !showReactions && renderQuickReactions()}
          {showReactions && renderAllReactions()}
        </div>
      </div>
    </div>
  );
};

export default Message;