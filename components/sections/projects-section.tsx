"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { playHoverSound, playClickSound } from "../../lib/sounds";
import projects from "@/data/projects-data.json";

// ─── Flying Books Background ────────────────────────────────────────────────

interface BookProps {
  id: number;
  x: number;       // % from left start
  y: number;       // % from top start
  size: number;    // px width
  speed: number;   // seconds for full flight across screen
  delay: number;   // animation delay seconds
  rotate: number;  // initial rotation degrees
  spin: number;    // degrees rotated per cycle
  color: string;   // spine/cover accent color
  opacity: number;
  driftY: number;  // vertical drift px
  pageColor: string;
}

function seededRand(seed: number) {
  // simple LCG pseudo-random
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function generateBooks(count: number): BookProps[] {
  const colors = ["#00f0ff", "#4deeea", "#0a52f4", "#4c8cff", "#b0e8ff", "#00c8ff"];
  const pageColors = ["#c8eeff", "#d6f5ff", "#b0d4ff", "#e0f7ff"];
  const books: BookProps[] = [];
  for (let i = 0; i < count; i++) {
    const r = (n: number) => seededRand(i * 37 + n);
    books.push({
      id: i,
      x: r(0) * 120 - 10,       // -10% to 110% — some start off-screen
      y: r(1) * 90 + 5,          // 5% to 95%
      size: 28 + r(2) * 36,      // 28px to 64px
      speed: 14 + r(3) * 22,     // 14s to 36s
      delay: -(r(4) * 30),       // stagger with negative delay so they're pre-running
      rotate: r(5) * 360 - 180,
      spin: (r(6) > 0.5 ? 1 : -1) * (8 + r(7) * 24),
      color: colors[Math.floor(r(8) * colors.length)],
      pageColor: pageColors[Math.floor(r(9) * pageColors.length)],
      opacity: 0.25 + r(10) * 0.35,
      driftY: (r(11) > 0.5 ? 1 : -1) * (20 + r(12) * 60),
    });
  }
  return books;
}

const BOOKS = generateBooks(18);

function FlyingBook({ book }: { book: BookProps }) {
  const spineW = Math.max(6, book.size * 0.18);
  const bookH = book.size * 1.35;
  const coverW = book.size - spineW;

  // keyframe ids are unique per book
  const flyId = `book-fly-${book.id}`;
  const floatId = `book-float-${book.id}`;

  return (
    <>
      <style>{`
        @keyframes ${flyId} {
          0%   { transform: translateX(0px) rotate(${book.rotate}deg); opacity: 0; }
          5%   { opacity: ${book.opacity}; }
          95%  { opacity: ${book.opacity}; }
          100% { transform: translateX(${book.x > 50 ? "-130vw" : "130vw"}) rotate(${book.rotate + book.spin * 3}deg); opacity: 0; }
        }
        @keyframes ${floatId} {
          0%   { margin-top: 0px; }
          50%  { margin-top: ${book.driftY}px; }
          100% { margin-top: 0px; }
        }
      `}</style>

      <div
        style={{
          position: "absolute",
          left: `${book.x}%`,
          top: `${book.y}%`,
          animation: `${flyId} ${book.speed}s linear ${book.delay}s infinite, ${floatId} ${book.speed * 0.6}s ease-in-out ${book.delay}s infinite`,
          willChange: "transform, opacity",
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        {/* Book body (cover + spine side by side) */}
        <div
          style={{
            display: "flex",
            width: book.size,
            height: bookH,
            filter: `drop-shadow(0 0 8px ${book.color}88) drop-shadow(0 0 20px ${book.color}44)`,
          }}
        >
          {/* Spine */}
          <div
            style={{
              width: spineW,
              height: "100%",
              background: `linear-gradient(180deg, ${book.color}cc, ${book.color}55)`,
              borderRadius: "2px 0 0 2px",
              boxShadow: `inset -2px 0 4px rgba(0,0,0,0.4), 0 0 6px ${book.color}`,
              flexShrink: 0,
            }}
          />
          {/* Cover */}
          <div
            style={{
              width: coverW,
              height: "100%",
              background: `linear-gradient(135deg, ${book.color}22 0%, #05155c99 40%, #020b4f88 100%)`,
              border: `1px solid ${book.color}55`,
              borderLeft: "none",
              borderRadius: "0 2px 2px 0",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Cover lines (decorative page edges) */}
            {[0.25, 0.5, 0.72].map((pos, li) => (
              <div
                key={li}
                style={{
                  position: "absolute",
                  top: `${pos * 100}%`,
                  left: "15%",
                  right: "15%",
                  height: "1px",
                  background: `${book.color}44`,
                }}
              />
            ))}
            {/* Small glowing title block */}
            <div
              style={{
                position: "absolute",
                top: "18%",
                left: "12%",
                right: "12%",
                height: Math.max(4, bookH * 0.06),
                background: `${book.color}66`,
                borderRadius: 1,
                boxShadow: `0 0 6px ${book.color}`,
              }}
            />
          </div>
        </div>

        {/* Fanned pages peeking from the right edge */}
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            style={{
              position: "absolute",
              top: `${3 + n * 2}px`,
              right: `-${n * 1.5}px`,
              width: 2,
              height: bookH - (3 + n * 2) * 2,
              background: book.pageColor,
              opacity: 0.5 - n * 0.1,
              borderRadius: 1,
            }}
          />
        ))}
      </div>
    </>
  );
}

function FlyingBooksBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {BOOKS.map((book) => (
        <FlyingBook key={book.id} book={book} />
      ))}
    </div>
  );
}

