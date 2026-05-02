import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene1() {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center bg-[#0a0f18]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Video Background */}
      <motion.video
        src={`${import.meta.env.BASE_URL}videos/cad-blueprint.mp4`}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-60"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 6, ease: 'linear' }}
      />
      
      {/* Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Overlay Elements */}
      <motion.div 
        className="absolute bottom-[10%] right-[5%] w-[300px] h-[1px] bg-white/40 origin-right"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        exit={{ scaleX: 0 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute top-[20%] left-[10%] w-[1px] h-[200px] bg-[#4facfe]/40 origin-top"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        exit={{ scaleY: 0 }}
        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
      />
    </motion.div>
  );
}
