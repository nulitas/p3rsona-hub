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

  const audioRef = useRef<HTMLAudioElement>(null);

  // Splash Screen Timer
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Music Auto-Player
  useEffect(() => {
    if (audioRef.current && !showSplash) {
      audioRef.current
        .play()
        .catch((e) => console.log("Audio play prevented:", e));
    }
  }, [activeSection, showSplash]);

  // Menu Animation Variants
  const menuVariants = {
    hidden: { opacity: 0, scale: 1.1, filter: "blur(10px)" },
    enter: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.6, ease: "easeOut" as const, staggerChildren: 0.1 },
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
    <div className="relative w-screen h-screen overflow-hidden text-white font-outfit select-none bg-[#0a52f4]">
      {/* 1. Initial Water Splash Screen overlay */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1, clipPath: "circle(100% at 50% 50%)" }}
            exit={{
              opacity: 0,
              clipPath: "circle(0% at 50% 50%)",
              transition: { duration: 1, ease: "easeInOut" },
            }}
            className="absolute inset-0 z-999 bg-[#00f0ff] flex items-center justify-center pointer-events-none"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="text-black text-6xl md:text-8xl font-black italic tracking-tighter"
            >
              INITIALIZING...
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
              className="absolute left-[0%] md:left-[5%] top-[-10%] w-[70vw] md:w-[45vw] h-[120%] z-20 flex items-start justify-start pointer-events-none"
            >
              {/* 
                We use an animated GIF with a transparent background. 
                We apply CSS filters to tint the image perfectly into a P3 Reload cyan/blue style.
                Framer motion adds a slow 'floating in water' breathing effect to the entire GIF. 
              */}
              <motion.img
                src="/avatar.png"
                alt="Protagonist"
                className="w-full h-auto object-contain opacity-90 rotate-180"
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
            <div className="absolute inset-0 flex items-center mb-10 justify-center pl-[20%] md:pl-0 z-30">
              <Navigation onSectionChange={setActiveSection} />
            </div>
          </motion.div>
        )}

        {/* State B: Active Subsection Content */}
        {activeSection !== "none" && (
          <motion.div
            key="sub-section"
            variants={sectionVariants}
            initial="hidden"
            animate="enter"
            exit="exit"
            className="absolute inset-0 w-full h-full z-40 bg-[#121ebb] backdrop-blur-2xl flex flex-col items-center justify-center p-4 md:p-10 pb-4 overflow-hidden"
          >
            {/* Sub-section Back Button */}
            <button
              onClick={() => setActiveSection("none")}
              className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center z-50 px-6 py-3 bg-white text-black font-black text-xl italic -skew-x-15 hover:bg-[#ff003c] hover:text-white hover:scale-105 transition-all shadow-[6px_6px_0_rgba(0,0,0,1)] hover:shadow-[-6px_6px_0_#00f0ff] duration-300 cursor-pointer"
            >
              <div className="skew-x-15 uppercase tracking-wider">
                &lt; BACK
              </div>
            </button>

            <div className="w-full h-full max-w-350 mx-auto relative mt-20 md:mt-16 overflow-hidden rounded-xl border border-white/10 shadow-2xl bg-black/20">
              {activeSection === "profile" && <ProfileSection />}
              {activeSection === "projects" && <ProjectsSection />}
              {activeSection === "system" && <SystemSection />}
              {activeSection === "persona" && <PersonaSection />}
              {activeSection === "chatbot" && <ChatbotSection />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Background Music Toggle */}
      <audio
        id="global-bgm"
        ref={audioRef}
        src={
          activeSection === "chatbot"
            ? "/p3rvelvetroom.mp3"
            : "/p3rcoloryournight.mp3"
        }
        loop
        autoPlay
      />
    </div>
  );
}
