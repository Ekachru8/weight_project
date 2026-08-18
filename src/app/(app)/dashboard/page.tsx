"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="relative min-h-[85vh] w-full flex items-center justify-center overflow-hidden rounded-[2rem] bg-[#030303]">
      {/* Dynamic Animated Mesh Background */}
      <div className="absolute inset-0 z-0 opacity-50">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(ellipse_at_center,rgba(192,255,0,0.15)_0%,transparent_50%)]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
            rotate: [360, 180, 360],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -right-[50%] w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,rgba(0,230,118,0.1)_0%,transparent_50%)]"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          {/* Glowing Aura behind text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-accent/20 blur-[100px] rounded-full pointer-events-none" />
          
          <h1 className="text-6xl sm:text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 tracking-tighter drop-shadow-2xl mb-8">
            HomeFit
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Link 
              href="/exercises" 
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-lg text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full overflow-hidden transition-all duration-500 backdrop-blur-md"
            >
              <span className="relative z-10 flex items-center gap-2">
                Enter Workspace
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Subtle floating particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/30 rounded-full"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
          }}
          animate={{
            y: [null, Math.random() * -500],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 5 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
}
