"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playHoverSound, playClickSound } from "../../lib/sounds";
import experienceData from "@/data/experience-data.json";

const workItems = [
  "Full-stack web apps with Next.js, React & TypeScript",
  "AI-driven interfaces and high-performance UX",
  "Backend systems with Node.js, Laravel & Python",
  "Video-game inspired interaction design",
];

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

  // Dynamically calculate years of experience
  const yearsExperience = (() => {
    try {
      if (!experienceData || experienceData.length === 0) return 1;
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
      return Math.max(1, maxYear - minYear);
    } catch (e) {
      return 1;
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
      className="flex h-full w-full relative z-10 p-4 md:p-8 lg:p-10 font-sans overflow-hidden"
    >
      {/* Main Dossier Card */}
      <motion.div
        variants={itemVariants}
        className="flex-1 min-h-0 relative z-10 shadow-[0_10px_40px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col transition-colors duration-500"
        style={{ backgroundColor: showExperience ? "#020b06" : "white" }}
      >
        {/* Faint decorative portrait bleeding into the card's empty space */}
        <img
          src="/avatar.png"
          alt=""
          aria-hidden="true"
          className="hidden md:block absolute right-0 top-0 h-full w-auto object-contain object-top opacity-[0.08] grayscale pointer-events-none select-none z-0"
        />

        <AnimatePresence mode="wait">
          {!showExperience ? (
            <motion.div
              key="dossier"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 flex-1 min-h-0 overflow-y-auto custom-scrollbar p-5 md:p-8 lg:p-10 text-black"
            >
              {/* Portrait + Name */}
              <div className="flex items-start gap-4 md:gap-6 mb-6 md:mb-8">
                <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 overflow-hidden border-4 border-[#050505] shadow-[4px_4px_0_rgba(0,0,0,0.2)] bg-[#e8f9ff]">
                  <img
                    src="/avatar.png"
                    alt="Andra"
                    className="w-full h-full object-cover object-[50%_12%]"
                    style={{
                      filter: "contrast(1.08) saturate(1.15)",
                      imageRendering: "auto",
                    }}
                  />
                </div>
                <div>
                  <h2 className="font-black text-2xl md:text-4xl tracking-tight leading-none">
                    Andra R. Pratama
                  </h2>
                  <p className="text-[#0090a8] text-sm md:text-lg font-bold uppercase tracking-wide mt-1">
                    Full Stack Developer{" "}
                    <span className="opacity-60">· {yearsExperience}+ yrs</span>
                  </p>
                  <p className="text-sm md:text-base opacity-70 mt-2 max-w-lg leading-relaxed">
                    I architect robust systems using Next.js and weave
                    interactive, video-game philosophies into my UI/UX
                    engineering.
                  </p>
                </div>
              </div>

              {/* What I Work On */}
              <div className="mb-6 md:mb-8 max-w-xl">
                <h3 className="font-black uppercase tracking-widest text-sm md:text-base mb-3 border-b-2 border-black/10 pb-2">
                  What I Work On
                </h3>
                <ul className="flex flex-col gap-2">
                  {workItems.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm md:text-base"
                    >
                      <span className="text-[#00b8d4] font-black mt-0.5 shrink-0">
                        ▸
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Links */}
              <div className="max-w-xl">
                <h3 className="font-black uppercase tracking-widest text-sm md:text-base mb-3 border-b-2 border-black/10 pb-2">
                  Links
                </h3>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://github.com/nulitas"
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={playHoverSound}
                    onClick={playClickSound}
                    className="inline-flex items-center gap-2 bg-[#050505] text-white px-4 py-2 -skew-x-6 font-bold text-sm hover:bg-[#00e5ff] hover:text-black transition-colors"
                  >
                    <span className="skew-x-6 block">GitHub</span>
                  </a>
                  <button
                    onClick={() => {
                      playClickSound();
                      setShowExperience(true);
                    }}
                    onMouseEnter={playHoverSound}
                    className="inline-flex items-center gap-2 bg-[#050505] text-[#00e5ff] px-4 py-2 -skew-x-6 font-bold text-sm hover:bg-[#00e5ff] hover:text-black transition-colors cursor-pointer"
                  >
                    <span className="skew-x-6 block">Work History →</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="experience-list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 flex-1 min-h-0 flex flex-col p-5 md:p-8 lg:p-10 text-white overflow-hidden"
            >
              <div className="flex items-center flex-wrap gap-4 mb-6 shrink-0">
                <button
                  onClick={() => {
                    playClickSound();
                    setShowExperience(false);
                  }}
                  onMouseEnter={playHoverSound}
                  className="font-black text-sm md:text-lg italic -skew-x-15 bg-white text-black px-3 md:px-4 py-1 border-2 border-black hover:bg-[#ff003c] hover:text-white transition-colors"
                >
                  <span className="skew-x-15 block">✕ PROFILE</span>
                </button>
                <h3 className="font-black italic text-2xl md:text-4xl tracking-tighter text-[#00f0ff] uppercase shadow-black drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
                  Work History
                </h3>
              </div>

              <div className="flex flex-col gap-4 flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2 md:pr-4">
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
      </motion.div>

      {/* Footer Clock */}
      <motion.div
        variants={itemVariants}
        className="fixed md:absolute bottom-4 right-4 md:bottom-8 md:right-8 text-white font-bold italic text-sm md:text-xl tracking-widest drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)] z-40 pointer-events-none"
      >
        <span className="opacity-70 mr-4">CLOCK_SYNC</span>
        <span className="font-mono text-2xl bg-[#050505] px-3 py-1 -skew-x-15 inline-block shadow-[3px_3px_0_#00e5ff] border border-white/20">
          <span className="skew-x-15 block">{loginTime || "LOADING..."}</span>
        </span>
      </motion.div>
    </motion.div>
  );
}
