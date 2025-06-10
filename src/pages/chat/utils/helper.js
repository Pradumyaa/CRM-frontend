// src/pages/chat/utils/helpers.js

// ======================
// DATE & TIME UTILITIES
// ======================

/**
 * Format timestamp to relative time (e.g., "2 minutes ago", "Yesterday")
 */
export const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInSeconds = Math.floor((now - date) / 1000);

    // Less than a minute
    if (diffInSeconds < 60) {
        return "Just now";
    }

    // Less than an hour
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }

    // Less than a day
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }

    // Less than a week
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        if (diffInDays === 1) return "Yesterday";
        return `${diffInDays} days ago`;
    }

    // More than a week
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
        return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
    }

    // Format as date
    return date.toLocaleDateString();
};

/**
 * Format timestamp for message display (e.g., "2:30 PM", "Yesterday 2:30 PM")
 */
export const formatMessageTime = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const isToday = now.toDateString() === date.toDateString();

    const timeString = date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

    if (isToday) {
        return timeString;
    }

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = yesterday.toDateString() === date.toDateString();

    if (isYesterday) {
        return `Yesterday ${timeString}`;
    }

    // This week
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffInDays < 7) {
        const dayName = date.toLocaleDateString([], { weekday: 'long' });
        return `${dayName} ${timeString}`;
    }

    // Older
    return `${date.toLocaleDateString()} ${timeString}`;
};

/**
 * Check if timestamp is today
 */
export const isToday = (timestamp) => {
    const today = new Date();
    const date = new Date(timestamp);
    return today.toDateString() === date.toDateString();
};

/**
 * Format call duration (e.g., "2:30", "1:05:22")
 */
export const formatCallDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

// ======================
// FILE UTILITIES
// ======================

/**
 * Format file size (e.g., "1.2 MB", "345 KB")
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get file type from filename or mime type
 */
export const getFileType = (filename, mimeType = '') => {
    const extension = filename.split('.').pop()?.toLowerCase();

    // Image types
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(extension) ||
        mimeType.startsWith('image/')) {
        return 'image';
    }

    // Video types
    if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'].includes(extension) ||
        mimeType.startsWith('video/')) {
        return 'video';
    }

    // Audio types
    if (['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma'].includes(extension) ||
        mimeType.startsWith('audio/')) {
        return 'audio';
    }

    // Document types
    if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(extension)) {
        return 'document';
    }

    // Spreadsheet types
    if (['xls', 'xlsx', 'csv'].includes(extension)) {
        return 'spreadsheet';
    }

    // Presentation types
    if (['ppt', 'pptx'].includes(extension)) {
        return 'presentation';
    }

    // Archive types
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) {
        return 'archive';
    }

    // Code types
    if (['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'cs', 'php', 'rb', 'go', 'rs'].includes(extension)) {
        return 'code';
    }

    return 'unknown';
};

/**
 * Check if file is an image
 */
export const isImageFile = (filename, mimeType = '') => {
    return getFileType(filename, mimeType) === 'image';
};

/**
 * Get file icon name based on type
 */
export const getFileIcon = (filename, mimeType = '') => {
    const type = getFileType(filename, mimeType);

    const iconMap = {
        image: 'Image',
        video: 'Video',
        audio: 'Music',
        document: 'FileText',
        spreadsheet: 'FileSpreadsheet',
        presentation: 'Presentation',
        archive: 'Archive',
        code: 'Code',
        unknown: 'File',
    };

    return iconMap[type] || 'File';
};

/**
 * Validate file for upload
 */
