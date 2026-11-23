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
    <>
      {/* Mobile Backdrop when open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="sm:hidden fixed inset-0 bg-black/30 z-40 backdrop-blur-xs"
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 font-sans">
        <AnimatePresence>
          {isOpen ? (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-x-3 bottom-3 sm:relative sm:inset-auto w-auto sm:w-[380px] max-w-[calc(100vw-24px)] sm:max-w-[380px] bg-white rounded-md border border-neutral-200/90 shadow-2xl overflow-hidden flex flex-col z-50 h-[480px] max-h-[calc(100dvh-24px)]"
            >
              {/* Header */}
              <div className="p-3.5 sm:p-4 border-b border-neutral-100 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  {/* Brand Logo Icon */}
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-sm overflow-hidden shrink-0 shadow-xs border border-neutral-200/60">
                    <img
                      src="/icon.png"
                      alt="Axios"
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-neutral-900 leading-tight">
                      Axios
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-neutral-500 font-medium">
                      AI Enterprise Assistant
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-sm flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
                  aria-label="Close assistant"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Conversation Area (Scrollable flex-1) */}
              <div className="flex-1 min-h-0 p-3 sm:p-4 space-y-3 overflow-y-auto bg-white scrollbar-none">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[88%] text-xs sm:text-[13px] leading-relaxed p-3 rounded-sm ${
                        msg.sender === "user"
                          ? "bg-[#1F45EC] text-white"
                          : "bg-[#F7F8FA] text-neutral-800 border border-neutral-200/60"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-[#F7F8FA] text-neutral-500 p-2.5 rounded-sm border border-neutral-200/60 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1F45EC] animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1F45EC] animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1F45EC] animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}

                {/* Quick Action Pills inside chat */}
                {messages.length === 1 && (
                  <div className="pt-2 flex flex-col gap-1.5">
                    <Link
                      href="/get-a-demo"
                      className="block w-full py-2 px-3 rounded-sm text-xs font-semibold bg-[#EEF1FF] text-[#1F45EC] hover:bg-[#E1E7FF] transition-colors text-center cursor-pointer shadow-2xs"
                    >
                      Book an architecture review
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleSend("How does Axios handle real-time ACL permissions and security?")}
                      className="w-full py-2 px-3 rounded-sm text-xs font-semibold bg-[#EEF1FF] text-[#1F45EC] hover:bg-[#E1E7FF] transition-colors text-center cursor-pointer shadow-2xs"
                    >
                      Ask about permission security
                    </button>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-3 border-t border-neutral-100 bg-[#FAF8F5] shrink-0">
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
                    placeholder="Ask Axios a question..."
                    className="w-full h-10 pl-3.5 pr-10 text-[16px] sm:text-xs rounded-sm border border-neutral-200 bg-white focus:outline-none focus:border-[#1F45EC] focus:ring-1 focus:ring-[#1F45EC] transition-all text-neutral-900 placeholder:text-neutral-400"
                  />
                  <button
                    type="submit"
                    disabled={!inputVal.trim()}
                    className="absolute right-1.5 w-7 h-7 rounded-sm bg-neutral-100 disabled:opacity-40 hover:bg-[#1F45EC] hover:text-white text-neutral-600 transition-colors flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
                    aria-label="Send query"
                  >
                    <ArrowRight size={14} />
                  </button>
                </form>

                {/* Disclaimer */}
                <p className="mt-2 text-[10px] text-neutral-400 leading-tight text-center">
                  Grounded in primary industrial knowledge · Zero model retention
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => setIsOpen(true)}
              className="h-10 pl-2 pr-3.5 rounded-sm flex items-center gap-2 bg-[#EEF1FF] hover:bg-[#E3E8FF] border border-[#D5DEFF] text-[#1F45EC] shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95 select-none"
              aria-label="Open Axios assistant"
            >
              <div className="w-6 h-6 rounded-xs overflow-hidden shrink-0 flex items-center justify-center shadow-2xs border border-[#1F45EC]/20">
                <img
                  src="/icon.png"
                  alt="Axios Logo"
                  width={24}
                  height={24}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs font-semibold tracking-tight text-[#1F45EC]">
                Ask Query
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
