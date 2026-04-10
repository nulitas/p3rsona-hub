"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const dummyDatabase = [
  { arcana: "Temper.", level: 42, name: "Seiryu" },
  { arcana: "Fool", level: 40, name: "Black Frost" },
  { arcana: "Hiero.", level: 30, name: "Shiisaa" },
  { arcana: "Devil", level: 34, name: "Baphomet" },
  { arcana: "Magician", level: 34, name: "Sati" },
  { arcana: "Hermit", level: 25, name: "Lamia" },
  { arcana: "Fortune", level: 28, name: "Kushi Mitama" },
  { arcana: "Star", level: 30, name: "Setanta" },
  { arcana: "Sun", level: 25, name: "Yatagarasu" },
  { arcana: "Emperor", level: 37, name: "King Frost" },
  { arcana: "Lovers", level: 28, name: "Queen Medb" },
  { arcana: "Moon", level: 15, name: "Gurulu" },
];

export default function PersonaSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number>(2);

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
          PERSONA
        </motion.div>
      </div>

      {/* Left Column: Menu Items */}
      <div className="w-full md:w-[45%] flex flex-col relative z-20 h-auto md:h-[70vh] pl-2 md:pl-10 mt-4 md:mt-10">
        <div className="flex flex-col gap-1 w-full max-w-full md:max-w-125 overflow-y-auto custom-scrollbar pr-2 md:pr-4 max-h-[45vh] md:max-h-none">
          {dummyDatabase.map((item, index) => {
            const isSelected = hoveredIndex === index;

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                onMouseEnter={() => setHoveredIndex(index)}
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
                    {isSelected ? "Lv " : ""}
                  </span>
                  <span
                    className={`${isSelected ? "text-3xl font-black italic font-sans" : "text-2xl font-bold"}`}
                  >
                    {item.level}
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
      </div>
    </motion.div>
  );
}
