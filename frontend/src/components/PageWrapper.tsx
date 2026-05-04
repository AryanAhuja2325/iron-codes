import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

const PageWrapper = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.25 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;
