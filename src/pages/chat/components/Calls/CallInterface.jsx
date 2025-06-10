// src/pages/chat/components/Calls/CallInterface.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Phone,
  PhoneOff,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  MonitorOff,
  Settings,
  Users,
  MessageSquare,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  RotateCcw,
  Wifi,
  WifiOff,
} from "lucide-react";
import Button from "../UI/Button";
import Avatar from "../UI/Avatar";
import Tooltip from "../UI/Tooltip";
import LoadingSpinner from "../UI/LoadingSpinner";
import CallControls from "./CallControls";
import CallNotification from "./CallNotification";
import useChatStore from "../../store/chatStore";
import useSocket from "../../hooks/useSocket";
import { formatCallDuration } from "../../utils/helper";
import { CALL_TYPES, CALL_STATUS, CALL_QUALITY } from "../../utils/constants";

const CallInterface = ({ isOpen = false, onClose = null, className = "" }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localVideoEnabled, setLocalVideoEnabled] = useState(true);
  const [localAudioEnabled, setLocalAudioEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState(CALL_QUALITY.GOOD);
  const [callDuration, setCallDuration] = useState(0);
  const [showChat, setShowChat] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const callTimerRef = useRef(null);

  const {
    activeCall,
    incomingCall,
    currentUser,
    users,
    endCall,
    setIncomingCall,
  } = useChatStore();

  const {
    isConnected,
    initiateCall,
    acceptCall,
    declineCall,
    endCall: socketEndCall,
  } = useSocket();

  const callParticipants = activeCall?.participants || [];
  const otherParticipants = callParticipants.filter(
    (id) => id !== currentUser?._id
  );
  const otherParticipant =
    otherParticipants.length > 0
      ? users.find((u) => u._id === otherParticipants[0])
      : null;

  // ======================
  // MEDIA STREAM MANAGEMENT
  // ======================

  const startLocalStream = useCallback(async (video = true, audio = true) => {
    try {
      const constraints = {
        video: video
          ? {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              frameRate: { ideal: 30 },
            }
          : false,
        audio: audio
          ? {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            }
          : false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      return stream;
    } catch (error) {
      console.error("Failed to get local stream:", error);
      throw error;
    }
  }, []);

  const stopLocalStream = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
  }, []);

  const startScreenShare = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      // Replace video track in peer connection
      if (peerConnectionRef.current) {
        const sender = peerConnectionRef.current
          .getSenders()
          .find((s) => s.track && s.track.kind === "video");

        if (sender) {
          await sender.replaceTrack(stream.getVideoTracks()[0]);
        }
      }

      setScreenSharing(true);

      // Handle screen share end
      stream.getVideoTracks()[0].onended = () => {
        setScreenSharing(false);
        // Switch back to camera
        if (localVideoEnabled) {
          startLocalStream(true, localAudioEnabled);
        }
      };

      return stream;
    } catch (error) {
      console.error("Failed to start screen share:", error);
      throw error;
    }
  }, [localVideoEnabled, localAudioEnabled, startLocalStream]);

  // ======================
  // CALL CONTROLS
  // ======================

  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !localVideoEnabled;
        setLocalVideoEnabled(!localVideoEnabled);
      }
    }
  }, [localVideoEnabled]);

  const toggleAudio = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !localAudioEnabled;
        setLocalAudioEnabled(!localAudioEnabled);
      }
    }
  }, [localAudioEnabled]);

  const toggleScreenShare = useCallback(async () => {
    if (screenSharing) {
      setScreenSharing(false);
      // Switch back to camera
      if (localVideoEnabled) {
        await startLocalStream(true, localAudioEnabled);
      }
    } else {
      await startScreenShare();
    }
  }, [
    screenSharing,
    localVideoEnabled,
    localAudioEnabled,
    startLocalStream,
    startScreenShare,
  ]);

  const handleEndCall = useCallback(() => {
    if (activeCall) {
      socketEndCall(activeCall._id);
      endCall();
    }

    stopLocalStream();

    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
    }

    if (onClose) {
      onClose();
    }
  }, [activeCall, socketEndCall, endCall, stopLocalStream, onClose]);

  const handleAcceptCall = useCallback(async () => {
    if (incomingCall) {
      try {
        await startLocalStream(true, true);
        acceptCall(incomingCall._id);
        setIncomingCall(null);
      } catch (error) {
        console.error("Failed to accept call:", error);
      }
    }
  }, [incomingCall, acceptCall, setIncomingCall, startLocalStream]);

  const handleDeclineCall = useCallback(() => {
    if (incomingCall) {
      declineCall(incomingCall._id);
      setIncomingCall(null);
    }
  }, [incomingCall, declineCall, setIncomingCall]);

  // ======================
  // CALL TIMER
  // ======================

  useEffect(() => {
    if (activeCall && activeCall.status === "active") {
      callTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
      setCallDuration(0);
    }

    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [activeCall]);

  // ======================
  // INITIALIZATION
  // ======================

  useEffect(() => {
    if (activeCall && isOpen) {
      startLocalStream(activeCall.type === CALL_TYPES.VIDEO, true);
    }

    return () => {
      stopLocalStream();
    };
  }, [activeCall, isOpen, startLocalStream, stopLocalStream]);

  // ======================
  // RENDER HELPERS
  // ======================

  const renderConnectionStatus = () => {
    const statusConfig = {
      [CALL_QUALITY.EXCELLENT]: {
        color: "text-green-600",
        icon: Wifi,
        text: "Excellent",
      },
      [CALL_QUALITY.GOOD]: {
        color: "text-green-500",
        icon: Wifi,
        text: "Good",
      },
      [CALL_QUALITY.FAIR]: {
        color: "text-yellow-500",
        icon: Wifi,
        text: "Fair",
      },
      [CALL_QUALITY.POOR]: {
        color: "text-red-500",
        icon: WifiOff,
        text: "Poor",
      },
    };

    const config = statusConfig[connectionQuality];
    const IconComponent = config.icon;

    return (
      <div className={`flex items-center gap-1 text-xs ${config.color}`}>
        <IconComponent className="w-3 h-3" />
        <span>{config.text}</span>
      </div>
    );
  };

  const renderParticipantVideo = (participant, isLocal = false) => {
    return (
      <div
        className={`relative bg-gray-900 rounded-lg overflow-hidden ${
          isLocal ? "w-48 h-36" : "flex-1"
        }`}
      >
        {/* Video Element */}
        <video
          ref={isLocal ? localVideoRef : remoteVideoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className="w-full h-full object-cover"
        />

        {/* Overlay when video is disabled */}
        {(!localVideoEnabled && isLocal) || (!participant && !isLocal) ? (
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
            <Avatar
              src={participant?.avatar}
              alt={participant?.name}
              size={isLocal ? "lg" : "2xl"}
            />
          </div>
        ) : null}

        {/* Participant Info */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
            <span className="text-white text-xs font-medium">
              {isLocal ? "You" : participant?.name}
            </span>
          </div>

          {/* Audio indicator */}
          {!localAudioEnabled && isLocal && (
            <div className="bg-red-500 rounded-full p-1">
              <MicOff className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        {/* Screen sharing indicator */}
        {screenSharing && isLocal && (
          <div className="absolute top-3 right-3 bg-blue-500 rounded-lg px-2 py-1">
            <span className="text-white text-xs font-medium">
              Screen Sharing
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderCallHeader = () => (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <Avatar
          src={otherParticipant?.avatar}
          alt={otherParticipant?.name}
          size="sm"
          status={otherParticipant?.status}
        />
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">
            {otherParticipant?.name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>
              {activeCall?.status === "connecting"
                ? "Connecting..."
                : activeCall?.status === "ringing"
                ? "Ringing..."
                : formatCallDuration(callDuration)}
            </span>
            {renderConnectionStatus()}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Tooltip content="Toggle chat">
          <Button
            size="sm"
            variant="ghost"
            icon={MessageSquare}
            onClick={() => setShowChat(!showChat)}
            className={showChat ? "bg-blue-100 dark:bg-blue-900/30" : ""}
          />
        </Tooltip>

        <Tooltip content={isMinimized ? "Maximize" : "Minimize"}>
          <Button
            size="sm"
            variant="ghost"
            icon={isMinimized ? Maximize : Minimize}
            onClick={() => setIsMinimized(!isMinimized)}
          />
        </Tooltip>
      </div>
    </div>
  );

  // ======================
  // RENDER MAIN INTERFACE
  // ======================

  if (!isOpen && !incomingCall) {
    return null;
  }

  // Incoming call notification
  if (incomingCall && !activeCall) {
    return (
      <CallNotification
        call={incomingCall}
        onAccept={handleAcceptCall}
        onDecline={handleDeclineCall}
      />
    );
  }

  // Minimized call window
  if (isMinimized && activeCall) {
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 min-w-64">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Avatar
              src={otherParticipant?.avatar}
              alt={otherParticipant?.name}
              size="xs"
            />
            <span className="text-sm font-medium">
              {otherParticipant?.name}
            </span>
          </div>
          <Button
            size="xs"
            variant="ghost"
            icon={Maximize}
            onClick={() => setIsMinimized(false)}
          />
        </div>

        <div className="flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant={localAudioEnabled ? "ghost" : "danger"}
            icon={localAudioEnabled ? Mic : MicOff}
            onClick={toggleAudio}
          />

          {activeCall?.type === CALL_TYPES.VIDEO && (
            <Button
              size="sm"
              variant={localVideoEnabled ? "ghost" : "danger"}
              icon={localVideoEnabled ? Video : VideoOff}
              onClick={toggleVideo}
            />
          )}

          <Button
            size="sm"
            variant="danger"
            icon={PhoneOff}
            onClick={handleEndCall}
          />
        </div>
      </div>
    );
  }

  // Full call interface
  return (
    <div className={`fixed inset-0 z-50 bg-gray-900 ${className}`}>
      {/* Header */}
      {renderCallHeader()}

      {/* Main call area */}
      <div className="flex-1 flex">
        {/* Video area */}
        <div className="flex-1 relative p-4">
          {activeCall?.type === CALL_TYPES.VIDEO ? (
            <div className="h-full flex flex-col gap-4">
              {/* Remote video */}
              {renderParticipantVideo(otherParticipant, false)}

              {/* Local video (picture-in-picture) */}
              <div className="absolute top-8 right-8">
                {renderParticipantVideo(currentUser, true)}
              </div>
            </div>
          ) : (
            // Voice call layout
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Avatar
                  src={otherParticipant?.avatar}
                  alt={otherParticipant?.name}
                  size="3xl"
                  className="mx-auto mb-6"
                />
                <h2 className="text-2xl font-semibold text-white mb-2">
                  {otherParticipant?.name}
                </h2>
                <p className="text-gray-400">
                  {activeCall?.status === "connecting"
                    ? "Connecting..."
                    : activeCall?.status === "ringing"
                    ? "Ringing..."
                    : formatCallDuration(callDuration)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Chat sidebar */}
        {showChat && (
          <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
            {/* Chat content would go here */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-white">
                Chat
              </h3>
            </div>
            <div className="flex-1 p-4">
              <p className="text-gray-500 text-center">Chat during call...</p>
            </div>
          </div>
        )}
      </div>

      {/* Call Controls */}
      <div className="p-6 bg-gray-800/50 backdrop-blur-sm">
        <CallControls
          isVideoCall={activeCall?.type === CALL_TYPES.VIDEO}
          audioEnabled={localAudioEnabled}
          videoEnabled={localVideoEnabled}
          screenSharing={screenSharing}
          onToggleAudio={toggleAudio}
          onToggleVideo={toggleVideo}
          onToggleScreenShare={toggleScreenShare}
          onEndCall={handleEndCall}
        />
      </div>
    </div>
  );
};

export default CallInterface;
