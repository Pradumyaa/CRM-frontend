// src/pages/chat/hooks/useSocket.js
import { useEffect, useRef, useCallback, useState } from 'react';
import { io } from 'socket.io-client';
import useChatStore from '../store/chatStore';
import { SOCKET_EVENTS } from '../utils/constants';

/**
 * Socket.IO connection hook for real-time chat functionality
 * Handles connection, events, and automatic reconnection
 */
const useSocket = (serverUrl) => {
    const socketRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const [reconnectAttempts, setReconnectAttempts] = useState(0);

    // Get server URL from environment or parameter
    const getServerUrl = () => {
        if (serverUrl) return serverUrl;

        // Use environment variable if available, otherwise default
        return 'https://getmax-backend.vercel.app';
    };

    const finalServerUrl = getServerUrl();

    const {
        currentUser,
        addMessage,
        updateMessage,
        deleteMessage,
        setTyping,
        setUserOnline,
        setUserOffline,
        updateUser,
        addNotification,
        setIncomingCall,
        updateChannel,
    } = useChatStore();

    // ======================
    // CONNECTION MANAGEMENT
    // ======================

    const connect = useCallback(() => {
        if (socketRef.current?.connected) {
            console.log('Socket already connected');
            return;
        }

        console.log('🔌 Attempting to connect to Socket.IO server:', finalServerUrl);
        setConnectionStatus('connecting');

        try {
            socketRef.current = io(finalServerUrl, {
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                maxReconnectionAttempts: 5,
                timeout: 20000,
                autoConnect: true,
                forceNew: false,
                transports: ['websocket', 'polling'], // Try websocket first, fallback to polling
                upgrade: true,
                withCredentials: true, // Important for CORS
            });

            // Connection successful
            socketRef.current.on('connect', () => {
                console.log('✅ Socket.IO connected successfully to:', finalServerUrl);
                console.log('Socket ID:', socketRef.current.id);
                setConnectionStatus('connected');
                setReconnectAttempts(0);

                // Authenticate user
                if (currentUser) {
                    console.log('📤 Sending user online status:', currentUser._id);
                    socketRef.current.emit(SOCKET_EVENTS.USER_ONLINE, {
                        userId: currentUser._id,
                        userInfo: currentUser,
                    });
                }
            });

            // Connection lost
            socketRef.current.on('disconnect', (reason) => {
                console.log('❌ Socket.IO disconnected:', reason);
                setConnectionStatus('disconnected');

                if (reason === 'io server disconnect') {
                    // Server disconnected - manually reconnect
                    console.log('🔄 Server disconnected, attempting manual reconnect...');
                    setTimeout(() => {
                        if (socketRef.current) {
                            socketRef.current.connect();
                        }
                    }, 1000);
                }
            });

            // Connection error
            socketRef.current.on('connect_error', (error) => {
                console.error('❌ Socket.IO connection error:', {
                    message: error.message,
                    description: error.description,
                    context: error.context,
                    type: error.type,
                    transport: error.transport
                });
                console.error('🎯 Attempted URL:', finalServerUrl);
                console.error('🔧 Available transports:', socketRef.current?.io?.opts?.transports);

                setConnectionStatus('error');
                setReconnectAttempts(prev => prev + 1);

                // Specific error handling
                if (error.message.includes('404')) {
                    console.error('🚨 404 Error - Server not found or Socket.IO endpoint not available');
                    console.error('💡 Make sure your backend server is running on port 3000');
                    console.error('💡 Check if Socket.IO is properly initialized on the backend');
                }
            });

            // Reconnection events
            socketRef.current.on('reconnect', (attemptNumber) => {
                console.log('✅ Socket.IO reconnected after', attemptNumber, 'attempts');
                setConnectionStatus('connected');
                setReconnectAttempts(0);
            });

            socketRef.current.on('reconnect_attempt', (attemptNumber) => {
                console.log('🔄 Socket.IO reconnect attempt:', attemptNumber);
                setReconnectAttempts(attemptNumber);
            });

            socketRef.current.on('reconnect_error', (error) => {
                console.error('❌ Socket.IO reconnect error:', error.message);
            });

            socketRef.current.on('reconnect_failed', () => {
                console.error('❌ Socket.IO reconnect failed - all attempts exhausted');
                setConnectionStatus('error');
            });

            // Setup event listeners
            setupEventListeners();

        } catch (error) {
            console.error('❌ Failed to create Socket.IO connection:', error);
            setConnectionStatus('error');
        }
    }, [finalServerUrl, currentUser]);

    const disconnect = useCallback(() => {
        if (socketRef.current) {
            console.log('🔌 Disconnecting Socket.IO...');

            // Send offline status before disconnecting
            if (currentUser) {
                socketRef.current.emit(SOCKET_EVENTS.USER_OFFLINE, {
                    userId: currentUser._id
                });
            }

            socketRef.current.disconnect();
            socketRef.current = null;
        }

        setConnectionStatus('disconnected');
        setReconnectAttempts(0);
    }, [currentUser]);

    // ======================
    // EVENT EMITTERS
    // ======================

    const emit = useCallback((event, data) => {
        if (socketRef.current?.connected) {
            console.log('📤 Emitting event:', event, data);
            socketRef.current.emit(event, data);
            return true;
        } else {
            console.warn('⚠️ Cannot emit event - Socket not connected:', {
                event,
                connectionStatus,
                serverUrl: finalServerUrl,
                socketExists: !!socketRef.current,
                socketConnected: socketRef.current?.connected
            });
            return false;
        }
    }, [connectionStatus, finalServerUrl]);

    const sendMessage = useCallback((chatId, message) => {
        return emit(SOCKET_EVENTS.MESSAGE_SEND, {
            chatId,
            message: {
                ...message,
                senderId: currentUser?._id,
                timestamp: new Date().toISOString(),
            },
        });
    }, [emit, currentUser]);

    const sendTypingStart = useCallback((chatId) => {
        return emit(SOCKET_EVENTS.TYPING_START, {
            chatId,
            userId: currentUser?._id,
            userInfo: currentUser,
        });
    }, [emit, currentUser]);

    const sendTypingStop = useCallback((chatId) => {
        return emit(SOCKET_EVENTS.TYPING_STOP, {
            chatId,
            userId: currentUser?._id,
        });
    }, [emit, currentUser]);

    const updateUserStatus = useCallback((status) => {
        return emit(SOCKET_EVENTS.USER_STATUS_CHANGE, {
            userId: currentUser?._id,
            status,
        });
    }, [emit, currentUser]);

    const joinChannel = useCallback((channelId) => {
        return emit(SOCKET_EVENTS.CHANNEL_JOIN, {
            channelId,
            userId: currentUser?._id,
        });
    }, [emit, currentUser]);

    const leaveChannel = useCallback((channelId) => {
        return emit(SOCKET_EVENTS.CHANNEL_LEAVE, {
            channelId,
            userId: currentUser?._id,
        });
    }, [emit, currentUser]);

    // ======================
    // CALL METHODS
    // ======================

    const initiateCall = useCallback((targetUserId, callType = 'voice') => {
        return emit(SOCKET_EVENTS.CALL_INITIATE, {
            targetUserId,
            callType,
            callerId: currentUser?._id,
            callerInfo: currentUser,
        });
    }, [emit, currentUser]);

    const acceptCall = useCallback((callId) => {
        return emit(SOCKET_EVENTS.CALL_ACCEPT, {
            callId,
            userId: currentUser?._id,
        });
    }, [emit, currentUser]);

    const declineCall = useCallback((callId, reason = 'declined') => {
        return emit(SOCKET_EVENTS.CALL_DECLINE, {
            callId,
            userId: currentUser?._id,
            reason,
        });
    }, [emit, currentUser]);

    const endCall = useCallback((callId) => {
        return emit(SOCKET_EVENTS.CALL_END, {
            callId,
            userId: currentUser?._id,
        });
    }, [emit, currentUser]);

    // ======================
    // EVENT LISTENERS
    // ======================

    const setupEventListeners = useCallback(() => {
        if (!socketRef.current) return;

        console.log('🎧 Setting up Socket.IO event listeners...');

        // Message events
        socketRef.current.on(SOCKET_EVENTS.MESSAGE_RECEIVE, (data) => {
            console.log('📥 Received message:', data);
            addMessage(data.chatId, data.message);

            // Show notification if not current chat
            const { selectedChat } = useChatStore.getState();
            if (data.chatId !== selectedChat) {
                addNotification({
                    type: 'message',
                    title: `New message from ${data.message.senderName}`,
                    message: data.message.content,
                    chatId: data.chatId,
                    senderId: data.message.senderId,
                });
            }
        });

        socketRef.current.on(SOCKET_EVENTS.MESSAGE_UPDATE, (data) => {
            console.log('📝 Message updated:', data);
            updateMessage(data.chatId, data.messageId, data.updates);
        });

        socketRef.current.on(SOCKET_EVENTS.MESSAGE_DELETE, (data) => {
            console.log('🗑️ Message deleted:', data);
            deleteMessage(data.chatId, data.messageId);
        });

        // Typing events
        socketRef.current.on(SOCKET_EVENTS.TYPING_START, (data) => {
            console.log('⌨️ User started typing:', data);
            setTyping(data.chatId, data.userId, true);
        });

        socketRef.current.on(SOCKET_EVENTS.TYPING_STOP, (data) => {
            console.log('⌨️ User stopped typing:', data);
            setTyping(data.chatId, data.userId, false);
        });

        // User presence events
        socketRef.current.on(SOCKET_EVENTS.USER_ONLINE, (data) => {
            console.log('🟢 User came online:', data);
            setUserOnline(data.userId);
            if (data.userInfo) {
                updateUser(data.userId, data.userInfo);
            }
        });

        socketRef.current.on(SOCKET_EVENTS.USER_OFFLINE, (data) => {
            console.log('🔴 User went offline:', data);
            setUserOffline(data.userId);
        });

        socketRef.current.on(SOCKET_EVENTS.USER_STATUS_CHANGE, (data) => {
            console.log('👤 User status changed:', data);
            updateUser(data.userId, { status: data.status });
        });

        // Channel events
        socketRef.current.on(SOCKET_EVENTS.CHANNEL_UPDATE, (data) => {
            console.log('📢 Channel updated:', data);
            updateChannel(data.channelId, data.updates);
        });

        // Call events
        socketRef.current.on(SOCKET_EVENTS.CALL_INITIATE, (data) => {
            console.log('📞 Incoming call:', data);
            setIncomingCall({
                _id: data.callId,
                type: data.callType,
                caller: data.callerInfo,
                timestamp: new Date().toISOString(),
            });

            addNotification({
                type: 'call_incoming',
                title: `Incoming ${data.callType} call`,
                message: `${data.callerInfo.name} is calling you`,
                senderId: data.callerInfo._id,
            });
        });

        socketRef.current.on(SOCKET_EVENTS.CALL_ACCEPT, (data) => {
            console.log('✅ Call accepted:', data);
        });

        socketRef.current.on(SOCKET_EVENTS.CALL_DECLINE, (data) => {
            console.log('❌ Call declined:', data);
            setIncomingCall(null);
        });

        socketRef.current.on(SOCKET_EVENTS.CALL_END, (data) => {
            console.log('📞 Call ended:', data);
            setIncomingCall(null);
        });

        // Error handling
        socketRef.current.on(SOCKET_EVENTS.ERROR, (data) => {
            console.error('❌ Socket error:', data);
        });

        // Generic error handling
        socketRef.current.on('error', (error) => {
            console.error('❌ Generic socket error:', error);
        });

        console.log('✅ Socket.IO event listeners setup complete');

    }, [
        addMessage,
        updateMessage,
        deleteMessage,
        setTyping,
        setUserOnline,
        setUserOffline,
        updateUser,
        addNotification,
        setIncomingCall,
        updateChannel,
    ]);

    // ======================
    // CONNECTION STATUS
    // ======================

    const isConnected = connectionStatus === 'connected';
    const isConnecting = connectionStatus === 'connecting';
    const isDisconnected = connectionStatus === 'disconnected';
    const hasError = connectionStatus === 'error';

    // ======================
    // EFFECTS
    // ======================

    // Auto-connect when currentUser is available
    useEffect(() => {
        if (currentUser && !socketRef.current) {
            console.log('👤 Current user available, initializing Socket.IO connection...');
            connect();
        }
    }, [currentUser, connect]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            console.log('🧹 Cleaning up Socket.IO connection...');
            disconnect();
        };
    }, [disconnect]);

    // Send user online status when connected
    useEffect(() => {
        if (isConnected && currentUser) {
            console.log('📤 Sending user online status on connection...');
            emit(SOCKET_EVENTS.USER_ONLINE, {
                userId: currentUser._id,
                userInfo: currentUser,
            });
        }
    }, [isConnected, currentUser, emit]);

    // Log connection status changes
    useEffect(() => {
        console.log(`🔄 Socket connection status changed: ${connectionStatus}`);
        if (hasError && reconnectAttempts > 0) {
            console.log(`🔄 Reconnect attempts: ${reconnectAttempts}/5`);
        }
    }, [connectionStatus, hasError, reconnectAttempts]);

    // ======================
    // RETURN INTERFACE
    // ======================

    return {
        // Connection status
        isConnected,
        isConnecting,
        isDisconnected,
        hasError,
        connectionStatus,
        reconnectAttempts,
        serverUrl: finalServerUrl,

        // Connection control
        connect,
        disconnect,

        // Message methods
        sendMessage,
        sendTypingStart,
        sendTypingStop,

        // User methods
        updateUserStatus,
        joinChannel,
        leaveChannel,

        // Call methods
        initiateCall,
        acceptCall,
        declineCall,
        endCall,

        // Raw emit function for custom events
        emit,
    };
};

export default useSocket;