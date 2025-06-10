// src/pages/chat/utils/constants.js

// ======================
// UI CONSTANTS
// ======================

export const MODAL_TYPES = {
    USER_PROFILE: 'user_profile',
    USER_SETTINGS: 'user_settings',
    CHANNEL_INFO: 'channel_info',
    CHANNEL_CREATE: 'channel_create',
    CHANNEL_EDIT: 'channel_edit',
    CHANNEL_MEMBERS: 'channel_members',
    SEARCH: 'search',
    SEARCH_RESULTS: 'search_results',
    NOTIFICATIONS: 'notifications',
    FILE_PREVIEW: 'file_preview',
    CALL_SETTINGS: 'call_settings',
};

export const CHAT_TYPES = {
    CHANNEL: 'channel',
    DIRECT: 'direct',
};

export const SIDEBAR_TABS = {
    CHATS: 'chats',
    CALLS: 'calls',
    FILES: 'files',
    NOTIFICATIONS: 'notifications',
};

export const THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system',
};

// ======================
// MESSAGE CONSTANTS
// ======================

export const MESSAGE_TYPES = {
    TEXT: 'text',
    IMAGE: 'image',
    FILE: 'file',
    AUDIO: 'audio',
    VIDEO: 'video',
    VOICE_NOTE: 'voice_note',
    SYSTEM: 'system',
    CALL_START: 'call_start',
    CALL_END: 'call_end',
    MEMBER_JOIN: 'member_join',
    MEMBER_LEAVE: 'member_leave',
    CHANNEL_CREATE: 'channel_create',
    CHANNEL_UPDATE: 'channel_update',
};

export const MESSAGE_STATUS = {
    SENDING: 'sending',
    SENT: 'sent',
    DELIVERED: 'delivered',
    READ: 'read',
    FAILED: 'failed',
};

export const MESSAGE_LIMITS = {
    MAX_LENGTH: 4000,
    MAX_FILES: 10,
    MAX_FILE_SIZE_MB: 50,
    MAX_IMAGE_SIZE_MB: 20,
    MAX_VIDEO_SIZE_MB: 100,
    MAX_AUDIO_SIZE_MB: 25,
};

// ======================
// FILE CONSTANTS
// ======================

export const FILE_TYPES = {
    IMAGE: 'image',
    VIDEO: 'video',
    AUDIO: 'audio',
    DOCUMENT: 'document',
    SPREADSHEET: 'spreadsheet',
    PRESENTATION: 'presentation',
    ARCHIVE: 'archive',
    CODE: 'code',
    UNKNOWN: 'unknown',
};

export const SUPPORTED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/bmp',
    'image/svg+xml',
];

export const SUPPORTED_VIDEO_TYPES = [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/avi',
    'video/mov',
    'video/wmv',
    'video/flv',
    'video/mkv',
];

export const SUPPORTED_AUDIO_TYPES = [
    'audio/mp3',
    'audio/wav',
    'audio/ogg',
    'audio/aac',
    'audio/flac',
    'audio/wma',
    'audio/m4a',
];

export const SUPPORTED_DOCUMENT_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/rtf',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
];

// ======================
// USER STATUS CONSTANTS
// ======================

export const USER_STATUS = {
    ONLINE: 'online',
    AWAY: 'away',
    BUSY: 'busy',
    OFFLINE: 'offline',
};

export const USER_STATUS_COLORS = {
    [USER_STATUS.ONLINE]: 'bg-green-500',
    [USER_STATUS.AWAY]: 'bg-yellow-500',
    [USER_STATUS.BUSY]: 'bg-red-500',
    [USER_STATUS.OFFLINE]: 'bg-gray-400',
};

export const USER_STATUS_LABELS = {
    [USER_STATUS.ONLINE]: 'Online',
    [USER_STATUS.AWAY]: 'Away',
    [USER_STATUS.BUSY]: 'Busy',
    [USER_STATUS.OFFLINE]: 'Offline',
};

// ======================
// CALL CONSTANTS
// ======================

export const CALL_TYPES = {
    VOICE: 'voice',
    VIDEO: 'video',
};

export const CALL_STATUS = {
    CONNECTING: 'connecting',
    RINGING: 'ringing',
    ACTIVE: 'active',
    ENDED: 'ended',
    MISSED: 'missed',
    DECLINED: 'declined',
    FAILED: 'failed',
};

