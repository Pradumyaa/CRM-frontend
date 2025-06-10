// src/pages/chat/hooks/useFileUpload.js
import { useCallback, useState, useMemo } from 'react';
import useChatStore from '../store/chatStore';
import {
    validateFile,
    formatFileSize,
    getFileType,
    getFileIcon,
    generateId
} from '../utils/helper';
import {
    MESSAGE_LIMITS,
    SUPPORTED_IMAGE_TYPES,
    SUPPORTED_VIDEO_TYPES,
    SUPPORTED_AUDIO_TYPES,
    SUPPORTED_DOCUMENT_TYPES,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES
} from '../utils/constants';

/**
 * Comprehensive file upload management hook
 * Handles file validation, upload progress, and file management
 */
const useFileUpload = () => {
    const [dragActive, setDragActive] = useState(false);
    const [uploadErrors, setUploadErrors] = useState({});

    const {
        uploadingFiles,
        recentFiles,
        currentUser,
        selectedChat,
        messages,
        channels,
        directMessages,
        addUploadingFile,
        updateFileUpload,
        removeUploadingFile,
        sendMessage,
        addMessage,
        updateMessage,
        incrementUnreadCount,
        updateChatLastMessage,
    } = useChatStore();

    // ======================
    // FILE VALIDATION
    // ======================

    const supportedTypes = useMemo(() => [
        ...SUPPORTED_IMAGE_TYPES,
        ...SUPPORTED_VIDEO_TYPES,
        ...SUPPORTED_AUDIO_TYPES,
        ...SUPPORTED_DOCUMENT_TYPES,
    ], []);

    const validateFiles = useCallback((files) => {
        const validationResults = [];

        if (files.length > MESSAGE_LIMITS.MAX_FILES) {
            return [{
                file: null,
                isValid: false,
                errors: [`Maximum ${MESSAGE_LIMITS.MAX_FILES} files allowed at once`],
            }];
        }

        Array.from(files).forEach(file => {
            let maxSize = MESSAGE_LIMITS.MAX_FILE_SIZE_MB;

            // Different limits for different file types
            if (SUPPORTED_IMAGE_TYPES.includes(file.type)) {
                maxSize = MESSAGE_LIMITS.MAX_IMAGE_SIZE_MB;
            } else if (SUPPORTED_VIDEO_TYPES.includes(file.type)) {
                maxSize = MESSAGE_LIMITS.MAX_VIDEO_SIZE_MB;
            } else if (SUPPORTED_AUDIO_TYPES.includes(file.type)) {
                maxSize = MESSAGE_LIMITS.MAX_AUDIO_SIZE_MB;
            }

            const validation = validateFile(file, maxSize, supportedTypes);

            validationResults.push({
                file,
                isValid: validation.isValid,
                errors: validation.errors,
                fileInfo: {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    lastModified: file.lastModified,
                    formattedSize: formatFileSize(file.size),
                    fileType: getFileType(file.name, file.type),
                    icon: getFileIcon(file.name, file.type),
                },
            });
        });

        return validationResults;
    }, [supportedTypes]);

    const canUploadFile = useCallback((file) => {
        if (!file) return false;

        const validation = validateFile(file, MESSAGE_LIMITS.MAX_FILE_SIZE_MB, supportedTypes);
        return validation.isValid;
    }, [supportedTypes]);

    // ======================
    // FILE UPLOAD SIMULATION
    // ======================

    const simulateUpload = useCallback((fileId, file) => {
        let progress = 0;
        const totalSize = file.size;
        let uploadedSize = 0;

        const interval = setInterval(() => {
            // Simulate network upload with varying speeds
            const chunkSize = Math.random() * (totalSize * 0.1) + (totalSize * 0.05);
            uploadedSize = Math.min(uploadedSize + chunkSize, totalSize);
            progress = Math.round((uploadedSize / totalSize) * 100);

            updateFileUpload(fileId, {
                progress,
                uploadedSize,
                status: progress === 100 ? 'completed' : 'uploading',
            });

            if (progress >= 100) {
                clearInterval(interval);

                // Simulate final processing
                setTimeout(() => {
                    const fileUrl = URL.createObjectURL(file);
                    updateFileUpload(fileId, {
                        status: 'completed',
                        url: fileUrl,
                        uploadedAt: new Date().toISOString(),
                    });

                    // Remove from uploading files after a delay
                    setTimeout(() => {
                        removeUploadingFile(fileId);
                    }, 2000);
                }, 500);
            }
        }, 100 + Math.random() * 300); // Variable interval for realistic feel

        return () => clearInterval(interval);
    }, [updateFileUpload, removeUploadingFile]);

    // ======================
    // UPLOAD MANAGEMENT
    // ======================

    const uploadFile = useCallback(async (file, chatId = null) => {
        if (!canUploadFile(file)) {
            const validation = validateFile(file, MESSAGE_LIMITS.MAX_FILE_SIZE_MB, supportedTypes);
            throw new Error(validation.errors.join(', '));
        }

        const targetChatId = chatId || selectedChat;
        if (!targetChatId) {
            throw new Error('No chat selected for file upload');
        }

        try {
            // Create upload record
            const uploadId = generateId('upload');
            const fileType = getFileType(file.name, file.type);

            addUploadingFile({
                _id: uploadId,
                file,
                fileName: file.name,
                fileSize: file.size,
                fileType,
                mimeType: file.type,
                progress: 0,
                status: 'starting',
                chatId: targetChatId,
                startedAt: new Date().toISOString(),
            });

            // Start upload simulation
            const cleanup = simulateUpload(uploadId, file);

            return {
                uploadId,
                cleanup,
                promise: new Promise((resolve, reject) => {
                    // Monitor upload progress
                    const checkStatus = () => {
                        const upload = uploadingFiles.find(u => u._id === uploadId);
                        if (!upload) return;

                        if (upload.status === 'completed') {
                            resolve({
                                uploadId,
                                fileUrl: upload.url,
                                fileName: file.name,
                                fileSize: file.size,
                                fileType,
                            });
                        } else if (upload.status === 'failed') {
                            reject(new Error('Upload failed'));
                        } else {
                            setTimeout(checkStatus, 100);
                        }
                    };

                    checkStatus();
                }),
            };
        } catch (error) {
            console.error('Upload error:', error);
            setUploadErrors(prev => ({ ...prev, [file.name]: error.message }));
            throw error;
        }
    }, [
        canUploadFile,
        selectedChat,
        addUploadingFile,
        simulateUpload,
        uploadingFiles,
        supportedTypes
    ]);

    const uploadFiles = useCallback(async (files, chatId = null) => {
        const results = [];
        const validationResults = validateFiles(files);

        for (const result of validationResults) {
            if (result.isValid) {
                try {
                    const upload = await uploadFile(result.file, chatId);
                    results.push({ success: true, upload, file: result.file });
                } catch (error) {
                    results.push({ success: false, error: error.message, file: result.file });
                }
            } else {
                results.push({
                    success: false,
                    error: result.errors.join(', '),
                    file: result.file
                });
            }
        }

        return results;
    }, [validateFiles, uploadFile]);

    const uploadAndSendFiles = useCallback(async (files, chatId = null, message = '') => {
        if (!files || files.length === 0) return [];

        const targetChatId = chatId || selectedChat;
        if (!targetChatId) {
            throw new Error(ERROR_MESSAGES.SOMETHING_WENT_WRONG);
        }

        try {
            const uploadResults = await uploadFiles(files, targetChatId);
            const successfulUploads = uploadResults.filter(result => result.success);

            if (successfulUploads.length > 0) {
                // Wait for all uploads to complete
                const uploadPromises = successfulUploads.map(result => result.upload.promise);
                const completedUploads = await Promise.all(uploadPromises);

                // Create attachments array
                const attachments = completedUploads.map(upload => ({
                    type: upload.fileType,
                    name: upload.fileName,
                    size: upload.fileSize,
                    url: upload.fileUrl,
                    uploadId: upload.uploadId,
                }));

                // Send message with attachments
                const messageContent = message.trim() ||
                    `Shared ${attachments.length} file${attachments.length > 1 ? 's' : ''}`;

                const sentMessage = sendMessage(targetChatId, messageContent, 'file', attachments);

                // Update chat last message
                updateChatLastMessage(targetChatId, sentMessage);

                return {
                    success: true,
                    message: SUCCESS_MESSAGES.FILE_UPLOADED,
                    attachments,
                    failedUploads: uploadResults.filter(result => !result.success),
                };
            } else {
                throw new Error(ERROR_MESSAGES.FILE_UPLOAD_FAILED);
            }
        } catch (error) {
            console.error('Upload and send error:', error);
            throw error;
        }
    }, [uploadFiles, selectedChat, sendMessage, updateChatLastMessage]);

    // ======================
    // UPLOAD CONTROL
    // ======================

    const cancelUpload = useCallback((uploadId) => {
        const upload = uploadingFiles.find(u => u._id === uploadId);
        if (upload && upload.cleanup) {
            upload.cleanup();
        }

        updateFileUpload(uploadId, { status: 'cancelled' });

        setTimeout(() => {
            removeUploadingFile(uploadId);
        }, 1000);
    }, [uploadingFiles, updateFileUpload, removeUploadingFile]);

    const retryUpload = useCallback(async (uploadId) => {
        const upload = uploadingFiles.find(u => u._id === uploadId);
        if (!upload) return;

        try {
            updateFileUpload(uploadId, {
                status: 'uploading',
                progress: 0,
                error: null,
            });

            const cleanup = simulateUpload(uploadId, upload.file);
            updateFileUpload(uploadId, { cleanup });
        } catch (error) {
            updateFileUpload(uploadId, {
                status: 'failed',
                error: error.message,
            });
        }
    }, [uploadingFiles, updateFileUpload, simulateUpload]);

    const clearCompletedUploads = useCallback(() => {
        const completedUploads = uploadingFiles.filter(
            upload => upload.status === 'completed' || upload.status === 'cancelled'
        );

        completedUploads.forEach(upload => {
            removeUploadingFile(upload._id);
        });
    }, [uploadingFiles, removeUploadingFile]);

    // ======================
    // DRAG & DROP HANDLING
    // ======================

    const handleDragEnter = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback(async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            try {
                await uploadAndSendFiles(files);
            } catch (error) {
                console.error('Drop upload error:', error);
            }
        }
    }, [uploadAndSendFiles]);

    const dragHandlers = useMemo(() => ({
        onDragEnter: handleDragEnter,
        onDragLeave: handleDragLeave,
        onDragOver: handleDragOver,
        onDrop: handleDrop,
    }), [handleDragEnter, handleDragLeave, handleDragOver, handleDrop]);

    // ======================
    // FILE UTILITIES
    // ======================

    const getFilePreview = useCallback((file) => {
        const fileType = getFileType(file.name, file.type);

        if (fileType === 'image') {
            return URL.createObjectURL(file);
        }

        return null;
    }, []);

    const formatUploadProgress = useCallback((upload) => {
        if (!upload) return '';

        const { progress, uploadedSize, fileSize } = upload;

        if (upload.status === 'completed') {
            return 'Upload complete';
        }

        if (upload.status === 'failed') {
            return 'Upload failed';
        }

        if (upload.status === 'cancelled') {
            return 'Upload cancelled';
        }

        if (uploadedSize && fileSize) {
            return `${formatFileSize(uploadedSize)} / ${formatFileSize(fileSize)} (${progress}%)`;
        }

        return `${progress}%`;
    }, []);

    // ======================
    // UPLOAD STATISTICS
    // ======================

    const uploadStats = useMemo(() => {
        const total = uploadingFiles.length;
        const uploading = uploadingFiles.filter(u => u.status === 'uploading').length;
        const completed = uploadingFiles.filter(u => u.status === 'completed').length;
        const failed = uploadingFiles.filter(u => u.status === 'failed').length;
        const cancelled = uploadingFiles.filter(u => u.status === 'cancelled').length;

        return {
            total,
            uploading,
            completed,
            failed,
            cancelled,
            hasActiveUploads: uploading > 0,
            hasFailedUploads: failed > 0,
        };
    }, [uploadingFiles]);

    // ======================
    // ERROR MANAGEMENT
    // ======================

    const clearUploadError = useCallback((fileName) => {
        setUploadErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[fileName];
            return newErrors;
        });
    }, []);

    const clearAllUploadErrors = useCallback(() => {
        setUploadErrors({});
    }, []);

    // ======================
    // RETURN INTERFACE
    // ======================

    return {
        // File validation
        validateFiles,
        canUploadFile,
        supportedTypes,

        // Upload actions
        uploadFile,
        uploadFiles,
        uploadAndSendFiles,

        // Upload control
        cancelUpload,
        retryUpload,
        clearCompletedUploads,

        // Drag & drop
        dragActive,
        dragHandlers,

        // Upload data
        uploadingFiles,
        recentFiles,
        uploadStats,

        // Upload errors
        uploadErrors,
        clearUploadError,
        clearAllUploadErrors,

        // Utilities
        getFilePreview,
        formatUploadProgress,

        // File helpers
        getFileType,
        getFileIcon,
        formatFileSize,
    };
};

export default useFileUpload;