// src/pages/chat/components/Input/MessageInput.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  Paperclip,
  Smile,
  Mic,
  MicOff,
  X,
  Plus,
  AtSign,
  Square,
  AlertCircle,
  Bold,
  Italic,
  Code,
  Link,
} from "lucide-react";
import Button from "../UI/Button";
import Tooltip from "../UI/Tooltip";
import LoadingSpinner from "../UI/LoadingSpinner";
import useChatStore from "../../store/chatStore";
import {
  KEYBOARD_SHORTCUTS,
  MESSAGE_LIMITS,
  COMMON_EMOJIS,
  ERROR_MESSAGES,
} from "../../utils/constants";
import { validateMessage, parseMentions, debounce } from "../../utils/helper";

const MessageInput = ({
  placeholder = "Type a message...",
  disabled = false,
  className = "",
  onSend = null,
  autoFocus = false,
}) => {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordingIntervalRef = useRef(null);
  const audioChunksRef = useRef([]);

  // UI State
  const [showEmojis, setShowEmojis] = useState(false);
  const [showFormatting, setShowFormatting] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingError, setRecordingError] = useState(null);

  // Upload State
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadErrors, setUploadErrors] = useState({});

  const {
    selectedChat,
    drafts,
    sendMessage,
    setDraft,
    getDraft,
    users,
    currentUser,
    setTyping,
  } = useChatStore();

  const [content, setContent] = useState("");

  // Load draft when chat changes
  useEffect(() => {
    if (selectedChat) {
      const draft = getDraft(selectedChat);
      setContent(draft || "");
    }
  }, [selectedChat, getDraft]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = Math.min(textareaRef.current.scrollHeight, 120);
      textareaRef.current.style.height = `${newHeight}px`;
      setIsExpanded(newHeight > 40);
    }
  }, [content]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  // ======================
  // INPUT HANDLERS
  // ======================

  const handleInputChange = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      const newContent = e.target.value;
      setContent(newContent);

      // Save draft without causing re-renders
      if (selectedChat) {
        setDraft(selectedChat, newContent);
      }

      // Handle typing indicators
      if (newContent.trim() && !isComposing) {
        setTyping(selectedChat, currentUser._id, true);

        // Auto-stop typing after 3 seconds
        setTimeout(() => {
          setTyping(selectedChat, currentUser._id, false);
        }, 3000);
      }

      // Check for mentions
      const textarea = e.target;
      const cursorPos = textarea.selectionStart;
      const textBeforeCursor = newContent.substring(0, cursorPos);
      const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

      if (mentionMatch) {
        setMentionQuery(mentionMatch[1]);
        setShowMentions(true);
      } else {
        setShowMentions(false);
        setMentionQuery("");
      }

      setCursorPosition(cursorPos);
    },
    [selectedChat, setDraft, isComposing, setTyping, currentUser]
  );

  const handleKeyDown = useCallback(
    (e) => {
      // Handle Enter key
      if (e.key === "Enter" && !e.shiftKey && !isComposing) {
        e.preventDefault();
        e.stopPropagation();
        handleSendMessage();
        return;
      }

      // Handle Escape key
      if (e.key === "Escape") {
        setShowEmojis(false);
        setShowFormatting(false);
        setShowMentions(false);
        return;
      }

      // Handle formatting shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "b":
            e.preventDefault();
            insertFormatting("**", "**", "bold text");
            break;
          case "i":
            e.preventDefault();
            insertFormatting("_", "_", "italic text");
            break;
          case "`":
            e.preventDefault();
            insertFormatting("`", "`", "code");
            break;
          case "k":
            e.preventDefault();
            insertFormatting("[", "](url)", "link text");
            break;
        }
      }
    },
    [isComposing, showMentions]
  );

  // ======================
  // MESSAGE SENDING
  // ======================

  const handleSendMessage = useCallback(async () => {
    if (!content.trim() || disabled || !selectedChat) return;

    const validation = validateMessage(content, MESSAGE_LIMITS.MAX_LENGTH);
    if (!validation.isValid) {
      console.error("Message validation failed:", validation.errors);
      return;
    }

    try {
      // Send message
      sendMessage(selectedChat, content.trim());

      // Clear input
      setContent("");

      // Clear draft
      if (selectedChat) {
        setDraft(selectedChat, "");
      }

      // Reset UI state
      setShowEmojis(false);
      setShowFormatting(false);
      setShowMentions(false);

      // Focus back on input
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 0);

      // Custom onSend callback
      if (onSend) {
        onSend(content.trim());
      }

      // Stop typing indicator
      setTyping(selectedChat, currentUser._id, false);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }, [
    content,
    disabled,
    selectedChat,
    sendMessage,
    setDraft,
    onSend,
    setTyping,
    currentUser,
  ]);

  // ======================
  // FILE HANDLING
  // ======================

  const handleFileSelect = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      const files = Array.from(e.target.files || []);
      if (files.length > 0 && selectedChat) {
        handleFileUpload(files);
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [selectedChat]
  );

  const handleFileUpload = useCallback(
    async (files) => {
      if (!selectedChat) return;

      try {
        for (const file of files) {
          const uploadId = `upload-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`;

          // Initialize upload progress
          setUploadProgress((prev) => ({ ...prev, [uploadId]: 0 }));

          // Create file URL for immediate display
          const fileUrl = URL.createObjectURL(file);

          // Send file message immediately with local URL
          const fileMessage = `📁 ${file.name} (${formatFileSize(file.size)})`;
          sendMessage(selectedChat, fileMessage, "file", [
            {
              type: getFileType(file.name, file.type),
              name: file.name,
              size: file.size,
              url: fileUrl,
            },
          ]);

          // Simulate upload progress
          let progress = 0;
          const interval = setInterval(() => {
            progress += Math.random() * 15 + 5; // 5-20% increments
            if (progress >= 100) {
              progress = 100;
              clearInterval(interval);

              // Complete upload
              setUploadProgress((prev) => {
                const newProgress = { ...prev };
                delete newProgress[uploadId];
                return newProgress;
              });
            } else {
              setUploadProgress((prev) => ({
                ...prev,
                [uploadId]: Math.floor(progress),
              }));
            }
          }, 300);
        }
      } catch (error) {
        console.error("File upload error:", error);
        setUploadErrors((prev) => ({ ...prev, [Date.now()]: error.message }));
      }
    },
    [selectedChat, sendMessage]
  );

  // ======================
  // VOICE RECORDING
  // ======================

  const startRecording = useCallback(async () => {
    try {
      setRecordingError(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "audio/wav",
      });

      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        try {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: recorder.mimeType || "audio/wav",
          });

          if (audioBlob.size > 0) {
            const audioUrl = URL.createObjectURL(audioBlob);

            // Send voice message
            sendMessage(
              selectedChat,
              `🎵 Voice message (${recordingTime}s)`,
              "voice",
              [
                {
                  type: "audio",
                  name: `voice_${Date.now()}.${
                    recorder.mimeType?.includes("webm") ? "webm" : "wav"
                  }`,
                  size: audioBlob.size,
                  url: audioUrl,
                  duration: recordingTime,
                },
              ]
            );
          }

          // Stop all tracks
          stream.getTracks().forEach((track) => track.stop());
        } catch (error) {
          console.error("Error processing voice message:", error);
          setRecordingError("Failed to process voice message");
        }
      };

      recorder.onerror = (event) => {
        console.error("Recording error:", event.error);
        setRecordingError("Recording failed");
      };

      mediaRecorderRef.current = recorder;
      recorder.start(100); // Collect data every 100ms

      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Failed to start recording:", error);
      setRecordingError(
        "Could not access microphone. Please check permissions."
      );
    }
  }, [selectedChat, sendMessage, recordingTime]);

  const stopRecording = useCallback(() => {
    try {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }

      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }

      setIsRecording(false);
      setRecordingTime(0);
    } catch (error) {
      console.error("Error stopping recording:", error);
      setRecordingError("Failed to stop recording");
    }
  }, []);

  // ======================
  // FORMATTING FUNCTIONS
  // ======================

  const insertFormatting = useCallback(
    (before, after, placeholder = "") => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);
      const textToInsert = selectedText || placeholder;
      const newText =
        content.substring(0, start) +
        before +
        textToInsert +
        after +
        content.substring(end);

      setContent(newText);
      if (selectedChat) {
        setDraft(selectedChat, newText);
      }

      // Set cursor position after formatting
      setTimeout(() => {
        const newCursorPos = selectedText
          ? start + before.length + textToInsert.length + after.length
          : start + before.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        textarea.focus();
      }, 0);
    },
    [content, selectedChat, setDraft]
  );

  const insertEmoji = useCallback(
    (emoji) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const newContent =
        content.substring(0, start) + emoji + content.substring(start);

      setContent(newContent);
      if (selectedChat) {
        setDraft(selectedChat, newContent);
      }

      // Move cursor after emoji
      setTimeout(() => {
        const newPos = start + emoji.length;
        textarea.setSelectionRange(newPos, newPos);
        textarea.focus();
      }, 0);

      setShowEmojis(false);
    },
    [content, selectedChat, setDraft]
  );

  const insertMention = useCallback(
    (user) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const beforeCursor = content.substring(0, cursorPosition);
      const afterCursor = content.substring(cursorPosition);
      const beforeMention = beforeCursor.replace(/@\w*$/, "");
      const mention = `@${user.name.replace(/\s+/g, "")} `;

      const newContent = beforeMention + mention + afterCursor;
      setContent(newContent);
      if (selectedChat) {
        setDraft(selectedChat, newContent);
      }

      setShowMentions(false);
      setMentionQuery("");

      // Move cursor after mention
      setTimeout(() => {
        const newPos = beforeMention.length + mention.length;
        textarea.setSelectionRange(newPos, newPos);
        textarea.focus();
      }, 0);
    },
    [content, cursorPosition, selectedChat, setDraft]
  );

  // ======================
  // HELPER FUNCTIONS
  // ======================

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileType = (filename, mimeType) => {
    const extension = filename.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(extension)) {
      return "image";
    }
    if (["mp4", "avi", "mov", "wmv"].includes(extension)) {
      return "video";
    }
    if (["mp3", "wav", "flac", "aac", "webm"].includes(extension)) {
      return "audio";
    }
    return "file";
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // ======================
  // FILTERED DATA
  // ======================

  const filteredUsers = users
    .filter(
      (user) =>
        user.name.toLowerCase().includes(mentionQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(mentionQuery.toLowerCase())
    )
    .slice(0, 5);

  // ======================
  // RENDER HELPERS
  // ======================

  const renderFormatting = () => (
    <div className="absolute bottom-12 left-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 flex gap-1 z-50">
      <Tooltip content="Bold (Ctrl+B)">
        <Button
          variant="ghost"
          size="xs"
          icon={Bold}
          onClick={() => insertFormatting("**", "**", "bold text")}
        />
      </Tooltip>
      <Tooltip content="Italic (Ctrl+I)">
        <Button
          variant="ghost"
          size="xs"
          icon={Italic}
          onClick={() => insertFormatting("_", "_", "italic text")}
        />
      </Tooltip>
      <Tooltip content="Code (Ctrl+`)">
        <Button
          variant="ghost"
          size="xs"
          icon={Code}
          onClick={() => insertFormatting("`", "`", "code")}
        />
      </Tooltip>
      <Tooltip content="Link (Ctrl+K)">
        <Button
          variant="ghost"
          size="xs"
          icon={Link}
          onClick={() => insertFormatting("[", "](url)", "link text")}
        />
      </Tooltip>
    </div>
  );

  const renderEmojiPicker = () => (
    <div className="absolute bottom-12 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 z-50 w-64">
      <div className="grid grid-cols-8 gap-1 max-h-32 overflow-y-auto">
        {COMMON_EMOJIS.map((emoji, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              insertEmoji(emoji);
            }}
            className="w-8 h-8 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center justify-center text-lg transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );

  const renderMentions = () => (
    <div className="absolute bottom-12 left-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 z-50 min-w-48">
      {filteredUsers.length > 0 ? (
        filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              insertMention(user);
            }}
            className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex items-center gap-2 transition-colors"
          >
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-medium text-sm">{user.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {user.email}
              </div>
            </div>
          </button>
        ))
      ) : (
        <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
          No users found
        </div>
      )}
    </div>
  );

  const renderVoiceRecorder = () => (
    <div className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
      <span className="text-sm font-medium text-red-700 dark:text-red-300">
        Recording {formatTime(recordingTime)}
      </span>
      <Button
        variant="ghost"
        size="xs"
        icon={Square}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          stopRecording();
        }}
        className="text-red-600 dark:text-red-400"
      />
    </div>
  );

  if (!selectedChat) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="text-sm font-medium">
            Select a chat to start messaging
          </div>
          <div className="text-xs mt-1">Or create a new conversation</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Errors */}
      {recordingError && (
        <div className="mb-3 p-3 bg-red-50/80 dark:bg-red-900/30 backdrop-blur-sm rounded-lg border border-red-200 dark:border-red-800/50 flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span className="text-sm text-red-700 dark:text-red-300">
              {recordingError}
            </span>
          </div>
          <Button
            variant="ghost"
            size="xs"
            icon={X}
            onClick={() => setRecordingError(null)}
            className="text-red-500 hover:bg-red-100/50 dark:hover:bg-red-900/20"
          />
        </div>
      )}

      {/* Voice Recording Indicator */}
      {isRecording && (
        <div className="mb-3">
          <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-gradient-to-r from-red-50/80 to-orange-50/80 dark:from-red-900/20 dark:to-orange-900/10 backdrop-blur-sm border border-red-200 dark:border-red-800/50 rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse absolute inset-0" />
                <div className="w-3 h-3 bg-red-500 rounded-full animate-ping absolute inset-0 opacity-75" />
              </div>
              <span className="text-sm font-medium text-red-700 dark:text-red-300">
                Recording {formatTime(recordingTime)}
              </span>
            </div>
            <Button
              variant="danger"
              size="sm"
              icon={Square}
              onClick={stopRecording}
              className="shadow-none"
            />
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="mb-3 space-y-2">
          {Object.entries(uploadProgress).map(([id, progress]) => (
            <div
              key={id}
              className="flex items-center gap-3 p-3 bg-blue-50/80 dark:bg-blue-900/20 backdrop-blur-sm border border-blue-200 dark:border-blue-800/50 rounded-lg shadow-sm"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  Uploading file...
                </div>
                <div className="w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-1.5 mt-1.5">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-1.5 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {progress}%
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Main Input Container */}
      <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md">
        {/* Popups */}
        {showFormatting && (
          <div className="absolute bottom-14 left-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 flex gap-1 z-50 backdrop-blur-sm">
            <Tooltip content="Bold (Ctrl+B)">
              <Button
                variant="ghost"
                size="xs"
                icon={Bold}
                onClick={() => insertFormatting("**", "**", "bold text")}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              />
            </Tooltip>
            <Tooltip content="Italic (Ctrl+I)">
              <Button
                variant="ghost"
                size="xs"
                icon={Italic}
                onClick={() => insertFormatting("_", "_", "italic text")}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              />
            </Tooltip>
            <Tooltip content="Code (Ctrl+`)">
              <Button
                variant="ghost"
                size="xs"
                icon={Code}
                onClick={() => insertFormatting("`", "`", "code")}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              />
            </Tooltip>
            <Tooltip content="Link (Ctrl+K)">
              <Button
                variant="ghost"
                size="xs"
                icon={Link}
                onClick={() => insertFormatting("[", "](url)", "link text")}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              />
            </Tooltip>
          </div>
        )}

        {showEmojis && (
          <div className="absolute bottom-14 right-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 z-50 w-64 backdrop-blur-sm">
            <div className="grid grid-cols-8 gap-1 max-h-32 overflow-y-auto">
              {COMMON_EMOJIS.map((emoji, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    insertEmoji(emoji);
                  }}
                  className="w-8 h-8 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center justify-center text-lg transition-colors hover:scale-110"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {showMentions && (
          <div className="absolute bottom-14 left-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 z-50 min-w-48 max-h-60 overflow-y-auto backdrop-blur-sm">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <button
                  key={user._id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    insertMention(user);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex items-center gap-3 transition-colors"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate">
                      {user.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                No users found
              </div>
            )}
          </div>
        )}

        {/* Input Area */}
        <div className="flex items-end gap-2 p-3">
          {/* File Upload Button */}
          <Tooltip content="Attach files">
            <Button
              variant="ghost"
              size="sm"
              icon={Paperclip}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              disabled={disabled}
              className="shrink-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            />
          </Tooltip>

          {/* Text Input */}
          <div className="flex-1 relative min-w-0">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              placeholder={placeholder}
              disabled={disabled}
              autoFocus={autoFocus}
              className="w-full resize-none border-0 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none text-sm leading-relaxed min-h-[20px] max-h-[120px] focus:ring-0 p-0"
              style={{ height: "auto" }}
              rows={1}
            />

            {/* Character Count */}
            {content.length > MESSAGE_LIMITS.MAX_LENGTH * 0.8 && (
              <div
                className={`absolute -top-6 right-0 text-xs ${
                  content.length > MESSAGE_LIMITS.MAX_LENGTH
                    ? "text-red-500"
                    : "text-yellow-500"
                }`}
              >
                {content.length}/{MESSAGE_LIMITS.MAX_LENGTH}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Emoji Button */}
            <Tooltip content="Emojis">
              <Button
                variant="ghost"
                size="sm"
                icon={Smile}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowEmojis(!showEmojis);
                }}
                disabled={disabled}
                className={`text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 ${
                  showEmojis ? "bg-gray-100/50 dark:bg-gray-700/50" : ""
                }`}
              />
            </Tooltip>

            {/* Voice/Send Button */}
            {content.trim() ? (
              <Tooltip content="Send message (Enter)">
                <Button
                  variant="primary"
                  size="sm"
                  icon={Send}
                  onClick={handleSendMessage}
                  disabled={
                    disabled || content.length > MESSAGE_LIMITS.MAX_LENGTH
                  }
                  className="shrink-0 shadow-md hover:shadow-lg"
                />
              </Tooltip>
            ) : (
              <Tooltip
                content={
                  isRecording ? "Stop recording" : "Record voice message"
                }
              >
                <Button
                  variant={isRecording ? "danger" : "ghost"}
                  size="sm"
                  icon={isRecording ? MicOff : Mic}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    isRecording ? stopRecording() : startRecording();
                  }}
                  disabled={disabled}
                  className={`shrink-0 ${
                    isRecording
                      ? "shadow-md hover:shadow-lg"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                />
              </Tooltip>
            )}
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
        onChange={handleFileSelect}
        className="hidden"
        onClick={(e) => {
          e.stopPropagation();
        }}
      />
    </div>
  );
};

export default MessageInput;
