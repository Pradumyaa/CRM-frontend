// src/pages/chat/components/Chat/ChatSidebar.jsx
import React, { useState, useMemo, useCallback } from "react";
import {
  Hash,
  Plus,
  Search,
  Settings,
  User,
  MessageSquare,
  Phone,
  Video,
  Bell,
  BellOff,
  Star,
  Archive,
  Users,
  MoreHorizontal,
  Filter,
  X,
  Clock,
} from "lucide-react";
import Button from "../UI/Button";
import Avatar from "../UI/Avatar";
import Tooltip from "../UI/Tooltip";
import { ThemeToggle } from "../UI/ThemeProvider";
import LoadingSpinner from "../UI/LoadingSpinner";
import useChatStore from "../../store/chatStore";
import useChat from "../../hooks/useChat";
import {
  formatRelativeTime,
  formatUserName,
  filterBySearch,
} from "../../utils/helper";
import { CHAT_TYPES, MODAL_TYPES } from "../../utils/constants";

const ChatSidebar = ({
  className = "",
  collapsed = false,
  onToggleCollapsed = () => {},
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("chats"); // 'chats' | 'calls' | 'files'
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const {
    channels,
    directMessages,
    users,
    currentUser,
    selectedChat,
    selectedChatType,
    onlineUsers,
    unreadCounts,
    setActiveModal,
    callHistory,
    recentFiles,
  } = useChatStore();

  const {
    selectChat,
    getChatPreview,
    getChatTimestamp,
    getUnreadCount,
    hasUnreadMessages,
    isUserOnline,
    chatStats,
  } = useChat();

  // ======================
  // COMPUTED VALUES
  // ======================

  const filteredChannels = useMemo(() => {
    return filterBySearch(channels, searchQuery, ["name", "description"]);
  }, [channels, searchQuery]);

  const filteredDirectMessages = useMemo(() => {
    let dms = directMessages;

    if (showOnlineOnly) {
      dms = dms.filter((dm) =>
        dm.participants.some(
          (participantId) =>
            participantId !== currentUser?._id && isUserOnline(participantId)
        )
      );
    }

    return filterBySearch(dms, searchQuery, ["name"]);
  }, [directMessages, searchQuery, showOnlineOnly, currentUser, isUserOnline]);

  const recentCalls = useMemo(() => {
    return callHistory.slice(0, 10);
  }, [callHistory]);

  const recentFilesList = useMemo(() => {
    return recentFiles.slice(0, 10);
  }, [recentFiles]);

  // ======================
  // EVENT HANDLERS
  // ======================

  const handleChatSelect = useCallback(
    (chatId, chatType) => {
      selectChat(chatId, chatType);
    },
    [selectChat]
  );

  const handleCreateChannel = useCallback(() => {
    setActiveModal(MODAL_TYPES.CHANNEL_CREATE);
  }, [setActiveModal]);

  const handleCreateDM = useCallback(() => {
    // This would typically open a user selector modal
    console.log("Create new DM");
  }, []);

  const handleUserProfileClick = useCallback(() => {
    setActiveModal(MODAL_TYPES.USER_PROFILE);
  }, [setActiveModal]);

  const handleNotificationsClick = useCallback(() => {
    setActiveModal(MODAL_TYPES.NOTIFICATIONS);
  }, [setActiveModal]);

  const handleSearchClick = useCallback(() => {
    setActiveModal(MODAL_TYPES.SEARCH);
  }, [setActiveModal]);

  // ======================
  // RENDER HELPERS
  // ======================

  const renderChannelItem = (channel) => {
    const isSelected =
      selectedChat === channel._id && selectedChatType === CHAT_TYPES.CHANNEL;
    const unreadCount = getUnreadCount(channel._id);
    const hasUnread = hasUnreadMessages(channel._id);

    return (
      <div
        key={channel._id}
        onClick={() => handleChatSelect(channel._id, CHAT_TYPES.CHANNEL)}
        className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
          isSelected
            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
            : "hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
      >
        {/* Channel Icon */}
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isSelected ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
          }`}
        >
          <Hash
            className={`w-4 h-4 ${
              isSelected ? "text-white" : "text-gray-600 dark:text-gray-400"
            }`}
          />
        </div>

        {/* Channel Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span
              className={`font-medium text-sm truncate ${
                hasUnread
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {channel.name}
            </span>
            {unreadCount > 0 && (
              <span className="bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <p
              className={`text-xs truncate ${
                hasUnread
                  ? "text-gray-600 dark:text-gray-300 font-medium"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {getChatPreview(channel, CHAT_TYPES.CHANNEL)}
            </p>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {getChatTimestamp(channel)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderDirectMessageItem = (dm) => {
    const isSelected =
      selectedChat === dm._id && selectedChatType === CHAT_TYPES.DIRECT;
    const unreadCount = getUnreadCount(dm._id);
    const hasUnread = hasUnreadMessages(dm._id);
    const otherParticipant = users.find(
      (u) => dm.participants.includes(u._id) && u._id !== currentUser?._id
    );

    return (
      <div
        key={dm._id}
        onClick={() => handleChatSelect(dm._id, CHAT_TYPES.DIRECT)}
        className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
          isSelected
            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
            : "hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
      >
        {/* User Avatar */}
        <Avatar
          src={otherParticipant?.avatar}
          alt={otherParticipant?.name}
          size="sm"
          status={otherParticipant?.status}
          showStatus={true}
        />

        {/* DM Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span
              className={`font-medium text-sm truncate ${
                hasUnread
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {formatUserName(otherParticipant)}
            </span>
            {unreadCount > 0 && (
              <span className="bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <p
              className={`text-xs truncate ${
                hasUnread
                  ? "text-gray-600 dark:text-gray-300 font-medium"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {getChatPreview(dm, CHAT_TYPES.DIRECT)}
            </p>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {getChatTimestamp(dm)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderCallItem = (call) => {
    const participant = users.find(
      (u) => u._id === call.participants.find((id) => id !== currentUser?._id)
    );
    const isVideoCall = call.type === "video";
    const isMissed = call.status === "missed";

    return (
      <div
        key={call._id}
        className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors"
      >
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isMissed
              ? "bg-red-100 dark:bg-red-900/30"
              : "bg-green-100 dark:bg-green-900/30"
          }`}
        >
          {isVideoCall ? (
            <Video
              className={`w-4 h-4 ${
                isMissed ? "text-red-600" : "text-green-600"
              }`}
            />
          ) : (
            <Phone
              className={`w-4 h-4 ${
                isMissed ? "text-red-600" : "text-green-600"
              }`}
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <span className="font-medium text-sm text-gray-900 dark:text-white truncate">
            {formatUserName(participant)}
          </span>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{isMissed ? "Missed" : "Completed"}</span>
            <span>•</span>
            <span>{formatRelativeTime(call.endTime || call.startTime)}</span>
            {call.duration && (
              <>
                <span>•</span>
                <span>
                  {Math.floor(call.duration / 60)}m {call.duration % 60}s
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderFileItem = (file) => {
    return (
      <div
        key={file._id}
        className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors"
      >
        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
          <span className="text-xs font-medium text-blue-600">
            {file.name.split(".").pop()?.toUpperCase()}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <span className="font-medium text-sm text-gray-900 dark:text-white truncate">
            {file.name}
          </span>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{file.size}</span>
            <span>•</span>
            <span>in #{file.chatName}</span>
            <span>•</span>
            <span>{formatRelativeTime(file.timestamp)}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "chats":
        return (
          <div className="space-y-6">
            {/* Channels Section */}
            <div>
              <div className="flex items-center justify-between mb-3 px-2">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Channels ({filteredChannels.length})
                </h3>
                <Button
                  size="xs"
                  variant="ghost"
                  icon={Plus}
                  onClick={handleCreateChannel}
                  className="opacity-60 hover:opacity-100"
                />
              </div>
              <div className="space-y-1">
                {filteredChannels.map(renderChannelItem)}
                {filteredChannels.length === 0 && searchQuery && (
                  <p className="text-xs text-gray-500 text-center py-4">
                    No channels found
                  </p>
                )}
              </div>
            </div>

            {/* Direct Messages Section */}
            <div>
              <div className="flex items-center justify-between mb-3 px-2">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Direct Messages ({filteredDirectMessages.length})
                </h3>
                <div className="flex items-center gap-1">
                  <Tooltip
                    content={
                      showOnlineOnly ? "Show all users" : "Show online only"
                    }
                  >
                    <Button
                      size="xs"
                      variant="ghost"
                      icon={Users}
                      onClick={() => setShowOnlineOnly(!showOnlineOnly)}
                      className={`opacity-60 hover:opacity-100 ${
                        showOnlineOnly ? "text-green-600" : ""
                      }`}
                    />
                  </Tooltip>
                  <Button
                    size="xs"
                    variant="ghost"
                    icon={Plus}
                    onClick={handleCreateDM}
                    className="opacity-60 hover:opacity-100"
                  />
                </div>
              </div>
              <div className="space-y-1">
                {filteredDirectMessages.map(renderDirectMessageItem)}
                {filteredDirectMessages.length === 0 && searchQuery && (
                  <p className="text-xs text-gray-500 text-center py-4">
                    No conversations found
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case "calls":
        return (
          <div className="space-y-1">
            {recentCalls.map(renderCallItem)}
            {recentCalls.length === 0 && (
              <div className="text-center py-8">
                <Phone className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No recent calls</p>
              </div>
            )}
          </div>
        );

      case "files":
        return (
          <div className="space-y-1">
            {recentFilesList.map(renderFileItem)}
            {recentFilesList.length === 0 && (
              <div className="text-center py-8">
                <Archive className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No recent files</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // ======================
  // RENDER MAIN COMPONENT
  // ======================

  if (collapsed) {
    return (
      <div
        className={`w-16 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col ${className}`}
      >
        {/* Collapsed Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <Button
            size="sm"
            variant="ghost"
            onClick={onToggleCollapsed}
            className="w-full"
          >
            💬
          </Button>
        </div>

        {/* Collapsed Navigation */}
        <div className="flex-1 p-2 space-y-2">
          <Tooltip content="Chats" position="right">
            <Button
              size="sm"
              variant={activeTab === "chats" ? "primary" : "ghost"}
              icon={MessageSquare}
              onClick={() => setActiveTab("chats")}
              className="w-full"
            />
          </Tooltip>

          <Tooltip content="Calls" position="right">
            <Button
              size="sm"
              variant={activeTab === "calls" ? "primary" : "ghost"}
              icon={Phone}
              onClick={() => setActiveTab("calls")}
              className="w-full"
            />
          </Tooltip>

          <Tooltip content="Files" position="right">
            <Button
              size="sm"
              variant={activeTab === "files" ? "primary" : "ghost"}
              icon={Archive}
              onClick={() => setActiveTab("files")}
              className="w-full"
            />
          </Tooltip>
        </div>

        {/* Collapsed User Menu */}
        <div className="p-2 border-t border-gray-200 dark:border-gray-700">
          <Tooltip content="Profile" position="right">
            <Avatar
              src={currentUser?.avatar}
              alt={currentUser?.name}
              size="sm"
              status={currentUser?.status}
              onClick={handleUserProfileClick}
              className="cursor-pointer"
            />
          </Tooltip>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Chat
          </h1>
          <div className="flex items-center gap-2">
            <Tooltip content="Search">
              <Button
                size="sm"
                variant="ghost"
                icon={Search}
                onClick={handleSearchClick}
              />
            </Tooltip>
            <Tooltip content="Notifications">
              <Button
                size="sm"
                variant="ghost"
                icon={Bell}
                onClick={handleNotificationsClick}
                className="relative"
              >
                {chatStats.hasUnread && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                )}
              </Button>
            </Tooltip>
            <Button size="sm" variant="ghost" onClick={onToggleCollapsed}>
              ←
            </Button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchQuery && (
            <Button
              size="xs"
              variant="ghost"
              icon={X}
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            />
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {[
          {
            id: "chats",
            label: "Chats",
            icon: MessageSquare,
            count: chatStats.totalChats,
          },
          {
            id: "calls",
            label: "Calls",
            icon: Phone,
            count: recentCalls.length,
          },
          {
            id: "files",
            label: "Files",
            icon: Archive,
            count: recentFilesList.length,
          },
        ].map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full px-1.5 py-0.5">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">{renderTabContent()}</div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors flex-1"
            onClick={handleUserProfileClick}
          >
            <Avatar
              src={currentUser?.avatar}
              alt={currentUser?.name}
              size="sm"
              status={currentUser?.status}
              showStatus={true}
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                {formatUserName(currentUser)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {currentUser?.role || currentUser?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <ThemeToggle variant="ghost" size="sm" />
            <Tooltip content="Settings">
              <Button
                size="sm"
                variant="ghost"
                icon={Settings}
                onClick={() => setActiveModal(MODAL_TYPES.USER_SETTINGS)}
              />
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
