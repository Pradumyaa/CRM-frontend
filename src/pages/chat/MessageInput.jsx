import React, { useState, useEffect } from "react";
import { Send } from "lucide-react";
import useChatStore from "@/store/chatSlice";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { selectedChat, sendMessage, employeeId, activeTab } = useChatStore();

  const handleSend = () => {
    if (!text.trim() || !selectedChat || !employeeId) return;
    
    console.log("handleSend called with:", { text, selectedChat, employeeId });
    
    // Call sendMessage with just the text
    // The store's sendMessage implementation will handle the chatId construction
    sendMessage(text.trim());
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Handle typing status
  useEffect(() => {
    if (text.trim() && !isTyping) {
      setIsTyping(true);
    } else if (!text.trim() && isTyping) {
      setIsTyping(false);
    }
  }, [text, isTyping]);

  return (
    <div className="p-4 border-t flex items-center gap-2 bg-white rounded-b-lg">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={selectedChat ? "Type a message..." : "Select a chat to send a message"}
        className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none max-h-32"
        rows={1}
        disabled={!selectedChat}
      />
      <button
        onClick={handleSend}
        disabled={!text.trim() || !selectedChat}
        className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        aria-label="Send message"
      >
        <Send size={20} />
      </button>
    </div>
  );
};

export default MessageInput;