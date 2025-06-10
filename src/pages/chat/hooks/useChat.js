// src/pages/chat/hooks/useChat.js
import { useCallback, useEffect, useMemo } from 'react';
import useChatStore from '../store/chatStore';
import { formatRelativeTime, generateMessagePreview, debounce } from '../utils/helper.js'
import { MESSAGE_TYPES, CHAT_TYPES } from '../utils/constants.js';

/**
 * Main chat hook that combines chat, messages, and typing functionality
 * Replaces multiple separate hooks with one comprehensive solution
 */
const useChat = () => {
    const {
        // State
        selectedChat,
        selectedChatType,
        channels,
        directMessages,
        messages,
        drafts,
        typingUsers,
        currentUser,
        users,
        onlineUsers,
        searchQuery,
        searchResults,

        // Actions
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
    // CURRENT CHAT LOGIC
    // ======================

    const currentChat = useMemo(() => {
        if (!selectedChat) return null;

        if (selectedChatType === CHAT_TYPES.CHANNEL) {
            return channels.find(channel => channel._id === selectedChat);
        } else {
            return directMessages.find(dm => dm._id === selectedChat);
        }
    }, [selectedChat, selectedChatType, channels, directMessages]);

    const currentMessages = useMemo(() => {
        return messages[selectedChat] || [];
    }, [messages, selectedChat]);

    const currentDraft = useMemo(() => {
        return getDraft(selectedChat) || '';
    }, [selectedChat, getDraft]);

    // ======================
    // CHAT ACTIONS
    // ======================

    const selectChat = useCallback((chatId, chatType = CHAT_TYPES.CHANNEL) => {
        // Clear unread count when selecting chat
        clearUnreadCount(chatId);
        setSelectedChat(chatId, chatType);
    }, [setSelectedChat, clearUnreadCount]);

    const sendChatMessage = useCallback(async (content, type = MESSAGE_TYPES.TEXT, attachments = []) => {
        if (!selectedChat || !content.trim()) return null;

        try {
            const message = sendMessage(selectedChat, content.trim(), type, attachments);

            // Scroll to bottom (will be handled by UI components)
            return message;
        } catch (error) {
            console.error('Failed to send message:', error);
            throw error;
        }
    }, [selectedChat, sendMessage]);

    const editMessage = useCallback(async (messageId, newContent) => {
        if (!selectedChat || !newContent.trim()) return;

        try {
            updateMessage(selectedChat, messageId, {
                content: newContent.trim(),
                edited: true,
                editedAt: new Date().toISOString(),
            });
        } catch (error) {
            console.error('Failed to edit message:', error);
            throw error;
        }
    }, [selectedChat, updateMessage]);

    const removeMessage = useCallback(async (messageId) => {
        if (!selectedChat) return;

        try {
            deleteMessage(selectedChat, messageId);
        } catch (error) {
            console.error('Failed to delete message:', error);
            throw error;
        }
    }, [selectedChat, deleteMessage]);

    const replyToMessage = useCallback(async (parentMessageId, content, type = MESSAGE_TYPES.TEXT) => {
        if (!selectedChat || !content.trim()) return null;

        try {
            // Create reply message with reference to parent
            const replyMessage = {
                content: content.trim(),
                type,
                replyTo: parentMessageId,
            };

            return sendChatMessage(replyMessage.content, replyMessage.type, []);
        } catch (error) {
            console.error('Failed to send reply:', error);
            throw error;
        }
    }, [selectedChat, sendChatMessage]);

    // ======================
    // DRAFT MANAGEMENT
    // ======================

    const updateDraft = useCallback((content) => {
        if (selectedChat) {
            setDraft(selectedChat, content);
        }
    }, [selectedChat, setDraft]);

    const clearDraft = useCallback(() => {
        if (selectedChat) {
            setDraft(selectedChat, '');
        }
    }, [selectedChat, setDraft]);

    // ======================
    // TYPING INDICATORS
    // ======================

    const startTyping = useCallback(() => {
        if (selectedChat && currentUser) {
            setTyping(selectedChat, currentUser._id, true);

            // Auto-stop typing after 3 seconds
            setTimeout(() => {
                setTyping(selectedChat, currentUser._id, false);
            }, 3000);
        }
    }, [selectedChat, currentUser, setTyping]);

    const stopTyping = useCallback(() => {
        if (selectedChat && currentUser) {
            setTyping(selectedChat, currentUser._id, false);
        }
    }, [selectedChat, currentUser, setTyping]);

    // Debounced typing indicator
    const debouncedStopTyping = useMemo(
        () => debounce(stopTyping, 2000),
        [stopTyping]
    );

    const handleTyping = useCallback(() => {
        startTyping();
        debouncedStopTyping();
    }, [startTyping, debouncedStopTyping]);

    const currentTypingUsers = useMemo(() => {
        if (!selectedChat) return [];

        const typingUserIds = typingUsers[selectedChat] || [];
        return typingUserIds
            .filter(userId => userId !== currentUser?._id) // Exclude current user
            .map(userId => users.find(user => user._id === userId))
            .filter(Boolean);
    }, [selectedChat, typingUsers, users, currentUser]);

    // ======================
    // MESSAGE UTILITIES
    // ======================

    const getMessageSender = useCallback((message) => {
        return users.find(user => user._id === message.senderId) || {
            _id: message.senderId,
            name: message.senderName || 'Unknown User',
            avatar: message.senderAvatar || null,
        };
    }, [users]);

    const isMessageFromCurrentUser = useCallback((message) => {
        return message.senderId === currentUser?._id;
    }, [currentUser]);

    const canEditMessage = useCallback((message) => {
        // Can only edit own text messages within 5 minutes
        if (!isMessageFromCurrentUser(message)) return false;
        if (message.type !== MESSAGE_TYPES.TEXT) return false;

        const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
        const messageTime = new Date(message.timestamp).getTime();

        return messageTime > fiveMinutesAgo;
    }, [isMessageFromCurrentUser]);

    const canDeleteMessage = useCallback((message) => {
        // Can delete own messages or if user is admin
        return isMessageFromCurrentUser(message);
    }, [isMessageFromCurrentUser]);

    // ======================
    // CHAT LIST UTILITIES
    // ======================

    const getChatPreview = useCallback((chat, chatType) => {
        const lastMessage = chat.lastMessage;
        if (!lastMessage) return 'No messages yet';

        return generateMessagePreview(lastMessage.content, 50);
    }, []);

    const getChatTimestamp = useCallback((chat) => {
        const lastMessage = chat.lastMessage;
        if (!lastMessage) return '';

        return formatRelativeTime(lastMessage.timestamp);
    }, []);

    const getUnreadCount = useCallback((chatId) => {
        return useChatStore.getState().unreadCounts[chatId] || 0;
    }, []);

    const hasUnreadMessages = useCallback((chatId) => {
        return getUnreadCount(chatId) > 0;
    }, [getUnreadCount]);

    // ======================
    // SEARCH FUNCTIONALITY
    // ======================

    const searchMessages = useCallback((query) => {
        setSearchQuery(query);
    }, [setSearchQuery]);

    const clearSearch = useCallback(() => {
        setSearchQuery('');
    }, [setSearchQuery]);

    // ======================
    // ONLINE STATUS
    // ======================

    const isUserOnline = useCallback((userId) => {
        return onlineUsers.has(userId);
    }, [onlineUsers]);

    const getOnlineMembers = useCallback((memberIds = []) => {
        return memberIds.filter(memberId => isUserOnline(memberId));
    }, [isUserOnline]);

    // ======================
    // CHAT STATISTICS
    // ======================

    const chatStats = useMemo(() => {
        const totalChannels = channels.length;
        const totalDirectMessages = directMessages.length;
        const totalUnread = Object.values(useChatStore.getState().unreadCounts)
            .reduce((sum, count) => sum + count, 0);

        return {
            totalChats: totalChannels + totalDirectMessages,
            totalChannels,
            totalDirectMessages,
            totalUnread,
            hasUnread: totalUnread > 0,
        };
    }, [channels.length, directMessages.length]);

    // ======================
    // CLEANUP EFFECTS
    // ======================

    useEffect(() => {
        // Clear typing when component unmounts or chat changes
        return () => {
            if (selectedChat && currentUser) {
                clearTyping(selectedChat);
            }
        };
    }, [selectedChat, currentUser, clearTyping]);

    // ======================
    // RETURN INTERFACE
    // ======================

    return {
        // Current chat state
        currentChat,
        currentMessages,
        currentDraft,
        currentTypingUsers,

        // Chat actions
        selectChat,
        sendChatMessage,
        editMessage,
        removeMessage,
        replyToMessage,

        // Draft management
        updateDraft,
        clearDraft,

        // Typing indicators
        handleTyping,
        startTyping,
        stopTyping,

        // Message utilities
        getMessageSender,
        isMessageFromCurrentUser,
        canEditMessage,
        canDeleteMessage,

        // Chat list utilities
        getChatPreview,
        getChatTimestamp,
        getUnreadCount,
        hasUnreadMessages,

        // Search
        searchMessages,
        clearSearch,
        searchQuery,
        searchResults,

        // Online status
        isUserOnline,
        getOnlineMembers,

        // Statistics
        chatStats,

        // Raw state (for advanced usage)
        selectedChat,
        selectedChatType,
        channels,
        directMessages,
        users,
        currentUser,
        onlineUsers,
    };
};

export default useChat;