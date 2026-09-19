"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playHoverSound, playClickSound } from "../../lib/sounds";

const skillDatabase = [
  { arcana: "Frontend", level: 99, name: "React.js", hue: 195, emoji: "⚛️" },
  { arcana: "Frontend", level: 95, name: "Next.js", hue: 0, emoji: "⬛" },
  { arcana: "Frontend", level: 85, name: "Vue.js", hue: 153, emoji: "🌿" },
  { arcana: "Styling", level: 98, name: "Tailwind CSS", hue: 190, emoji: "🌬️" },
  { arcana: "Backend", level: 88, name: "Laravel", hue: 350, emoji: "🐘" },
  { arcana: "Backend", level: 90, name: "Express.js", hue: 60, emoji: "🚂" },
  { arcana: "Backend", level: 85, name: "FastAPI", hue: 175, emoji: "⚡" },
  { arcana: "Language", level: 95, name: "TypeScript", hue: 210, emoji: "📘" },
  { arcana: "Language", level: 99, name: "JavaScript", hue: 50, emoji: "🟨" },
  { arcana: "Language", level: 85, name: "PHP", hue: 240, emoji: "🐘" },
  { arcana: "Language", level: 90, name: "Python", hue: 215, emoji: "🐍" },
  { arcana: "Data/AI", level: 80, name: "TensorFlow", hue: 25, emoji: "🧠" },
];

