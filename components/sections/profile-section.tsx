"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ProfileSection() {
  const [loginTime, setLoginTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes(),
      ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
      setLoginTime(time);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -100, y: 50 },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { type: "spring", stiffness: 350, damping: 25 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col h-full w-full relative z-10 p-0 pt-[15vh] font-sans italic bg-black/40 overflow-hidden"
    >
      {/* Avatar on the right side */}
      <motion.img
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        src="/avatar.png"
        onError={(e) => {
          // Fallback if avatar.gif is not found
          e.currentTarget.src = "/avatar.png";
        }}
        alt="Avatar"
        className="absolute right-[-5%] bottom-[0%] h-[110%] w-auto object-contain z-20 pointer-events-none drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]"
      />

      <motion.div
        variants={itemVariants}
        className="relative z-10 w-[150vw] -ml-[25vw] mt-16 transform -rotate-6"
      >
        {/* Top Header Block: Name, Lv, HP, SP */}
        <div className="bg-[#050505] text-white p-6 pb-8 flex items-end justify-start relative pl-[32vw]">
          <div className="flex flex-col items-start leading-none pr-8">
            <span className="text-xl font-medium tracking-widest text-gray-300">
              Andra R.
            </span>
            <span className="text-4xl font-black mt-1">Pratama</span>
            <div className="text-[11px] text-gray-400 mt-3 font-semibold tracking-widest">
              NEXT EXP 2,030
            </div>
          </div>

          <div className="flex items-end gap-2 ml-4 mb-1">
            <span className="text-[#00e5ff] text-4xl font-light">/Lv</span>
            <span className="text-6xl font-black leading-none tracking-tighter shadow-black drop-shadow-md">
              99
            </span>
          </div>

          <div className="flex flex-col ml-16 gap-4 w-60 pr-4 mt-2">
            {/* HP */}
            <div className="flex flex-col relative w-full">
              <div className="flex justify-between items-end mb-1 font-bold">
                <span className="text-[#00e5ff] text-sm tracking-widest">
                  HP
                </span>
                <span className="text-[#00e5ff] text-xl text-shadow-sm">
                  999<span className="text-sm">/999</span>
                </span>
              </div>
              <div className="w-full h-3 bg-gray-800 skew-x-[15deg]">
                <div className="h-full bg-[#00e5ff] w-full shadow-[0_0_8px_#00e5ff]" />
              </div>
            </div>
            {/* SP */}
            <div className="flex flex-col relative w-full">
              <div className="flex justify-between items-end mb-1 font-bold">
                <span className="text-[#ffea00] text-sm tracking-widest">
                  SP
                </span>
                <span className="text-[#ffea00] text-xl text-shadow-sm">
                  999<span className="text-sm">/999</span>
                </span>
              </div>
              <div className="w-full h-3 bg-gray-800 skew-x-[15deg]">
                <div className="h-full bg-[#ffea00] w-full shadow-[0_0_8px_#ffea00]" />
              </div>
            </div>
          </div>
        </div>

        {/* Thick black separator line to sell the 3D look */}
        <div className="h-4 w-[150vw] bg-[#0a0a0a] relative z-20"></div>

        {/* Persona Info Block */}
        <div className="p-8 pb-16 pl-[32vw] pr-12 bg-white text-black relative">
          <div className="flex items-center gap-4 font-bold text-3xl tracking-tighter mb-6 relative z-10 w-[600px] max-w-full">
            <div className="w-6 h-6 bg-[#00e5ff] rotate-45 border-[3px] border-[#050505] shadow-[2px_2px_0_1px_#050505] flex-shrink-0"></div>
            <span className="uppercase font-semibold tracking-wider opacity-80">
              Fool
            </span>
            <span className="font-black text-4xl ml-2 tracking-tight">
              Lv 99 Developer
            </span>
          </div>

          {/* Attack Type Swoosh */}
          <div className="flex items-center gap-2 text-2xl font-black uppercase relative py-3 my-6 group w-[600px] max-w-full">
            {/* Orange background slash */}
            <div className="absolute inset-y-0 left-[-8rem] w-[90%] bg-[#f58400] z-0 -skew-x-[25deg] origin-left border-y-[6px] border-[#050505] h-[120%] top-[-10%] transition-transform group-hover:scale-y-110"></div>
            <span
              className="relative z-10 text-white drop-shadow-[2px_2px_0_#000] tracking-widest outline-text pl-4"
              style={{ WebkitTextStroke: "1px black" }}
            >
              Focus Area
            </span>
            <span className="relative z-10 text-[#050505] font-black ml-6 tracking-tighter bg-white/80 px-2 skew-x-[8deg]">
              AI Interfaces
            </span>
          </div>

          {/* Stats below */}
          <div className="mt-8 flex gap-10 items-center text-2xl font-bold uppercase tracking-tight relative z-10 w-[600px] max-w-full">
            <div className="flex items-center">
              Frontend <span className="text-3xl ml-2 opacity-50">•</span>
              <span className="font-black text-4xl ml-2">177</span>
            </div>
            <div className="flex items-center">
              Backend <span className="text-3xl ml-2 opacity-50">•</span>
              <span className="font-black text-4xl ml-2">154</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Links mimicking in-game bottom controls */}
      <motion.div
        variants={itemVariants}
        className="flex gap-6 mt-1 ml-[15vw] relative z-30 transform -rotate-6"
      >
        <a
          href="https://github.com/nulitas"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 bg-white text-black text-center font-black italic px-8 py-3 text-2xl -skew-x-[15deg] hover:bg-[#00e5ff] transition-colors border-[4px] border-[#050505] shadow-[6px_6px_0_rgba(0,0,0,0.7)] group"
        >
          <span className="skew-x-[15deg] bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-2 group-hover:bg-[#e60012] group-hover:scale-110 transition-transform">
            G
          </span>
          <span className="skew-x-[15deg] block tracking-wider">GitHub</span>
        </a>
      </motion.div>

      {/* Footer Clock */}
      <motion.div
        variants={itemVariants}
        className="absolute bottom-8 right-8 text-white font-bold italic text-xl tracking-widest drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)] z-40"
      >
        <span className="opacity-70 mr-4">CLOCK_SYNC</span>
        <span className="font-mono text-2xl bg-[#050505] px-3 py-1 -skew-x-[15deg] inline-block shadow-[3px_3px_0_#00e5ff] border border-white/20">
          <span className="skew-x-[15deg] block">
            {loginTime || "LOADING..."}
          </span>
        </span>
      </motion.div>
    </motion.div>
  );
}
