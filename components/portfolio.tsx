"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "./navigation";
import ProfileSection from "./sections/profile-section";
import ProjectsSection from "./sections/projects-section";
import SystemSection from "./sections/system-section";
import PersonaSection from "./sections/persona-section";
import ChatbotSection from "./sections/chatbot-section";
import { playHoverSound, playClickSound } from "../lib/sounds";

export type Section =
  | "profile"
  | "projects"
  | "system"
  | "persona"
  | "chatbot"
  | "none";

// Decorative "underwater" backdrop for the main menu: a bright waterline,
// sunbeam shafts, drifting caustics and rising bubbles to sell the P3-style
// water splash look behind the nav.
const WaterSplashBackground = () => {
  const bubbles = Array.from({ length: 22 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: 5 + Math.random() * 16,
    duration: 5 + Math.random() * 9,
    delay: Math.random() * 8,
    drift: Math.random() * 30 - 15,
  }));

  const caustics = [
    { top: "-15%", left: "-10%", size: "65vw", color: "#ffffff", duration: 13 },
    { top: "10%", left: "55%", size: "55vw", color: "#00f0ff", duration: 17 },
    { top: "50%", left: "0%", size: "50vw", color: "#4deeea", duration: 21 },
    { top: "60%", left: "50%", size: "60vw", color: "#0a52f4", duration: 15 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Sunbeam shafts streaming down from the surface */}
      <div
        className="absolute inset-x-0 top-0 h-[45%] opacity-25 mix-blend-screen"
        style={{
          background:
            "repeating-linear-gradient(100deg, rgba(255,255,255,0.35) 0px, rgba(255,255,255,0.35) 30px, transparent 30px, transparent 120px)",
          maskImage: "linear-gradient(to bottom, black, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
        }}
      />

      {/* Drifting caustic light blobs */}
      {caustics.map((c, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full mix-blend-screen opacity-40"
          style={{
            top: c.top,
            left: c.left,
            width: c.size,
            height: c.size,
            background: `radial-gradient(circle at center, ${c.color} 0%, transparent 70%)`,
            filter: "blur(35px)",
          }}
          animate={{
            x: ["0%", "8%", "-6%", "0%"],
            y: ["0%", "-6%", "5%", "0%"],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{
            duration: c.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Animated wavy waterline separating a brighter "surface" band from the deep */}
      <div className="absolute left-0 right-0 top-[30%] h-20 md:h-28 overflow-hidden opacity-70">
        <motion.svg
          viewBox="0 0 200 40"
          preserveAspectRatio="none"
          className="w-[200%] h-full"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 11, repeat: Infinity, ease: "linear" }}
        >
          <defs>
            <linearGradient id="waterlineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="40%" stopColor="#4deeea" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#4deeea" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 20 Q 12.5 6 25 20 T 50 20 T 75 20 T 100 20 T 125 20 T 150 20 T 175 20 T 200 20 V40 H0 Z"
            fill="url(#waterlineGrad)"
          />
        </motion.svg>
      </div>

      {/* Diagonal light shimmer sweep */}
      <motion.div
        className="absolute -inset-y-1/2 w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-white/20 to-transparent mix-blend-screen"
        animate={{ x: ["-40vw", "140vw"] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Rising bubbles */}
      {bubbles.map((b) => (
        <motion.div
          key={b.id}
          initial={{ x: `${b.x}vw`, y: "110%", opacity: 0 }}
          animate={{
            x: [`${b.x}vw`, `${b.x + b.drift}vw`],
            y: ["110%", "-10%"],
            opacity: [0, 0.8, 0.8, 0],
          }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute rounded-full bg-white/50 border border-white/60 shadow-[0_0_8px_rgba(255,255,255,0.6)]"
          style={{ width: b.size, height: b.size }}
        />
      ))}
    </div>
  );
};

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState<Section>("none");
  const [showSplash, setShowSplash] = useState(true);
  const [doorState, setDoorState] = useState<
    "idle" | "enter1" | "enter2" | "leave1" | "leave2"
  >("idle");

  const mainMenuAudioRef = useRef<HTMLAudioElement>(null);
  const velvetAudioRef = useRef<HTMLAudioElement>(null);

  // Splash Screen Timer
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3500);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Music Crossfader
  useEffect(() => {
    const fadeAudio = (audio: HTMLAudioElement, targetVolume: number) => {
      if (!audio) return;
      const existingInterval = (audio as any).fadeInterval;
      if (existingInterval) clearInterval(existingInterval);

      if (targetVolume > 0 && audio.paused) {
        audio.play().catch((e) => console.log("Audio play prevented:", e));
      }

      const step = 0.05;
      const interval = setInterval(() => {
        let current = audio.volume;
        if (current < targetVolume) {
          audio.volume = Math.min(current + step, targetVolume);
        } else if (current > targetVolume) {
          audio.volume = Math.max(current - step, targetVolume);
        }

        if (audio.volume === targetVolume) {
          clearInterval(interval);
          if (targetVolume === 0) {
            audio.pause();
          }
        }
      }, 50);

      (audio as any).fadeInterval = interval;
    };

    if (showSplash) {
      if (mainMenuAudioRef.current) fadeAudio(mainMenuAudioRef.current, 0);
      if (velvetAudioRef.current) fadeAudio(velvetAudioRef.current, 0);
      return;
    }

    const isVelvet =
      activeSection === "chatbot" ||
      doorState === "enter1" ||
      doorState === "enter2";

    // Read user's explicit volume preference
    let masterVolume = 1;
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("bgm_volume");
      if (stored !== null) masterVolume = parseFloat(stored);
    }

    if (isVelvet) {
      if (mainMenuAudioRef.current) fadeAudio(mainMenuAudioRef.current, 0);
      if (velvetAudioRef.current)
        fadeAudio(velvetAudioRef.current, masterVolume);
    } else {
      if (mainMenuAudioRef.current)
        fadeAudio(mainMenuAudioRef.current, masterVolume);
      if (velvetAudioRef.current) fadeAudio(velvetAudioRef.current, 0);
    }
  }, [activeSection, showSplash, doorState]);

  // Sync muted state on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isMuted = localStorage.getItem("bgm_muted") === "true";
      if (mainMenuAudioRef.current) mainMenuAudioRef.current.muted = isMuted;
      if (velvetAudioRef.current) velvetAudioRef.current.muted = isMuted;
    }
  }, []);

  // Global Play/Pause (Spacebar & Double Tap)
  useEffect(() => {
    let lastTap = 0;

    const toggleMusic = (e?: Event) => {
      if (e && e.type === "keydown") {
        const keyEvent = e as KeyboardEvent;
        if (
          keyEvent.target instanceof HTMLInputElement ||
          keyEvent.target instanceof HTMLTextAreaElement
        )
          return;

        if (keyEvent.code === "Space") {
          keyEvent.preventDefault();
        } else {
          return;
        }
      }

      if (e && (e.type === "touchstart" || e.type === "dblclick")) {
        const target = e.target as HTMLElement;
        if (target.closest(".nav-item")) return;
      }

      const isMuted = localStorage.getItem("bgm_muted") === "true";
      const newMuted = !isMuted;
      localStorage.setItem("bgm_muted", newMuted.toString());

      const audioMain = document.getElementById(
        "main-menu-bgm",
      ) as HTMLAudioElement;
      if (audioMain) audioMain.muted = newMuted;

      const audioVelvet = document.getElementById(
        "velvet-room-bgm",
      ) as HTMLAudioElement;
      if (audioVelvet) audioVelvet.muted = newMuted;

      if (!newMuted) {
        if (audioMain && audioMain.paused && activeSection !== "chatbot")
          audioMain.play().catch(() => {});
        if (audioVelvet && audioVelvet.paused && activeSection === "chatbot")
          audioVelvet.play().catch(() => {});
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      toggleMusic(e);
    };

    const handleTouchStart = (e: TouchEvent) => {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap;

      if (tapLength < 500 && tapLength > 0) {
        toggleMusic(e);
      }
      lastTap = currentTime;
    };

    const handleDoubleClick = (e: MouseEvent) => {
      toggleMusic(e);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("dblclick", handleDoubleClick);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("dblclick", handleDoubleClick);
    };
  }, [activeSection]);

  const handleSectionChange = (section: Section) => {
    if (section === "chatbot" && activeSection !== "chatbot") {
      // ENTERING VELVET ROOM
      if (velvetAudioRef.current) velvetAudioRef.current.currentTime = 0;
      setDoorState("enter1");
      setTimeout(() => {
        setActiveSection(section);
        setDoorState("enter2");
        setTimeout(() => setDoorState("idle"), 1000);
      }, 1500);
    } else if (activeSection === "chatbot" && section !== "chatbot") {
      // LEAVING VELVET ROOM
      if (mainMenuAudioRef.current) mainMenuAudioRef.current.currentTime = 0;
      setDoorState("leave1");
      setTimeout(() => {
        // Flash white and swap back to main menu instantly once the door finishes closing
        setActiveSection(section);
        setDoorState("leave2");
        setTimeout(() => setDoorState("idle"), 1200);
      }, 1000); // Give the door 1 full second to swing shut before flashing
    } else {
      setActiveSection(section);
    }
  };

  // Menu Animation Variants
  const menuVariants = {
    hidden: { opacity: 0, scale: 1.1, filter: "blur(10px)" },
    enter: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.35,
        ease: "easeOut" as const,
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      filter: "blur(4px)",
      transition: { duration: 0.2, ease: "easeIn" as const },
    },
  };

  // Section Animation Variants
  const sectionVariants = {
    hidden: { opacity: 0, clipPath: "circle(0% at 50% 50%)" },
    enter: {
      opacity: 1,
      clipPath: "circle(150% at 50% 50%)",
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
    exit: {
      opacity: 0,
      clipPath: "circle(0% at 50% 50%)",
      transition: { duration: 0.25, ease: "easeIn" as const },
    },
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden text-white font-outfit select-none bg-[#0a52f4]">
      {/* 1. Dark Hour Clock Splash Screen overlay */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{
              opacity: 1,
              filter: "brightness(1) contrast(1)",
              scale: 1,
            }}
            exit={{
              opacity: 0,
              filter: "brightness(3) contrast(1.5)",
              scale: 1.1,
              transition: { duration: 0.8, ease: "easeIn" },
            }}
            className="absolute inset-0 z-[999] bg-[#020b06] flex items-center justify-center pointer-events-none overflow-hidden"
          >
            {/* Ambient Dark Hour Glow */}
            <motion.div
              className="absolute inset-0 z-0 opacity-30 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#00ff2a]/30 via-[#020b06]/80 to-black"
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 3.5, ease: "easeInOut" }}
            />

            {/* Giant Clock Face */}
            <motion.div
              className="relative z-10 w-[280px] h-[280px] md:w-[450px] md:h-[450px] rounded-full border-[2px] md:border-[4px] border-[#0a2f16] flex items-center justify-center bg-black/80 shadow-[0_0_80px_rgba(0,255,42,0.15)]"
              initial={{ scale: 0.8, opacity: 0, rotate: -15 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              {/* Inner Decorative Rings */}
              <div className="absolute inset-4 md:inset-8 rounded-full border border-[#0a2f16]/60" />
              <div className="absolute inset-10 md:inset-20 rounded-full border border-[#0a2f16]/30" />

              {/* Clock Markers */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={`marker-${i}`}
                  className="absolute inset-0 flex px-2 py-3 md:p-6"
                  style={{ transform: `rotate(${i * 30}deg)` }}
                >
                  <div
                    className={`mx-auto rounded-full ${i % 3 === 0 ? "w-1.5 md:w-2 h-6 md:h-10 bg-[#165a29] shadow-[0_0_10px_#165a29]" : "w-1 md:w-1.5 h-3 md:h-6 bg-[#0a2f16]"}`}
                  />
                </div>
              ))}

              {/* Hour Hand */}
              <motion.div
                className="absolute w-[4px] md:w-[8px] h-[70px] md:h-[120px] bg-[#165a29] rounded-full bottom-1/2 left-1/2 -ml-[2px] md:-ml-[4px] origin-bottom"
                initial={{ rotate: -10 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 2.2, ease: "anticipate" }}
              />

              {/* Minute Hand */}
              <motion.div
                className="absolute w-[2px] md:w-[4px] h-[100px] md:h-[160px] bg-[#00ff2a] rounded-full bottom-1/2 left-1/2 -ml-[1px] md:-ml-[2px] origin-bottom shadow-[0_0_15px_#00ff2a]"
                initial={{ rotate: -120 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 2.2, ease: "anticipate" }}
              />

              {/* Second Hand */}
              <motion.div
                className="absolute w-[1px] md:w-[2px] h-[110px] md:h-[180px] bg-white/70 rounded-full bottom-1/2 left-1/2 -ml-[0.5px] md:-ml-[1px] origin-bottom"
                initial={{ rotate: -1080 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 2.2, ease: "anticipate" }}
              />

              {/* Center Dot */}
              <div className="relative w-4 h-4 md:w-6 md:h-6 bg-[#00ff2a] flex items-center justify-center rounded-full shadow-[0_0_20px_#00ff2a] z-20" />
            </motion.div>

            {/* Flash Effect exactly when it hits 12 */}
            <motion.div
              className="absolute inset-0 bg-[#00ff2a] mix-blend-screen z-50 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 1, 0] }}
              transition={{ duration: 3.5, times: [0, 0.628, 0.642, 1] }}
            />

            {/* Digital Time at bottom */}
            <motion.div className="absolute bottom-12 md:bottom-20 z-20 flex flex-col items-center">
              <div className="text-[#00ff2a] font-black text-5xl md:text-7xl tracking-[0.2em] shadow-[0_0_30px_rgba(0,255,42,0.5)] font-mono ml-4 relative h-[1.2em] w-[4em] flex justify-center drop-shadow-[0_0_20px_#00ff2a]">
                <motion.span
                  initial={{ opacity: 1 }}
                  animate={{ opacity: [1, 1, 0, 0] }}
                  transition={{ duration: 3.5, times: [0, 0.628, 0.642, 1] }}
                  className="absolute whitespace-nowrap"
                >
                  23:59
                </motion.span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0, 1, 1] }}
                  transition={{ duration: 3.5, times: [0, 0.628, 0.642, 1] }}
                  className="absolute whitespace-nowrap"
                >
                  00:00
                </motion.span>
              </div>

              {/* Dark Hour Text */}
              <motion.div
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{
                  opacity: [0, 0, 1, 1],
                  y: [30, 30, 0, 0],
                  filter: [
                    "blur(10px)",
                    "blur(10px)",
                    "blur(0px)",
                    "blur(0px)",
                  ],
                }}
                transition={{ duration: 3.5, times: [0, 0.628, 0.65, 1] }}
                className="text-[#00ff2a] text-lg md:text-2xl tracking-[0.6em] mt-2 md:mt-4 uppercase italic font-outfit"
              >
                THE DARK HOUR
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Global Environment (Deep blue gradient matching the image) */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-linear-to-tr from-[#021bc9] via-[#053df5] to-[#4deeea]" />

      {/* Base background while splash is active to transition smoothly without white flash */}
      <div className="absolute inset-0 z-[-1] bg-[#000000] pointer-events-none" />

      <AnimatePresence>
        {/* State A: Main Menu */}
        {activeSection === "none" && !showSplash && (
          <motion.div
            key="main-menu"
            variants={menuVariants}
            initial="hidden"
            animate="enter"
            exit="exit"
            className="absolute inset-0 w-full h-full flex z-10"
          >
            {/* Water Splash Backdrop */}
            <div className="absolute inset-0 z-0">
              <WaterSplashBackground />
            </div>

            {/* Protagonist Avatar - Upside Down, Animated GIF */}
            <motion.div
              initial={{ x: -200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="absolute opacity-20 left-[-30%] top-[-6%] w-[140vw] h-full md:portrait:opacity-90 md:portrait:left-[-10%] md:portrait:top-[-6%] md:portrait:w-[90vw] md:portrait:h-[110%] md:landscape:opacity-90 md:landscape:left-[0%] md:landscape:top-[-16%] md:landscape:w-auto md:landscape:h-[95%] lg:landscape:left-[12%] z-20 flex items-start justify-start pointer-events-none"
            >
              {/*
                We use an animated GIF with a transparent background.
                We apply CSS filters to tint the image perfectly into a P3 Reload cyan/blue style.
                Framer motion adds a slow 'floating in water' breathing effect to the entire GIF.
                Landscape breakpoints size the image off container HEIGHT (not width) so it doesn't
                balloon and swallow the nav text on short-but-wide viewports (e.g. Nest Hub Max).
              */}

              <motion.img
                src="/avatar.png"
                alt="Protagonist"
                className="w-full h-auto object-contain rotate-180 -scale-x-100 md:landscape:w-auto md:landscape:h-full"
                style={{
                  filter:
                    "sepia(1) hue-rotate(180deg) saturate(400%) brightness(1.2) contrast(1.1) drop-shadow(10px -10px 30px rgba(0,240,255,0.6))",
                }}
                animate={{ y: [0, -15, 0], rotate: [5, 3, 5] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>

            {/* Centered Tilted Menu */}
            <div className="absolute inset-0 flex items-center mb-10 justify-center pl-[5%] md:pl-[10%] lg:pl-0 z-30">
              <Navigation onSectionChange={handleSectionChange} />
            </div>
          </motion.div>
        )}

        {/* State B: Active Subsection Content */}
        {activeSection !== "none" && activeSection !== "chatbot" && (
          <motion.div
            key="sub-section"
            variants={sectionVariants}
            initial="hidden"
            animate="enter"
            exit="exit"
            className="absolute inset-0 w-full h-full z-40 bg-[#121ebb] backdrop-blur-2xl flex flex-col items-center justify-center p-2 md:p-10 pb-2 md:pb-4 overflow-hidden"
          >
            {/* Sub-section Back Button */}
            <button
              onClick={() => {
                playClickSound();
                handleSectionChange("none");
              }}
              onMouseEnter={playHoverSound}
              className="absolute top-4 left-4 md:top-8 md:left-8 flex items-center z-50 px-4 md:px-6 py-2 md:py-3 bg-white text-black font-black text-sm md:text-xl italic -skew-x-15 hover:bg-[#ff003c] hover:text-white hover:scale-105 transition-all shadow-[6px_6px_0_rgba(0,0,0,1)] hover:shadow-[-6px_6px_0_#00f0ff] duration-300 cursor-pointer"
            >
              <div className="skew-x-15 uppercase tracking-wider">
                &lt; BACK
              </div>
            </button>

            <div className="w-full h-full max-w-350 mx-auto relative mt-16 md:mt-16 overflow-hidden rounded-xl border border-white/10 shadow-2xl bg-black/20">
              {activeSection === "profile" && <ProfileSection />}
              {activeSection === "projects" && <ProjectsSection />}
              {activeSection === "system" && <SystemSection />}
              {activeSection === "persona" && <PersonaSection />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* State C: Chatbot (Velvet Room) */}
      <AnimatePresence>
        {activeSection === "chatbot" && (
          <motion.div
            key="sub-section-chatbot"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            className="absolute inset-0 w-full h-full z-40 bg-[#121ebb] backdrop-blur-2xl flex flex-col items-center justify-center p-2 md:p-10 pb-2 md:pb-4 overflow-hidden"
          >
            {/* Sub-section Back Button */}
            <button
              onClick={() => {
                playClickSound();
                handleSectionChange("none");
              }}
              onMouseEnter={playHoverSound}
              className="absolute top-4 left-4 md:top-8 md:left-8 flex items-center z-50 px-4 md:px-6 py-2 md:py-3 bg-white text-black font-black text-sm md:text-xl italic -skew-x-15 hover:bg-[#ff003c] hover:text-white hover:scale-105 transition-all shadow-[6px_6px_0_rgba(0,0,0,1)] hover:shadow-[-6px_6px_0_#00f0ff] duration-300 cursor-pointer"
            >
              <div className="skew-x-15 uppercase tracking-wider">
                &lt; BACK
              </div>
            </button>

            <div className="w-full h-full max-w-350 mx-auto relative mt-16 md:mt-16 overflow-hidden rounded-xl border border-white/10 shadow-2xl bg-black/20">
              <ChatbotSection />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Velvet Room Transition Overlay (3D Tilted Blue Door) */}
      <AnimatePresence>
        {doorState !== "idle" && (
          <motion.div className="absolute inset-0 w-full h-full z-[100] pointer-events-auto overflow-hidden flex items-center justify-center">
            {/* Dark BG Overlay */}
            <motion.div
              className="absolute inset-0 bg-black"
              initial={{
                opacity:
                  doorState === "leave1" || doorState === "leave2" ? 1 : 0,
              }}
              animate={{
                opacity:
                  doorState === "enter2" || doorState === "leave2" ? 0 : 1,
              }}
              transition={{
                duration: doorState === "leave2" ? 1.0 : 0.1,
              }}
            />

            {/* 3D Tilted Container for Door & Light */}
            <motion.div
              className="relative w-full h-full flex flex-col items-center justify-center pointer-events-none"
              style={{ rotate: "-8deg", scale: 1.2 }}
              initial={{
                opacity:
                  doorState === "leave1" || doorState === "leave2" ? 1 : 0,
              }}
              animate={{
                opacity:
                  doorState === "enter2" || doorState === "leave2" ? 0 : 1,
              }}
              transition={{
                duration: doorState === "leave2" ? 0 : 0.3,
              }}
            >
              {/* Floor Line representing horizon */}
              <div className="absolute w-[200%] h-[1px] bg-blue-900/40 top-[55%]" />

              {/* The Door Container */}
              <div
                className="absolute top-[20%] w-[120px] md:w-[180px] h-[35%] flex justify-center z-20"
                style={{ perspective: "1000px" }}
              >
                {/* Shining White Light Inside Door */}
                <div
                  className="absolute inset-0 bg-white"
                  style={{
                    boxShadow:
                      "0 0 50px 20px rgba(255, 255, 255, 0.8), 0 0 100px 40px rgba(0, 150, 255, 0.6)",
                  }}
                />

                {/* The Swinging Single Open Door */}
                <motion.div
                  className="absolute inset-0 bg-[#0a1930] rounded-sm flex flex-col justify-around py-2 shadow-inset"
                  style={{
                    transformOrigin: "left",
                    boxShadow: "inset 0 0 20px rgba(0,0,0,0.8)",
                    border: "2px solid #4c8cff",
                  }}
                  initial={{
                    rotateY:
                      doorState === "leave1" || doorState === "leave2"
                        ? -120
                        : 0,
                  }}
                  animate={{
                    rotateY: doorState === "enter1" ? -120 : 0,
                  }}
                  transition={{
                    duration: 1.0,
                    ease: doorState === "leave1" ? "easeOut" : "circIn",
                    delay: doorState === "enter1" ? 0.3 : 0,
                  }}
                >
                  {/* Door Knob & Decor */}
                  <div className="absolute right-2 top-1/2 w-2 h-4 md:w-3 md:h-6 bg-yellow-400 rounded-sm shadow-[0_0_5px_rgba(250,204,21,0.8)] -translate-y-1/2" />
                  <div className="w-[70%] h-[30%] border border-[#4c8cff]/30 mx-auto" />
                  <div className="w-[70%] h-[30%] border border-[#4c8cff]/30 mx-auto" />
                </motion.div>
              </div>
            </motion.div>

            {/* Solid White Flash Overlay */}
            <motion.div
              className="absolute inset-0 bg-white pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{
                opacity:
                  doorState === "enter1"
                    ? [0, 0, 1]
                    : doorState === "enter2"
                      ? [1, 1, 0]
                      : doorState === "leave1"
                        ? 0
                        : doorState === "leave2"
                          ? [1, 1, 0]
                          : 0,
              }}
              transition={{
                duration:
                  doorState === "enter1"
                    ? 1.5
                    : doorState === "enter2"
                      ? 1.2
                      : doorState === "leave1"
                        ? 0
                        : doorState === "leave2"
                          ? 1.2
                          : 0,
                times:
                  doorState === "enter1"
                    ? [0, 0.73, 1]
                    : doorState === "enter2"
                      ? [0, 0.4, 1]
                      : doorState === "leave2"
                        ? [0, 0.15, 1]
                        : undefined,
                ease: "easeOut",
              }}
              style={{ zIndex: 50 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Background Music Elements */}
      <audio
        id="main-menu-bgm"
        ref={mainMenuAudioRef}
        src="/p3rcoloryournight.mp3"
        loop
      />
      <audio
        id="velvet-room-bgm"
        ref={velvetAudioRef}
        src="/p3rvelvetroom.mp3"
        loop
      />
    </div>
  );
}
