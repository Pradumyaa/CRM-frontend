// src/pages/chat/data/mockData.js

// ======================
// MOCK USERS
// ======================
export const mockUsers = [
    {
        _id: "user-1",
        name: "John Doe",
        email: "john@example.com",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        status: "online",
        role: "Senior Developer",
        department: "Engineering",
        lastSeen: new Date().toISOString(),
    },
    {
        _id: "user-2",
        name: "Sarah Wilson",
        email: "sarah@example.com",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b641?w=150",
        status: "online",
        role: "Product Manager",
        department: "Product",
        lastSeen: new Date(Date.now() - 5 * 60000).toISOString(), // 5 min ago
    },
    {
        _id: "user-3",
        name: "Mike Chen",
        email: "mike@example.com",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        status: "away",
        role: "UX Designer",
        department: "Design",
        lastSeen: new Date(Date.now() - 30 * 60000).toISOString(), // 30 min ago
    },
    {
        _id: "user-4",
        name: "Emily Rodriguez",
        email: "emily@example.com",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        status: "busy",
        role: "DevOps Engineer",
        department: "Engineering",
        lastSeen: new Date(Date.now() - 2 * 60 * 60000).toISOString(), // 2 hours ago
    },
    {
        _id: "user-5",
        name: "David Park",
        email: "david@example.com",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        status: "offline",
        role: "Marketing Manager",
        department: "Marketing",
        lastSeen: new Date(Date.now() - 24 * 60 * 60000).toISOString(), // 1 day ago
    },
    {
        _id: "user-6",
        name: "Lisa Thompson",
        email: "lisa@example.com",
        avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150",
        status: "online",
        role: "QA Engineer",
        department: "Engineering",
        lastSeen: new Date().toISOString(),
    },
    {
        _id: "user-7",
        name: "Alex Kumar",
        email: "alex@example.com",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        status: "away",
        role: "Data Scientist",
        department: "Analytics",
        lastSeen: new Date(Date.now() - 45 * 60000).toISOString(), // 45 min ago
    },
    {
        _id: "user-8",
        name: "Rachel Green",
        email: "rachel@example.com",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        status: "online",
        role: "HR Manager",
        department: "Human Resources",
        lastSeen: new Date().toISOString(),
    }
];

// ======================
// MOCK CHANNELS
// ======================
export const mockChannels = [
    {
        _id: "channel-1",
        name: "general",
        description: "General team discussions and announcements",
        type: "public",
        memberCount: 8,
        members: ["user-1", "user-2", "user-3", "user-4", "user-5", "user-6", "user-7", "user-8"],
        createdBy: "user-1",
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60000).toISOString(), // 30 days ago
        avatar: null,
        lastMessage: {
            content: "Great work on the new feature everyone! 🎉",
            timestamp: new Date(Date.now() - 10 * 60000).toISOString(), // 10 min ago
            senderName: "Sarah Wilson",
        },
        unreadCount: 2,
    },
    {
        _id: "channel-2",
        name: "development",
        description: "Development discussions, code reviews, and tech talks",
        type: "public",
        memberCount: 5,
        members: ["user-1", "user-3", "user-4", "user-6", "user-7"],
        createdBy: "user-1",
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60000).toISOString(), // 25 days ago
        avatar: null,
        lastMessage: {
            content: "The new API endpoints are ready for testing",
            timestamp: new Date(Date.now() - 1 * 60 * 60000).toISOString(), // 1 hour ago
            senderName: "Mike Chen",
        },
        unreadCount: 0,
    },
    {
        _id: "channel-3",
        name: "design",
        description: "Design discussions, mockups, and user experience",
        type: "public",
        memberCount: 4,
        members: ["user-2", "user-3", "user-6", "user-8"],
        createdBy: "user-3",
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60000).toISOString(), // 20 days ago
        avatar: null,
        lastMessage: {
            content: "Updated the design system with new components",
            timestamp: new Date(Date.now() - 3 * 60 * 60000).toISOString(), // 3 hours ago
            senderName: "Mike Chen",
        },
        unreadCount: 1,
    },
    {
        _id: "channel-4",
        name: "random",
        description: "Random chats, memes, and casual conversations",
        type: "public",
        memberCount: 7,
        members: ["user-1", "user-2", "user-3", "user-4", "user-6", "user-7", "user-8"],
        createdBy: "user-2",
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60000).toISOString(), // 15 days ago
        avatar: null,
        lastMessage: {
            content: "Anyone up for coffee? ☕",
            timestamp: new Date(Date.now() - 30 * 60000).toISOString(), // 30 min ago
            senderName: "Lisa Thompson",
        },
        unreadCount: 5,
    },
    {
        _id: "channel-5",
        name: "announcements",
        description: "Company announcements and important updates",
        type: "public",
        memberCount: 8,
        members: ["user-1", "user-2", "user-3", "user-4", "user-5", "user-6", "user-7", "user-8"],
        createdBy: "user-8",
        createdAt: new Date(Date.now() - 35 * 24 * 60 * 60000).toISOString(), // 35 days ago
        avatar: null,
        lastMessage: {
            content: "Team meeting tomorrow at 10 AM",
            timestamp: new Date(Date.now() - 6 * 60 * 60000).toISOString(), // 6 hours ago
            senderName: "Rachel Green",
        },
        unreadCount: 0,
    }
];

