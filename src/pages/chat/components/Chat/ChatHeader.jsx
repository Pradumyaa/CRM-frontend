// src/pages/chat/components/Chat/ChatHeader.jsx
import React, { useState, useCallback } from "react";
import {
  Hash,
  Users,
  Phone,
  Video,
  Search,
  Star,
  StarOff,
  Bell,
  BellOff,
  Settings,
  Info,
  MoreVertical,
  Pin,
  Archive,
  Trash2,
  UserPlus,
  Volume2,
  VolumeX,
  Shield,
  Lock,
  Globe,
} from "lucide-react";
import Button from "../UI/Button";
import Avatar from "../UI/Avatar";
import Tooltip from "../UI/Tooltip";
import useChatStore from "../../store/chatStore";
import useChat from "../../hooks/useChat";
import useSocket from "../../hooks/useSocket";
import { formatUserName } from "../../utils/helper";
import { CHAT_TYPES, MODAL_TYPES, CHANNEL_TYPES } from "../../utils/constants";

const ChatHeader = ({ className = "" }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isNotificationsMuted, setIsNotificationsMuted] = useState(false);

  const {
    selectedChat,
    selectedChatType,
    channels,
    directMessages,
    users,
    currentUser,
    onlineUsers,
    setActiveModal,
  } = useChatStore();

  const { currentChat, getOnlineMembers, isUserOnline } = useChat();

  const { initiateCall, isConnected } = useSocket();

  // ======================
  // COMPUTED VALUES
  // ======================

  const isChannel = selectedChatType === CHAT_TYPES.CHANNEL;
  const isDirect = selectedChatType === CHAT_TYPES.DIRECT;

  // Get chat participants/members
  const chatParticipants =
    currentChat?.members || currentChat?.participants || [];
  const onlineCount = isChannel ? getOnlineMembers(chatParticipants).length : 0;

  // For direct messages, get the other participant
  const otherParticipant = isDirect
    ? users.find(
        (u) => chatParticipants.includes(u._id) && u._id !== currentUser?._id
      )
    : null;

  const isOtherUserOnline = otherParticipant
    ? isUserOnline(otherParticipant._id)
    : false;

  // ======================
  // EVENT HANDLERS
  // ======================

  const handleVoiceCall = useCallback(() => {
    if (!currentChat || !isConnected) return;

    if (isDirect && otherParticipant) {
      initiateCall(otherParticipant._id, "voice");
    }
  }, [currentChat, isDirect, otherParticipant, initiateCall, isConnected]);

  const handleVideoCall = useCallback(() => {
    if (!currentChat || !isConnected) return;

    if (isDirect && otherParticipant) {
      initiateCall(otherParticipant._id, "video");
    }
  }, [currentChat, isDirect, otherParticipant, initiateCall, isConnected]);

  const handleChatInfo = useCallback(() => {
    if (isChannel) {
      setActiveModal(MODAL_TYPES.CHANNEL_INFO);
    } else if (isDirect && otherParticipant) {
      setActiveModal(MODAL_TYPES.USER_PROFILE);
    }
  }, [isChannel, isDirect, otherParticipant, setActiveModal]);

  const handleChatSettings = useCallback(() => {
    if (isChannel) {
      setActiveModal(MODAL_TYPES.CHANNEL_EDIT);
    }
  }, [isChannel, setActiveModal]);

  const handleSearchInChat = useCallback(() => {
    setActiveModal(MODAL_TYPES.SEARCH);
  }, [setActiveModal]);

  const handleToggleFavorite = useCallback(() => {
    setIsFavorited(!isFavorited);
    // TODO: Update favorite status in store
  }, [isFavorited]);

  const handleToggleNotifications = useCallback(() => {
    setIsNotificationsMuted(!isNotificationsMuted);
    // TODO: Update notification settings in store
  }, [isNotificationsMuted]);

  const handleAddMembers = useCallback(() => {
    if (isChannel) {
      setActiveModal(MODAL_TYPES.CHANNEL_MEMBERS);
    }
  }, [isChannel, setActiveModal]);

  // ======================
  // RENDER HELPERS
  // ======================

  const renderChatTitle = () => {
    if (isChannel) {
      return (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded flex items-center justify-center">
            {currentChat?.type === CHANNEL_TYPES.PRIVATE ? (
              <Lock className="w-3 h-3 text-gray-600 dark:text-gray-400" />
            ) : (
              <Hash className="w-3 h-3 text-gray-600 dark:text-gray-400" />
            )}
          </div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            {currentChat?.name}
          </h1>
          {currentChat?.type === CHANNEL_TYPES.PRIVATE && (
            <Shield className="w-4 h-4 text-gray-500" />
          )}
        </div>
      );
    }

    if (isDirect && otherParticipant) {
      return (
        <div className="flex items-center gap-3">
          <Avatar
            src={otherParticipant.avatar}
            alt={otherParticipant.name}
            size="sm"
            status={otherParticipant.status}
            showStatus={true}
          />
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatUserName(otherParticipant)}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {isOtherUserOnline ? "Online" : "Offline"}
              {otherParticipant.role && ` • ${otherParticipant.role}`}
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderChatSubtitle = () => {
    if (isChannel) {
      return (
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Users className="w-4 h-4" />
          <span>
            {currentChat?.memberCount || 0} members
            {onlineCount > 0 && `, ${onlineCount} online`}
          </span>
          {currentChat?.description && (
            <>
              <span>•</span>
              <span className="truncate max-w-xs">
                {currentChat.description}
              </span>
            </>
          )}
        </div>
      );
    }

    return null;
  };

  const renderActionButtons = () => (
    <div className="flex items-center gap-2">
      {/* Search in Chat */}
      <Tooltip content="Search in conversation">
        <Button
          size="sm"
          variant="ghost"
          icon={Search}
          onClick={handleSearchInChat}
        />
      </Tooltip>

      {/* Call Buttons (only for direct messages) */}
      {isDirect && (
        <>
          <Tooltip content="Voice call">
            <Button
              size="sm"
              variant="ghost"
              icon={Phone}
              onClick={handleVoiceCall}
              disabled={!isConnected || !isOtherUserOnline}
            />
          </Tooltip>

          <Tooltip content="Video call">
            <Button
              size="sm"
              variant="ghost"
              icon={Video}
              onClick={handleVideoCall}
              disabled={!isConnected || !isOtherUserOnline}
            />
          </Tooltip>
        </>
      )}

      {/* Channel Members (only for channels) */}
      {isChannel && (
        <Tooltip content="View members">
          <Button
            size="sm"
            variant="ghost"
            icon={Users}
            onClick={() => setActiveModal(MODAL_TYPES.CHANNEL_MEMBERS)}
          />
        </Tooltip>
      )}

      {/* Favorite Toggle */}
      <Tooltip
        content={isFavorited ? "Remove from favorites" : "Add to favorites"}
      >
        <Button
          size="sm"
          variant="ghost"
          icon={isFavorited ? Star : StarOff}
          onClick={handleToggleFavorite}
          className={isFavorited ? "text-yellow-500" : ""}
        />
      </Tooltip>

      {/* Notifications Toggle */}
      <Tooltip
        content={
          isNotificationsMuted ? "Unmute notifications" : "Mute notifications"
        }
      >
        <Button
          size="sm"
          variant="ghost"
          icon={isNotificationsMuted ? BellOff : Bell}
          onClick={handleToggleNotifications}
          className={isNotificationsMuted ? "text-red-500" : ""}
        />
      </Tooltip>

      {/* More Options */}
      <div className="relative">
        <Tooltip content="More options">
          <Button
            size="sm"
            variant="ghost"
            icon={MoreVertical}
            onClick={() => setShowDropdown(!showDropdown)}
          />
        </Tooltip>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
            <div className="py-1">
              <button
                onClick={handleChatInfo}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <Info className="w-4 h-4" />
                {isChannel ? "Channel info" : "Profile"}
              </button>

              {isChannel && (
                <>
                  <button
                    onClick={handleChatSettings}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Channel settings
                  </button>

                  <button
                    onClick={handleAddMembers}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Add members
                  </button>

                  <hr className="my-1 border-gray-200 dark:border-gray-700" />

                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                    <Pin className="w-4 h-4" />
                    Pin channel
                  </button>

                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                    <Archive className="w-4 h-4" />
                    Archive channel
                  </button>

                  <hr className="my-1 border-gray-200 dark:border-gray-700" />

                  <button className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Delete channel
                  </button>
                </>
              )}

              {isDirect && (
                <>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    Call settings
                  </button>

                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                    <Archive className="w-4 h-4" />
                    Archive conversation
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ======================
  // RENDER MAIN COMPONENT
  // ======================

  if (!currentChat) {
    return (
      <div
        className={`h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-center ${className}`}
      >
        <p className="text-gray-500 dark:text-gray-400">
          Select a conversation to start chatting
        </p>
      </div>
    );
  }

  return (
    <div
      className={`bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 ${className}`}
      onClick={() => setShowDropdown(false)} // Close dropdown when clicking outside
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Side - Chat Info */}
          <div className="flex-1 min-w-0">
            <div className="cursor-pointer" onClick={handleChatInfo}>
              {renderChatTitle()}
              {renderChatSubtitle()}
            </div>
          </div>

          {/* Right Side - Action Buttons */}
          <div onClick={(e) => e.stopPropagation()}>
            {renderActionButtons()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
