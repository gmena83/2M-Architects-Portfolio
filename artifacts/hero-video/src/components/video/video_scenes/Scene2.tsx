import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene2() {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center bg-[#0a0f18]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.img
        src={`${import.meta.env.BASE_URL}images/arch-abstract.png`}
        className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-screen"
        initial={{ scale: 1 }}
        animate={{ scale: 1.1, x: '-2%' }}
        transition={{ duration: 6, ease: 'linear' }}
      />
      
      {/* Architectural sketch lines drawing */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="none">
        <motion.path
          d="M 200 800 L 800 200 L 1600 600"
          fill="none"
          stroke="rgba(79, 172, 254, 0.6)"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
        <motion.rect
          x="800" y="200" width="300" height="400"
          fill="none"
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 1 }}
        />
        <motion.circle
          cx="1600" cy="600" r="100"
          fill="none"
          stroke="rgba(79, 172, 254, 0.4)"
          strokeWidth="1"
          strokeDasharray="5,5"
          initial={{ rotate: -90, pathLength: 0, opacity: 0 }}
          animate={{ rotate: 0, pathLength: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: "easeOut", delay: 1.5 }}
        />
      </svg>
    </motion.div>
  );
}
