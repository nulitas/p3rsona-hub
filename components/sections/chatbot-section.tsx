"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { generateChatResponse } from "@/lib/gemini-actions";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  text: string;
  sender: "user" | "ai";
}

function renderMessageWithLinks(text: string): React.ReactNode[] {
  // Existing link parsing logic unchanged
  const linkRegex =
    /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})|(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+[^\s]*)/g;

  const parts: string[] = [];
  const matches: { text: string; type: "email" | "url" }[] = [];

  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const matchedText = match[0];
    const isEmail = match[1] !== undefined;

    matches.push({ text: matchedText, type: isEmail ? "email" : "url" });
    parts.push(matchedText);
    lastIndex = linkRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  if (matches.length === 0) {
    return [<span key={0}>{text}</span>];
  }

  return parts.map((part, index) => {
    const matchInfo = matches.find((m) => m.text === part);

    if (matchInfo) {
      if (matchInfo.type === "email") {
        return (
          <a
            key={index}
            href={`mailto:${part}`}
            className="underline font-bold text-[#00f0ff] hover:text-white transition-colors"
          >
            {part}
          </a>
        );
      } else {
        let href = part;
        if (!part.startsWith("http")) {
          href = `https://${part}`;
        }
        return (
          <a
            key={index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-bold text-[#00f0ff] hover:text-white transition-colors"
          >
            {part}
          </a>
        );
      }
    }
    return <span key={index}>{part}</span>;
  });
}

const BlueButterflies = () => {
  const butterflies = Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    scale: 0.3 + Math.random() * 0.8,
    duration: 15 + Math.random() * 15,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 mix-blend-screen">
      {butterflies.map((b) => (
        <motion.div
          key={b.id}
          initial={{ x: `${b.x}vw`, y: `${b.y}vh`, opacity: 0, scale: b.scale }}
          animate={{
            x: [
              `${b.x}vw`,
              `${b.x + (Math.random() * 10 - 5)}vw`,
              `${b.x - (Math.random() * 10 - 5)}vw`,
              `${b.x}vw`,
            ],
            y: [`${b.y}vh`, `${b.y - 30}vh`, `${b.y - 10}vh`, `${b.y - 40}vh`],
            opacity: [0, 0.8, 0.4, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            delay: b.delay,
            ease: "easeInOut",
          }}
          className="absolute w-8 h-8 flex items-center justify-center filter drop-shadow-[0_0_10px_#00f0ff]"
        >
          {/* Simple butterfly flutter effect */}
          <motion.div
            animate={{ scaleX: [1, 0.2, 1] }}
            transition={{
              duration: 0.3 + Math.random() * 0.2,
              repeat: Infinity,
            }}
            className="w-full h-full text-[#00f0ff]"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full opacity-80"
            >
              <path d="M12 12C12 12 6 4 2 8C-2 12 4 18 12 12Z" />
              <path d="M12 12C12 12 18 4 22 8C26 12 20 18 12 12Z" />
            </svg>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

export default function ChatbotSection() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedMessages = localStorage.getItem("nulitas_cli_chat_history");
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error("Failed to load chat history:", error);
      }
    } else {
      setMessages([
        {
          text: "Welcome to the Velvet Room. This space exists between mind and matter. What do you wish to know?",
          sender: "ai",
        },
      ]);
    }
  }, []);

  useEffect(() => {
    if (
      messages.length > 1 ||
      (messages.length === 1 && messages[0].sender === "user")
    ) {
      localStorage.setItem(
        "nulitas_cli_chat_history",
        JSON.stringify(messages),
      );
    }
  }, [messages]);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = { text: text.trim(), sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const result = await generateChatResponse(text);

      if (result.success && result.response) {
        const aiResponse: ChatMessage = {
          text: result.response,
          sender: "ai",
        };
        setMessages((prev) => [...prev, aiResponse]);
      } else {
        const errorMessage: ChatMessage = {
          text: result.error || "Communication failure... Retry.",
          sender: "ai",
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMessage: ChatMessage = {
        text: "Communication failure... Retry.",
        sender: "ai",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const clearChat = () => {
    setMessages([
      {
        text: "Welcome to the Velvet Room. This space exists between mind and matter. What do you wish to know?",
        sender: "ai",
      },
    ]);
    localStorage.removeItem("nulitas_cli_chat_history");
    setShowResetModal(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    show: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 350, damping: 25 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col h-full w-full max-w-5xl relative z-10 px-4 pt-10 pb-8 mx-auto"
    >
      {/* Decorative Velvet Room Background */}
      <img
        src="/velvet.jpeg"
        alt="Velvet Room"
        className="fixed inset-0 w-screen h-screen object-cover opacity-40 z-0 pointer-events-none mix-blend-screen"
      />

      {/* Floating Butterflies Overlay */}
      <BlueButterflies />

      <motion.div
        variants={itemVariants}
        className="shrink-0 mb-6 relative z-10 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-black m-0 tracking-tighter italic uppercase text-white drop-shadow-[0_4px_10px_rgba(0,240,255,0.6)]">
          VELVET ROOM LINK
        </h1>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="flex-1 p-2 md:p-6 mb-4 flex flex-col overflow-hidden relative z-10"
      >
        <div
          ref={chatHistoryRef}
          className="flex-grow overflow-y-auto pr-4 pt-16 custom-scrollbar flex flex-col gap-8 pb-10"
        >
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`relative max-w-[90%] md:max-w-[75%] ${message.sender === "ai" ? "self-start ml-[5vw] md:ml-[10vw] mt-6" : "self-end"}`}
              >
                {message.sender === "ai" ? (
                  /* Velvet Room Igor Dialogue Box */
                  <div className="relative">
                    {/* Floating Igor Face for the Dialogue Box */}
                    <div className="absolute -left-[5rem] md:-left-[8rem] bottom-0 w-[6rem] md:w-[10rem] h-[8rem] md:h-[12rem] z-20 pointer-events-none drop-shadow-2xl">
                      <img
                        src="/igor.png"
                        alt="Igor"
                        className="w-full h-full object-contain object-bottom drop-shadow-[5px_5px_0_rgba(0,0,0,0.8)]"
                      />
                    </div>

                    {/* Dialogue Box Name Plate */}
                    <div className="absolute -top-6 left-[-1rem] bg-[#021bc9] border-l-4 border-r-4 border-b-4 border-transparent border-t-4 border-t-[#00f0ff] px-6 py-1 skew-x-[-10deg] shadow-xl z-30">
                      <span className="skew-x-[10deg] block font-bold text-[#00f0ff] text-sm md:text-base tracking-wide">
                        Igor
                        <div className="text-[0.55rem] text-[#00f0ff] uppercase tracking-widest opacity-80 -mt-1">
                          Talk
                        </div>
                      </span>
                    </div>

                    {/* Blue Dialogue Bubble */}
                    <div className="bg-[#03068e]/95 backdrop-blur-md rounded-t-lg rounded-br-lg p-6 pt-8 pb-8 min-h-[6rem] border-l-8 border-b-8 border-l-[#00f0ff] border-b-[#00f0ff] shadow-[15px_15px_0_rgba(0,0,0,0.5)] relative z-10 text-white font-medium text-lg leading-relaxed pr-10">
                      {renderMessageWithLinks(message.text)}
                      {/* Blinking arrow indicator */}
                      <div
                        className="absolute bottom-4 right-4 w-5 h-5 border-b-4 border-r-4 border-white animate-bounce"
                        style={{ transform: "rotate(45deg)" }}
                      />
                    </div>
                  </div>
                ) : (
                  /* User Message Style */
                  <div className="bg-white text-black p-4 px-6 md:p-6 skew-x-[-5deg] shadow-[10px_10px_0_rgba(0,240,255,0.4)] border border-black/10 relative z-10 mb-6">
                    <div className="skew-x-[5deg]">
                      <div className="text-xs font-black italic mb-1 uppercase text-black/50">
                        YOU
                      </div>
                      <div className="text-lg md:text-xl font-bold leading-relaxed">
                        {renderMessageWithLinks(message.text)}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative max-w-[90%] md:max-w-[75%] self-start ml-[5vw] md:ml-[10vw] mt-6"
            >
              <div className="relative">
                <div className="absolute -top-6 left-[-1rem] bg-[#021bc9] border-l-4 border-r-4 border-b-4 border-transparent border-t-4 border-t-[#00f0ff] px-6 py-1 skew-x-[-10deg] shadow-xl z-30">
                  <span className="skew-x-[10deg] block font-bold text-[#00f0ff] text-sm md:text-base tracking-wide">
                    Igor
                    <div className="text-[0.55rem] text-[#00f0ff] uppercase tracking-widest opacity-80 -mt-1">
                      Thinking
                    </div>
                  </span>
                </div>

                <div className="bg-[#03068e]/95 backdrop-blur-md rounded-t-lg rounded-br-lg p-6 pt-8 pb-8 min-h-[6rem] border-l-8 border-b-8 border-l-[#00f0ff] border-b-[#00f0ff] shadow-[15px_15px_0_rgba(0,0,0,0.5)] relative z-10 text-white font-medium text-lg leading-relaxed flex items-center gap-2">
                  <span className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-3 h-3 bg-white rounded-full animate-bounce"></span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="shrink-0">
        <form onSubmit={handleSubmit} className="flex gap-2 relative z-10">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="What is your request?"
            className="flex-1 p-5 md:p-6 bg-[#03068e]/80 text-white font-bold text-lg md:text-xl tracking-wider placeholder:text-white/40 focus:outline-none transition-all shadow-[10px_10px_0_rgba(0,0,0,0.5)] border-t-2 border-t-[#00f0ff] skew-x-[-5deg] relative z-20"
            autoComplete="off"
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="bg-white hover:bg-[#00f0ff] text-black px-8 py-5 md:py-6 font-black italic tracking-widest text-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all skew-x-[-5deg] shadow-[10px_10px_0_rgba(0,0,0,0.5)] hover:shadow-[-5px_10px_0_rgba(0,0,0,0.8)] z-20 shrink-0"
          >
            <div className="skew-x-[5deg]">SUBMIT</div>
          </button>

          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            disabled={isLoading}
            className="bg-[#021bc9] hover:bg-[#ff003c] text-white px-6 py-5 md:py-6 font-black tracking-widest cursor-pointer transition-all skew-x-[-5deg] shadow-[5px_5px_0_rgba(0,0,0,0.5)] z-20 shrink-0 border border-white/20"
            title="Reset Chat"
          >
            <div className="skew-x-[5deg]">X</div>
          </button>
        </form>
      </motion.div>

      {/* Custom Velvet Room Reset Modal */}
      <AnimatePresence>
        {showResetModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-[#03068e]/95 border-2 border-[#00f0ff] p-8 max-w-md w-full shadow-[15px_15px_0_rgba(0,0,0,0.8)] skew-x-[-2deg] relative"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-[#00f0ff]" />
              <h2 className="text-2xl font-black italic text-white uppercase tracking-wider mb-4 mt-2">
                Sever Connection?
              </h2>
              <p className="text-white/80 font-medium text-lg leading-relaxed mb-8">
                Are you sure you wish to reset your dialogue with the Velvet
                Room? All prior insights will be lost.
              </p>

              <div className="flex gap-4 justify-end font-black italic tracking-widest text-lg">
                <button
                  onClick={() => setShowResetModal(false)}
                  className="px-6 py-3 border-2 border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black transition-colors"
                >
                  CANCEL
                </button>
                <button
                  onClick={clearChat}
                  className="px-6 py-3 bg-red-600 border-2 border-red-600 text-white hover:bg-white hover:text-red-600 hover:border-white transition-colors"
                >
                  SEVER
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