export default function PersonaSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number>(2);
  const listRef = useRef<HTMLDivElement>(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const updateScrollState = () => {
    const el = listRef.current;
    if (!el) return;
    setCanScrollUp(el.scrollTop > 4);
    setCanScrollDown(el.scrollTop + el.clientHeight < el.scrollHeight - 4);
  };

  useEffect(() => {
    updateScrollState();
    const el = listRef.current;
    if (!el) return;
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scrollList = (direction: "up" | "down") => {
    playClickSound();
    listRef.current?.scrollBy({
      top: direction === "up" ? -160 : 160,
      behavior: "smooth",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50, filter: "blur(4px)" },
    show: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: { type: "spring" as const, stiffness: 400, damping: 30 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col md:flex-row h-full w-full relative z-10 px-[4vw] md:px-[5vw] pt-[22vh] md:pt-[25vh] overflow-hidden bg-transparent"
    >
      {/* Angled Top Header */}
      <div className="absolute top-0 left-0 w-full h-[22vh] bg-white -skew-y-2 origin-top-left z-0 shadow-2xl flex items-end overflow-hidden pb-2 pl-4">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-[5rem] sm:text-[7rem] md:text-[10rem] lg:text-[14rem] font-black italic tracking-tighter text-[#121ebb] opacity-90 leading-none drop-shadow-[5px_5px_0_rgba(0,0,0,0.1)]"
        >
          TECHNOLOGIA
        </motion.div>
      </div>

      {/* Left Column: Menu Items */}
      <div className="w-full md:w-[45%] flex flex-col relative z-20 h-auto md:h-[calc(100%-2.5rem)] pl-2 md:pl-10 mt-4 md:mt-10">
        <div className="relative md:flex md:flex-col md:flex-1 md:min-h-0">
          {/* Top fade + Scroll Up Button */}
          <AnimatePresence>
            {canScrollUp && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-0 inset-x-0 h-12 z-20 pointer-events-none bg-linear-to-b from-[#121ebb] to-transparent"
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {canScrollUp && (
              <motion.button
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                onMouseEnter={playHoverSound}
                onClick={() => scrollList("up")}
                className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 w-9 h-9 flex items-center justify-center bg-[#00f0ff] text-black border-2 border-black shadow-[3px_3px_0_rgba(0,0,0,0.6)] hover:bg-white transition-colors cursor-pointer"
                aria-label="Scroll up"
              >
                <span className="text-lg font-black leading-none -mt-0.5">▲</span>
              </motion.button>
            )}
          </AnimatePresence>

          <div
            ref={listRef}
            onScroll={updateScrollState}
            className="flex flex-col gap-1 w-full max-w-full md:max-w-125 overflow-y-auto custom-scrollbar pr-2 md:pr-4 max-h-[45vh] md:max-h-none md:flex-1 md:min-h-0"
          >
          {skillDatabase.map((item, index) => {
            const isSelected = hoveredIndex === index;
            const rank = String(index + 1).padStart(2, "0");

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                onMouseEnter={() => {
                  setHoveredIndex(index);
                  playHoverSound();
                }}
                onClick={playClickSound}
                className={`relative flex items-center pr-4 cursor-pointer font-sans transition-all duration-100 ${
                  isSelected
                    ? "bg-white text-black py-1"
                    : "bg-transparent text-[#4deeea] py-1"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 -left-8 right-0 h-1 bg-[#ff003c]" />
                )}
                <div
                  className={`w-30 text-center font-bold italic px-2 py-0.5 ml-2 mr-4 ${
                    isSelected
                      ? "bg-[#00f0ff] text-black"
                      : "bg-black/60 text-[#4deeea]"
                  }`}
                >
                  {item.arcana}
                </div>
                <div
                  className={`flex flex-1 items-center font-serif tracking-tight text-xl ${isSelected ? "font-black" : ""}`}
                >
                  <span
                    className={`${isSelected ? "text-xl font-sans font-bold italic pr-1" : ""}`}
                  >
                    {isSelected ? "No. " : "#"}
                  </span>
                  <span
                    className={`${isSelected ? "text-3xl font-black italic font-sans" : "text-2xl font-bold"}`}
                  >
                    {rank}
                  </span>
                  <span className="mx-2 opacity-50 text-sm">•</span>
                  <span
                    className={`${isSelected ? "text-2xl font-black" : "text-xl font-normal text-white"}`}
                  >
                    {item.name}
                  </span>
                </div>
              </motion.div>
            );
          })}
          </div>

          {/* Bottom fade + Scroll Down Button */}
          <AnimatePresence>
            {canScrollDown && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-0 inset-x-0 h-12 z-20 pointer-events-none bg-linear-to-t from-[#121ebb] to-transparent"
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {canScrollDown && (
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                onMouseEnter={playHoverSound}
                onClick={() => scrollList("down")}
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-30 w-9 h-9 flex items-center justify-center bg-[#00f0ff] text-black border-2 border-black shadow-[3px_3px_0_rgba(0,0,0,0.6)] hover:bg-white transition-colors cursor-pointer"
                aria-label="Scroll down"
              >
                <span className="text-lg font-black leading-none mt-0.5">▼</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Column: Dynamic Persona Image/Icon */}
      <div className="absolute right-[-10vw] md:right-[5vw] top-0 bottom-0 w-[120vw] md:w-[50%] pointer-events-none z-10 flex items-center justify-center overflow-hidden">
        <AnimatePresence>
          {skillDatabase[hoveredIndex] && (
            <motion.div
              key={hoveredIndex}
              initial={{
                opacity: 0,
                scale: 0.92,
                x: 20,
                filter: "blur(4px)",
                rotate: 3,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                x: 0,
                filter: "blur(0px)",
                rotate: 0,
              }}
              exit={{
                opacity: 0,
                scale: 1.05,
                x: -20,
                filter: "blur(4px)",
                rotate: -3,
              }}
              transition={{ duration: 0.12, ease: "easeOut" }}
              className="flex flex-col items-center justify-center relative w-full h-full"
            >
              {/* Background Colored Aura */}
              <div
                className="absolute inset-0 opacity-40 mix-blend-screen"
                style={{
                  background: `radial-gradient(circle at center, hsl(${skillDatabase[hoveredIndex].hue}, 80%, 40%) 0%, transparent 60%)`,
                }}
              />

              {/* Massive Icon/Emoji Placeholder */}
              <div
                className="text-[14rem] md:text-[25rem] leading-none z-20"
                style={{
                  filter: `drop-shadow(15px 15px 0px rgba(0,0,0,0.8)) saturate(1.5) hue-rotate(${skillDatabase[hoveredIndex].hue}deg)`,
                }}
              >
                {skillDatabase[hoveredIndex].emoji}
              </div>

              {/* Persona Name floating behind horizontally */}
              <div className="absolute font-black italic text-[7rem] md:text-[15rem] tracking-tighter text-white/5 whitespace-nowrap z-10 transform -rotate-12 scale-150 pointer-events-none select-none">
                {skillDatabase[hoveredIndex].name.toUpperCase()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
