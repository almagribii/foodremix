
import { useState, useEffect } from 'react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

const buttonVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'tween' },
  },
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: { duration: 0.1 },
  },
};

const ScrollToTopButton = ({ isHorizontal = false }) => {
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleScroll = () => {
    if (window.scrollY > 400) {
      setShowScrollTopButton(true);
    } else {
      setShowScrollTopButton(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const baseClasses =
    'p-3 md:p-5 bg-[#eab308] text-white border border-cyan-300/50 rounded-full shadow-[0_20px_52px_-24px_rgba(14,165,233,0.95)] hover:from-amber-400 hover:to-amber-500 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-amber-300/55 cursor-pointer';

  return (
    <AnimatePresence>
      {showScrollTopButton && (
        <motion.button
          onClick={scrollToTop}
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          whileHover="hover"
          className={baseClasses}
          aria-label="Scroll back to top"
        >
          <ChevronUp className="w-5 h-5 md:w-7 md:h-7" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTopButton;