export const CALL_QUALITY = {
    POOR: 'poor',
    FAIR: 'fair',
    GOOD: 'good',
    EXCELLENT: 'excellent',
};

// ======================
// NOTIFICATION CONSTANTS
// ======================

export const NOTIFICATION_TYPES = {
    MESSAGE: 'message',
    MENTION: 'mention',
    DIRECT_MESSAGE: 'direct_message',
    CALL_INCOMING: 'call_incoming',
    CALL_MISSED: 'call_missed',
    CHANNEL_INVITE: 'channel_invite',
    SYSTEM: 'system',
};

export const NOTIFICATION_PRIORITY = {
    LOW: 'low',
    NORMAL: 'normal',
    HIGH: 'high',
    URGENT: 'urgent',
};

// ======================
// SEARCH CONSTANTS
// ======================

export const SEARCH_TYPES = {
    ALL: 'all',
    MESSAGES: 'messages',
    CHANNELS: 'channels',
    USERS: 'users',
    FILES: 'files',
    DIRECT: 'direct',
};

export const SEARCH_FILTERS = {
    DATE_RANGE: 'dateRange',
    SENDER: 'sender',
    CHANNEL: 'channel',
    FILE_TYPE: 'fileType',
    HAS_ATTACHMENTS: 'hasAttachments',
};

// ======================
// CHANNEL CONSTANTS
// ======================

export const CHANNEL_TYPES = {
    PUBLIC: 'public',
    PRIVATE: 'private',
};

export const CHANNEL_PERMISSIONS = {
    ADMIN: 'admin',
    MODERATOR: 'moderator',
    MEMBER: 'member',
    GUEST: 'guest',
};

export const CHANNEL_LIMITS = {
    MAX_NAME_LENGTH: 50,
    MAX_DESCRIPTION_LENGTH: 500,
    MAX_MEMBERS: 1000,
};

// ======================
// EMOJI & REACTIONS
// ======================

export const COMMON_EMOJIS = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣',
    '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰',
    '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜',
    '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏',
    '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
    '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠',
    '👍', '👎', '👌', '🤌', '🤏', '✌️', '🤞', '🤟',
    '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️',
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
    '💯', '💢', '💥', '💫', '💦', '💨', '🕳️', '💬',
];

export const REACTION_EMOJIS = [
    '👍', '👎', '❤️', '😂', '😮', '😢', '😡', '🎉',
    '🔥', '👏', '💯', '🚀', '✅', '❌', '⭐', '💡',
];

// ======================
// KEYBOARD SHORTCUTS
// ======================

export const KEYBOARD_SHORTCUTS = {
    // Message actions
    SEND_MESSAGE: 'Enter',
    NEW_LINE: 'Shift+Enter',
    EDIT_LAST_MESSAGE: 'ArrowUp',

    // Navigation
    NEXT_CHAT: 'Ctrl+ArrowDown',
    PREV_CHAT: 'Ctrl+ArrowUp',
    SEARCH: 'Ctrl+K',

    // UI actions
    TOGGLE_SIDEBAR: 'Ctrl+B',
    OPEN_SETTINGS: 'Ctrl+,',
    CLOSE_MODAL: 'Escape',

    // Formatting
    BOLD: 'Ctrl+B',
    ITALIC: 'Ctrl+I',
    CODE: 'Ctrl+`',
    LINK: 'Ctrl+K',
};

// ======================
// API ENDPOINTS (for future use)
// ======================

export const API_ENDPOINTS = {
    // Auth
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',

    // Users
    USERS: '/api/users',
    USER_PROFILE: '/api/users/profile',
    USER_STATUS: '/api/users/status',

    // Channels
    CHANNELS: '/api/channels',
    CHANNEL_MEMBERS: '/api/channels/:id/members',
    CHANNEL_MESSAGES: '/api/channels/:id/messages',

    // Direct Messages
    DIRECT_MESSAGES: '/api/direct-messages',
    DM_MESSAGES: '/api/direct-messages/:id/messages',

    // Messages
    MESSAGES: '/api/messages',
    MESSAGE_REACTIONS: '/api/messages/:id/reactions',

    // Files
    FILE_UPLOAD: '/api/files/upload',
    FILE_DOWNLOAD: '/api/files/:id/download',

    // Search
    SEARCH: '/api/search',

    // Calls
    CALLS: '/api/calls',
    CALL_HISTORY: '/api/calls/history',
    CALL_INITIATE: '/api/calls/initiate',

    // Notifications
    NOTIFICATIONS: '/api/notifications',
    MARK_NOTIFICATION_READ: '/api/notifications/:id/read',
};

