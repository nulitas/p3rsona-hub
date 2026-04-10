"use client";

import { useState } from "react";
import { projects } from "@/projects-data";
import { motion } from "framer-motion";

export default function ProjectsSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);

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

  const activeProject = projects[hoveredIndex] || projects[0];
  const [activeProjectName, activeProjectDesc] = activeProject.name.split("–");

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col h-full w-full relative z-10 px-[10vw] pt-[5vh] text-white font-sans overflow-hidden"
    >
      {/* Top Header Navigation Tabs (Mocking the L / R requests tabs) */}
      <motion.div
        variants={itemVariants}
        className="flex items-end gap-4 mb-6 z-20 relative font-black italic"
      >
        {/* <div className="text-3xl text-red-500 tracking-tighter cursor-default select-none transform -skew-x-12">
          &lt; L
        </div> */}

        <div className="flex items-center gap-2">
          {/* Active Tab */}
          <div className="bg-white text-black px-12 py-1 rounded-full text-2xl tracking-tight shadow-[0_0_10px_white]">
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
          className="flex items-end px-4 border-b-2 border-white/20 pb-2 mb-2 text-white/70 italic text-sm font-semibold tracking-wider"
        >
          <div className="w-[10%] text-center">No.</div>
          <div className="w-[50%]">Project</div>
          {/* <div className="w-[20%] text-center">Deadline</div> */}
          <div className="w-[20%] text-center relative">
            <span className="text-[#00f0ff] uppercase text-[10px] absolute -top-3 left-1/2 -translate-x-1/2">
              Sort
            </span>
            Stats
          </div>
        </motion.div>

        {/* Scrollable Project List */}
        <div className="flex flex-col flex-1 max-h-[45vh] overflow-y-auto custom-scrollbar pr-4 gap-1">
          {projects.map((project, index) => {
            const isHovered = index === hoveredIndex;
            const [projName] = project.name.split("–");

            return (
              <motion.a
                key={index}
                variants={itemVariants}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setHoveredIndex(index)}
                onFocus={() => setHoveredIndex(index)}
                className={`flex items-center px-4 py-2 relative group cursor-pointer transition-all ${
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
                <div className="w-[10%] text-center font-serif italic text-2xl opacity-90 tracking-tighter">
                  {(index + 1).toString().padStart(2, "0")}
                </div>

                {/* Name */}
                <div
                  className={`w-[50%] font-semibold tracking-wide truncate ${isHovered ? "text-black" : "text-white"}`}
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
                <div className="w-[20%] flex justify-center">
                  <div
                    className={`flex items-center border-2 font-black italic tracking-tighter px-2 py-0.5 text-xs w-full max-w-30 justify-center ${
                      isHovered
                        ? "bg-[#050505] text-white border-black"
                        : "bg-[#00f0ff] text-black border-[#00f0ff]"
                    }`}
                  >
                    <span className="mr-1 text-sm leading-none">✔</span>
                    {project.status ? "Complete" : "In Progress"}
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* Dynamic Task Info Section below the list */}
        <motion.div
          variants={itemVariants}
          className="mt-8 pt-6 border-t border-white/20 pl-4 h-32"
        >
          <h3 className="italic text-[#00f0ff] text-3xl font-serif tracking-tighter mb-2 shadow-black drop-shadow-md">
            Task
          </h3>
          <div className="flex items-start">
            <span className="mr-2 text-xl leading-none mt-1 shadow-black drop-shadow-md">
              •
            </span>
            <p className="text-lg font-medium tracking-wide shadow-black drop-shadow-md max-w-2xl text-white">
              {activeProjectDesc
                ? activeProjectDesc.trim()
                : "Review the project repository for details."}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
