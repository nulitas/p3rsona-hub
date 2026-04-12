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
      transition: { type: "spring" as const, stiffness: 350, damping: 25 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col justify-start md:justify-center h-full w-full relative z-10 p-0 pt-[10vh] md:pt-0 font-sans italic bg-black/40 md:overflow-hidden overflow-y-auto overflow-x-hidden custom-scrollbar"
    >
      {/* Avatar on the right side */}
      <motion.img
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        src="/me.png"
        onError={(e) => {
          // Fallback if avatar.gif is not found
          e.currentTarget.src = "/me.png";
        }}
        alt="Avatar"
        className="absolute right-[-20%] md:right-[-20%] bottom-0 md:top-20 h-[60%] md:h-[110%] opacity-30 md:opacity-100 w-auto object-contain z-0 md:z-20 pointer-events-none drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]"
      />

      <motion.div
        variants={itemVariants}
        className="relative z-10 w-[120%] lg:w-[130%] -ml-[10%] lg:-ml-[15%] mt-4 md:mt-0 transform md:-rotate-3 lg:-rotate-6"
      >
        {/* Action Links - Moved to the top */}
        <div className="flex gap-4 md:gap-6 mb-4 md:mb-6 mx-auto md:mx-0 ml-[15%] md:ml-[20%] lg:ml-[30%] relative z-30">
          <a
            href="https://github.com/nulitas"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-white text-black text-center font-black italic px-8 py-3 text-2xl -skew-x-15 hover:bg-[#00e5ff] transition-colors border-4 border-[#050505] shadow-[6px_6px_0_rgba(0,0,0,0.7)] group"
          >
            <span className="skew-x-15 bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-2 group-hover:bg-[#e60012] group-hover:scale-110 transition-transform">
              G
            </span>
            <span className="skew-x-15 block tracking-wider">GitHub</span>
          </a>
        </div>

        {/* Top Header Block: Name, Lv, HP, SP */}
        <div className="bg-[#050505] text-white p-4 md:p-6 pb-6 md:pb-8 flex flex-col md:flex-row items-start md:items-end justify-start relative px-6 md:px-0 pl-[15%] md:pl-[20%] lg:pl-[30%]">
          <div className="flex flex-col items-start leading-none pr-4 md:pr-8 mb-4 md:mb-0">
            <span className="text-xl md:text-2xl font-medium tracking-widest text-gray-300">
              Andra R.
            </span>
            <span className="text-4xl md:text-5xl font-black mt-1">
              Pratama
            </span>
            <div className="text-[11px] md:text-[13px] text-gray-400 mt-3 font-semibold tracking-widest">
              NEXT EXP 2,030
            </div>
          </div>

          <div className="flex items-end gap-2 md:ml-4 mb-4 md:mb-1">
            <span className="text-[#00e5ff] text-2xl md:text-4xl font-light">
              /Lv
            </span>
            <span className="text-5xl md:text-6xl lg:text-7xl font-black leading-none tracking-tighter shadow-black drop-shadow-md">
              99
            </span>
          </div>

          <div className="flex flex-col md:ml-10 lg:ml-16 gap-4 w-full md:w-56 lg:w-60 pr-0 md:pr-4 mt-2">
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
              <div className="w-full h-3 bg-gray-800 skew-x-15">
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
              <div className="w-full h-3 bg-gray-800 skew-x-15">
                <div className="h-full bg-[#ffea00] w-full shadow-[0_0_8px_#ffea00]" />
              </div>
            </div>
          </div>
        </div>

        {/* Thick black separator line to sell the 3D look (Hidden on mobile) */}
        <div className="hidden md:block h-3 lg:h-4 w-full bg-[#0a0a0a] relative z-20"></div>

        {/* Persona Info Block */}
        <div className="p-6 md:p-8 pb-10 md:pb-16 px-6 md:px-0 pl-[15%] md:pl-[20%] lg:pl-[30%] md:pr-12 bg-white text-black relative">
          <div className="flex items-center gap-2 md:gap-4 font-bold text-2xl md:text-3xl lg:text-4xl tracking-tighter mb-4 md:mb-6 relative z-10 w-full md:w-auto max-w-full">
            <div className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 bg-[#00e5ff] rotate-45 border-[3px] border-[#050505] shadow-[2px_2px_0_1px_#050505] shrink-0"></div>
            <span className="uppercase font-semibold tracking-wider opacity-80">
              Fool
            </span>
            <span className="font-black text-2xl md:text-3xl lg:text-4xl ml-2 tracking-tight">
              Lv 99 Developer
            </span>
          </div>

          {/* Attack Type Swoosh */}
          <div className="flex items-center gap-2 text-xl md:text-2xl lg:text-3xl font-black uppercase relative py-2 md:py-3 my-4 md:my-6 group w-full md:w-auto max-w-full">
            {/* Orange background slash */}
            <div className="absolute inset-y-0 -left-6 md:-left-24 lg:-left-32 w-[90%] bg-[#f58400] z-0 -skew-x-25 origin-left border-y-[4px] md:border-y-[6px] border-[#050505] h-[120%] top-[-10%] transition-transform group-hover:scale-y-110"></div>
            <span className="relative z-10 text-white drop-shadow-[2px_2px_0_#000] tracking-widest outline-text pl-2 md:pl-4 text-stroke-1 whitespace-nowrap">
              Focus Area
            </span>
            <span className="relative z-10 text-[#050505] font-black ml-4 lg:ml-6 tracking-tighter bg-white/80 px-2 skew-x-[8deg]">
              AI Interfaces
            </span>
          </div>

          {/* Stats below */}
          <div className="mt-6 md:mt-8 flex flex-wrap gap-4 md:gap-8 lg:gap-10 items-center text-lg md:text-2xl lg:text-3xl font-bold uppercase tracking-tight relative z-10 w-full md:w-auto max-w-full">
            <div className="flex items-center">
              Frontend{" "}
              <span className="text-xl md:text-2xl lg:text-3xl ml-2 opacity-50">
                •
              </span>
              <span className="font-black text-2xl md:text-3xl lg:text-4xl ml-2">
                177
              </span>
            </div>
            <div className="flex items-center">
              Backend{" "}
              <span className="text-xl md:text-3xl ml-2 opacity-50">•</span>
              <span className="font-black text-2xl md:text-4xl ml-2">154</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Footer Clock */}
      <motion.div
        variants={itemVariants}
        className="fixed md:absolute bottom-4 right-4 md:bottom-8 md:right-8 text-white font-bold italic text-sm md:text-xl tracking-widest drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)] z-40"
      >
        <span className="opacity-70 mr-4">CLOCK_SYNC</span>
        <span className="font-mono text-2xl bg-[#050505] px-3 py-1 -skew-x-15 inline-block shadow-[3px_3px_0_#00e5ff] border border-white/20">
          <span className="skew-x-15 block">{loginTime || "LOADING..."}</span>
        </span>
      </motion.div>
    </motion.div>
  );
}
