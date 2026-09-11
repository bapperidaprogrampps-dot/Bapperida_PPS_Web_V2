import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring, Variants } from 'motion/react';
import { ArrowUp } from 'lucide-react';

/* =========================================================================
   1. SCROLL PROGRESS BAR (Indikator Gulir Halaman di Paling Atas)
   ========================================================================= */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 via-amber-500 to-[#185377] origin-left z-[60] pointer-events-none"
      aria-hidden="true"
    />
  );
}

/* =========================================================================
   2. SCROLL TO TOP BUTTON (Tombol Mengambang Menuju ke Atas dengan Animasi)
   ========================================================================= */
export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 320) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.7, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.7, y: 20 }}
      whileHover={{ scale: 1.1, y: -3 }}
      whileTap={{ scale: 0.95 }}
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-[#0f3d5c] hover:bg-[#185377] text-white border border-white/20 transition group flex items-center justify-center cursor-pointer"
      title="Kembali ke Atas"
      aria-label="Kembali ke Atas"
      id="scroll-to-top-btn"
    >
      <ArrowUp className="w-5 h-5 text-amber-400 group-hover:-translate-y-0.5 transition" />
      <span className="sr-only">Kembali ke Atas</span>
    </motion.button>
  );
}

/* =========================================================================
   3. SCROLL REVEAL (Pembungkus Animasi Muncul Saat Bergulir ke Bawah)
   ========================================================================= */
export type RevealDirection = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in' | 'flip-up';

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: RevealDirection;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  id?: string;
  margin?: string;
  once?: boolean;
}

export function ScrollReveal({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 0.65,
  distance = 32,
  className = '',
  id,
  margin = '0px',
  once = true
}: ScrollRevealProps) {
  const getInitial = () => {
    switch (variant) {
      case 'fade-up':
        return { opacity: 0, y: distance };
      case 'fade-down':
        return { opacity: 0, y: -distance };
      case 'fade-left':
        return { opacity: 0, x: distance };
      case 'fade-right':
        return { opacity: 0, x: -distance };
      case 'zoom-in':
        return { opacity: 0, scale: 0.92 };
      case 'flip-up':
        return { opacity: 0, rotateX: 20, y: distance };
      default:
        return { opacity: 0, y: distance };
    }
  };

  const getAnimate = () => {
    switch (variant) {
      case 'fade-up':
      case 'fade-down':
        return { opacity: 1, y: 0 };
      case 'fade-left':
      case 'fade-right':
        return { opacity: 1, x: 0 };
      case 'zoom-in':
        return { opacity: 1, scale: 1 };
      case 'flip-up':
        return { opacity: 1, rotateX: 0, y: 0 };
      default:
        return { opacity: 1, y: 0 };
    }
  };

  return (
    <motion.div
      id={id}
      initial={getInitial()}
      whileInView={getAnimate()}
      viewport={{ once, margin: margin as any }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1] // cubic bezier untuk pantulan lembut natural
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* =========================================================================
   4. STAGGER CONTAINER & ITEM (Animasi Beruntun / Efek Bertahap Saat Menggulir)
   ========================================================================= */
interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
  id?: string;
  margin?: string;
  once?: boolean;
  key?: React.Key;
}

export function StaggerContainer({
  children,
  staggerDelay = 0.09,
  className = '',
  id,
  margin = '0px',
  once = true
}: StaggerContainerProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.05
      }
    }
  };

  return (
    <motion.div
      id={id}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: margin as any }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: React.ReactNode;
  variant?: 'fade-up' | 'zoom-in' | 'fade-left' | 'fade-right';
  className?: string;
  id?: string;
  key?: React.Key;
}

export function StaggerItem({
  children,
  variant = 'fade-up',
  className = '',
  id
}: StaggerItemProps) {
  const itemVariants: Variants = {
    hidden: () => {
      switch (variant) {
        case 'zoom-in':
          return { opacity: 0, scale: 0.9, y: 15 };
        case 'fade-left':
          return { opacity: 0, x: 25 };
        case 'fade-right':
          return { opacity: 0, x: -25 };
        default:
          return { opacity: 0, y: 25 };
      }
    },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <motion.div
      id={id}
      variants={itemVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