export default function ProjectsSection() {
  // -1 = nothing selected yet. Clicking/tapping/hovering a row only ever
  // previews it; opening the repo is a separate explicit button below.
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  if (!projects || projects.length === 0) {
    return null;
  }

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

  const activeProject = projects[activeIndex];
  const activeProjectDesc = activeProject
    ? activeProject.name.split("–")[1]
    : undefined;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col h-full w-full relative z-10 px-4 md:px-[10vw] pt-[5vh] text-white font-sans overflow-hidden"
    >
      {/* ── Flying Books Background ───────────────────────────────── */}
      <FlyingBooksBackground />
      {/* Top Header Navigation Tabs (Mocking the L / R requests tabs) */}
      <motion.div
        variants={itemVariants}
        className="flex items-end gap-4 mb-4 md:mb-6 z-20 relative font-black italic"
      >
        {/* <div className="text-3xl text-red-500 tracking-tighter cursor-default select-none transform -skew-x-12">
          &lt; L
        </div> */}

        <div className="flex items-center gap-2">
          {/* Active Tab */}
          <div className="bg-white text-black px-6 md:px-12 py-1 rounded-full text-xl md:text-2xl tracking-tight shadow-[0_0_10px_white]">
            Projects
          </div>
          {/* Inactive Tab */}
          {/* <div className="text-white/60 px-6 py-1 text-xl tracking-tight hover:text-white transition-colors cursor-default">
            Experiences
          </div> */}
        </div>

        {/* <div className="text-3xl text-white tracking-tighter cursor-default select-none transform -skew-x-12">
          R &gt;
        </div> */}
      </motion.div>

      {/* Main Table Area */}
      <div className="w-full max-w-4xl flex flex-col relative z-20">
        {/* Table Headers */}
        <motion.div
          variants={itemVariants}
          className="flex items-end px-2 md:px-4 border-b-2 border-white/20 pb-2 mb-2 text-white/70 italic text-xs md:text-sm font-semibold tracking-wider"
        >
          <div className="w-[15%] md:w-[10%] text-center">No.</div>
          <div className="w-[60%] md:w-[50%]">Project</div>
          {/* <div className="hidden md:block md:w-[20%] text-center">Deadline</div> */}
          <div className="w-[25%] md:w-[20%] text-center relative">
            <span className="text-[#00f0ff] uppercase text-[8px] md:text-[10px] absolute -top-3 left-1/2 -translate-x-1/2">
              Sort
            </span>
            Stats
          </div>
        </motion.div>

        {/* Scrollable Project List */}
        <div className="flex flex-col flex-1 max-h-[50vh] md:max-h-[45vh] overflow-y-auto custom-scrollbar pr-2 md:pr-4 gap-1">
          {projects.map((project, index) => {
            const isHovered = index === activeIndex;
            const [projName] = project.name.split("–");

            return (
              <motion.button
                key={index}
                type="button"
                variants={itemVariants}
                onMouseEnter={() => { setActiveIndex(index); playHoverSound(); }}
                onFocus={() => { setActiveIndex(index); playHoverSound(); }}
                onClick={() => { setActiveIndex(index); playClickSound(); }}
                className={`w-full flex items-center px-2 md:px-4 py-2 md:py-2 relative group cursor-pointer transition-all text-left ${
                  isHovered
                    ? "bg-white text-black"
                    : "bg-transparent text-[#00f0ff] hover:bg-white/10"
                }`}
              >
                {/* Pink Top Border matching the selected row style in Persona */}
                {isHovered && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#ff0055]" />
                )}

                {/* Number */}
                <div className="w-[15%] md:w-[10%] text-center font-serif italic text-xl md:text-2xl opacity-90 tracking-tighter">
                  {(index + 1).toString().padStart(2, "0")}
                </div>

                {/* Name */}
                <div
                  className={`w-[60%] md:w-[50%] font-semibold tracking-wide truncate text-sm md:text-base ${isHovered ? "text-black" : "text-white"}`}
                >
                  {projName.trim()}
                </div>

                {/* Deadline */}

                {/* <div
                  className={`w-[20%] text-center font-bold font-serif italic ${isHovered ? "text-black" : "text-white"}`}
                >
                  —
                </div> */}

                {/* Status Badge */}
                <div className="w-[25%] md:w-[20%] flex justify-center">
                  <div
                    className={`flex items-center border-2 font-black italic tracking-tighter px-1 md:px-2 py-0.5 text-[10px] md:text-xs w-full max-w-30 justify-center ${
                      isHovered
                        ? "bg-[#050505] text-white border-black"
                        : "bg-[#00f0ff] text-black border-[#00f0ff]"
                    }`}
                  >
                    <span className="truncate">
                      {project.status ? "Done" : "Dev"}
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Dynamic Task Info Section below the list */}
        <motion.div
          variants={itemVariants}
          className="mt-4 md:mt-8 pt-4 md:pt-6 border-t border-white/20 pl-2 md:pl-4 h-auto md:h-32 mb-8 md:mb-0"
        >
          <h3 className="italic text-[#00f0ff] text-xl md:text-3xl font-serif tracking-tighter mb-1 md:mb-2 shadow-black drop-shadow-md">
            Task
          </h3>
          <div className="flex items-start">
            <span className="mr-2 text-sm md:text-xl leading-none mt-1 shadow-black drop-shadow-md">
              •
            </span>
            <p className="text-sm md:text-lg font-medium tracking-wide shadow-black drop-shadow-md max-w-2xl text-white">
              {activeProjectDesc
                ? activeProjectDesc.trim()
                : "Select a project below to see its details."}
            </p>
          </div>

          {activeProject && (
            <a
              href={activeProject.url}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={playHoverSound}
              onClick={playClickSound}
              className="inline-flex items-center gap-2 mt-3 md:mt-4 bg-[#00f0ff] text-black font-black italic text-sm md:text-base px-4 py-2 -skew-x-6 shadow-[4px_4px_0_rgba(0,0,0,0.5)] hover:bg-white transition-colors"
            >
              <span className="skew-x-6 block">View on GitHub →</span>
            </a>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
