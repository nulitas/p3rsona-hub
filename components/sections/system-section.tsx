"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { playHoverSound, playClickSound } from "../../lib/sounds";

type Entry = { type: "text"; content: string } | { type: "audio" };

const systemEntries: Entry[] = [
  {
    type: "text",
    content:
      "A PERSONAL HUB DESIGNED WITH A HIGH-CONTRAST POP-ART AESTHETIC, REIMAGINED FOR MODERN METRICS.",
  },
  {
    type: "text",
    content:
      "Engineered using Next.js, React, TypeScript, and Framer Motion for liquid synchronization, featuring real-time AI capabilities.",
  },
  {
    type: "text",
    content:
      "Deployed to break the grid intentionally. Form and function, locked in sync. The Dark Hour awaits.",
  },
  { type: "text", content: "SYS_SPECS: FRAME_SYNC // NEXT-GEN // FLUID" },
  { type: "audio" },
];

export default function SystemSection() {
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Sync state with localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedVol = localStorage.getItem("bgm_volume");
      if (storedVol !== null) setVolume(parseFloat(storedVol));
      const storedMute = localStorage.getItem("bgm_muted");
      if (storedMute !== null) setIsMuted(storedMute === "true");
    }
  }, []);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("bgm_volume", val.toString());
    }

    // Immediately apply to any currently playing background track without breaking crossfade logic
    const audioMain = document.getElementById(
      "main-menu-bgm",
    ) as HTMLAudioElement;
    if (audioMain && audioMain.volume > 0) audioMain.volume = val;

    const audioVelvet = document.getElementById(
      "velvet-room-bgm",
    ) as HTMLAudioElement;
    if (audioVelvet && audioVelvet.volume > 0) audioVelvet.volume = val;

    if (val > 0 && isMuted) {
      setIsMuted(false);
      if (typeof window !== "undefined")
        localStorage.setItem("bgm_muted", "false");
      if (audioMain) audioMain.muted = false;
      if (audioVelvet) audioVelvet.muted = false;
    }
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (typeof window !== "undefined") {
      localStorage.setItem("bgm_muted", newMuted.toString());
    }

    const audioMain = document.getElementById(
      "main-menu-bgm",
    ) as HTMLAudioElement;
    if (audioMain) audioMain.muted = newMuted;

    const audioVelvet = document.getElementById(
      "velvet-room-bgm",
    ) as HTMLAudioElement;
    if (audioVelvet) audioVelvet.muted = newMuted;
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
      transition: { type: "spring" as const, stiffness: 300, damping: 25 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col w-full h-full relative z-10 overflow-hidden bg-[#050a2b]"
    >
      {/* Background styling to match the Tutorial screen (Diagonal split) */}
      <div className="absolute top-0 left-0 w-full h-24 bg-white/10 z-0 border-b border-white/20"></div>
      <div
        className="absolute top-0 right-0 w-[65%] h-[150%] bg-[#121ebb]/80 z-0 origin-bottom-left border-l-8 border-[#00f0ff]"
        style={{
          clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0 100%)",
          transform: "skewX(-15deg)",
        }}
      ></div>

      {/* Giant Background Watermark */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotate: -35 }}
        animate={{ opacity: 1, scale: 1, rotate: -35 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute bottom-10 right-[-10%] text-[6rem] md:text-[14rem] font-black italic pointer-events-none select-none z-0 text-[#0c144a] leading-none tracking-tighter opacity-80"
      >
        SYSTEM
      </motion.div>

      {/* Top Header Navigation Tabs */}
      <motion.div
        variants={itemVariants}
        className="flex items-end justify-start gap-2 md:gap-4 mt-4 md:mt-6 px-[5vw] z-20 relative font-black italic"
      >
        <div className="flex bg-white rounded-full items-center pl-2 pr-1 h-10 md:h-12 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          {/* Active Tab */}
          <div className="bg-white text-black px-4 md:px-12 py-1 rounded-full text-sm md:text-2xl tracking-tight leading-none h-full flex items-center border-l-4 border-white">
            System
          </div>
        </div>
      </motion.div>

      {/* Main Bulleted List Area */}
      <div className="flex flex-col w-full max-w-300 z-10 mt-8 md:mt-12 px-[5vw] pl-[8vw] md:pl-[12vw]">
        <div className="flex flex-col gap-1 w-full md:w-[80%]">
          {systemEntries.map((entry, index) => {
            const isActive = entry.type === "audio";

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`relative w-full flex items-center font-sans transition-all px-2 md:px-4 py-2 md:py-3 min-h-12 md:min-h-16 ${
                  isActive
                    ? "bg-white text-black z-20 shadow-[0_4px_10px_rgba(0,0,0,0.5)] scale-[1.01]"
                    : "bg-transparent text-[#00f0ff] z-10 cursor-default"
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 right-0 w-full h-0.75 bg-[#ff003c]/80"></div>
                )}

                <div
                  className={`mr-2 md:mr-4 text-lg md:text-2xl leading-none font-black ${isActive ? "text-[#121ebb]" : "text-[#00f0ff]"}`}
                >
                  •
                </div>

                <div
                  className={`flex-1 flex flex-col md:flex-row md:items-center text-xs md:text-lg font-bold leading-relaxed tracking-wide ${isActive ? "text-[#121ebb]" : "text-[#00f0ff] drop-shadow-[0_0_2px_rgba(0,240,255,0.4)]"}`}
                >
                  {entry.type === "text" ? (
                    entry.content
                  ) : (
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 w-full">
                      <span className="shrink-0 w-24 md:w-32 uppercase tracking-widest text-[10px] md:text-base">
                        BGM Settings
                      </span>

                      <div className="flex items-center gap-2 md:gap-4 flex-1">
                        <button
                          onMouseEnter={playHoverSound}
                          onClick={() => { playClickSound(); toggleMute(); }}
                          className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full border-2 transition-colors ${
                            isActive
                              ? "border-[#121ebb] hover:bg-[#121ebb] hover:text-white"
                              : "border-[#00f0ff] hover:bg-[#00f0ff] hover:text-black"
                          }`}
                        >
                          {isMuted || volume === 0 ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                              <line x1="23" y1="9" x2="17" y2="15"></line>
                              <line x1="17" y1="9" x2="23" y2="15"></line>
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                            </svg>
                          )}
                        </button>

                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={isMuted ? 0 : volume}
                          onChange={handleVolumeChange}
                          className={`flex-1 h-2 md:h-3 rounded-full appearance-none cursor-pointer ${
                            isActive ? "bg-[#121ebb]/20" : "bg-[#00f0ff]/20"
                          }`}
                          style={{
                            WebkitAppearance: "none",
                            background: isActive
                              ? `linear-gradient(to right, #121ebb 0%, #121ebb ${(isMuted ? 0 : volume) * 100}%, rgba(18,30,187,0.2) ${(isMuted ? 0 : volume) * 100}%, rgba(18,30,187,0.2) 100%)`
                              : `linear-gradient(to right, #00f0ff 0%, #00f0ff ${(isMuted ? 0 : volume) * 100}%, rgba(0,240,255,0.2) ${(isMuted ? 0 : volume) * 100}%, rgba(0,240,255,0.2) 100%)`,
                          }}
                        />
                        <span className="font-sans font-black w-8 md:w-12 text-right text-xs md:text-base">
                          {Math.round((isMuted ? 0 : volume) * 100)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {isActive && (
                  <div className="absolute top-0 right-0 h-full w-1.5 bg-[#121ebb]"></div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Scrollbar Mocking */}
      <div className="absolute left-[3vw] md:left-[6vw] top-[30vh] w-1.5 md:w-2 h-[40vh] bg-black/50 z-20 overflow-hidden shadow-inner hidden md:block">
        <div
          className="w-full bg-[#00f0ff] transition-all duration-300 shadow-[0_0_8px_#00f0ff]"
          style={{
            height: `${100 / systemEntries.length}%`,
            top: `${(systemEntries.length - 1) * (100 / systemEntries.length)}%`,
            position: "absolute",
          }}
        ></div>
      </div>
    </motion.div>
  );
}
