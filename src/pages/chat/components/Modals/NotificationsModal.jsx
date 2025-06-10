// src/pages/chat/components/Modals/NotificationsModal.jsx
import React, { useState, useCallback, useMemo } from "react";
import {
  Bell,
  BellOff,
  X,
  Check,
  Trash2,
  MessageSquare,
  AtSign,
  Phone,
  UserPlus,
  AlertTriangle,
  Info,
  Star,
  Filter,
  MoreHorizontal,
  Eye,
  EyeOff,
  Settings,
  Volume2,
  VolumeX,
} from "lucide-react";
import Modal from "../UI/Modal";
import Button from "../UI/Button";
import Avatar from "../UI/Avatar";
import Tooltip from "../UI/Tooltip";
import LoadingSpinner from "../UI/LoadingSpinner";
import useNotifications from "../../hooks/useNotifications";
import useChatStore from "../../store/chatStore";
import useChat from "../../hooks/useChat";
import { formatRelativeTime, formatUserName } from "../../utils/helper";
import {
  NOTIFICATION_TYPES,
  NOTIFICATION_PRIORITY,
} from "../../utils/constants";

const NotificationsModal = ({ isOpen, onClose }) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedNotifications, setSelectedNotifications] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const {
    notifications,
    unreadNotifications,
    notificationStats,
    notificationSettings,
    markAsRead,
    markAllAsRead,
    clearAll,
    removeNotification,
    updateNotificationSettings,
  } = useNotifications();

  const { users, channels, directMessages } = useChatStore();
  const { selectChat } = useChat();

  // ======================
  // COMPUTED VALUES
  // ======================

  const filteredNotifications = useMemo(() => {
    let filtered = notifications;

    switch (activeFilter) {
      case "unread":
        filtered = unreadNotifications;
        break;
      case "mentions":
        filtered = notifications.filter(
          (n) => n.type === NOTIFICATION_TYPES.MENTION
        );
        break;
      case "messages":
        filtered = notifications.filter(
          (n) =>
            n.type === NOTIFICATION_TYPES.MESSAGE ||
            n.type === NOTIFICATION_TYPES.DIRECT_MESSAGE
        );
        break;
      case "calls":
        filtered = notifications.filter(
          (n) =>
            n.type === NOTIFICATION_TYPES.CALL_INCOMING ||
            n.type === NOTIFICATION_TYPES.CALL_MISSED
        );
        break;
      case "system":
        filtered = notifications.filter(
          (n) => n.type === NOTIFICATION_TYPES.SYSTEM
        );
        break;
      default:
        filtered = notifications;
    }

    return filtered.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  }, [notifications, unreadNotifications, activeFilter]);

  const hasSelectedNotifications = selectedNotifications.size > 0;
  const allCurrentPageSelected =
    filteredNotifications.length > 0 &&
    filteredNotifications.every((n) => selectedNotifications.has(n._id));

  // ======================
  // EVENT HANDLERS
  // ======================

  const handleNotificationClick = useCallback(
    (notification) => {
      // Mark as read
      if (!notification.read) {
        markAsRead(notification._id);
      }

      // Navigate to relevant chat if applicable
      if (notification.chatId) {
        const chatType = notification.chatType || "channel";
        selectChat(notification.chatId, chatType);
        onClose();
      }
    },
    [markAsRead, selectChat, onClose]
  );

  const handleSelectNotification = useCallback((notificationId) => {
    setSelectedNotifications((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(notificationId)) {
        newSet.delete(notificationId);
      } else {
        newSet.add(notificationId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (allCurrentPageSelected) {
      setSelectedNotifications(new Set());
    } else {
      setSelectedNotifications(
        new Set(filteredNotifications.map((n) => n._id))
      );
    }
  }, [allCurrentPageSelected, filteredNotifications]);

  const handleMarkSelectedAsRead = useCallback(async () => {
    setIsLoading(true);
    try {
      const promises = Array.from(selectedNotifications).map((id) =>
        markAsRead(id)
      );
      await Promise.all(promises);
      setSelectedNotifications(new Set());
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedNotifications, markAsRead]);

  const handleDeleteSelected = useCallback(async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete the selected notifications?"
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const promises = Array.from(selectedNotifications).map((id) =>
        removeNotification(id)
      );
      await Promise.all(promises);
      setSelectedNotifications(new Set());
    } catch (error) {
      console.error("Failed to delete notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedNotifications, removeNotification]);

  const handleMarkAllAsRead = useCallback(async () => {
    setIsLoading(true);
    try {
      await markAllAsRead();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    } finally {
      setIsLoading(false);
    }
  }, [markAllAsRead]);

  const handleClearAll = useCallback(async () => {
    if (
      !window.confirm(
        "Are you sure you want to clear all notifications? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      await clearAll();
    } catch (error) {
      console.error("Failed to clear notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, [clearAll]);

  // ======================
  // RENDER HELPERS
  // ======================

  const getNotificationIcon = (type) => {
    const iconMap = {
      [NOTIFICATION_TYPES.MESSAGE]: MessageSquare,
      [NOTIFICATION_TYPES.DIRECT_MESSAGE]: MessageSquare,
      [NOTIFICATION_TYPES.MENTION]: AtSign,
      [NOTIFICATION_TYPES.CALL_INCOMING]: Phone,
      [NOTIFICATION_TYPES.CALL_MISSED]: Phone,
      [NOTIFICATION_TYPES.CHANNEL_INVITE]: UserPlus,
      [NOTIFICATION_TYPES.SYSTEM]: Info,
    };
    return iconMap[type] || Bell;
  };

  const getNotificationColor = (type, priority = "normal") => {
    if (priority === "urgent")
      return "text-red-600 bg-red-100 dark:bg-red-900/20";
    if (priority === "high")
      return "text-orange-600 bg-orange-100 dark:bg-orange-900/20";

    const colorMap = {
      [NOTIFICATION_TYPES.MENTION]:
        "text-blue-600 bg-blue-100 dark:bg-blue-900/20",
      [NOTIFICATION_TYPES.CALL_INCOMING]:
        "text-green-600 bg-green-100 dark:bg-green-900/20",
      [NOTIFICATION_TYPES.CALL_MISSED]:
        "text-red-600 bg-red-100 dark:bg-red-900/20",
      [NOTIFICATION_TYPES.SYSTEM]: "text-gray-600 bg-gray-100 dark:bg-gray-700",
    };

    return colorMap[type] || "text-blue-600 bg-blue-100 dark:bg-blue-900/20";
  };

  const renderNotificationItem = (notification) => {
    const IconComponent = getNotificationIcon(notification.type);
    const colorClass = getNotificationColor(
      notification.type,
      notification.priority
    );
    const sender = notification.senderId
      ? users.find((u) => u._id === notification.senderId)
      : null;
    const isSelected = selectedNotifications.has(notification._id);

    return (
      <div
        key={notification._id}
        className={`group relative p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors ${
          !notification.read
            ? "bg-blue-50 dark:bg-blue-900/10"
            : "hover:bg-gray-50 dark:hover:bg-gray-800"
        } ${isSelected ? "bg-blue-100 dark:bg-blue-900/20" : ""}`}
      >
        {/* Selection Checkbox */}
        <div className="absolute top-4 left-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => handleSelectNotification(notification._id)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>

        {/* Notification Content */}
        <div className="ml-8 flex items-start gap-3">
          {/* Icon */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${colorClass}`}
          >
            <IconComponent className="w-4 h-4" />
          </div>

          {/* Sender Avatar */}
          {sender && (
            <Avatar
              src={sender.avatar}
              alt={sender.name}
              size="sm"
              status={sender.status}
            />
          )}

          {/* Content */}
          <div
            className="flex-1 min-w-0 cursor-pointer"
            onClick={() => handleNotificationClick(notification)}
          >
            <div className="flex items-center gap-2 mb-1">
              <h4
                className={`font-medium text-sm ${
                  !notification.read
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {notification.title}
              </h4>

              {!notification.read && (
                <div className="w-2 h-2 bg-blue-600 rounded-full" />
              )}

              {notification.priority === "urgent" && (
                <AlertTriangle className="w-4 h-4 text-red-600" />
              )}
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {notification.message}
            </p>

            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
              <span>{formatRelativeTime(notification.timestamp)}</span>

              {notification.chatId && (
                <>
                  <span>•</span>
                  <span>
                    {notification.chatType === "channel"
                      ? `#${
                          channels.find((c) => c._id === notification.chatId)
                            ?.name || "Unknown"
                        }`
                      : directMessages.find(
                          (dm) => dm._id === notification.chatId
                        )?.name || "Direct Message"}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            {!notification.read && (
              <Tooltip content="Mark as read">
                <Button
                  size="xs"
                  variant="ghost"
                  icon={Check}
                  onClick={(e) => {
                    e.stopPropagation();
                    markAsRead(notification._id);
                  }}
                />
              </Tooltip>
            )}

            <Tooltip content="Remove">
              <Button
                size="xs"
                variant="ghost"
                icon={X}
                onClick={(e) => {
                  e.stopPropagation();
                  removeNotification(notification._id);
                }}
                className="text-red-600 dark:text-red-400"
              />
            </Tooltip>
          </div>
        </div>
      </div>
    );
  };

  const renderFilterButtons = () => {
    const filters = [
      { id: "all", label: "All", count: notificationStats.total },
      { id: "unread", label: "Unread", count: notificationStats.unread },
      {
        id: "mentions",
        label: "Mentions",
        count: notificationStats.byType.mentions || 0,
      },
      {
        id: "messages",
        label: "Messages",
        count:
          (notificationStats.byType.messages || 0) +
          (notificationStats.byType.directMessages || 0),
      },
      {
        id: "calls",
        label: "Calls",
        count: notificationStats.byType.calls || 0,
      },
      {
        id: "system",
        label: "System",
        count: notificationStats.byType.system || 0,
      },
    ];

    return (
      <div className="flex flex-wrap gap-2 mb-4">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeFilter === filter.id
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            {filter.label}
            {filter.count > 0 && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-xs ${
                  activeFilter === filter.id
                    ? "bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200"
                    : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                }`}
              >
                {filter.count}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  };

  const renderBulkActions = () => {
    if (!hasSelectedNotifications) return null;

    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
            {selectedNotifications.size} notification
            {selectedNotifications.size > 1 ? "s" : ""} selected
          </span>

          <div className="flex items-center gap-2">
            <Button
              size="xs"
              variant="outline"
              icon={Check}
              onClick={handleMarkSelectedAsRead}
              loading={isLoading}
            >
              Mark as Read
            </Button>

            <Button
              size="xs"
              variant="outline"
              icon={Trash2}
              onClick={handleDeleteSelected}
              loading={isLoading}
              className="text-red-600 dark:text-red-400"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderNotificationSettings = () => (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
      <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <Settings className="w-4 h-4" />
        Notification Settings
      </h4>

      <div className="grid grid-cols-2 gap-4">
        {[
          { key: "desktop", label: "Desktop notifications", icon: Bell },
          { key: "sound", label: "Sound notifications", icon: Volume2 },
          { key: "mentions", label: "Mention notifications", icon: AtSign },
          {
            key: "directMessages",
            label: "Direct messages",
            icon: MessageSquare,
          },
          { key: "channels", label: "Channel messages", icon: MessageSquare },
          { key: "calls", label: "Call notifications", icon: Phone },
        ].map(({ key, label, icon: IconComponent }) => (
          <label
            key={key}
            className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-2">
              <IconComponent className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {label}
              </span>
            </div>
            <input
              type="checkbox"
              checked={notificationSettings[key] || false}
              onChange={(e) =>
                updateNotificationSettings({ [key]: e.target.checked })
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>
        ))}
      </div>
    </div>
  );

  // ======================
  // RENDER
  // ======================

  const footerContent = (
    <div className="flex justify-between items-center">
      <div className="flex gap-2">
        {filteredNotifications.length > 0 && (
          <Button size="xs" variant="ghost" onClick={handleSelectAll}>
            {allCurrentPageSelected ? "Deselect All" : "Select All"}
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        {notificationStats.unread > 0 && (
          <Button
            size="sm"
            variant="outline"
            icon={Check}
            onClick={handleMarkAllAsRead}
            loading={isLoading}
          >
            Mark All Read
          </Button>
        )}

        {notificationStats.total > 0 && (
          <Button
            size="sm"
            variant="outline"
            icon={Trash2}
            onClick={handleClearAll}
            loading={isLoading}
            className="text-red-600 dark:text-red-400"
          >
            Clear All
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notifications
          {notificationStats.unread > 0 && (
            <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs font-medium">
              {notificationStats.unread}
            </span>
          )}
        </div>
      }
      size="lg"
      footer={footerContent}
      className="max-h-[80vh]"
    >
      {/* Filters */}
      {renderFilterButtons()}

      {/* Bulk Actions */}
      {renderBulkActions()}

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto max-h-96 border border-gray-200 dark:border-gray-700 rounded-lg">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <BellOff className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {activeFilter === "all"
                ? "No notifications"
                : `No ${activeFilter} notifications`}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {activeFilter === "all"
                ? "You're all caught up! No new notifications."
                : `No ${activeFilter} notifications at the moment.`}
            </p>
          </div>
        ) : (
          filteredNotifications.map(renderNotificationItem)
        )}
      </div>

      {/* Settings */}
      {renderNotificationSettings()}
    </Modal>
  );
};

export default NotificationsModal;