// ======================
// WEBSOCKET EVENTS
// ======================

export const SOCKET_EVENTS = {
    // Connection
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    ERROR: 'error',

    // User events
    USER_ONLINE: 'user:online',
    USER_OFFLINE: 'user:offline',
    USER_STATUS_CHANGE: 'user:status:change',

    // Message events
    MESSAGE_SEND: 'message:send',
    MESSAGE_RECEIVE: 'message:receive',
    MESSAGE_UPDATE: 'message:update',
    MESSAGE_DELETE: 'message:delete',
    MESSAGE_REACTION: 'message:reaction',

    // Typing events
    TYPING_START: 'typing:start',
    TYPING_STOP: 'typing:stop',

    // Channel events
    CHANNEL_CREATE: 'channel:create',
    CHANNEL_UPDATE: 'channel:update',
    CHANNEL_DELETE: 'channel:delete',
    CHANNEL_JOIN: 'channel:join',
    CHANNEL_LEAVE: 'channel:leave',

    // Call events
    CALL_INITIATE: 'call:initiate',
    CALL_ACCEPT: 'call:accept',
    CALL_DECLINE: 'call:decline',
    CALL_END: 'call:end',
    CALL_ICE_CANDIDATE: 'call:ice:candidate',
    CALL_OFFER: 'call:offer',
    CALL_ANSWER: 'call:answer',

    // Notification events
    NOTIFICATION_NEW: 'notification:new',
    NOTIFICATION_READ: 'notification:read',
};

// ======================
// LOCAL STORAGE KEYS
// ======================

export const STORAGE_KEYS = {
    AUTH_TOKEN: 'chat_auth_token',
    REFRESH_TOKEN: 'chat_refresh_token',
    USER_SETTINGS: 'chat_user_settings',
    THEME: 'chat_theme',
    SIDEBAR_STATE: 'chat_sidebar_state',
    DRAFT_MESSAGES: 'chat_draft_messages',
    NOTIFICATION_PERMISSION: 'chat_notification_permission',
    CALL_SETTINGS: 'chat_call_settings',
    RECENT_EMOJIS: 'chat_recent_emojis',
    SEARCH_HISTORY: 'chat_search_history',
};

// ======================
// ERROR MESSAGES
// ======================

export const ERROR_MESSAGES = {
    // Network errors
    NETWORK_ERROR: 'Network error. Please check your connection.',
    SERVER_ERROR: 'Server error. Please try again later.',
    TIMEOUT_ERROR: 'Request timeout. Please try again.',

    // Authentication errors
    INVALID_CREDENTIALS: 'Invalid email or password.',
    TOKEN_EXPIRED: 'Session expired. Please log in again.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',

    // Message errors
    MESSAGE_TOO_LONG: 'Message is too long. Maximum 4000 characters allowed.',
    MESSAGE_EMPTY: 'Message cannot be empty.',
    MESSAGE_SEND_FAILED: 'Failed to send message. Please try again.',

    // File errors
    FILE_TOO_LARGE: 'File is too large. Maximum size is 50MB.',
    FILE_TYPE_NOT_SUPPORTED: 'File type is not supported.',
    FILE_UPLOAD_FAILED: 'File upload failed. Please try again.',

    // Call errors
    CALL_FAILED: 'Call failed to connect. Please try again.',
    CALL_PERMISSION_DENIED: 'Camera/microphone permission denied.',
    CALL_NOT_SUPPORTED: 'Calls are not supported in this browser.',

    // Channel errors
    CHANNEL_NAME_REQUIRED: 'Channel name is required.',
    CHANNEL_NAME_TOO_LONG: 'Channel name is too long. Maximum 50 characters allowed.',
    CHANNEL_NOT_FOUND: 'Channel not found.',
    CHANNEL_ACCESS_DENIED: 'You do not have access to this channel.',

    // General errors
    SOMETHING_WENT_WRONG: 'Something went wrong. Please try again.',
    FEATURE_NOT_AVAILABLE: 'This feature is not available.',
    PERMISSION_DENIED: 'Permission denied.',
};

// ======================
// SUCCESS MESSAGES
// ======================

