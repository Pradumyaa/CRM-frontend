// src/pages/chat/components/Chat/ChatInput.jsx
import React, { useState, useCallback } from "react";
import { Mic, Send } from "lucide-react";
import MessageInput from "../Input/MessageInput";
import VoiceRecorder from "../Input/VoiceRecorder";
import Button from "../UI/Button";
import Tooltip from "../UI/Tooltip";
import useChat from "../../hooks/useChat";

const ChatInput = ({
  className = "",
  placeholder = "Type a message...",
  showVoiceRecorder = true,
  autoFocus = false,
}) => {
  const [inputMode, setInputMode] = useState("text"); // 'text' | 'voice'
  const [isRecording, setIsRecording] = useState(false);

  const { currentChat, sendChatMessage } = useChat();

  // ======================
  // EVENT HANDLERS
  // ======================

  const handleMessageSend = useCallback((message) => {
    console.log("Message sent:", message);
    // MessageInput component handles the actual sending
  }, []);

  const handleVoiceRecordStart = useCallback(() => {
    setInputMode("voice");
    setIsRecording(true);
  }, []);

  const handleVoiceRecordSend = useCallback(
    async (audioFile, duration) => {
      try {
        // TODO: Upload audio file and send as voice note
        console.log("Voice note:", { audioFile, duration });

        // For now, just send a text message indicating voice note
        await sendChatMessage(
          `🎵 Voice note (${Math.floor(duration)}s)`,
          "voice_note"
        );

        setInputMode("text");
        setIsRecording(false);
      } catch (error) {
        console.error("Failed to send voice note:", error);
      }
    },
    [sendChatMessage]
  );

  const handleVoiceRecordCancel = useCallback(() => {
    setInputMode("text");
    setIsRecording(false);
  }, []);

  // ======================
  // RENDER
  // ======================

  if (!currentChat) {
    return (
      <div
        className={`p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 ${className}`}
      >
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="text-sm">Select a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 ${className}`}
    >
      {inputMode === "voice" ? (
        // Voice Recording Mode
        <div className="space-y-4">
          <VoiceRecorder
            onSend={handleVoiceRecordSend}
            onCancel={handleVoiceRecordCancel}
            maxDuration={300} // 5 minutes
          />
        </div>
      ) : (
        // Text Input Mode
        <div className="flex items-end gap-3">
          {/* Main Message Input */}
          <div className="flex-1">
            <MessageInput
              placeholder={placeholder}
              onSend={handleMessageSend}
              autoFocus={autoFocus}
              className="w-full"
            />
          </div>

          {/* Voice Record Button */}
          {showVoiceRecorder && (
            <div className="flex-shrink-0">
              <Tooltip content="Record voice note">
                <Button
                  size="md"
                  variant="ghost"
                  icon={Mic}
                  onClick={handleVoiceRecordStart}
                  className="h-10 w-10 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                />
              </Tooltip>
            </div>
          )}
        </div>
      )}

      {/* Input Mode Indicator */}
      {inputMode === "voice" && (
        <div className="mt-2 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Recording voice note... Tap to send or cancel
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatInput;
