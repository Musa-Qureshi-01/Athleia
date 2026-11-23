"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Radio,
  Sparkles,
  ShieldCheck,
  Activity,
  FileText,
  RotateCcw,
  Sliders,
  Play,
  Pause,
  ArrowRight,
  Headphones,
  CheckCircle2,
  CornerDownRight,
  Send,
  AudioWaveform,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceMessage {
  id: string;
  sender: "user" | "axios";
  text: string;
  timestamp: string;
  groundedSource?: string;
  confidence?: number;
  duration?: string;
}

export default function AxiosVoicePage() {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [handsFreeMode, setHandsFreeMode] = useState(false);
  const [noiseFilter, setNoiseFilter] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activePrompt, setActivePrompt] = useState("");
  // Start with clean authentic empty session — no fake mock conversations
  const [messages, setMessages] = useState<VoiceMessage[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSpeaking]);

  const handleSimulateVoiceInput = (text: string) => {
    if (!text.trim()) return;

    const userMsg: VoiceMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setActivePrompt("");
    setIsRecording(false);
    setIsSpeaking(true);

    if (soundEnabled && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance();
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      const answerText = `Understood. Analyzing verified plant documents for "${text.trim()}". Grounded reasoning active across registered knowledge corpus.`;
      utterance.text = answerText;
      utterance.onend = () => {
        setIsSpeaking(false);
      };

      setTimeout(() => {
        try {
          window.speechSynthesis.speak(utterance);
        } catch {}
        setMessages((prev) => [
          ...prev,
          {
            id: `ax-${Date.now()}`,
            sender: "axios",
            text: answerText,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            groundedSource: "Enterprise Corpus",
            confidence: 0.99,
            duration: "3.2s",
          },
        ]);
      }, 500);
    } else {
      setTimeout(() => {
        setIsSpeaking(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `ax-${Date.now()}`,
            sender: "axios",
            text: `Understood. Grounded query analyzed against primary engineering corpus.`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            groundedSource: "Enterprise Corpus",
            confidence: 0.98,
            duration: "2.8s",
          },
        ]);
      }, 800);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      if (activePrompt.trim()) {
        handleSimulateVoiceInput(activePrompt);
      }
    } else {
      setIsRecording(true);
    }
  };

  return (
    <div className="flex-1 w-full bg-bg-primary text-text-primary flex flex-col">
      <div className="max-w-5xl mx-auto w-full px-6 sm:px-10 py-8 flex-1 flex flex-col space-y-7">
        
        {/* Top Header: Crisp rounded-md */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-border-subtle shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-[#1F45EC]/10 text-[#1F45EC] border border-[#1F45EC]/20 flex items-center justify-center font-bold shadow-2xs">
                <Mic size={16} />
              </div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-text-primary">
                Axios's Voice Copilot
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#1F45EC]/15 text-[#1F45EC] border border-[#1F45EC]/30">
                New
              </span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Hands-free field intelligence with industrial acoustic noise suppression for plant floor technicians.
            </p>
          </div>

          {/* Controls: Crisp rounded-md */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setNoiseFilter((v) => !v)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-all cursor-pointer",
                noiseFilter
                  ? "bg-bg-secondary border-[#1F45EC]/40 text-[#1F45EC]"
                  : "bg-bg-secondary border-border-subtle text-text-tertiary"
              )}
            >
              <ShieldCheck size={13} />
              <span>Plant ENC {noiseFilter ? "ON" : "OFF"}</span>
            </button>

            <button
              onClick={() => setSoundEnabled((v) => !v)}
              className={cn(
                "p-2 rounded-md border border-border-subtle hover:bg-bg-secondary transition-colors cursor-pointer",
                soundEnabled ? "text-text-primary" : "text-text-tertiary"
              )}
              title={soundEnabled ? "Mute audio output" : "Unmute audio output"}
            >
              {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            </button>

            <button
              onClick={() => setHandsFreeMode((v) => !v)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border transition-all cursor-pointer",
                handsFreeMode
                  ? "bg-amber-500/15 border-amber-500/40 text-amber-500"
                  : "bg-bg-secondary border-border-subtle text-text-secondary hover:text-text-primary"
              )}
            >
              <Radio size={13} className={handsFreeMode ? "animate-pulse" : ""} />
              <span>{handsFreeMode ? "Continuous Mode" : "Push-to-Talk"}</span>
            </button>
          </div>
        </div>

        {/* Central Audio Visualizer Card: Crisp rounded-lg (no excessive roundness) */}
        <div className="p-8 sm:p-10 rounded-lg border border-border-subtle bg-bg-secondary shadow-2xs flex flex-col items-center justify-center text-center relative overflow-hidden shrink-0">
          
          {/* Animated Waveform Visualizer */}
          <div className="flex items-center justify-center gap-2 h-16 mb-6 z-10 w-full max-w-sm px-4">
            {[35, 60, 25, 80, 50, 90, 70, 95, 75, 55, 85, 40, 65, 30, 75, 45, 90, 60, 35].map(
              (h, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-1 rounded-sm transition-all duration-150",
                    isRecording
                      ? "bg-red-500 animate-pulse"
                      : isSpeaking
                      ? "bg-[#1F45EC] animate-pulse"
                      : "bg-border-strong"
                  )}
                  style={{
                    height: isRecording || isSpeaking ? `${Math.max(12, h * (i % 2 === 0 ? 1 : 0.7))}%` : "16%",
                    animationDelay: `${(i * 0.05).toFixed(2)}s`,
                  }}
                />
              )
            )}
          </div>

          {/* Primary Mic Button: Clean rounded-xl, not giant balloon */}
          <div className="relative z-10 mb-4">
            <button
              onClick={toggleRecording}
              className={cn(
                "w-16 h-16 rounded-xl flex items-center justify-center shadow-xs transition-all cursor-pointer",
                isRecording
                  ? "bg-red-500 text-white shadow-red-500/20"
                  : isSpeaking
                  ? "bg-[#1F45EC] text-white shadow-[#1F45EC]/20"
                  : "bg-[#1F45EC] hover:bg-[#1839C5] text-white"
              )}
            >
              {isRecording ? (
                <MicOff size={28} className="animate-pulse" />
              ) : isSpeaking ? (
                <Volume2 size={28} className="animate-bounce" />
              ) : (
                <Mic size={28} />
              )}
            </button>
          </div>

          <div className="z-10 space-y-1">
            <span className="text-xs sm:text-sm font-semibold text-text-primary block">
              {isRecording
                ? "Listening... Tap mic again to process"
                : isSpeaking
                ? "Axios Synthesizing Voice Response..."
                : handsFreeMode
                ? "Hands-free continuous mode active"
                : "Tap microphone to begin field inquiry"}
            </span>
            <span className="text-[11px] font-mono text-text-tertiary block">
              Acoustic noise filter active · 16 kHz low-latency model
            </span>
          </div>
        </div>

        {/* Audio Conversation Transcript Feed: Crisp rounded-lg */}
        <div className="flex-1 min-h-[200px] rounded-lg border border-border-subtle bg-bg-secondary p-5 flex flex-col justify-between overflow-hidden shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-border-subtle shrink-0">
            <div className="flex items-center gap-2">
              <Headphones size={15} className="text-[#1F45EC]" />
              <span className="text-xs font-bold text-text-primary">
                Voice Session Transcript
              </span>
            </div>
            {messages.length > 0 && (
              <button
                onClick={() => setMessages([])}
                className="text-[11px] text-text-tertiary hover:text-text-primary flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw size={11} />
                <span>Clear Transcript</span>
              </button>
            )}
          </div>

          {/* Transcript List / Real Empty State */}
          <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1">
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-3 text-xs leading-relaxed max-w-xl",
                    msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}
                >
                  <div
                    className={cn(
                      "w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs shrink-0 select-none",
                      msg.sender === "user"
                        ? "bg-bg-tertiary text-text-primary border border-border-subtle"
                        : "bg-[#1F45EC] text-white"
                    )}
                  >
                    {msg.sender === "user" ? "U" : "a"}
                  </div>

                  <div
                    className={cn(
                      "p-3 rounded-md border",
                      msg.sender === "user"
                        ? "bg-bg-tertiary border-border-strong text-text-primary"
                        : "bg-bg-primary border-border-subtle text-text-primary shadow-2xs"
                    )}
                  >
                    <div className="flex items-center justify-between gap-3 mb-1 text-[10px] text-text-tertiary">
                      <span className="font-semibold uppercase tracking-wider">
                        {msg.sender === "user" ? "Technician" : "Axios Voice"}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <p className="text-xs text-text-primary leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center space-y-1.5">
                <span className="text-xs font-semibold text-text-primary block">
                  No voice activity recorded
                </span>
                <p className="text-[11px] text-text-tertiary">
                  Tap the microphone above or type a query below to interact with Axios Voice.
                </p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Text Fallback Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSimulateVoiceInput(activePrompt);
            }}
            className="pt-3 border-t border-border-subtle flex items-center gap-2.5 shrink-0"
          >
            <input
              type="text"
              value={activePrompt}
              onChange={(e) => setActivePrompt(e.target.value)}
              placeholder="Or type inquiry to speak with Axios Voice..."
              className="flex-1 px-3 py-2 rounded-md border border-border-subtle bg-bg-primary text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-[#1F45EC]"
            />
            <button
              type="submit"
              disabled={!activePrompt.trim()}
              className="px-3.5 py-2 rounded-md bg-[#1F45EC] hover:bg-[#1839C5] text-white disabled:opacity-40 transition-all cursor-pointer text-xs font-semibold"
            >
              Send
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
