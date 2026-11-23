"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Sparkles, ExternalLink, MessageSquare, Bot } from "lucide-react";
import Link from "next/link";

interface ChatMessage {
  sender: "bot" | "user";
  text: string;
}

export function FloatingAssistantWidget() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "bot",
      text: "Axios secures and connects knowledge across 100+ apps to power AI-native workflows and reduce token costs. How are you approaching AI adoption in your teams?"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSend = (textToSend?: string) => {
    const q = textToSend || inputVal.trim();
    if (!q) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: q }]);
    setInputVal("");
    setIsTyping(true);

    // Simulate smart enterprise AI response
    setTimeout(() => {
      let reply = "Axios indexes your company's dispersed knowledge across Slack, Jira, Drive, Confluence, and internal databases with real-time ACL security. Would you like to schedule a customized enterprise walkthrough?";
      const lower = q.toLowerCase();
      if (lower.includes("meeting") || lower.includes("demo") || lower.includes("book")) {
        reply = "You can book an executive architecture review directly with our enterprise engineering team. Click 'Book a meeting' to select a time that fits your schedule!";
      } else if (lower.includes("security") || lower.includes("permission") || lower.includes("privacy")) {
        reply = "Axios operates with strict zero-retention and zero model training guarantees. Our enterprise permission engine mirrors ACLs in sub-second intervals to guarantee no unauthorized data leakage.";
      } else if (lower.includes("pricing") || lower.includes("cost")) {
        reply = "Axios offers tailored enterprise tiers based on active knowledge seats and VPC deployment requirements. Our team can prepare an ROI model for your organization.";
      }

      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
      setIsTyping(false);
    }, 700);
  };

  if (!mounted) return null;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 font-sans">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-[calc(100vw-32px)] max-w-[380px] bg-white rounded-lg border border-neutral-200/90 shadow-2xl overflow-hidden flex flex-col"
            style={{ maxHeight: "calc(100vh - 120px)" }}
          >
            {/* Header */}
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                {/* Brand Logo Icon */}
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 shadow-xs">
                  <img
                    src="/icon.png"
                    alt="Axios"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900 leading-tight">
                    Axios
                  </h4>
                  <p className="text-[11px] text-neutral-500 font-medium">
                    AI assistant
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-md flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
                aria-label="Close assistant"
              >
                <X size={16} />
              </button>
            </div>

            {/* Conversation Area */}
            <div className="p-4 space-y-3.5 overflow-y-auto max-h-[380px] bg-white scrollbar-none">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[88%] text-xs sm:text-[13px] leading-relaxed p-3.5 rounded-lg ${msg.sender === "user"
                        ? "bg-[#194BFB] text-white rounded-br-xs"
                        : "bg-[#F7F8FA] text-neutral-800 rounded-bl-xs border border-neutral-200/60"
                      }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#F7F8FA] p-3 rounded-lg rounded-bl-xs border border-neutral-200/60 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#194BFB] animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#194BFB] animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#194BFB] animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              {/* Quick suggestions shown when conversation is fresh */}
              {messages.length === 1 && (
                <div className="space-y-2 pt-1">
                  <Link
                    href="/get-a-demo"
                    className="block w-full py-2 px-3.5 rounded-md text-xs font-semibold bg-[#EEF1FF] text-[#194BFB] hover:bg-[#E1E7FF] transition-colors text-center cursor-pointer shadow-2xs"
                  >
                    Book a meeting
                  </Link>
                  <button
                    onClick={() => handleSend("Tell me how Axios connects enterprise apps with zero retention.")}
                    className="w-full py-2 px-3.5 rounded-md text-xs font-semibold bg-[#EEF1FF] text-[#194BFB] hover:bg-[#E1E7FF] transition-colors text-center cursor-pointer shadow-2xs"
                  >
                    Tell me more about Axios
                  </button>
                </div>
              )}
            </div>

            {/* Input Footer */}
            <div className="p-3.5 border-t border-neutral-100 bg-white">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Ask Axios a question"
                  className="w-full h-10 pl-3.5 pr-10 text-xs sm:text-[13px] rounded-md border border-neutral-200 bg-white focus:outline-none focus:border-[#194BFB] focus:ring-1 focus:ring-[#194BFB] transition-all text-neutral-800 placeholder:text-neutral-400"
                />
                <button
                  type="submit"
                  disabled={!inputVal.trim()}
                  className="absolute right-1.5 w-7 h-7 rounded-md bg-neutral-100 disabled:opacity-40 hover:bg-[#194BFB] hover:text-white text-neutral-600 transition-colors flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
                  aria-label="Send query"
                >
                  <ArrowRight size={14} />
                </button>
              </form>

              {/* Disclaimer */}
              <p className="mt-2.5 text-[10px] text-neutral-400 leading-tight text-center">
                By messaging, you agree that this chat may be monitored, recorded, and used for personalization and other business services per our{" "}
                <Link href="/contact" className="underline hover:text-neutral-600 inline-flex items-center gap-0.5">
                  Privacy Policy <ExternalLink size={8} />
                </Link>
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="h-10.5 pl-2 pr-4.5 rounded-xl flex items-center gap-2.5 bg-[#EEF1FF] hover:bg-[#E3E8FF] border border-[#D5DEFF] text-[#1F45EC] shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group select-none"
            aria-label="Open Axios assistant"
          >
            <div className="w-6.5 h-6.5 rounded-full overflow-hidden shrink-0 flex items-center justify-center shadow-2xs">
              <img
                src="/icon.png"
                alt="Axios Logo"
                width={26}
                height={26}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[14px] font-semibold tracking-tight text-[#1F45EC]">
              Ask Query
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

