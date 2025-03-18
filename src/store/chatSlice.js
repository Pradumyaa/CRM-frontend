import { create } from "zustand";
import { io } from "socket.io-client";
import axios from "axios";

// Initialize Socket.IO client with proper reconnection options
const socket = io("https://crm-backend-6gcl.onrender.com", {
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  autoConnect: true
});

const useChatStore = create((set, get) => ({
  employeeId: null,
  activeTab: "direct", // 'direct' or 'channels'
  employees: [],
  channels: [],
  selectedChat: null,
  messages: {},
  loading: false,
  error: null,
  socketConnected: false,

  // Improved initialization function
  initialize: async () => {
    try {
      set({ loading: true });

      // Retrieve employeeId from localStorage
      const storedEmployeeId = localStorage.getItem("employeeId");
      console.log("Retrieved employeeId from localStorage:", storedEmployeeId);

      if (!storedEmployeeId) {
        throw new Error("No employeeId found in localStorage");
      }

      // Set the employeeId first
      set({ employeeId: storedEmployeeId });
      
      // Then load employees and channels in parallel
      await Promise.all([
        get().fetchEmployees(),
        get().fetchChannels()
      ]);
      
      // Set up socket listeners
      get().setupSocketListeners();
      
      // Finally mark as initialized
      set({ loading: false });
      console.log("Chat store initialized successfully");
    } catch (error) {
      console.error("Failed to initialize chat store:", error);
      set({ error: error.message, loading: false });
    }
  },

  // Fetch employees from API
  fetchEmployees: async () => {
    try {
      const response = await axios.get("https://crm-backend-6gcl.onrender.com/api/employees");
      console.log("Employees API Response:", response.data);

      let employeesArray;

      // Normalize response format
      if (Array.isArray(response.data)) {
        employeesArray = response.data;
      } else if (response.data && Array.isArray(response.data.employees)) {
        employeesArray = response.data.employees;
      } else if (response.data && typeof response.data === "object") {
        employeesArray = [response.data];
      } else {
        employeesArray = [];
      }

      // Ensure each employee has a consistent ID
      employeesArray = employeesArray.map(emp => ({
        ...emp,
        _id: emp._id || emp.id || emp.employeeId
      }));

      console.log("Processed employees array:", employeesArray);
      set({ employees: employeesArray });
      return employeesArray;
    } catch (error) {
      console.error("Error fetching employees:", error);
      set({ error: "Failed to fetch employees", employees: [] });
      return [];
    }
  },
  
  // Fetch channels from API
  fetchChannels: async () => {
    try {
      const response = await axios.get("https://crm-backend-6gcl.onrender.com/api/channels");
      console.log("Channels API Response:", response.data);
      
      const channelsArray = Array.isArray(response.data) ? 
        response.data : 
        (response.data?.channels || []);
      
      // Normalize channel objects
      const normalizedChannels = channelsArray.map(ch => ({
        ...ch,
        _id: ch._id || ch.id
      }));
      
      set({ channels: normalizedChannels });
      return normalizedChannels;
    } catch (error) {
      console.error("Error fetching channels:", error);
      set({ error: "Failed to fetch channels", channels: [] });
      return [];
    }
  },

  // Fetch messages for a specific chat
  fetchMessages: async (chatId) => {
    if (!chatId) {
      console.error("Cannot fetch messages: chatId is undefined");
      return;
    }
    
    try {
      set({ loading: true });
      console.log(`Fetching messages for chat: ${chatId}`);
      
      const response = await axios.get(`https://crm-backend-6gcl.onrender.com/api/chats/${chatId}/messages`);
      console.log(`Messages received for ${chatId}:`, response.data);
      
      // Normalize message format
      const normalizedMessages = (response.data.messages || []).map(msg => ({
        id: msg.id || msg._id || `server-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        senderId: msg.senderId || msg.sender,
        text: msg.text || msg.message,
        timestamp: msg.timestamp || Date.now(),
        deleted: !!msg.deleted
      }));
      
      // Sort messages by timestamp
      normalizedMessages.sort((a, b) => a.timestamp - b.timestamp);
      
      set(state => ({
        messages: {
          ...state.messages,
          [chatId]: normalizedMessages
        },
        loading: false
      }));
      
      return normalizedMessages;
    } catch (error) {
      console.error(`Error fetching messages for ${chatId}:`, error);
      set({ error: "Failed to fetch messages", loading: false });
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
    
    if (prevChat) {
      const prevChatId = activeTab === "direct" 
        ? [employeeId, prevChat].sort().join('_') 
        : prevChat;
      
      console.log(`Leaving chat: ${prevChatId}`);
      socket.emit("leave_chat", prevChatId);
    }
    
    // Set new selected chat
    set({ selectedChat: chatId });
    
    if (!chatId) return;
    
    // Determine the actual chat ID based on chat type
    const actualChatId = activeTab === "direct" 
      ? [employeeId, chatId].sort().join('_')
      : chatId;
    
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
    
    const employeeId = get().employeeId;
    const selectedChat = get().selectedChat;
    const activeTab = get().activeTab;
    const employees = get().employees;
    
    if (!employeeId) {
      console.error("Cannot send message: Missing employeeId");
      return;
    }
    
    if (!selectedChat) {
      console.error("Cannot send message: No chat selected");
      return;
    }
    
    // Find the current employee to get their name
    const currentEmployee = employees.find(emp => 
      emp._id === employeeId || emp.id === employeeId
    );
    
    const senderName = currentEmployee?.name || "Unknown";
    
    if (activeTab === "direct") {
      // For direct messages
      const chatId = [employeeId, selectedChat].sort().join('_');
      
      const messageData = {
        senderId: employeeId,
        receiverId: selectedChat,
        text,
        timestamp: Date.now()
      };
      
      console.log("Sending direct message:", messageData);
      socket.emit("sendMessage", messageData);
      
      // Optimistically update UI
      const newMessage = {
        id: `temp-${Date.now()}`,
        ...messageData
      };
      
      set(state => {
        const existingMessages = state.messages[chatId] || [];
        return {
          messages: {
            ...state.messages,
            [chatId]: [...existingMessages, newMessage]
          }
        };
      });
    } else {
      // For channel messages
      const messageData = {
        chatId: selectedChat,
        message: text,
        senderId: employeeId,
        senderName,
        timestamp: Date.now()
      };
      
      console.log("Sending channel message:", messageData);
      socket.emit("send_message", messageData);
      
      // Optimistically update UI
      const newMessage = {
        id: `temp-${Date.now()}`,
        text: messageData.message,
        senderId: messageData.senderId,
        senderName: messageData.senderName,
        timestamp: messageData.timestamp
      };
      
      set(state => {
        const existingMessages = state.messages[selectedChat] || [];
        return {
          messages: {
            ...state.messages,
            [selectedChat]: [...existingMessages, newMessage]
          }
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
    
    console.log(`Deleting message: ${messageId} in chat: ${chatId}`);
    socket.emit("deleteMessage", { chatId, messageId });
    
    // Optimistically update UI
    set(state => {
      const chatMessages = state.messages[chatId] || [];
      const updatedMessages = chatMessages.map(msg => 
        msg.id === messageId ? { ...msg, deleted: true } : msg
      );
      
      return {
        messages: {
          ...state.messages,
          [chatId]: updatedMessages
        }
      };
    });
  },

  // Set up socket listeners
  setupSocketListeners: () => {
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
      set({ socketConnected: true });
    });
    
    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      set({ socketConnected: false });
    });
    
    // Handle incoming messages (new format)
    socket.on("receive_message", (message) => {
      console.log("Received message:", message);
      
      // Normalize message format
      const normalizedMessage = {
        id: message.id || `server-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        senderId: message.senderId || message.sender,
        text: message.text || message.message,
        receiverId: message.receiverId,
        timestamp: message.timestamp || Date.now(),
        senderName: message.senderName,
        deleted: !!message.deleted
      };
      
      // Determine chat ID
      let chatId;
      
      if (message.chatId) {
        // Channel message
        chatId = message.chatId;
      } else {
        // Direct message - ensure consistent order
        chatId = [normalizedMessage.senderId, normalizedMessage.receiverId || employeeId]
          .sort()
          .join('_');
      }
      
      // Update state with new message (avoid duplicates)
      set(state => {
        const chatMessages = state.messages[chatId] || [];
        
        // Check for duplicates by ID or content+timestamp
        const isDuplicate = chatMessages.some(msg => 
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
            [chatId]: [...chatMessages, normalizedMessage]
          }
        };
      });
    });
    
    // Handle message deletion
    socket.on("message_deleted", ({ chatId, messageId }) => {
      console.log(`Message ${messageId} deleted in chat ${chatId}`);
      
      set(state => {
        const chatMessages = state.messages[chatId] || [];
        const updatedMessages = chatMessages.map(msg => 
          msg.id === messageId ? { ...msg, deleted: true } : msg
        );
        
        return {
          messages: {
            ...state.messages,
            [chatId]: updatedMessages
          }
        };
      });
    });
    
    console.log("Socket listeners set up successfully");
  },

  // Cleanup function for unmounting
  cleanup: () => {
    socket.removeAllListeners();
    socket.disconnect();
  }
}));

export default useChatStore;