export const SUCCESS_MESSAGES = {
    MESSAGE_SENT: 'Message sent successfully.',
    FILE_UPLOADED: 'File uploaded successfully.',
    CHANNEL_CREATED: 'Channel created successfully.',
    CHANNEL_UPDATED: 'Channel updated successfully.',
    SETTINGS_SAVED: 'Settings saved successfully.',
    NOTIFICATION_ENABLED: 'Notifications enabled successfully.',
    CALL_ENDED: 'Call ended.',
    USER_INVITED: 'User invited successfully.',
    MESSAGE_COPIED: 'Message copied to clipboard.',
    LINK_COPIED: 'Link copied to clipboard.',
};

// ======================
// ANIMATION DURATIONS
// ======================

export const ANIMATION_DURATION = {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
    VERY_SLOW: 1000,
};

// ======================
// BREAKPOINTS
// ======================

export const BREAKPOINTS = {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536,
};

// ======================
// Z-INDEX LAYERS
// ======================

export const Z_INDEX = {
    BASE: 0,
    DROPDOWN: 10,
    STICKY: 20,
    OVERLAY: 30,
    MODAL: 40,
    POPOVER: 50,
    TOOLTIP: 60,
    NOTIFICATION: 70,
    LOADING: 80,
    MAXIMUM: 99,
};

// ======================
// REGEX PATTERNS
// ======================

export const REGEX_PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    URL: /(https?:\/\/[^\s]+)/g,
    MENTION: /@(\w+)/g,
    HASHTAG: /#(\w+)/g,
    PHONE: /(\+\d{1,3}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g,
    EMOJI: /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu,
};

// ======================
// FEATURE FLAGS
// ======================

export const FEATURES = {
    VOICE_MESSAGES: true,
    VIDEO_CALLS: true,
    SCREEN_SHARING: true,
    FILE_SHARING: true,
    MESSAGE_REACTIONS: true,
    MESSAGE_THREADS: false, // Future feature
    MESSAGE_SCHEDULING: false, // Future feature
    CHANNEL_THREADS: false, // Future feature
    CUSTOM_EMOJIS: false, // Future feature
    DARK_MODE: true,
    NOTIFICATIONS: true,
    SEARCH: true,
    MENTIONS: true,
    URL_PREVIEWS: true,
    TYPING_INDICATORS: true,
    READ_RECEIPTS: true,
    PRESENCE_STATUS: true,
};

// ======================
// DEFAULT SETTINGS
// ======================

export const DEFAULT_SETTINGS = {
    notifications: {
        desktop: true,
        sound: true,
        mentions: true,
        directMessages: true,
        channels: true,
        calls: true,
    },
    appearance: {
        theme: THEMES.SYSTEM,
        fontSize: 'medium',
        compact: false,
        sidebarCollapsed: false,
    },
    privacy: {
        readReceipts: true,
        lastSeen: true,
        profileVisibility: 'everyone',
        messagePreview: true,
    },
    calls: {
        autoAcceptFromContacts: false,
        videoQuality: 'auto',
        audioInputDevice: 'default',
        audioOutputDevice: 'default',
        videoInputDevice: 'default',
    },
    advanced: {
        developerMode: false,
        debugMode: false,
        betaFeatures: false,
    },
};

// ======================
// EXPORT ALL CONSTANTS
// ======================

export default {
    MODAL_TYPES,
    CHAT_TYPES,
    SIDEBAR_TABS,
    THEMES,
    MESSAGE_TYPES,
    MESSAGE_STATUS,
    MESSAGE_LIMITS,
    FILE_TYPES,
    SUPPORTED_IMAGE_TYPES,
    SUPPORTED_VIDEO_TYPES,
    SUPPORTED_AUDIO_TYPES,
    SUPPORTED_DOCUMENT_TYPES,
    USER_STATUS,
    USER_STATUS_COLORS,
    USER_STATUS_LABELS,
    CALL_TYPES,
    CALL_STATUS,
    CALL_QUALITY,
    NOTIFICATION_TYPES,
    NOTIFICATION_PRIORITY,
    SEARCH_TYPES,
    SEARCH_FILTERS,
    CHANNEL_TYPES,
    CHANNEL_PERMISSIONS,
    CHANNEL_LIMITS,
    COMMON_EMOJIS,
    REACTION_EMOJIS,
    KEYBOARD_SHORTCUTS,
    API_ENDPOINTS,
    SOCKET_EVENTS,
    STORAGE_KEYS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    ANIMATION_DURATION,
    BREAKPOINTS,
    Z_INDEX,
    REGEX_PATTERNS,
    FEATURES,
    DEFAULT_SETTINGS,
};