export const validateFile = (file, maxSizeMB = 10, allowedTypes = []) => {
    const errors = [];

    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
        errors.push(`File size must be less than ${maxSizeMB}MB`);
    }

    // Check file type if specified
    if (allowedTypes.length > 0) {
        const fileType = getFileType(file.name, file.type);
        if (!allowedTypes.includes(fileType) && !allowedTypes.includes(file.type)) {
            errors.push(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

// ======================
// MESSAGE UTILITIES
// ======================

/**
 * Parse mentions from message content (@username)
 */
export const parseMentions = (content, users = []) => {
    const mentionRegex = /@(\w+)/g;
    const mentions = [];
    let match;

    while ((match = mentionRegex.exec(content)) !== null) {
        const username = match[1];
        const user = users.find(u =>
            u.name.toLowerCase().replace(/\s+/g, '') === username.toLowerCase() ||
            u.email.split('@')[0] === username.toLowerCase()
        );

        if (user) {
            mentions.push({
                userId: user._id,
                username: username,
                displayName: user.name,
                start: match.index,
                end: match.index + match[0].length,
            });
        }
    }

    return mentions;
};

/**
 * Highlight mentions in message content
 */
export const highlightMentions = (content, mentions = []) => {
    if (mentions.length === 0) return content;

    let result = content;
    let offset = 0;

    mentions.forEach(mention => {
        const before = result.substring(0, mention.start + offset);
        const mentionText = result.substring(mention.start + offset, mention.end + offset);
        const after = result.substring(mention.end + offset);

        const highlightedMention = `<span class="mention" data-user-id="${mention.userId}">${mentionText}</span>`;
        result = before + highlightedMention + after;

        offset += highlightedMention.length - mentionText.length;
    });

    return result;
};

/**
 * Parse URLs from message content
 */
export const parseUrls = (content) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = [];
    let match;

    while ((match = urlRegex.exec(content)) !== null) {
        urls.push({
            url: match[1],
            start: match.index,
            end: match.index + match[0].length,
        });
    }

    return urls;
};

/**
 * Convert URLs to clickable links
 */
export const linkifyUrls = (content) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return content.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>');
};

/**
 * Generate message preview (first line, truncated)
 */
export const generateMessagePreview = (content, maxLength = 50) => {
    if (!content) return '';

    // Remove HTML tags
    const plainText = content.replace(/<[^>]*>/g, '');

    // Get first line
    const firstLine = plainText.split('\n')[0];

    // Truncate if too long
    if (firstLine.length <= maxLength) {
        return firstLine;
    }

    return firstLine.substring(0, maxLength).trim() + '...';
};

// ======================
// SEARCH UTILITIES
// ======================

/**
 * Highlight search terms in text
 */
export const highlightSearchTerms = (text, searchTerm) => {
    if (!searchTerm || !text) return text;

    const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
};

/**
 * Escape special regex characters
 */
export const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Filter items by search query
 */
export const filterBySearch = (items, query, searchFields = ['name']) => {
    if (!query || !items) return items;

    const lowerQuery = query.toLowerCase();

    return items.filter(item => {
        return searchFields.some(field => {
            const value = getNestedValue(item, field);
            return value && value.toLowerCase().includes(lowerQuery);
        });
    });
};

/**
 * Get nested object value by dot notation
 */
export const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
};

// ======================
// VALIDATION UTILITIES
// ======================

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate URL format
 */
export const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

/**
 * Check if string is empty or whitespace only
 */
export const isEmpty = (str) => {
    return !str || str.trim().length === 0;
};

/**
 * Validate message content
 */
export const validateMessage = (content, maxLength = 4000) => {
    const errors = [];

    if (isEmpty(content)) {
        errors.push('Message cannot be empty');
    }

    if (content && content.length > maxLength) {
        errors.push(`Message must be less than ${maxLength} characters`);
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

// ======================
// NOTIFICATION UTILITIES
// ======================

/**
 * Request notification permission
 */
export const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
        return 'not-supported';
    }

    if (Notification.permission === 'granted') {
        return 'granted';
    }

    if (Notification.permission === 'denied') {
        return 'denied';
    }

    const permission = await Notification.requestPermission();
    return permission;
};

/**
 * Show desktop notification
 */
export const showDesktopNotification = (title, options = {}) => {
    if (Notification.permission !== 'granted') {
        return null;
    }

    const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
    });

    // Auto-close after 5 seconds
    setTimeout(() => {
        notification.close();
    }, 5000);

    return notification;
};

// ======================
// UTILITY FUNCTIONS
// ======================

/**
 * Generate random ID
 */
export const generateId = (prefix = 'id') => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Debounce function calls
 */
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Throttle function calls
 */
export const throttle = (func, limit) => {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        return success;
    }
};

/**
 * Download file from URL
 */
export const downloadFile = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * Scroll element into view smoothly
 */
export const scrollToElement = (element, behavior = 'smooth') => {
    if (element) {
        element.scrollIntoView({ behavior, block: 'nearest' });
    }
};

/**
 * Check if user is on mobile device
 */
export const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Get user's preferred color scheme
 */
export const getPreferredColorScheme = () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
};

/**
 * Format user name for display
 */
export const formatUserName = (user, showStatus = false) => {
    if (!user) return 'Unknown User';

    let name = user.name || user.email?.split('@')[0] || 'Unknown';

    if (showStatus && user.status) {
        const statusEmoji = {
            online: '🟢',
            away: '🟡',
            busy: '🔴',
            offline: '⚫',
        };
        name += ` ${statusEmoji[user.status] || ''}`;
    }

    return name;
};

export default {
    // Date & Time
    formatRelativeTime,
    formatMessageTime,
    isToday,
    formatCallDuration,

    // Files
    formatFileSize,
    getFileType,
    isImageFile,
    getFileIcon,
    validateFile,

    // Messages
    parseMentions,
    highlightMentions,
    parseUrls,
    linkifyUrls,
    generateMessagePreview,

    // Search
    highlightSearchTerms,
    escapeRegExp,
    filterBySearch,
    getNestedValue,

    // Validation
    isValidEmail,
    isValidUrl,
    isEmpty,
    validateMessage,

    // Notifications
    requestNotificationPermission,
    showDesktopNotification,

    // Utilities
    generateId,
    debounce,
    throttle,
    copyToClipboard,
    downloadFile,
    scrollToElement,
    isMobile,
    getPreferredColorScheme,
    formatUserName,
};