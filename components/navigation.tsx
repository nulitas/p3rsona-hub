"use client";

import type { Section } from "./portfolio";
import { motion } from "framer-motion";

interface NavigationProps {
  onSectionChange: (section: Section) => void;
}

export default function Navigation({ onSectionChange }: NavigationProps) {
  // Web Audio Synthesis for Hover Sound (High-pitched metallic click)
  const playHoverSound = () => {
    try {
      const audioCtx = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        1200,
        audioCtx.currentTime + 0.05,
      );

      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtx.currentTime + 0.05,
      );

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.05);
    } catch (e) {
      console.log(e);
    }
  };

  // Web Audio Synthesis for Click Sound (Deeper digital slice)
  const playClickSound = () => {
    try {
      const audioCtx = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = "sawtooth";
      oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        40,
        audioCtx.currentTime + 0.2,
      );

      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtx.currentTime + 0.2,
      );

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.2);
    } catch (e) {
      console.log(e);
    }
  };

  // Hardcoding rotation and translation offsets to create the "fanning" wave effect
  const navItems: {
    key: Section;
    label: string;
    layoutClass: string;
    zIndex: string;
  }[] = [
    {
      key: "profile",
      label: "STATS",
      layoutClass: "-rotate-12 translate-x-4 md:translate-x-12",
      zIndex: "z-[40]",
    },
    {
      key: "projects",
      label: "PROJECTS",
      layoutClass: "-rotate-2 translate-x-1 md:translate-x-2",
      zIndex: "z-[30]",
    },
    {
      key: "persona",
      label: "PERSONA",
      layoutClass: "rotate-2",
      zIndex: "z-[25]",
    },
    {
      key: "system",
      label: "SYSTEM",
      layoutClass: "rotate-6 -translate-x-1 md:-translate-x-2",
      zIndex: "z-[20]",
    },
    {
      key: "chatbot",
      label: "VELVET RM",
      layoutClass: "rotate-[15deg] translate-x-2 md:translate-x-4",
      zIndex: "z-[10]",
    },
  ];

  return (
    <nav className="flex flex-col -mt-10 relative z-50 origin-center justify-center">
      {navItems.map(({ key, label, layoutClass, zIndex }, i) => (
        <motion.button
          key={key}
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay: i * 0.1,
            type: "spring",
            stiffness: 400,
            damping: 20,
          }}
          onMouseEnter={playHoverSound}
          onClick={() => {
            playClickSound();
            onSectionChange(key);
          }}
          // Use negative margins to make the words barely overlap exactly like the image
          className={`group relative text-center md:text-left cursor-pointer outline-none block -mt-1 md:-mt-2 ${layoutClass} ${zIndex}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* The active jagged polygon backgrounds (only visible on hover/active) */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-0">
            {/* Pink jagged outline (smallest offset at bottom right) */}
            <div className="absolute top-[15%] left-[5%] w-full h-[90%] bg-[#ff00ff] clip-polygon-white" />
            {/* White jagged outline */}
            <div className="absolute top-[10%] left-[-5%] w-[110%] h-[90%] bg-white clip-polygon-white" />
            {/* Red slashed cursor triangle */}
            <div className="absolute top-[5%] left-[-5%] w-[110%] h-[90%] bg-[#ff003c] clip-polygon-red" />
          </div>

          {/* The Huge Text Label */}
          <div
            className={`relative z-10 font-black text-5xl md:text-7xl lg:text-[8rem] leading-[0.85] uppercase tracking-tighter transition-all duration-300 drop-shadow-[2px_4px_0_rgba(0,0,0,0.3)] 
              text-[#4deeea] group-hover:text-black group-hover:drop-shadow-none px-4`}
          >
            {label}
          </div>
        </motion.button>
      ))}
    </nav>
  );
}