// ======================
// MOCK DIRECT MESSAGES
// ======================
export const mockDirectMessages = [
    {
        _id: "dm-1-2", // user-1 and user-2
        participants: ["user-1", "user-2"],
        name: "Sarah Wilson", // Name shown to current user (user-1)
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b641?w=150",
        status: "online",
        lastMessage: {
            content: "Sounds good! Let's discuss this in the meeting.",
            timestamp: new Date(Date.now() - 5 * 60000).toISOString(), // 5 min ago
            senderName: "Sarah Wilson",
        },
        unreadCount: 1,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60000).toISOString(), // 10 days ago
    },
    {
        _id: "dm-1-3", // user-1 and user-3
        participants: ["user-1", "user-3"],
        name: "Mike Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        status: "away",
        lastMessage: {
            content: "The design looks great! Few minor tweaks needed.",
            timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(), // 2 hours ago
            senderName: "Mike Chen",
        },
        unreadCount: 0,
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60000).toISOString(), // 8 days ago
    },
    {
        _id: "dm-1-4", // user-1 and user-4
        participants: ["user-1", "user-4"],
        name: "Emily Rodriguez",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        status: "busy",
        lastMessage: {
            content: "Deployment went smoothly. All systems are green ✅",
            timestamp: new Date(Date.now() - 4 * 60 * 60000).toISOString(), // 4 hours ago
            senderName: "Emily Rodriguez",
        },
        unreadCount: 2,
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60000).toISOString(), // 12 days ago
    },
    {
        _id: "dm-1-6", // user-1 and user-6
        participants: ["user-1", "user-6"],
        name: "Lisa Thompson",
        avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150",
        status: "online",
        lastMessage: {
            content: "Found a few bugs in the latest build. Creating tickets now.",
            timestamp: new Date(Date.now() - 1 * 60 * 60000).toISOString(), // 1 hour ago
            senderName: "Lisa Thompson",
        },
        unreadCount: 0,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60000).toISOString(), // 5 days ago
    }
];

