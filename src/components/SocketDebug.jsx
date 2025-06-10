// src/components/SocketDebug.jsx
import React from "react";
import useSocket from "../pages/chat/hooks/useSocket";
import useChatStore from "../pages/chat/store/chatStore";

const SocketDebug = () => {
  const { currentUser } = useChatStore();
  const {
    isConnected,
    isConnecting,
    isDisconnected,
    hasError,
    connectionStatus,
    reconnectAttempts,
    serverUrl,
    connect,
    disconnect,
  } = useSocket();

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "green";
      case "connecting":
        return "orange";
      case "error":
        return "red";
      default:
        return "gray";
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case "connected":
        return "✅";
      case "connecting":
        return "🔄";
      case "error":
        return "❌";
      default:
        return "⚪";
    }
  };

  const testConnection = async () => {
    try {
      const response = await fetch(serverUrl);
      console.log("Server test response:", response.status);
    } catch (error) {
      console.error("Server test failed:", error);
    }
  };

  const testSocketEndpoint = async () => {
    try {
      const response = await fetch(`${serverUrl}/socket.io/`);
      console.log("Socket.IO endpoint test:", response.status);
    } catch (error) {
      console.error("Socket.IO endpoint test failed:", error);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        background: "white",
        border: "2px solid #ccc",
        borderRadius: "8px",
        padding: "15px",
        minWidth: "300px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        zIndex: 9999,
        fontSize: "14px",
      }}
    >
      <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>
        Socket.IO Debug Panel
      </h3>

      <div style={{ marginBottom: "10px" }}>
        <strong>Status:</strong>
        <span style={{ color: getStatusColor(), marginLeft: "5px" }}>
          {getStatusIcon()} {connectionStatus.toUpperCase()}
        </span>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <strong>Server URL:</strong>
        <span
          style={{
            marginLeft: "5px",
            fontFamily: "monospace",
            fontSize: "12px",
          }}
        >
          {serverUrl}
        </span>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <strong>Current User:</strong>
        <span style={{ marginLeft: "5px" }}>
          {currentUser ? `${currentUser.name} (${currentUser._id})` : "None"}
        </span>
      </div>

      {reconnectAttempts > 0 && (
        <div style={{ marginBottom: "10px", color: "orange" }}>
          <strong>Reconnect Attempts:</strong> {reconnectAttempts}/5
        </div>
      )}

      <div style={{ marginBottom: "15px" }}>
        <strong>Flags:</strong>
        <ul style={{ margin: "5px 0", paddingLeft: "20px" }}>
          <li>Connected: {isConnected ? "✅" : "❌"}</li>
          <li>Connecting: {isConnecting ? "✅" : "❌"}</li>
          <li>Disconnected: {isDisconnected ? "✅" : "❌"}</li>
          <li>Has Error: {hasError ? "✅" : "❌"}</li>
        </ul>
      </div>

      <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
        <button
          onClick={connect}
          style={{
            padding: "5px 10px",
            fontSize: "12px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Connect
        </button>

        <button
          onClick={disconnect}
          style={{
            padding: "5px 10px",
            fontSize: "12px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Disconnect
        </button>

        <button
          onClick={testConnection}
          style={{
            padding: "5px 10px",
            fontSize: "12px",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Test Server
        </button>

        <button
          onClick={testSocketEndpoint}
          style={{
            padding: "5px 10px",
            fontSize: "12px",
            backgroundColor: "#FF9800",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Test Socket.IO
        </button>
      </div>

      <div style={{ marginTop: "10px", fontSize: "12px", color: "#666" }}>
        <strong>Debug Tips:</strong>
        <ul style={{ margin: "5px 0", paddingLeft: "20px" }}>
          <li>Check browser console for detailed logs</li>
          <li>Ensure backend server is running on port 3000</li>
          <li>Test server endpoints with the buttons above</li>
          <li>Check Network tab for WebSocket connections</li>
        </ul>
      </div>
    </div>
  );
};

export default SocketDebug;
