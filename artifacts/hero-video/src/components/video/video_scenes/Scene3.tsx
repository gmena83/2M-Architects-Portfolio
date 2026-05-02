import { motion } from 'framer-motion';

export function Scene3() {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center bg-[#0a0f18]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.video
        src={`${import.meta.env.BASE_URL}videos/cad-blueprint.mp4`}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-60"
        initial={{ scale: 1.2, x: '5%', filter: 'brightness(1)' }}
        animate={{ scale: 1, x: '0%', filter: 'brightness(0.7)' }}
        transition={{ duration: 6, ease: 'easeOut' }}
      />
      
      {/* Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(79, 172, 254, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(79, 172, 254, 0.2) 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }}
      />
      
      {/* CAD-style corner crosshair (no text) */}
      <motion.div
        className="absolute top-[5%] left-[5%] w-16 h-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <div className="absolute top-1/2 left-0 right-0 h-px bg-[#4facfe]/60" />
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-[#4facfe]/60" />
        <motion.div
          className="absolute top-1/2 left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 border border-[#4facfe]/80 rounded-full"
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      <motion.div className="absolute bottom-[5%] right-[5%] w-32 h-32 border border-white/20 rounded-full flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.5 }}>
        <motion.div className="w-1 h-full bg-[#4facfe]/50" animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} />
      </motion.div>
    </motion.div>
  );
}