// ======================
// MOCK MESSAGES
// ======================
export const mockMessages = {
    // General Channel Messages
    "channel-1": [
        {
            _id: "msg-1",
            content: "Good morning everyone! Ready for another productive day? 🌅",
            type: "text",
            senderId: "user-2",
            senderName: "Sarah Wilson",
            senderAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b641?w=150",
            timestamp: new Date(Date.now() - 4 * 60 * 60000).toISOString(), // 4 hours ago
            reactions: { "👍": ["user-1", "user-3", "user-6"], "☕": ["user-4"] },
            edited: false,
            replyTo: null,
        },
        {
            _id: "msg-2",
            content: "Absolutely! Coffee is brewing ☕",
            type: "text",
            senderId: "user-1",
            senderName: "John Doe",
            senderAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
            timestamp: new Date(Date.now() - 3.5 * 60 * 60000).toISOString(),
            reactions: { "☕": ["user-2", "user-6"] },
            edited: false,
            replyTo: "msg-1",
        },
        {
            _id: "msg-3",
            content: "Great work on the new feature everyone! 🎉",
            type: "text",
            senderId: "user-2",
            senderName: "Sarah Wilson",
            senderAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b641?w=150",
            timestamp: new Date(Date.now() - 10 * 60000).toISOString(), // 10 min ago
            reactions: { "🎉": ["user-1", "user-3", "user-4"], "🚀": ["user-6"] },
            edited: false,
            replyTo: null,
        },
    ],

    // Development Channel Messages
    "channel-2": [
        {
            _id: "msg-4",
            content: "Just pushed the latest changes to the feature branch. Ready for code review!",
            type: "text",
            senderId: "user-1",
            senderName: "John Doe",
            senderAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
            timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(), // 2 hours ago
            reactions: { "👀": ["user-3", "user-4"] },
            edited: false,
            replyTo: null,
        },
        {
            _id: "msg-5",
            content: "The new API endpoints are ready for testing",
            type: "text",
            senderId: "user-3",
            senderName: "Mike Chen",
            senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
            timestamp: new Date(Date.now() - 1 * 60 * 60000).toISOString(), // 1 hour ago
            reactions: { "✅": ["user-1", "user-6"] },
            edited: false,
            replyTo: null,
        },
    ],

    // Direct Message: user-1 and user-2
    "dm-1-2": [
        {
            _id: "msg-6",
            content: "Hey! Do you have a moment to discuss the project timeline?",
            type: "text",
            senderId: "user-2",
            senderName: "Sarah Wilson",
            senderAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b641?w=150",
            timestamp: new Date(Date.now() - 30 * 60000).toISOString(), // 30 min ago
            reactions: {},
            edited: false,
            replyTo: null,
        },
        {
            _id: "msg-7",
            content: "Of course! I was thinking we could move the deadline by a week to ensure quality.",
            type: "text",
            senderId: "user-1",
            senderName: "John Doe",
            senderAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
            timestamp: new Date(Date.now() - 25 * 60000).toISOString(), // 25 min ago
            reactions: {},
            edited: false,
            replyTo: "msg-6",
        },
        {
            _id: "msg-8",
            content: "Sounds good! Let's discuss this in the meeting.",
            type: "text",
            senderId: "user-2",
            senderName: "Sarah Wilson",
            senderAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b641?w=150",
            timestamp: new Date(Date.now() - 5 * 60000).toISOString(), // 5 min ago
            reactions: {},
            edited: false,
            replyTo: null,
        },
    ],

    // Direct Message: user-1 and user-3
    "dm-1-3": [
        {
            _id: "msg-9",
            content: "I've uploaded the latest design mockups to Figma",
            type: "text",
            senderId: "user-3",
            senderName: "Mike Chen",
            senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
            timestamp: new Date(Date.now() - 3 * 60 * 60000).toISOString(), // 3 hours ago
            reactions: {},
            edited: false,
            replyTo: null,
        },
        {
            _id: "msg-10",
            content: "The design looks great! Few minor tweaks needed.",
            type: "text",
            senderId: "user-3",
            senderName: "Mike Chen",
            senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
            timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(), // 2 hours ago
            reactions: {},
            edited: false,
            replyTo: null,
        },
    ],

    // Random Channel Messages
    "channel-4": [
        {
            _id: "msg-11",
            content: "Anyone up for coffee? ☕",
            type: "text",
            senderId: "user-6",
            senderName: "Lisa Thompson",
            senderAvatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150",
            timestamp: new Date(Date.now() - 30 * 60000).toISOString(), // 30 min ago
            reactions: { "☕": ["user-1", "user-2"], "🙋‍♀️": ["user-3"] },
            edited: false,
            replyTo: null,
        },
        {
            _id: "msg-12",
            content: "I'm in! Meeting room B in 10 minutes?",
            type: "text",
            senderId: "user-2",
            senderName: "Sarah Wilson",
            senderAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b641?w=150",
            timestamp: new Date(Date.now() - 25 * 60000).toISOString(), // 25 min ago
            reactions: { "👍": ["user-6"] },
            edited: false,
            replyTo: "msg-11",
        },
    ],
};

