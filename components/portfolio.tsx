"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "./navigation";
import ProfileSection from "./sections/profile-section";
import ProjectsSection from "./sections/projects-section";
import SystemSection from "./sections/system-section";
import PersonaSection from "./sections/persona-section";
import ChatbotSection from "./sections/chatbot-section";

export type Section =
  | "profile"
  | "projects"
  | "system"
  | "persona"
  | "chatbot"
  | "none";

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
    return () => clearTimeout(timer);
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
      if (velvetAudioRef.current) fadeAudio(velvetAudioRef.current, masterVolume);
    } else {
      if (mainMenuAudioRef.current) fadeAudio(mainMenuAudioRef.current, masterVolume);
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
        duration: 0.6,
        ease: "easeOut" as const,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      filter: "blur(10px)",
      transition: { duration: 0.4, ease: "easeIn" as const },
    },
  };

  // Section Animation Variants
  const sectionVariants = {
    hidden: { opacity: 0, clipPath: "circle(0% at 50% 50%)" },
    enter: {
      opacity: 1,
      clipPath: "circle(150% at 50% 50%)",
      transition: { duration: 0.8, ease: "easeOut" as const },
    },
    exit: {
      opacity: 0,
      clipPath: "circle(0% at 50% 50%)",
      transition: { duration: 0.5, ease: "easeIn" as const },
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

      {/* Top Right Animated Water Ripples (Surface Reflection) */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[50%] z-1 pointer-events-none overflow-hidden mix-blend-screen opacity-90">
        <motion.div
          className="absolute right-[10%] top-[10%] w-[80%] h-[80%] rounded-[40%] bg-linear-to-tr from-transparent to-white/40 border-t-4 border-white blur-[2px]"
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute right-[5%] top-[5%] w-[90%] h-[90%] rounded-[45%] bg-linear-to-r from-transparent to-[#00f0ff]/30 border-r-8 border-[#00f0ff] blur-xs opacity-70"
          animate={{ rotate: -360, scale: [1, 1.2, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute right-[15%] top-[15%] w-[60%] h-[60%] rounded-[35%] bg-white blur-[60px] opacity-30"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* 3. Floating Animated Water Droplets (Right Side) */}
      <div className="absolute right-0 top-0 bottom-0 w-[40%] pointer-events-none z-5 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`droplet-${i}`}
            className="absolute rounded-[40%] border-2 border-white/20 mix-blend-overlay"
            initial={{
              opacity: 0,
              scale: 0,
              x: 50 + Math.random() * 200,
              y: 200 + Math.random() * 500,
            }}
            animate={{
              opacity: [0, 0.6, 0],
              scale: [0, 2 + Math.random()],
              y: [null, "-50px"],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "easeOut",
            }}
            style={{
              width: `${100 + Math.random() * 150}px`,
              height: `${100 + Math.random() * 150}px`,
            }}
          />
        ))}
        {/* Subtle right-side wave glow */}
        <motion.div
          className="absolute right-[-10%] top-[20%] w-[50%] h-[80%] rounded-[100%] bg-[#00f0ff] opacity-10 blur-[120px]"
          animate={{ scale: [1, 1.3, 1], y: [0, -50, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Base background while splash is active to transition smoothly without white flash */}
      <div className="absolute inset-0 z-[-1] bg-[#000000] pointer-events-none" />

      <AnimatePresence mode="wait">
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
            {/* Protagonist Avatar - Upside Down, Animated GIF */}
            <motion.div
              initial={{ x: -200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="absolute opacity-40 -left-[30%] md:-left-[0%] md:opacity-90 lg:left-[5%] top-[5%] md:top-[-10%] w-[140vw] md:w-[70vw] lg:w-[45vw] h-[100%] md:h-[120%] z-20 flex items-start justify-start pointer-events-none"
            >
              {/* 
                We use an animated GIF with a transparent background. 
                We apply CSS filters to tint the image perfectly into a P3 Reload cyan/blue style.
                Framer motion adds a slow 'floating in water' breathing effect to the entire GIF. 
              */}
              <motion.img
                src="/avatar.png"
                alt="Protagonist"
                className="w-full h-auto object-contain rotate-180"
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
              onClick={() => handleSectionChange("none")}
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
              onClick={() => handleSectionChange("none")}
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
              initial={{ opacity: doorState === "leave1" || doorState === "leave2" ? 1 : 0 }}
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
              initial={{ opacity: doorState === "leave1" || doorState === "leave2" ? 1 : 0 }}
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
                  initial={{ rotateY: doorState === "leave1" || doorState === "leave2" ? -120 : 0 }}
                  animate={{
                    rotateY:
                      doorState === "enter1"
                        ? -120
                        : 0,
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
