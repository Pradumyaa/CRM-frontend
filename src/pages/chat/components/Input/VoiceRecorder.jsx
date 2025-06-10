// src/pages/chat/components/Input/VoiceRecorder.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Mic,
  MicOff,
  Square,
  Play,
  Pause,
  Trash2,
  Send,
  Volume2,
  VolumeX,
} from "lucide-react";
import Button from "../UI/Button";
import Tooltip from "../UI/Tooltip";
import LoadingSpinner from "../UI/LoadingSpinner";
import { formatCallDuration } from "../../utils/helper.js"
import { ERROR_MESSAGES, MESSAGE_LIMITS } from "../../utils/constants.js";

const VoiceRecorder = ({
  onSend = null,
  onCancel = null,
  disabled = false,
  className = "",
  maxDuration = 300, // 5 minutes in seconds
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);

  // ======================
  // AUDIO PERMISSION & SETUP
  // ======================

  const initializeRecorder = useCallback(async () => {
    setIsInitializing(true);
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
        },
      });

      streamRef.current = stream;

      // Check for MediaRecorder support
      if (!MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        console.warn("Preferred format not supported, falling back to webm");
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm",
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        chunksRef.current = [];
      };

      mediaRecorder.onerror = (event) => {
        console.error("MediaRecorder error:", event.error);
        setError("Recording failed. Please try again.");
      };

      setIsInitializing(false);
      return true;
    } catch (err) {
      console.error("Failed to initialize recorder:", err);
      let errorMessage =
        "Failed to access microphone. Please check your device settings.";

      if (err.name === "NotAllowedError") {
        errorMessage =
          "Microphone permission denied. Please allow access and try again.";
      } else if (err.name === "NotFoundError") {
        errorMessage =
          "No microphone found. Please connect a microphone and try again.";
      } else if (err.name === "NotReadableError") {
        errorMessage = "Microphone is already in use by another application.";
      }

      setError(errorMessage);
      setIsInitializing(false);
      return false;
    }
  }, []);

  // ======================
  // RECORDING CONTROLS
  // ======================

  const startRecording = useCallback(async () => {
    if (!mediaRecorderRef.current && !(await initializeRecorder())) {
      return;
    }

    try {
      setDuration(0);
      setAudioBlob(null);
      setAudioUrl(null);
      chunksRef.current = [];

      mediaRecorderRef.current.start(100); // Collect data every 100ms
      setIsRecording(true);
      setIsPaused(false);

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration((prev) => {
          const newDuration = prev + 1;
          if (newDuration >= maxDuration) {
            stopRecording();
            return maxDuration;
          }
          return newDuration;
        });
      }, 1000);

      // Start visualization
      startVisualization();
    } catch (err) {
      console.error("Failed to start recording:", err);
      setError("Failed to start recording. Please try again.");
    }
  }, [maxDuration, initializeRecorder]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      stopVisualization();
    }
  }, [isRecording, isPaused]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);

      // Resume timer
      timerRef.current = setInterval(() => {
        setDuration((prev) => {
          const newDuration = prev + 1;
          if (newDuration >= maxDuration) {
            stopRecording();
            return maxDuration;
          }
          return newDuration;
        });
      }, 1000);

      startVisualization();
    }
  }, [isPaused, maxDuration]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      stopVisualization();
    }
  }, [isRecording]);

  const cancelRecording = useCallback(() => {
    stopRecording();
    setDuration(0);
    setAudioBlob(null);
    setAudioUrl(null);

    if (onCancel) {
      onCancel();
    }
  }, [onCancel, stopRecording]);

  // ======================
  // PLAYBACK CONTROLS
  // ======================

  const playRecording = useCallback(() => {
    if (audioRef.current && audioUrl) {
      audioRef.current.currentTime = 0;
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [audioUrl, volume, isMuted]);

  const pausePlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const newMuted = !prev;
      if (audioRef.current) {
        audioRef.current.volume = newMuted ? 0 : volume;
      }
      return newMuted;
    });
  }, [volume]);

  // ======================
  // VISUALIZATION
  // ======================

  const startVisualization = useCallback(() => {
    if (!streamRef.current || !canvasRef.current) return;

    try {
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(
        streamRef.current
      );

      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const draw = () => {
        if (!isRecording || isPaused) return;

        analyserRef.current.getByteFrequencyData(dataArray);

        ctx.fillStyle =
          getComputedStyle(document.documentElement).getPropertyValue(
            "--tw-colors-gray-100"
          ) || "#f3f4f6";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * canvas.height * 0.8;

          const gradient = ctx.createLinearGradient(
            0,
            canvas.height - barHeight,
            0,
            canvas.height
          );
          gradient.addColorStop(0, "#3b82f6"); // Blue
          gradient.addColorStop(1, "#8b5cf6"); // Purple

          ctx.fillStyle = gradient;
          ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

          x += barWidth + 1;
        }

        animationRef.current = requestAnimationFrame(draw);
      };

      draw();
    } catch (err) {
      console.error("Failed to start visualization:", err);
    }
  }, [isRecording, isPaused]);

  const stopVisualization = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close();
    }
  }, []);

  // ======================
  // SEND RECORDING
  // ======================

  const sendRecording = useCallback(async () => {
    if (!audioBlob || !onSend) return;

    try {
      // Create a File object from the blob
      const audioFile = new File([audioBlob], `voice-note-${Date.now()}.webm`, {
        type: "audio/webm",
      });

      await onSend(audioFile, duration);

      // Reset state
      setAudioBlob(null);
      setAudioUrl(null);
      setDuration(0);
      setIsPlaying(false);
    } catch (err) {
      console.error("Failed to send voice note:", err);
      setError("Failed to send voice note. Please try again.");
    }
  }, [audioBlob, onSend, duration]);

  // ======================
  // EFFECTS
  // ======================

  useEffect(() => {
    return () => {
      // Cleanup
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        audioContextRef.current.close();
      }

      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // Handle audio playback events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    const handleError = () => {
      setIsPlaying(false);
      setError("Failed to play audio. Please try again.");
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [audioUrl]);

  // ======================
  // RENDER STATES
  // ======================

  if (isInitializing) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <LoadingSpinner
          type="dots"
          size="sm"
          text="Initializing microphone..."
        />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 ${className}`}
      >
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <MicOff className="w-5 h-5" />
          <span className="text-sm font-medium">{error}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setError(null)}
          className="mt-2 text-red-600 dark:text-red-400"
        >
          Try Again
        </Button>
      </div>
    );
  }

  // Recording state
  if (isRecording || duration > 0) {
    return (
      <div
        className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-4 ${className}`}
      >
        {/* Recording Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {isRecording && !isPaused && (
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            )}
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {isRecording
                ? isPaused
                  ? "Paused"
                  : "Recording..."
                : "Voice Note"}
            </span>
          </div>
          <div className="text-sm font-mono text-gray-600 dark:text-gray-400">
            {formatCallDuration(duration)}
          </div>
        </div>

        {/* Waveform Visualization */}
        <div className="mb-4">
          <canvas
            ref={canvasRef}
            width="300"
            height="60"
            className="w-full h-15 bg-gray-100 dark:bg-gray-700 rounded-lg"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isRecording ? (
              <>
                {isPaused ? (
                  <Tooltip content="Resume recording">
                    <Button
                      variant="primary"
                      size="sm"
                      icon={Mic}
                      onClick={resumeRecording}
                      disabled={disabled}
                    />
                  </Tooltip>
                ) : (
                  <Tooltip content="Pause recording">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={Pause}
                      onClick={pauseRecording}
                      disabled={disabled}
                    />
                  </Tooltip>
                )}

                <Tooltip content="Stop recording">
                  <Button
                    variant="danger"
                    size="sm"
                    icon={Square}
                    onClick={stopRecording}
                    disabled={disabled}
                  />
                </Tooltip>
              </>
            ) : (
              <>
                {/* Playback Controls */}
                <Tooltip content={isPlaying ? "Pause" : "Play"}>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={isPlaying ? Pause : Play}
                    onClick={isPlaying ? pausePlayback : playRecording}
                    disabled={disabled || !audioUrl}
                  />
                </Tooltip>

                <Tooltip content={isMuted ? "Unmute" : "Mute"}>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={isMuted ? VolumeX : Volume2}
                    onClick={toggleMute}
                    disabled={disabled}
                  />
                </Tooltip>

                {/* Volume Control */}
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      const newVolume = parseFloat(e.target.value);
                      setVolume(newVolume);
                      setIsMuted(newVolume === 0);
                      if (audioRef.current) {
                        audioRef.current.volume = newVolume;
                      }
                    }}
                    className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    disabled={disabled}
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Tooltip content="Delete recording">
              <Button
                variant="ghost"
                size="sm"
                icon={Trash2}
                onClick={cancelRecording}
                disabled={disabled}
                className="text-red-600 dark:text-red-400"
              />
            </Tooltip>

            {!isRecording && audioBlob && (
              <Tooltip content="Send voice note">
                <Button
                  variant="primary"
                  size="sm"
                  icon={Send}
                  onClick={sendRecording}
                  disabled={disabled}
                />
              </Tooltip>
            )}
          </div>
        </div>

        {/* Duration Warning */}
        {duration > maxDuration * 0.9 && isRecording && (
          <div className="mt-3 text-xs text-yellow-600 dark:text-yellow-400 text-center">
            Recording will stop automatically at{" "}
            {formatCallDuration(maxDuration)}
          </div>
        )}

        {/* Hidden Audio Element */}
        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            preload="metadata"
            className="hidden"
          />
        )}

        {/* Custom Slider Styles */}
        <style jsx>{`
          .slider::-webkit-slider-thumb {
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }

          .slider::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
        `}</style>
      </div>
    );
  }

  // Initial state - show record button
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Tooltip content="Record voice note">
        <Button
          variant="primary"
          size="lg"
          icon={Mic}
          onClick={startRecording}
          disabled={disabled}
          className="rounded-full w-12 h-12 p-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        />
      </Tooltip>
    </div>
  );
};

export default VoiceRecorder;
