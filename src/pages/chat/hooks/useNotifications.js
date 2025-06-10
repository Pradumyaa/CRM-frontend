// src/pages/chat/hooks/useNotifications.js
import { useEffect, useCallback, useMemo, useState } from 'react';
import useChatStore from '../store/chatStore';
import {
    requestNotificationPermission,
    showDesktopNotification
} from '../utils/helper.js';
import {
    NOTIFICATION_TYPES,
    STORAGE_KEYS,
    SUCCESS_MESSAGES
} from '../utils/constants.js';

/**
 * Comprehensive notification management hook
 * Handles desktop notifications, permission management, and notification state
 */
const useNotifications = () => {
    const [permission, setPermission] = useState(Notification.permission);
    const [soundEnabled, setSoundEnabled] = useState(true);

    const {
        notifications,
        settings,
        currentUser,
        selectedChat,
        messages,
        drafts,
        typingUsers,
        users,
        onlineUsers,
        searchQuery,
        searchResults,
        addNotification,
        markNotificationRead,
        clearNotifications,
        updateSettings,
        setSelectedChat,
        sendMessage,
        addMessage,
        updateMessage,
        deleteMessage,
        setDraft,
        getDraft,
        setTyping,
        clearTyping,
        setSearchQuery,
        performSearch,
        updateChatLastMessage,
        incrementUnreadCount,
        clearUnreadCount,
    } = useChatStore();

    // ======================
    // NOTIFICATION SETTINGS
    // ======================

    const notificationSettings = useMemo(() => {
        return settings.notifications || {
            desktop: true,
            sound: true,
            mentions: true,
            directMessages: true,
            channels: true,
            calls: true,
        };
    }, [settings.notifications]);

    const updateNotificationSettings = useCallback((newSettings) => {
        updateSettings('notifications', newSettings);
    }, [updateSettings]);

    // ======================
    // PERMISSION MANAGEMENT
    // ======================

    const requestPermission = useCallback(async () => {
        try {
            const result = await requestNotificationPermission();
            setPermission(result);

            if (result === 'granted') {
                // Update settings to enable desktop notifications
                updateNotificationSettings({
                    ...notificationSettings,
                    desktop: true,
                });

                // Show success notification
                showDesktopNotification('Notifications Enabled', {
                    body: SUCCESS_MESSAGES.NOTIFICATION_ENABLED,
                    tag: 'permission-granted',
                });
            }

            return result;
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            return 'error';
        }
    }, [notificationSettings, updateNotificationSettings]);

    const isPermissionGranted = useMemo(() => {
        return permission === 'granted';
    }, [permission]);

    const canShowDesktopNotifications = useMemo(() => {
        return isPermissionGranted && notificationSettings.desktop;
    }, [isPermissionGranted, notificationSettings.desktop]);

    // ======================
    // SOUND MANAGEMENT
    // ======================

    const playNotificationSound = useCallback(() => {
        if (!soundEnabled || !notificationSettings.sound) return;

        try {
            // Create audio context for notification sound
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Configure notification sound (gentle beep)
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (error) {
            console.error('Error playing notification sound:', error);
        }
    }, [soundEnabled, notificationSettings.sound]);

    const toggleSound = useCallback(() => {
        setSoundEnabled(prev => !prev);
        updateNotificationSettings({
            ...notificationSettings,
            sound: !soundEnabled,
        });
    }, [soundEnabled, notificationSettings, updateNotificationSettings]);

    // ======================
    // NOTIFICATION CREATION
    // ======================

    const shouldShowNotification = useCallback((type, chatId = null) => {
        // Don't show notification for current chat if it's visible
        if (chatId === selectedChat) {
            // Only show for high priority notifications even in current chat
            return type === NOTIFICATION_TYPES.CALL_INCOMING ||
                type === NOTIFICATION_TYPES.MENTION;
        }

        // Check specific notification type settings
        switch (type) {
            case NOTIFICATION_TYPES.DIRECT_MESSAGE:
                return notificationSettings.directMessages;
            case NOTIFICATION_TYPES.MESSAGE:
                return notificationSettings.channels;
            case NOTIFICATION_TYPES.MENTION:
                return notificationSettings.mentions;
            case NOTIFICATION_TYPES.CALL_INCOMING:
            case NOTIFICATION_TYPES.CALL_MISSED:
                return notificationSettings.calls;
            default:
                return true;
        }
    }, [selectedChat, notificationSettings]);

    const createNotification = useCallback((notificationData) => {
        const { type, title, message, chatId, senderId, priority = 'normal' } = notificationData;

        // Check if we should show this notification
        if (!shouldShowNotification(type, chatId)) {
            return null;
        }

        // Add to internal notification store
        const notification = addNotification({
            type,
            title,
            message,
            chatId,
            senderId,
            priority,
        });

        // Show desktop notification if enabled
        if (canShowDesktopNotifications) {
            const desktopNotification = showDesktopNotification(title, {
                body: message,
                tag: `notification-${notification._id}`,
                icon: '/favicon.ico',
                requireInteraction: priority === 'urgent',
                onClick: () => {
                    // Focus window and navigate to chat
                    window.focus();
                    if (chatId) {
                        // This would be handled by the UI components
                        console.log('Navigate to chat:', chatId);
                    }
                    markNotificationRead(notification._id);
                },
            });

            // Auto-close non-urgent notifications
            if (desktopNotification && priority !== 'urgent') {
                setTimeout(() => {
                    desktopNotification.close();
                }, 5000);
            }
        }

        // Play sound if enabled
        if (notificationSettings.sound) {
            playNotificationSound();
        }

        return notification;
    }, [
        shouldShowNotification,
        addNotification,
        canShowDesktopNotifications,
        markNotificationRead,
        notificationSettings.sound,
        playNotificationSound,
    ]);

    // ======================
    // NOTIFICATION ACTIONS
    // ======================

    const markAsRead = useCallback((notificationId) => {
        markNotificationRead(notificationId);
    }, [markNotificationRead]);

    const markAllAsRead = useCallback(() => {
        notifications.forEach(notification => {
            if (!notification.read) {
                markNotificationRead(notification._id);
            }
        });
    }, [notifications, markNotificationRead]);

    const clearAll = useCallback(() => {
        clearNotifications();
    }, [clearNotifications]);

    const removeNotification = useCallback((notificationId) => {
        // For now, mark as read (in a real app, you might have a separate remove action)
        markAsRead(notificationId);
    }, [markAsRead]);

    // ======================
    // NOTIFICATION HELPERS
    // ======================

    const getNotificationsByType = useCallback((type) => {
        return notifications.filter(notification => notification.type === type);
    }, [notifications]);

    const getUnreadNotifications = useCallback(() => {
        return notifications.filter(notification => !notification.read);
    }, [notifications]);

    const getNotificationCount = useCallback((type = null) => {
        if (type) {
            return getNotificationsByType(type).length;
        }
        return notifications.length;
    }, [notifications, getNotificationsByType]);

    const getUnreadCount = useCallback((type = null) => {
        const unreadNotifications = getUnreadNotifications();
        if (type) {
            return unreadNotifications.filter(notification => notification.type === type).length;
        }
        return unreadNotifications.length;
    }, [getUnreadNotifications]);

    const hasUnreadNotifications = useCallback((type = null) => {
        return getUnreadCount(type) > 0;
    }, [getUnreadCount]);

    // ======================
    // QUICK NOTIFICATION CREATORS
    // ======================

    const notifyNewMessage = useCallback((message, chatId, chatType = 'channel') => {
        const isDirectMessage = chatType === 'direct';
        const type = isDirectMessage ? NOTIFICATION_TYPES.DIRECT_MESSAGE : NOTIFICATION_TYPES.MESSAGE;

        // Check if message contains mentions of current user
        const mentions = message.content.toLowerCase().includes(`@${currentUser?.name.toLowerCase()}`);
        if (mentions) {
            notifyMention(message, chatId);
            return;
        }

        // Increment unread count for the chat
        if (chatId !== selectedChat) {
            incrementUnreadCount(chatId);
        }

        return createNotification({
            type,
            title: isDirectMessage
                ? `New message from ${message.senderName}`
                : `New message in chat`,
            message: message.content.length > 50
                ? message.content.substring(0, 50) + '...'
                : message.content,
            chatId,
            senderId: message.senderId,
            priority: isDirectMessage ? 'high' : 'normal',
        });
    }, [createNotification, currentUser, selectedChat, incrementUnreadCount]);

    const notifyMention = useCallback((message, chatId) => {
        // Increment unread count for mentions
        incrementUnreadCount(chatId);

        return createNotification({
            type: NOTIFICATION_TYPES.MENTION,
            title: `You were mentioned`,
            message: `${message.senderName}: ${message.content.length > 100 ? message.content.substring(0, 100) + '...' : message.content}`,
            chatId,
            senderId: message.senderId,
            priority: 'high',
        });
    }, [createNotification, incrementUnreadCount]);

    const notifyIncomingCall = useCallback((caller, callType = 'voice') => {
        return createNotification({
            type: NOTIFICATION_TYPES.CALL_INCOMING,
            title: `Incoming ${callType} call`,
            message: `${caller.name} is calling you`,
            senderId: caller._id,
            priority: 'urgent',
        });
    }, [createNotification]);

    const notifyMissedCall = useCallback((caller, callType = 'voice') => {
        return createNotification({
            type: NOTIFICATION_TYPES.CALL_MISSED,
            title: `Missed ${callType} call`,
            message: `Missed call from ${caller.name}`,
            senderId: caller._id,
            priority: 'high',
        });
    }, [createNotification]);

    const notifyChannelInvite = useCallback((channel, inviter) => {
        return createNotification({
            type: NOTIFICATION_TYPES.CHANNEL_INVITE,
            title: `Channel invitation`,
            message: `${inviter.name} invited you to join #${channel.name}`,
            chatId: channel._id,
            senderId: inviter._id,
            priority: 'high',
        });
    }, [createNotification]);

    const notifySystem = useCallback((title, message, priority = 'normal') => {
        return createNotification({
            type: NOTIFICATION_TYPES.SYSTEM,
            title,
            message,
            priority,
        });
    }, [createNotification]);

    // ======================
    // NOTIFICATION STATISTICS
    // ======================

    const notificationStats = useMemo(() => {
        const total = notifications.length;
        const unread = getUnreadCount();
        const byType = {
            messages: getNotificationCount(NOTIFICATION_TYPES.MESSAGE),
            directMessages: getNotificationCount(NOTIFICATION_TYPES.DIRECT_MESSAGE),
            mentions: getNotificationCount(NOTIFICATION_TYPES.MENTION),
            calls: getNotificationCount(NOTIFICATION_TYPES.CALL_INCOMING) +
                getNotificationCount(NOTIFICATION_TYPES.CALL_MISSED),
            system: getNotificationCount(NOTIFICATION_TYPES.SYSTEM),
        };

        return {
            total,
            unread,
            byType,
            hasUnread: unread > 0,
        };
    }, [notifications, getUnreadCount, getNotificationCount]);

    // ======================
    // EFFECTS
    // ======================

    // Listen for permission changes
    useEffect(() => {
        const handlePermissionChange = () => {
            setPermission(Notification.permission);
        };

        // Some browsers support permission change events
        if ('permissions' in navigator) {
            navigator.permissions.query({ name: 'notifications' })
                .then(permissionStatus => {
                    permissionStatus.addEventListener('change', handlePermissionChange);
                    return () => {
                        permissionStatus.removeEventListener('change', handlePermissionChange);
                    };
                })
                .catch(() => {
                    // Fallback: check permission periodically
                    const interval = setInterval(() => {
                        if (Notification.permission !== permission) {
                            handlePermissionChange();
                        }
                    }, 1000);

                    return () => clearInterval(interval);
                });
        }
    }, [permission]);

    // Save notification settings to localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.NOTIFICATION_PERMISSION, permission);
    }, [permission]);

    // ======================
    // RETURN INTERFACE
    // ======================

    return {
        // Permission management
        permission,
        isPermissionGranted,
        canShowDesktopNotifications,
        requestPermission,

        // Settings
        notificationSettings,
        updateNotificationSettings,

        // Sound management
        soundEnabled,
        toggleSound,
        playNotificationSound,

        // Notification data
        notifications,
        unreadNotifications: getUnreadNotifications(),
        notificationStats,

        // Notification actions
        markAsRead,
        markAllAsRead,
        clearAll,
        removeNotification,

        // Notification queries
        getNotificationsByType,
        getUnreadNotifications,
        getNotificationCount,
        getUnreadCount,
        hasUnreadNotifications,

        // Quick notification creators
        notifyNewMessage,
        notifyMention,
        notifyIncomingCall,
        notifyMissedCall,
        notifyChannelInvite,
        notifySystem,

        // Custom notification creation
        createNotification,
    };
};

export default useNotifications;