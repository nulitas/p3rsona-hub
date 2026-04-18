"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playHoverSound, playClickSound } from "../../lib/sounds";
import experienceData from "@/data/experience-data.json";

export default function ProfileSection() {
  const [loginTime, setLoginTime] = useState("");
  const [showExperience, setShowExperience] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const d = String(now.getDate()).padStart(2, "0");
      const m = String(now.getMonth() + 1).padStart(2, "0");
      const y = now.getFullYear();
      const time = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes(),
      ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
      setLoginTime(`${y}/${m}/${d} ${time}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Dynamically calculate level based on experience
  const dynamicLevel = (() => {
    try {
      if (!experienceData || experienceData.length === 0) return 99;
      let minYear = new Date().getFullYear();
      let maxYear = minYear;

      experienceData.forEach((exp: any) => {
        const matches = exp.period.match(/\d{4}/g);
        if (matches) {
          matches.forEach((m: string) => {
            const y = parseInt(m, 10);
            if (y < minYear) minYear = y;
            if (y > maxYear && !exp.period.toLowerCase().includes("present")) {
              maxYear = y;
            }
          });
        }
        if (exp.period.toLowerCase().includes("present")) {
          maxYear = new Date().getFullYear();
        }
      });
      const totalYears = maxYear - minYear;
      return Math.min(99, Math.max(1, totalYears)); // 1 level per year
    } catch (e) {
      return 99;
    }
  })();

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
      className="flex flex-col justify-start h-full w-full relative z-10 p-0 pt-[4vh] md:pt-[6vh] lg:pt-[8vh] font-sans italic bg-black/40 overflow-hidden"
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
        className="hidden md:block absolute right-[-15%] md:right-[-10%] bottom-0 md:top-20 h-[50%] md:h-[85%] lg:h-[95%] w-auto object-contain z-0 md:z-20 pointer-events-none drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]"
      />

      <motion.div
        variants={itemVariants}
        className="relative z-10 w-full mt-2 md:mt-0 flex flex-col flex-1 min-h-0"
      >
        {/* Action Links - Moved to the top */}
        <div className="flex shrink-0 gap-4 md:gap-6 mb-3 md:mb-4 mx-auto md:mx-0 ml-[5%] md:ml-[10%] lg:ml-[15%] relative z-30">
          <a
            href="https://github.com/nulitas"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={playHoverSound}
            onClick={playClickSound}
            className="flex items-center justify-center gap-3 bg-white text-black text-center font-black italic px-8 py-3 text-2xl -skew-x-15 hover:bg-[#00e5ff] transition-colors border-4 border-[#050505] shadow-[6px_6px_0_rgba(0,0,0,0.7)] group"
          >
            <span className="skew-x-15 bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-2 group-hover:bg-[#e60012] group-hover:scale-110 transition-transform">
              G
            </span>
            <span className="skew-x-15 block tracking-wider">GitHub</span>
          </a>
        </div>

        <AnimatePresence initial={false}>
          {!showExperience && (
            <motion.div
              initial={{ opacity: 0, height: 0, scaleY: 0 }}
              animate={{ opacity: 1, height: "auto", scaleY: 1 }}
              exit={{ opacity: 0, height: 0, scaleY: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="origin-top overflow-hidden shrink-0"
            >
              {/* Top Header Block: Name, Lv, HP, SP */}
              <div className="bg-[#050505] text-white p-4 md:p-6 pb-4 md:pb-6 flex flex-col md:flex-row items-start md:items-end justify-start relative px-4 md:px-0 pl-[5%] md:pl-[10%] lg:pl-[15%] shadow-[0_4px_20px_rgba(0,0,0,0.5)] z-30">
                <div className="flex flex-col items-start leading-none pr-4 md:pr-8 mb-4 md:mb-0">
                  <span className="text-xl md:text-2xl font-medium tracking-widest text-gray-300">
                    Andra R.
                  </span>
                  <span className="text-4xl md:text-5xl font-black mt-1">
                    Pratama
                  </span>
                  <motion.button
                    onClick={() => {
                      playClickSound();
                      setShowExperience(true);
                    }}
                    onMouseEnter={playHoverSound}
                    animate={{
                      opacity: [1, 0.5, 1],
                      textShadow: [
                        "0px 0px 0px transparent",
                        "0px 0px 8px #00e5ff",
                        "0px 0px 0px transparent",
                      ],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "easeInOut",
                    }}
                    className="text-[11px] md:text-[13px] text-[#00e5ff] mt-3 font-bold tracking-widest cursor-pointer text-left focus:outline-none hover:text-white hover:scale-105 origin-left"
                  >
                    WORK EXPERIENCE &gt;
                  </motion.button>
                </div>

                <div className="flex items-end gap-2 md:ml-4 mb-4 md:mb-1">
                  <span className="text-[#00e5ff] text-2xl md:text-4xl font-light">
                    /Lv
                  </span>
                  <span className="text-5xl md:text-6xl lg:text-7xl font-black leading-none tracking-tighter shadow-black drop-shadow-md">
                    {dynamicLevel}
                  </span>
                </div>

                <div className="flex flex-col md:ml-10 lg:ml-16 gap-4 w-full md:w-56 lg:w-60 pr-0 md:pr-4 mt-2">
                  {/* HP */}
                  <div className="flex flex-col relative w-full">
                    <div className="flex justify-between items-end mb-1 font-bold">
                      <span className="text-[#00e5ff] text-sm tracking-widest">HP</span>
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
                      <span className="text-[#ffea00] text-sm tracking-widest">SP</span>
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
              <div className="hidden md:block h-3 lg:h-4 w-full shrink-0 bg-[#0a0a0a] relative z-20"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Data Block: Persona Stats vs Work Experience */}
        <div className="relative w-full bg-white text-black flex-1 min-h-[100px] mb-0 grid shadow-[inset_0_10px_20px_rgba(0,0,0,0.3)] duration-500 ease-in-out transition-colors" style={{ backgroundColor: showExperience ? '#020b06' : 'white' }}>
          <AnimatePresence>
            {!showExperience ? (
              <motion.div
                key="persona-stats"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
                className="col-start-1 row-start-1 min-h-0 pb-20 md:pb-24 pt-6 md:pt-8 px-4 md:px-0 pl-[5%] md:pl-[10%] lg:pl-[15%] md:pr-12 w-full h-full overflow-y-auto custom-scrollbar"
              >
                <div className="flex items-center gap-2 md:gap-4 font-bold text-2xl md:text-3xl lg:text-4xl tracking-tighter mb-4 md:mb-6 mt-2 relative z-10 w-full md:w-auto max-w-full">
                  <div className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 bg-[#00e5ff] rotate-45 border-[3px] border-[#050505] shadow-[2px_2px_0_1px_#050505] shrink-0"></div>
                  <span className="uppercase font-semibold tracking-wider opacity-80 text-lg md:text-xl lg:text-2xl">
                    Fool
                  </span>
                  <span className="font-black text-xl md:text-2xl lg:text-3xl ml-2 tracking-tight">
                    Lv {dynamicLevel} Developer
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
                <div className="mt-6 md:mt-8 flex flex-wrap gap-4 md:gap-6 lg:gap-8 items-center text-base md:text-xl lg:text-2xl font-bold uppercase tracking-tight relative z-10 w-full md:w-auto max-w-full">
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
                    <span className="text-xl md:text-3xl ml-2 opacity-50">
                      •
                    </span>
                    <span className="font-black text-2xl md:text-4xl ml-2">
                      154
                    </span>
                  </div>
                </div>

                {/* About Me Section to fill space */}
                <div className="mt-8 md:mt-10 lg:mt-12 bg-[#050505] text-white p-4 md:p-5 -skew-x-4 border-l-4 border-l-[#00e5ff] relative z-10 w-[95%] md:w-[85%] lg:w-[80%] shadow-[4px_4px_0_rgba(0,0,0,0.15)] group hover:bg-[#0a181e] transition-colors">
                  <h4 className="text-[#00e5ff] font-black text-sm md:text-base mb-1 uppercase tracking-widest skew-x-4">
                    Background
                  </h4>
                  <p className="text-sm md:text-base font-medium leading-relaxed opacity-80 skew-x-4 group-hover:opacity-100 transition-opacity">
                    Full Stack Developer specializing in AI-driven interfaces
                    and high-performance web applications. I architect robust
                    systems using Next.js and weave interactive, video-game
                    philosophies into my UI/UX engineering.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="experience-list"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
                className="col-start-1 row-start-1 min-h-0 pt-6 md:pt-8 pb-20 md:pb-24 px-4 md:px-0 pl-[5%] md:pl-[10%] lg:pl-[15%] md:pr-12 w-full h-full flex flex-col bg-transparent text-white overflow-hidden z-10"
              >
                <div className="flex items-center justify-start mb-6 relative z-20 w-full pr-4 gap-4">
                  <button
                    onClick={() => {
                      playClickSound();
                      setShowExperience(false);
                    }}
                    onMouseEnter={playHoverSound}
                    className="font-black text-sm md:text-xl italic -skew-x-15 bg-white text-black px-3 md:px-4 py-1 border-2 border-black hover:bg-[#ff003c] hover:text-white transition-colors"
                  >
                    <span className="skew-x-15 block">✕ STATS</span>
                  </button>
                  <h3 className="font-black italic text-3xl md:text-4xl tracking-tighter text-[#00f0ff] uppercase shadow-black drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
                    Work History
                  </h3>
                </div>

                <div className="flex flex-col gap-4 flex-1 h-full max-h-[250px] md:max-h-[300px] lg:max-h-[330px] overflow-y-auto custom-scrollbar pr-4 relative z-20 pb-4">
                  {experienceData.map((exp: any, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      onMouseEnter={playHoverSound}
                      className="group relative flex flex-col bg-[#050505] border-2 border-white/20 p-4 -skew-x-4 transition-all hover:border-[#00e5ff] hover:bg-[#001015] hover:scale-[1.02]"
                    >
                      <div className="flex flex-wrap items-center gap-3 skew-x-4 relative z-10 w-full mb-2">
                        <span className="font-black text-xl md:text-2xl tracking-tighter text-white group-hover:text-[#00f0ff] transition-colors uppercase">
                          {exp.role}
                        </span>
                        <div className="bg-[#ffea00] px-2 py-0.5 text-black font-black italic tracking-widest text-xs md:text-sm shadow-[2px_2px_0_rgba(255,255,255,0.4)]">
                          {exp.period}
                        </div>
                      </div>
                      <div className="skew-x-4 text-white/60 text-sm md:text-base font-bold italic mb-2 tracking-wide uppercase group-hover:text-white/90">
                        @ {exp.company}
                      </div>
                      <p className="skew-x-4 text-white/80 text-sm md:text-base leading-snug group-hover:text-white">
                        {exp.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
