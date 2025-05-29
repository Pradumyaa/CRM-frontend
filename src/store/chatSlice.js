import { create } from "zustand";
import { io } from "socket.io-client";
import axios from "axios";

// Create axios instance with interceptors for auth
const createAuthenticatedAxios = () => {
  const axiosInstance = axios.create({
    baseURL: "https://getmax-backend.vercel.app",
  });

  // Request interceptor to add auth token
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle auth errors
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("token");
        localStorage.removeItem("employeeId");
        window.location.href = "/login"; // Redirect to login
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

const api = createAuthenticatedAxios();

// Initialize Socket.IO client with auth token
const initializeSocket = () => {
  const token = localStorage.getItem("token");

  return io("https://getmax-backend.vercel.app", {
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    autoConnect: true,
    auth: {
      token: token,
    },
    query: {
      token: token,
    },
  });
};

let socket = null;

const useChatStore = create((set, get) => ({
  employeeId: null,
  userInfo: null, // Store complete user info
  activeTab: "direct", // 'direct' or 'channels'
  employees: [],
  channels: [],
  selectedChat: null,
  messages: {},
  loading: false,
  error: null,
  socketConnected: false,

  // Check authentication status
  checkAuth: () => {
    const token = localStorage.getItem("token");
    const employeeId = localStorage.getItem("employeeId");

    if (!token || !employeeId) {
      console.log("No authentication found");
      return false;
    }

    try {
      // Basic token validation (you might want to decode and check expiry)
      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;

      if (tokenPayload.exp < currentTime) {
        console.log("Token expired");
        localStorage.removeItem("token");
        localStorage.removeItem("employeeId");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Token validation error:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("employeeId");
      return false;
    }
  },

  // Improved initialization function
  initialize: async () => {
    try {
      set({ loading: true, error: null });

      // Check authentication first
      if (!get().checkAuth()) {
        throw new Error("Authentication required. Please login.");
      }

      // Retrieve employeeId from localStorage
      const storedEmployeeId = localStorage.getItem("employeeId");
      console.log("Retrieved employeeId from localStorage:", storedEmployeeId);

      if (!storedEmployeeId) {
        throw new Error("No employeeId found in localStorage");
      }

      // Set the employeeId first
      set({ employeeId: storedEmployeeId });

      // Initialize socket with auth
      socket = initializeSocket();

      // Load user info, employees and channels in parallel
      await Promise.all([
        get().fetchUserInfo(),
        get().fetchEmployees(),
        get().fetchChannels(),
      ]);

      // Set up socket listeners
      get().setupSocketListeners();

      // Finally mark as initialized
      set({ loading: false });
      console.log("Chat store initialized successfully");
    } catch (error) {
      console.error("Failed to initialize chat store:", error);
      set({ error: error.message, loading: false });

      // If auth error, redirect to login
      if (
        error.message.includes("Authentication") ||
        error.message.includes("Token")
      ) {
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    }
  },

  // Fetch current user info
  fetchUserInfo: async () => {
    try {
      const employeeId = get().employeeId;
      if (!employeeId) {
        throw new Error("Employee ID not found");
      }

      const response = await api.get(`/api/employees/${employeeId}`);
      console.log("User info response:", response.data);

      const userInfo = response.data.success
        ? response.data.data
        : response.data;
      set({ userInfo });
      return userInfo;
    } catch (error) {
      console.error("Error fetching user info:", error);
      set({ error: "Failed to fetch user information" });
      return null;
    }
  },

  // Fetch employees from API with authentication
  fetchEmployees: async () => {
    try {
      const response = await api.get("/api/employees");
      console.log("Employees API Response:", response.data);

      let employeesArray;

      // Handle different response formats
      if (response.data.success && Array.isArray(response.data.data)) {
        employeesArray = response.data.data;
      } else if (Array.isArray(response.data)) {
        employeesArray = response.data;
      } else if (response.data && Array.isArray(response.data.employees)) {
        employeesArray = response.data.employees;
      } else if (response.data && typeof response.data === "object") {
        employeesArray = [response.data];
      } else {
        employeesArray = [];
      }

      // Ensure each employee has a consistent ID
      employeesArray = employeesArray.map((emp) => ({
        ...emp,
        _id: emp._id || emp.id || emp.employeeId,
        id: emp._id || emp.id || emp.employeeId,
      }));

      console.log("Processed employees array:", employeesArray);
      set({ employees: employeesArray });
      return employeesArray;
    } catch (error) {
      console.error("Error fetching employees:", error);

      if (error.response?.status === 401) {
        set({ error: "Authentication failed. Please login again." });
      } else {
        set({ error: "Failed to fetch employees" });
      }

      set({ employees: [] });
      return [];
    }
  },

  // Fetch channels from API with authentication
  fetchChannels: async () => {
    try {
      const response = await api.get("/api/channels");
      console.log("Channels API Response:", response.data);

      let channelsArray;

      // Handle different response formats
      if (response.data.success && Array.isArray(response.data.data)) {
        channelsArray = response.data.data;
      } else if (Array.isArray(response.data)) {
        channelsArray = response.data;
      } else if (response.data?.channels) {
        channelsArray = response.data.channels;
      } else {
        channelsArray = [];
      }

      // Normalize channel objects
      const normalizedChannels = channelsArray.map((ch) => ({
        ...ch,
        _id: ch._id || ch.id,
        id: ch._id || ch.id,
      }));

      set({ channels: normalizedChannels });
      return normalizedChannels;
    } catch (error) {
      console.error("Error fetching channels:", error);

      if (error.response?.status === 401) {
        set({ error: "Authentication failed. Please login again." });
      } else {
        set({ error: "Failed to fetch channels" });
      }

      set({ channels: [] });
      return [];
    }
  },

  // Fetch messages for a specific chat with authentication
  fetchMessages: async (chatId) => {
    if (!chatId) {
      console.error("Cannot fetch messages: chatId is undefined");
      return;
    }

    try {
      set({ loading: true });
      console.log(`Fetching messages for chat: ${chatId}`);

      const response = await api.get(`/api/chats/${chatId}/messages`);
      console.log(`Messages received for ${chatId}:`, response.data);

      // Handle different response formats
      let messagesArray;
      if (response.data.success && Array.isArray(response.data.data)) {
        messagesArray = response.data.data;
      } else if (response.data.messages) {
        messagesArray = response.data.messages;
      } else if (Array.isArray(response.data)) {
        messagesArray = response.data;
      } else {
        messagesArray = [];
      }

      // Normalize message format
      const normalizedMessages = messagesArray.map((msg) => ({
        id:
          msg.id ||
          msg._id ||
          `server-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        senderId: msg.senderId || msg.sender,
        text: msg.text || msg.message,
        timestamp: msg.timestamp || Date.now(),
        senderName: msg.senderName,
        deleted: !!msg.deleted,
      }));

      // Sort messages by timestamp
      normalizedMessages.sort((a, b) => a.timestamp - b.timestamp);

      set((state) => ({
        messages: {
          ...state.messages,
          [chatId]: normalizedMessages,
        },
        loading: false,
      }));

      return normalizedMessages;
    } catch (error) {
      console.error(`Error fetching messages for ${chatId}:`, error);

      if (error.response?.status === 401) {
        set({
          error: "Authentication failed. Please login again.",
          loading: false,
        });
      } else {
        set({ error: "Failed to fetch messages", loading: false });
      }

      return [];
    }
  },

  // Set active tab
  setActiveTab: (tab) => {
    set({ activeTab: tab });

    // Clear selected chat when changing tabs to prevent confusion
    set({ selectedChat: null });
  },

  // Select a chat and join the Socket.IO room
  selectChat: (chatId) => {
    // Don't process if no change
    if (chatId === get().selectedChat) return;

    // Leave previous chat if any
    const prevChat = get().selectedChat;
    const employeeId = get().employeeId;
    const activeTab = get().activeTab;

    if (prevChat && socket) {
      const prevChatId =
        activeTab === "direct"
          ? [employeeId, prevChat].sort().join("_")
          : prevChat;

      console.log(`Leaving chat: ${prevChatId}`);
      socket.emit("leave_chat", prevChatId);
    }

    // Set new selected chat
    set({ selectedChat: chatId });

    if (!chatId || !socket) return;

    // Determine the actual chat ID based on chat type
    const actualChatId =
      activeTab === "direct" ? [employeeId, chatId].sort().join("_") : chatId;

    // Join new chat room
    console.log(`Joining chat: ${actualChatId}`);
    socket.emit("join_chat", actualChatId);

    // Fetch messages for the selected chat
    get().fetchMessages(actualChatId);
  },

  // Send a message
  sendMessage: (text) => {
    if (!text.trim()) {
      console.error("Cannot send empty message");
      return;
    }

    if (!socket || !socket.connected) {
      console.error("Socket not connected");
      set({ error: "Connection lost. Please refresh the page." });
      return;
    }

    const employeeId = get().employeeId;
    const selectedChat = get().selectedChat;
    const activeTab = get().activeTab;
    const employees = get().employees;
    const userInfo = get().userInfo;

    if (!employeeId) {
      console.error("Cannot send message: Missing employeeId");
      return;
    }

    if (!selectedChat) {
      console.error("Cannot send message: No chat selected");
      return;
    }

    // Get sender name from userInfo or employees
    const senderName =
      userInfo?.name ||
      employees.find((emp) => emp._id === employeeId || emp.id === employeeId)
        ?.name ||
      "Unknown";

    if (activeTab === "direct") {
      // For direct messages
      const chatId = [employeeId, selectedChat].sort().join("_");

      const messageData = {
        senderId: employeeId,
        receiverId: selectedChat,
        text,
        timestamp: Date.now(),
        senderName,
      };

      console.log("Sending direct message:", messageData);
      socket.emit("sendMessage", messageData);

      // Optimistically update UI
      const newMessage = {
        id: `temp-${Date.now()}`,
        ...messageData,
      };

      set((state) => {
        const existingMessages = state.messages[chatId] || [];
        return {
          messages: {
            ...state.messages,
            [chatId]: [...existingMessages, newMessage],
          },
        };
      });
    } else {
      // For channel messages
      const messageData = {
        chatId: selectedChat,
        message: text,
        senderId: employeeId,
        senderName,
        timestamp: Date.now(),
      };

      console.log("Sending channel message:", messageData);
      socket.emit("send_message", messageData);

      // Optimistically update UI
      const newMessage = {
        id: `temp-${Date.now()}`,
        text: messageData.message,
        senderId: messageData.senderId,
        senderName: messageData.senderName,
        timestamp: messageData.timestamp,
      };

      set((state) => {
        const existingMessages = state.messages[selectedChat] || [];
        return {
          messages: {
            ...state.messages,
            [selectedChat]: [...existingMessages, newMessage],
          },
        };
      });
    }
  },

  // Delete a message
  deleteMessage: (chatId, messageId) => {
    if (!chatId || !messageId) {
      console.error("Cannot delete message: Missing chatId or messageId");
      return;
    }

    if (!socket || !socket.connected) {
      console.error("Socket not connected");
      return;
    }

    console.log(`Deleting message: ${messageId} in chat: ${chatId}`);
    socket.emit("deleteMessage", { chatId, messageId });

    // Optimistically update UI
    set((state) => {
      const chatMessages = state.messages[chatId] || [];
      const updatedMessages = chatMessages.map((msg) =>
        msg.id === messageId ? { ...msg, deleted: true } : msg
      );

      return {
        messages: {
          ...state.messages,
          [chatId]: updatedMessages,
        },
      };
    });
  },

  // Set up socket listeners
  setupSocketListeners: () => {
    if (!socket) {
      console.error("Socket not initialized");
      return;
    }

    const employeeId = get().employeeId;

    if (!employeeId) {
      console.error("Cannot set up socket listeners: Missing employeeId");
      return;
    }

    // Remove existing listeners to prevent duplicates
    socket.removeAllListeners();

    // Connection status listeners
    socket.on("connect", () => {
      console.log("Socket connected");
      set({ socketConnected: true, error: null });
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      set({ socketConnected: false });
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      set({ socketConnected: false, error: "Connection failed" });
    });

    // Handle authentication errors
    socket.on("auth_error", (error) => {
      console.error("Socket auth error:", error);
      set({ error: "Authentication failed. Please login again." });
      localStorage.removeItem("token");
      localStorage.removeItem("employeeId");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    });

    // Handle incoming messages (new format)
    socket.on("receive_message", (message) => {
      console.log("Received message:", message);

      // Normalize message format
      const normalizedMessage = {
        id:
          message.id ||
          `server-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        senderId: message.senderId || message.sender,
        text: message.text || message.message,
        receiverId: message.receiverId,
        timestamp: message.timestamp || Date.now(),
        senderName: message.senderName,
        deleted: !!message.deleted,
      };

      // Determine chat ID
      let chatId;

      if (message.chatId) {
        // Channel message
        chatId = message.chatId;
      } else {
        // Direct message - ensure consistent order
        chatId = [
          normalizedMessage.senderId,
          normalizedMessage.receiverId || employeeId,
        ]
          .sort()
          .join("_");
      }

      // Update state with new message (avoid duplicates)
      set((state) => {
        const chatMessages = state.messages[chatId] || [];

        // Check for duplicates by ID or content+timestamp
        const isDuplicate = chatMessages.some(
          (msg) =>
            (msg.id && msg.id === normalizedMessage.id) ||
            (msg.timestamp === normalizedMessage.timestamp &&
              msg.senderId === normalizedMessage.senderId &&
              msg.text === normalizedMessage.text)
        );

        if (isDuplicate) {
          console.log("Duplicate message detected, skipping");
          return state;
        }

        return {
          messages: {
            ...state.messages,
            [chatId]: [...chatMessages, normalizedMessage],
          },
        };
      });
    });

    // Handle message deletion
    socket.on("message_deleted", ({ chatId, messageId }) => {
      console.log(`Message ${messageId} deleted in chat ${chatId}`);

      set((state) => {
        const chatMessages = state.messages[chatId] || [];
        const updatedMessages = chatMessages.map((msg) =>
          msg.id === messageId ? { ...msg, deleted: true } : msg
        );

        return {
          messages: {
            ...state.messages,
            [chatId]: updatedMessages,
          },
        };
      });
    });

    console.log("Socket listeners set up successfully");
  },

  // Logout function
  logout: () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("employeeId");

    // Cleanup socket
    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
      socket = null;
    }

    // Reset store state
    set({
      employeeId: null,
      userInfo: null,
      employees: [],
      channels: [],
      selectedChat: null,
      messages: {},
      loading: false,
      error: null,
      socketConnected: false,
      activeTab: "direct",
    });

    // Redirect to login
    window.location.href = "/login";
  },

  // Cleanup function for unmounting
  cleanup: () => {
    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
      socket = null;
    }
  },
}));

export default useChatStore;
