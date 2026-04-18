"use client";

import type { Section } from "./portfolio";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { playHoverSound, playClickSound } from "../lib/sounds";

interface NavigationProps {
  onSectionChange: (section: Section) => void;
}

export default function Navigation({ onSectionChange }: NavigationProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        setActiveIndex((prev) => {
          const next = Math.max(0, prev - 1);
          if (next !== prev) playHoverSound();
          return next;
        });
      } else if (e.key === "ArrowDown") {
        setActiveIndex((prev) => {
          const next = Math.min(navItems.length - 1, prev + 1);
          if (next !== prev) playHoverSound();
          return next;
        });
      } else if (e.key === "Enter") {
        playClickSound();
        onSectionChange(navItems[activeIndex].key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, onSectionChange, navItems]);

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
          onMouseEnter={() => {
            if (activeIndex !== i) playHoverSound();
            setActiveIndex(i);
          }}
          onClick={(e) => {
            if (activeIndex !== i) {
              e.preventDefault();
              if (activeIndex !== i) playHoverSound();
              setActiveIndex(i);
            } else {
              playClickSound();
              onSectionChange(key);
            }
          }}
          className={`nav-item relative cursor-pointer outline-none inline-block self-center md:self-start -mt-1 md:-mt-2 ${layoutClass} ${zIndex}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="relative font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[0.85] uppercase tracking-tighter inline-flex justify-start whitespace-nowrap text-center md:text-left">
            {/* 1. Base Spacer (Invisible) to secure layout dimensions */}
            <div className="px-4 opacity-0 pointer-events-none pb-2 xl:pb-4 pt-1">
              {label}
            </div>

            {/* 2. Inactive State (Cyan Text) */}
            <div
              className={`absolute inset-0 px-4 flex items-center justify-start transition-opacity duration-200 ${activeIndex === i ? "opacity-0" : "opacity-100 text-[#4deeea] drop-shadow-[2px_4px_0_rgba(0,0,0,0.3)]"}`}
            >
              {label}
            </div>

            {/* 3. Active State (Red/Black Text + Polygon Layers) */}
            <div
              className={`absolute inset-0 transition-opacity duration-200 ${activeIndex === i ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            >
              {/* 3a. Pink Idle Background (Shoots endlessly right) */}
              <motion.div
                className="absolute -inset-x-[30px] -inset-y-[5px] bg-[#ff00ff] clip-polygon-white"
                animate={
                  activeIndex === i
                    ? {
                        x: ["-2px", "1px", "-1px", "2px", "-2px"],
                        y: ["1px", "3px", "2px", "4px", "1px"],
                      }
                    : {}
                }
                transition={{
                  duration: 0.25,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              {/* 3c. RED Base Text (Shows where it spills outside the red polygon!) */}
              <div className="absolute inset-x-0 inset-y-0 px-4 flex items-center justify-center md:justify-start text-black">
                {label}
              </div>

              {/* 3d. RED Background with matching BLACK Text inside, perfectly clipped together */}
              <div className="absolute -inset-x-[15px] -inset-y-[5px] bg-white clip-polygon-red flex items-center justify-center md:justify-start px-[15px] z-10">
                <div className="px-4 text-red-500 w-full text-center md:text-left">
                  {label}
                </div>
              </div>
            </div>
          </div>
        </motion.button>
      ))}
    </nav>
  );
}