// ======================
// MOCK NOTIFICATIONS
// ======================
export const mockNotifications = [
    {
        _id: "notif-1",
        type: "mention",
        title: "You were mentioned in #general",
        message: "Sarah Wilson mentioned you in a message",
        chatId: "channel-1",
        chatType: "channel",
        senderId: "user-2",
        timestamp: new Date(Date.now() - 15 * 60000).toISOString(), // 15 min ago
        read: false,
    },
    {
        _id: "notif-2",
        type: "direct_message",
        title: "New message from Sarah Wilson",
        message: "Sounds good! Let's discuss this in the meeting.",
        chatId: "dm-1-2",
        chatType: "direct",
        senderId: "user-2",
        timestamp: new Date(Date.now() - 5 * 60000).toISOString(), // 5 min ago
        read: false,
    },
    {
        _id: "notif-3",
        type: "call_missed",
        title: "Missed call from Mike Chen",
        message: "Voice call - 2 minutes ago",
        senderId: "user-3",
        timestamp: new Date(Date.now() - 2 * 60000).toISOString(), // 2 min ago
        read: false,
    },
];

// ======================
// MOCK CALL HISTORY
// ======================
export const mockCallHistory = [
    {
        _id: "call-1",
        type: "video",
        participants: ["user-1", "user-2"],
        participantNames: ["John Doe", "Sarah Wilson"],
        startTime: new Date(Date.now() - 2 * 60 * 60000).toISOString(), // 2 hours ago
        endTime: new Date(Date.now() - 2 * 60 * 60000 + 15 * 60000).toISOString(), // 15 min call
        duration: 15 * 60, // 15 minutes in seconds
        status: "completed",
        initiatedBy: "user-1",
    },
    {
        _id: "call-2",
        type: "voice",
        participants: ["user-1", "user-3"],
        participantNames: ["John Doe", "Mike Chen"],
        startTime: new Date(Date.now() - 24 * 60 * 60000).toISOString(), // 1 day ago
        endTime: new Date(Date.now() - 24 * 60 * 60000 + 8 * 60000).toISOString(), // 8 min call
        duration: 8 * 60, // 8 minutes in seconds
        status: "completed",
        initiatedBy: "user-3",
    },
    {
        _id: "call-3",
        type: "voice",
        participants: ["user-1", "user-3"],
        participantNames: ["John Doe", "Mike Chen"],
        startTime: new Date(Date.now() - 2 * 60000).toISOString(), // 2 min ago
        endTime: null,
        duration: 0,
        status: "missed",
        initiatedBy: "user-3",
    },
];

// ======================
// MOCK FILES
// ======================
export const mockRecentFiles = [
    {
        _id: "file-1",
        name: "Design_System_v2.pdf",
        type: "pdf",
        size: "2.4 MB",
        url: "#",
        uploadedBy: "user-3",
        uploaderName: "Mike Chen",
        chatId: "channel-3",
        chatName: "design",
        timestamp: new Date(Date.now() - 1 * 60 * 60000).toISOString(), // 1 hour ago
    },
    {
        _id: "file-2",
        name: "API_Documentation.docx",
        type: "docx",
        size: "1.8 MB",
        url: "#",
        uploadedBy: "user-1",
        uploaderName: "John Doe",
        chatId: "channel-2",
        chatName: "development",
        timestamp: new Date(Date.now() - 3 * 60 * 60000).toISOString(), // 3 hours ago
    },
    {
        _id: "file-3",
        name: "team_photo.jpg",
        type: "jpg",
        size: "956 KB",
        url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400",
        uploadedBy: "user-8",
        uploaderName: "Rachel Green",
        chatId: "channel-4",
        chatName: "random",
        timestamp: new Date(Date.now() - 6 * 60 * 60000).toISOString(), // 6 hours ago
    },
];

// ======================
// UTILITY FUNCTIONS
// ======================
export const initializeMockData = () => {
    return {
        users: mockUsers,
        channels: mockChannels,
        directMessages: mockDirectMessages,
        messages: mockMessages,
        notifications: mockNotifications,
        callHistory: mockCallHistory,
        recentFiles: mockRecentFiles,
        onlineUsers: new Set(["user-1", "user-2", "user-6", "user-8"]), // Currently online users
        unreadCounts: {
            "channel-1": 2,
            "channel-3": 1,
            "channel-4": 5,
            "dm-1-2": 1,
            "dm-1-4": 2,
        },
    };
};

// Current user (for testing purposes)
export const currentUser = mockUsers[0]; // John Doe

export default {
    mockUsers,
    mockChannels,
    mockDirectMessages,
    mockMessages,
    mockNotifications,
    mockCallHistory,
    mockRecentFiles,
    initializeMockData,
    currentUser,
};