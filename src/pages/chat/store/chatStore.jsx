import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

const useChatStore = create(
  subscribeWithSelector((set, get) => ({
    // =====================================
    // UI STATE
    // =====================================
    theme: "light",
    activeModal: null,
    selectedChat: "channel-1", // Set default selected chat
    selectedChatType: "channel", // channel or direct
    sidebarCollapsed: false,
    searchQuery: "",
    isTyping: false,
    activeTabs: "chats", // chats or calls or files

    // =====================================
    // USER DATA
    // =====================================
    currentUser: {
      _id: "user-1",
      name: "John Doe",
      email: "john@example.com",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      status: "online",
      role: "Developer",
      department: "Engineering",
    },

    users: [],
    onlineUsers: new Set(["user-1", "user-2", "user-6", "user-8"]),

    // =====================================
    // CHAT DATA
    // =====================================
    channels: [],
    directMessages: [],
    messages: {}, // {chatId: [messages]}
    drafts: {}, // {chatId: draft text}

    // =====================================
    // REAL TIME STATE
    // =====================================
    typingUsers: {}, // {chatId: [userIds]}
    notifications: [],
    unreadCounts: {}, // {chatId: count}

    // =====================================
    // CALL STATE
    // =====================================
    activeCall: null,
    callHistory: [],
    incomingCall: null,

    // =====================================
    // SEARCH STATE
    // =====================================
    searchResults: [],
    searchFilters: {
      type: "all", // all or messages or channels or users or direct
      dateRange: null,
      sender: null,
    },

    // =====================================
    // FILE STATE
    // =====================================
    uploadingFiles: [],
    recentFiles: [],

    // =====================================
    // SETTINGS STATE
    // =====================================
    settings: {
      notifications: {
        desktop: true,
        sound: true,
        mentions: true,
        directMessages: true,
      },
      appearance: {
        theme: "light",
        fontSize: "medium",
        compact: false,
      },
      privacy: {
        readReceipts: true,
        lastSeen: true,
        profileVisibility: "everyone",
      },
    },

    // =====================================
    // UI ACTIONS
    // =====================================
    setTheme: (theme) => set({ theme }),

    setActiveModal: (modal) => set({ activeModal: modal }),

    setSelectedChat: (chatId, type = "channel") =>
      set({
        selectedChat: chatId,
        selectedChatType: type,
        activeModal: null,
      }),

    setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

    setSearchQuery: (query) => {
      set({ searchQuery: query });
      if (query.trim()) {
        // Trigger search
        get().performSearch(query);
      } else {
        set({ searchResults: [] });
      }
    },

    setActiveTab: (tab) => set({ activeTabs: tab }),

    // =====================================
    // USER ACTIONS
    // =====================================
    setUsers: (users) => set({ users }),

    updateUser: (userId, updates) =>
      set((state) => ({
        users: state.users.map((user) =>
          user._id === userId ? { ...user, ...updates } : user
        ),
      })),

    updateCurrentUser: (updates) =>
      set((state) => ({
        currentUser: { ...state.currentUser, ...updates },
      })),

    setUserOnline: (userId) =>
      set((state) => ({
        onlineUsers: new Set([...state.onlineUsers, userId]),
      })),

    setUserOffline: (userId) =>
      set((state) => {
        const newOnlineUsers = new Set(state.onlineUsers);
        newOnlineUsers.delete(userId);
        return { onlineUsers: newOnlineUsers };
      }),

    // =====================================
    // CHAT ACTIONS
    // =====================================
    setChannels: (channels) => set({ channels }),

    addChannel: (channel) =>
      set((state) => ({
        channels: [...state.channels, channel],
      })),

    updateChannel: (channelId, updates) =>
      set((state) => ({
        channels: state.channels.map((channel) =>
          channel._id === channelId ? { ...channel, ...updates } : channel
        ),
      })),

    removeChannel: (channelId) =>
      set((state) => ({
        channels: state.channels.filter((channel) => channel._id !== channelId),
      })),

    setDirectMessages: (dms) => set({ directMessages: dms }),

    addDirectMessage: (dm) =>
      set((state) => ({
        directMessages: [...state.directMessages, dm],
      })),

    // =====================================
    // MESSAGE ACTIONS - FIXED
    // =====================================
    setMessages: (chatId, messages) =>
      set((state) => ({
        messages: { ...state.messages, [chatId]: messages },
      })),

    addMessage: (chatId, message) =>
      set((state) => {
        const chatMessages = state.messages[chatId] || [];
        const newMessages = {
          ...state.messages,
          [chatId]: [...chatMessages, message],
        };

        // Update last message for the chat
        const updatedChannels = state.channels.map((channel) =>
          channel._id === chatId
            ? {
                ...channel,
                lastMessage: {
                  content: message.content,
                  timestamp: message.timestamp,
                  senderName: message.senderName,
                },
              }
            : channel
        );

        const updatedDirectMessages = state.directMessages.map((dm) =>
          dm._id === chatId
            ? {
                ...dm,
                lastMessage: {
                  content: message.content,
                  timestamp: message.timestamp,
                  senderName: message.senderName,
                },
              }
            : dm
        );

        return {
          messages: newMessages,
          channels: updatedChannels,
          directMessages: updatedDirectMessages,
        };
      }),

    updateMessage: (chatId, messageId, updates) =>
      set((state) => {
        const chatMessages = state.messages[chatId] || [];
        return {
          messages: {
            ...state.messages,
            [chatId]: chatMessages.map((msg) =>
              msg._id === messageId ? { ...msg, ...updates } : msg
            ),
          },
        };
      }),

    deleteMessage: (chatId, messageId) =>
      set((state) => {
        const chatMessages = state.messages[chatId] || [];
        return {
          messages: {
            ...state.messages,
            [chatId]: chatMessages.filter((msg) => msg._id !== messageId),
          },
        };
      }),

    sendMessage: (chatId, content, type = "text", attachments = []) => {
      const state = get();
      const message = {
        _id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content,
        type,
        attachments,
        senderId: state.currentUser._id,
        senderName: state.currentUser.name,
        senderAvatar: state.currentUser.avatar,
        timestamp: new Date().toISOString(),
        reactions: {},
        edited: false,
        replyTo: null,
        status: "sending",
      };

      // Add message immediately
      state.addMessage(chatId, message);

      // Clear draft
      set((state) => ({
        drafts: { ...state.drafts, [chatId]: "" },
      }));

      // Simulate message delivery
      setTimeout(() => {
        state.updateMessage(chatId, message._id, { status: "sent" });
      }, 1000);

      return message;
    },

    // Add reaction to message
    addReaction: (chatId, messageId, emoji) =>
      set((state) => {
        const chatMessages = state.messages[chatId] || [];
        const userId = state.currentUser._id;

        return {
          messages: {
            ...state.messages,
            [chatId]: chatMessages.map((msg) => {
              if (msg._id === messageId) {
                const reactions = { ...msg.reactions };
                if (reactions[emoji]) {
                  if (reactions[emoji].includes(userId)) {
                    reactions[emoji] = reactions[emoji].filter(
                      (id) => id !== userId
                    );
                    if (reactions[emoji].length === 0) delete reactions[emoji];
                  } else {
                    reactions[emoji].push(userId);
                  }
                } else {
                  reactions[emoji] = [userId];
                }
                return { ...msg, reactions };
              }
              return msg;
            }),
          },
        };
      }),

    // =====================================
    // DRAFT ACTIONS
    // =====================================
    setDraft: (chatId, draft) =>
      set((state) => ({
        drafts: { ...state.drafts, [chatId]: draft },
      })),

    getDraft: (chatId) => {
      const state = get();
      return state.drafts[chatId] || "";
    },

    // =====================================
    // TYPING ACTIONS - FIXED
    // =====================================
    setTyping: (chatId, userId, isTyping) =>
      set((state) => {
        const chatTyping = state.typingUsers[chatId] || [];

        if (isTyping) {
          if (!chatTyping.includes(userId)) {
            return {
              typingUsers: {
                ...state.typingUsers,
                [chatId]: [...chatTyping, userId],
              },
            };
          }
        } else {
          return {
            typingUsers: {
              ...state.typingUsers,
              [chatId]: chatTyping.filter((id) => id !== userId),
            },
          };
        }

        return state;
      }),

    clearTyping: (chatId) =>
      set((state) => ({
        typingUsers: { ...state.typingUsers, [chatId]: [] },
      })),

    // =====================================
    // NOTIFICATION ACTIONS
    // =====================================
    addNotification: (notification) =>
      set((state) => ({
        notifications: [
          {
            _id: `notif-${Date.now()}`,
            timestamp: new Date().toISOString(),
            read: false,
            ...notification,
          },
          ...state.notifications,
        ],
      })),

    markNotificationRead: (notificationId) =>
      set((state) => ({
        notifications: state.notifications.map((notif) =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        ),
      })),

    clearNotifications: () => set({ notifications: [] }),

    // =====================================
    // UNREAD COUNT ACTIONS
    // =====================================
    setUnreadCount: (chatId, count) =>
      set((state) => ({
        unreadCounts: {
          ...state.unreadCounts,
          [chatId]: Math.max(0, count),
        },
      })),

    incrementUnreadCount: (chatId) =>
      set((state) => {
        const currentCount = state.unreadCounts[chatId] || 0;
        return {
          unreadCounts: {
            ...state.unreadCounts,
            [chatId]: currentCount + 1,
          },
        };
      }),

    clearUnreadCount: (chatId) =>
      set((state) => ({
        unreadCounts: {
          ...state.unreadCounts,
          [chatId]: 0,
        },
      })),

    // =====================================
    // SEARCH ACTIONS - FIXED
    // =====================================
    performSearch: (query) => {
      const state = get();

      if (!query || !query.trim()) {
        set({ searchResults: [] });
        return;
      }

      const results = [];
      const searchTerm = query.toLowerCase();

      try {
        // Search Messages
        Object.entries(state.messages).forEach(([chatId, messages]) => {
          messages.forEach((message) => {
            if (
              message.content &&
              message.content.toLowerCase().includes(searchTerm)
            ) {
              const isChannel = state.channels.find(
                (channel) => channel._id === chatId
              );
              const chatType = isChannel ? "channel" : "direct";

              results.push({
                type: "message",
                data: {
                  ...message,
                  chatId,
                  chatType,
                },
              });
            }
          });
        });

        // Search Channels
        state.channels.forEach((channel) => {
          if (
            (channel.name && channel.name.toLowerCase().includes(searchTerm)) ||
            (channel.description &&
              channel.description.toLowerCase().includes(searchTerm))
          ) {
            results.push({
              type: "channel",
              data: channel,
            });
          }
        });

        // Search DMs
        state.directMessages.forEach((dm) => {
          if (dm.name && dm.name.toLowerCase().includes(searchTerm)) {
            results.push({
              type: "direct",
              data: dm,
            });
          }
        });

        // Search Users
        state.users.forEach((user) => {
          if (
            (user.name && user.name.toLowerCase().includes(searchTerm)) ||
            (user.email && user.email.toLowerCase().includes(searchTerm))
          ) {
            results.push({
              type: "user",
              data: user,
            });
          }
        });

        set({ searchResults: results });
      } catch (error) {
        console.error("Search failed:", error);
        set({ searchResults: [] });
      }
    },

    setSearchFilter: (filter, value) =>
      set((state) => ({
        searchFilters: { ...state.searchFilters, [filter]: value },
      })),

    // =====================================
    // CALL ACTIONS - FIXED
    // =====================================
    startCall: (targetUserId, type = "voice") => {
      const state = get();
      const call = {
        _id: `call-${Date.now()}`,
        type,
        participants: [state.currentUser._id, targetUserId],
        startTime: new Date().toISOString(),
        status: "connecting",
      };

      set({ activeCall: call });
      return call;
    },

    endCall: () => {
      const state = get();
      if (state.activeCall) {
        const endedCall = {
          ...state.activeCall,
          endTime: new Date().toISOString(),
          status: "ended",
        };

        set({
          activeCall: null,
          callHistory: [endedCall, ...state.callHistory],
        });
      }
    },

    setIncomingCall: (call) => set({ incomingCall: call }),

    // =====================================
    // FILE ACTIONS - FIXED
    // =====================================
    addUploadingFile: (file) =>
      set((state) => ({
        uploadingFiles: [
          ...state.uploadingFiles,
          {
            _id: `upload-${Date.now()}`,
            ...file,
            progress: 0,
            status: "uploading",
          },
        ],
      })),

    updateFileUpload: (fileId, updates) =>
      set((state) => ({
        uploadingFiles: state.uploadingFiles.map((upload) =>
          upload._id === fileId ? { ...upload, ...updates } : upload
        ),
      })),

    removeUploadingFile: (fileId) =>
      set((state) => ({
        uploadingFiles: state.uploadingFiles.filter(
          (upload) => upload._id !== fileId
        ),
      })),

    // =====================================
    // SETTINGS ACTIONS
    // =====================================
    updateSettings: (section, updates) =>
      set((state) => ({
        settings: {
          ...state.settings,
          [section]: { ...state.settings[section], ...updates },
        },
      })),

    // =====================================
    // UTILITY ACTIONS
    // =====================================
    updateChatLastMessage: (chatId, message) => {
      // This is now handled in addMessage
    },

    // Reset store (for logout)
    reset: () =>
      set({
        selectedChat: null,
        selectedChatType: "channel",
        activeModal: null,
        searchQuery: "",
        searchResults: [],
        messages: {},
        drafts: {},
        typingUsers: {},
        notifications: [],
        unreadCounts: {},
        activeCall: null,
        incomingCall: null,
        uploadingFiles: [],
      }),
  }))
);

export default useChatStore;
