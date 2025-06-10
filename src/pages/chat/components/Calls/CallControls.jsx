// src/pages/chat/components/Calls/CallControls.jsx
import React from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  ScreenShare,
  ScreenShareOff,
  Phone,
  PhoneOff,
  Settings,
  Users,
  MessageSquare,
  Volume2,
  VolumeX,
  Monitor,
  MonitorOff,
  MoreHorizontal,
  Circle,
  CircleDot,
  Square,
} from "lucide-react";
import Button from "../UI/Button";
import Tooltip from "../UI/Tooltip";

const CallControls = ({
  isVideoCall = false,
  audioEnabled = true,
  videoEnabled = true,
  screenSharing = false,
  recording = false,
  muted = false,
  participants = [],
  onToggleAudio = () => {},
  onToggleVideo = () => {},
  onToggleScreenShare = () => {},
  onToggleMute = () => {},
  onEndCall = () => {},
  onOpenSettings = () => {},
  onOpenParticipants = () => {},
  onOpenChat = () => {},
  onToggleRecording = () => {},
  showAdvanced = false,
  className = "",
}) => {
  // ======================
  // RENDER HELPERS
  // ======================

  const renderPrimaryControls = () => (
    <div className="flex items-center justify-center gap-4">
      {/* Audio Toggle */}
      <Tooltip content={audioEnabled ? "Mute microphone" : "Unmute microphone"}>
        <Button
          size="lg"
          variant={audioEnabled ? "secondary" : "danger"}
          icon={audioEnabled ? Mic : MicOff}
          onClick={onToggleAudio}
          className={`w-14 h-14 rounded-full ${
            !audioEnabled ? "bg-red-600 hover:bg-red-700" : ""
          }`}
        />
      </Tooltip>

      {/* Video Toggle (only for video calls) */}
      {isVideoCall && (
        <Tooltip content={videoEnabled ? "Turn off camera" : "Turn on camera"}>
          <Button
            size="lg"
            variant={videoEnabled ? "secondary" : "danger"}
            icon={videoEnabled ? Video : VideoOff}
            onClick={onToggleVideo}
            className={`w-14 h-14 rounded-full ${
              !videoEnabled ? "bg-red-600 hover:bg-red-700" : ""
            }`}
          />
        </Tooltip>
      )}

      {/* Screen Share Toggle */}
      <Tooltip content={screenSharing ? "Stop sharing screen" : "Share screen"}>
        <Button
          size="lg"
          variant={screenSharing ? "primary" : "secondary"}
          icon={screenSharing ? ScreenShareOff : ScreenShare}
          onClick={onToggleScreenShare}
          className={`w-14 h-14 rounded-full ${
            screenSharing ? "bg-blue-600 hover:bg-blue-700" : ""
          }`}
        />
      </Tooltip>

      {/* End Call */}
      <Tooltip content="End call">
        <Button
          size="lg"
          variant="danger"
          icon={PhoneOff}
          onClick={onEndCall}
          className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white"
        />
      </Tooltip>
    </div>
  );

  const renderSecondaryControls = () => (
    <div className="flex items-center justify-center gap-3">
      {/* Speaker/Volume */}
      <Tooltip content={muted ? "Unmute speaker" : "Mute speaker"}>
        <Button
          size="md"
          variant="ghost"
          icon={muted ? VolumeX : Volume2}
          onClick={onToggleMute}
          className="w-12 h-12 rounded-full text-white hover:bg-white/20"
        />
      </Tooltip>

      {/* Participants */}
      {participants.length > 0 && (
        <Tooltip content={`Participants (${participants.length})`}>
          <Button
            size="md"
            variant="ghost"
            icon={Users}
            onClick={onOpenParticipants}
            className="w-12 h-12 rounded-full text-white hover:bg-white/20 relative"
          >
            {participants.length > 1 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {participants.length}
              </span>
            )}
          </Button>
        </Tooltip>
      )}

      {/* Chat */}
      <Tooltip content="Open chat">
        <Button
          size="md"
          variant="ghost"
          icon={MessageSquare}
          onClick={onOpenChat}
          className="w-12 h-12 rounded-full text-white hover:bg-white/20"
        />
      </Tooltip>

      {/* Recording */}
      {showAdvanced && (
        <Tooltip content={recording ? "Stop recording" : "Start recording"}>
          <Button
            size="md"
            variant={recording ? "danger" : "ghost"}
            icon={recording ? CircleDot : Circle}
            onClick={onToggleRecording}
            className={`w-12 h-12 rounded-full text-white hover:bg-white/20 ${
              recording ? "bg-red-600 hover:bg-red-700" : ""
            }`}
          />
        </Tooltip>
      )}

      {/* Settings */}
      <Tooltip content="Call settings">
        <Button
          size="md"
          variant="ghost"
          icon={Settings}
          onClick={onOpenSettings}
          className="w-12 h-12 rounded-full text-white hover:bg-white/20"
        />
      </Tooltip>

      {/* More options */}
      {showAdvanced && (
        <Tooltip content="More options">
          <Button
            size="md"
            variant="ghost"
            icon={MoreHorizontal}
            className="w-12 h-12 rounded-full text-white hover:bg-white/20"
          />
        </Tooltip>
      )}
    </div>
  );

  // ======================
  // RENDER
  // ======================

  return (
    <div className={`flex flex-col items-center gap-6 ${className}`}>
      {/* Secondary Controls */}
      {renderSecondaryControls()}

      {/* Primary Controls */}
      {renderPrimaryControls()}

      {/* Call Status Indicators */}
      <div className="flex items-center gap-4 text-white/70 text-sm">
        {!audioEnabled && (
          <div className="flex items-center gap-1">
            <MicOff className="w-4 h-4 text-red-400" />
            <span>Muted</span>
          </div>
        )}

        {isVideoCall && !videoEnabled && (
          <div className="flex items-center gap-1">
            <VideoOff className="w-4 h-4 text-red-400" />
            <span>Camera off</span>
          </div>
        )}

        {screenSharing && (
          <div className="flex items-center gap-1">
            <ScreenShare className="w-4 h-4 text-blue-400" />
            <span>Screen sharing</span>
          </div>
        )}

        {recording && (
          <div className="flex items-center gap-1">
            <CircleDot className="w-4 h-4 text-red-400 animate-pulse" />
            <span>Recording</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallControls;
