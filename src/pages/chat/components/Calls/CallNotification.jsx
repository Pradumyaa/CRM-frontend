// src/pages/chat/components/Calls/CallNotification.jsx
import React, { useEffect, useState } from "react";
import {
  Phone,
  PhoneOff,
  Video,
  VideoOff,
  MessageSquare,
  User,
  Clock,
  Volume2,
  VolumeX,
} from "lucide-react";
import Button from "../UI/Button";
import Avatar from "../UI/Avatar";
import Tooltip from "../UI/Tooltip";
import { formatUserName } from "../../utils/helper";
import { CALL_TYPES } from "../../utils/constants";

const CallNotification = ({
  call,
  onAccept = () => {},
  onDecline = () => {},
  onMessage = () => {},
  autoDeclineTimeout = 30000, // 30 seconds
  showFullScreen = true,
  className = "",
}) => {
  const [timeRemaining, setTimeRemaining] = useState(
    Math.floor(autoDeclineTimeout / 1000)
  );
  const [isRinging, setIsRinging] = useState(true);

  const caller = call?.caller;
  const callType = call?.type || CALL_TYPES.VOICE;
  const isVideoCall = callType === CALL_TYPES.VIDEO;

  // ======================
  // AUTO DECLINE TIMER
  // ======================

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          onDecline();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onDecline]);

  // ======================
  // NOTIFICATION SOUND
  // ======================

  useEffect(() => {
    let audioContext;
    let oscillator;
    let gainNode;
    let isPlaying = false;

    const playRingtone = () => {
      if (!isRinging || isPlaying) return;

      try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        oscillator = audioContext.createOscillator();
        gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Create ringtone pattern (two-tone)
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(
          1000,
          audioContext.currentTime + 0.5
        );
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 1);

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 1.5
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1.5);

        isPlaying = true;

        oscillator.onended = () => {
          isPlaying = false;
          if (isRinging) {
            setTimeout(playRingtone, 500); // Pause between rings
          }
        };
      } catch (error) {
        console.error("Failed to play ringtone:", error);
      }
    };

    playRingtone();

    return () => {
      setIsRinging(false);
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [isRinging]);

  // ======================
  // EVENT HANDLERS
  // ======================

  const handleAccept = () => {
    setIsRinging(false);
    onAccept();
  };

  const handleDecline = () => {
    setIsRinging(false);
    onDecline();
  };

  const handleMessage = () => {
    setIsRinging(false);
    onMessage();
  };

  const toggleSound = () => {
    setIsRinging(!isRinging);
  };

  // ======================
  // RENDER HELPERS
  // ======================

  const renderFullScreenNotification = () => (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]" />
      </div>

      {/* Content */}
      <div className="relative text-center px-8 py-12 max-w-md w-full">
        {/* Caller Avatar with Pulse Animation */}
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
          <div className="absolute inset-2 rounded-full bg-white/10 animate-ping animation-delay-150" />
          <Avatar
            src={caller?.avatar}
            alt={caller?.name}
            size="3xl"
            className="relative z-10 ring-4 ring-white/30"
          />
        </div>

        {/* Caller Info */}
        <div className="mb-2">
          <h2 className="text-3xl font-bold text-white mb-2">
            {formatUserName(caller)}
          </h2>
          <p className="text-white/80 text-lg">
            Incoming {isVideoCall ? "video" : "voice"} call
          </p>
        </div>

        {/* Call Type Icon */}
        <div className="flex justify-center mb-8">
          {isVideoCall ? (
            <Video className="w-8 h-8 text-white/60" />
          ) : (
            <Phone className="w-8 h-8 text-white/60" />
          )}
        </div>

        {/* Timer */}
        <div className="flex items-center justify-center gap-2 mb-8 text-white/60">
          <Clock className="w-4 h-4" />
          <span className="text-sm">Auto-decline in {timeRemaining}s</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-8">
          {/* Decline Button */}
          <div className="flex flex-col items-center gap-2">
            <Tooltip content="Decline call">
              <Button
                size="xl"
                variant="danger"
                icon={PhoneOff}
                onClick={handleDecline}
                className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              />
            </Tooltip>
            <span className="text-white/60 text-sm">Decline</span>
          </div>

          {/* Message Button */}
          <div className="flex flex-col items-center gap-2">
            <Tooltip content="Send message">
              <Button
                size="lg"
                variant="secondary"
                icon={MessageSquare}
                onClick={handleMessage}
                className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              />
            </Tooltip>
            <span className="text-white/60 text-sm">Message</span>
          </div>

          {/* Accept Button */}
          <div className="flex flex-col items-center gap-2">
            <Tooltip content="Accept call">
              <Button
                size="xl"
                variant="success"
                icon={isVideoCall ? Video : Phone}
                onClick={handleAccept}
                className="w-16 h-16 rounded-full bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              />
            </Tooltip>
            <span className="text-white/60 text-sm">Accept</span>
          </div>
        </div>

        {/* Sound Toggle */}
        <div className="absolute top-8 right-8">
          <Tooltip content={isRinging ? "Mute ringtone" : "Unmute ringtone"}>
            <Button
              size="sm"
              variant="ghost"
              icon={isRinging ? Volume2 : VolumeX}
              onClick={toggleSound}
              className="text-white/60 hover:text-white hover:bg-white/20"
            />
          </Tooltip>
        </div>
      </div>
    </div>
  );

  const renderCompactNotification = () => (
    <div className="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-4 min-w-80 animate-in slide-in-from-top-2 fade-in-0 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {isVideoCall ? (
            <Video className="w-5 h-5 text-blue-600" />
          ) : (
            <Phone className="w-5 h-5 text-green-600" />
          )}
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Incoming {isVideoCall ? "video" : "voice"} call
          </span>
        </div>

        <Button
          size="xs"
          variant="ghost"
          icon={isRinging ? Volume2 : VolumeX}
          onClick={toggleSound}
          className="text-gray-400 hover:text-gray-600"
        />
      </div>

      {/* Caller Info */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <Avatar
            src={caller?.avatar}
            alt={caller?.name}
            size="md"
            className="ring-2 ring-blue-500/20"
          />
          <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
            {formatUserName(caller)}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {caller?.role || caller?.email}
          </p>
        </div>
      </div>

      {/* Timer Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>Auto-decline in</span>
          <span>{timeRemaining}s</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
          <div
            className="bg-red-500 h-1 rounded-full transition-all duration-1000"
            style={{
              width: `${
                ((autoDeclineTimeout / 1000 - timeRemaining) /
                  (autoDeclineTimeout / 1000)) *
                100
              }%`,
            }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          icon={MessageSquare}
          onClick={handleMessage}
          className="flex-1"
        >
          Message
        </Button>

        <Button
          variant="danger"
          size="sm"
          icon={PhoneOff}
          onClick={handleDecline}
        >
          Decline
        </Button>

        <Button
          variant="success"
          size="sm"
          icon={isVideoCall ? Video : Phone}
          onClick={handleAccept}
        >
          Accept
        </Button>
      </div>
    </div>
  );

  // ======================
  // RENDER
  // ======================

  if (!call) return null;

  return (
    <div className={className}>
      {showFullScreen
        ? renderFullScreenNotification()
        : renderCompactNotification()}

      {/* Custom CSS for animations */}
      <style jsx>{`
        .animation-delay-150 {
          animation-delay: 150ms;
        }

        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        .animate-pulse-ring {
          animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default CallNotification;
