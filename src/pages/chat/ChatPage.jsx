// src/pages/chat/ChatPage.jsx - Updated version
import React, { useEffect, useState, useCallback } from "react";
import ChatSidebar from "./components/Chat/ChatSidebar";
import ChatContainer from "./components/Chat/ChatContainer";
import CallInterface from "./components/Calls/CallInterface";
import UserModal from "./components/Modals/UserModal";
import ChannelModal from "./components/Modals/ChannelModal";
import SearchModal from "./components/Modals/SearchModal";
import NotificationsModal from "./components/Modals/NotificationsModal";
import ThemeProvider from "./components/UI/ThemeProvider";
import useChatStore from "./store/chatStore";
import useSocket from "./hooks/useSocket";
import useNotifications from "./hooks/useNotifications";
import { initializeMockData } from "./data/mockData";
import { MODAL_TYPES } from "./utils/constants";

const ChatPage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState(null);

  const {
    activeModal,
    setActiveModal,
    activeCall,
    incomingCall,
    setUsers,
    setChannels,
    setDirectMessages,
    setMessages,
  } = useChatStore();

  const { isConnected } = useSocket();
  const { requestPermission } = useNotifications();

  // ======================
  // INITIALIZATION
  // ======================

  const initializeApp = useCallback(async () => {
    try {
      console.log("Starting app initialization...");

      // Initialize with mock data
      const mockData = initializeMockData();

      // Set data in chunks to avoid overwhelming the store
      setUsers(mockData.users);
      setChannels(mockData.channels);
      setDirectMessages(mockData.directMessages);

      // Set messages for each chat individually
      if (mockData.messages["channel-1"]) {
        setMessages("channel-1", mockData.messages["channel-1"]);
      }
      if (mockData.messages["channel-2"]) {
        setMessages("channel-2", mockData.messages["channel-2"]);
      }
      if (mockData.messages["channel-4"]) {
        setMessages("channel-4", mockData.messages["channel-4"]);
      }
      if (mockData.messages["dm-1-2"]) {
        setMessages("dm-1-2", mockData.messages["dm-1-2"]);
      }
      if (mockData.messages["dm-1-3"]) {
        setMessages("dm-1-3", mockData.messages["dm-1-3"]);
      }

      // Request notification permission
      try {
        await requestPermission();
      } catch (notifError) {
        console.warn("Notification permission failed:", notifError);
      }

      console.log("App initialization completed");
      setIsInitialized(true);
    } catch (error) {
      console.error("Failed to initialize chat app:", error);
      setInitError(error.message);
      setIsInitialized(true); // Still show the app even if initialization fails
    }
  }, [
    setUsers,
    setChannels,
    setDirectMessages,
    setMessages,
    requestPermission,
  ]);

  // Initialize app on mount
  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      if (isMounted) {
        await initializeApp();
      }
    };

    init();

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array to prevent re-initialization

  // ======================
  // MODAL HANDLERS
  // ======================
  const handleCloseModal = useCallback(() => {
    setActiveModal(null);
  }, [setActiveModal]);

  const renderModals = () => (
    <div>
      {/* User Profile/Settings Modal */}
      <UserModal
        isOpen={
          activeModal === MODAL_TYPES.USER_PROFILE ||
          activeModal === MODAL_TYPES.USER_SETTINGS
        }
        onClose={handleCloseModal}
        mode={
          activeModal === MODAL_TYPES.USER_SETTINGS ? "settings" : "profile"
        }
      />

      {/* Channel Modals */}
      <ChannelModal
        isOpen={[
          MODAL_TYPES.CHANNEL_CREATE,
          MODAL_TYPES.CHANNEL_EDIT,
          MODAL_TYPES.CHANNEL_INFO,
          MODAL_TYPES.CHANNEL_MEMBERS,
        ].includes(activeModal)}
        onClose={handleCloseModal}
        mode={
          activeModal === MODAL_TYPES.CHANNEL_CREATE
            ? "create"
            : activeModal === MODAL_TYPES.CHANNEL_EDIT
            ? "edit"
            : activeModal === MODAL_TYPES.CHANNEL_MEMBERS
            ? "members"
            : "info"
        }
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={activeModal === MODAL_TYPES.SEARCH}
        onClose={handleCloseModal}
      />

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={activeModal === MODAL_TYPES.NOTIFICATIONS}
        onClose={handleCloseModal}
      />
    </div>
  );

  // ======================
  // ERROR STATE
  // ======================
  if (initError) {
    return (
      <ThemeProvider>
        <div className="h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Failed to Load Chat
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{initError}</p>
            <button
              onClick={() => {
                setInitError(null);
                setIsInitialized(false);
                initializeApp();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  // ======================
  // LOADING STATE
  // ======================

  if (!isInitialized) {
    return (
      <ThemeProvider>
        <div className="h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Loading Chat
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Setting up your workspace...
            </p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="h-screen bg-gray-100 dark:bg-gray-900 flex overflow-hidden">
        {/* Sidebar */}
        <ChatSidebar
          collapsed={sidebarCollapsed}
          onToggleCollapsed={setSidebarCollapsed}
        />

        {/* Main Chat Area - NOW UNCOMMENTED */}
        <ChatContainer />

        {/* Connection Status */}
        {!isConnected && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-300 px-4 py-2 rounded-lg shadow-lg z-50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Reconnecting...</span>
            </div>
          </div>
        )}

        {/* Call Interface */}
        {(activeCall || incomingCall) && (
          <CallInterface
            isOpen={!!(activeCall || incomingCall)}
            onClose={() => {
              // Handle call close
              console.log("Call interface closed");
            }}
          />
        )}

        {/* Modals */}
        {renderModals()}
      </div>
    </ThemeProvider>
  );
};

export default ChatPage;
