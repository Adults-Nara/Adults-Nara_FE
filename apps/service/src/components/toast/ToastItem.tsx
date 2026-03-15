'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Info, CircleX } from 'lucide-react';

interface ToastItemProps {
  message: string;
  type: 'success' | 'error' | 'info';
}

const icons = {
  success: CheckCircle,
  error: CircleX,
  info: Info,
};

const colors = {
  success: 'text-green-400',
  error: 'text-red-400',
  info: 'text-blue-400',
};

export default function ToastItem({ message, type }: ToastItemProps) {
  const Icon = icons[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.2 }}
      className="relative overflow-hidden rounded-xl bg-black/70 px-4 py-3 text-white shadow-lg backdrop-blur"
    >
      <div className="flex items-center gap-2">
        <Icon className={`h-7 w-7 ${colors[type]} shrink-0`} />
        <span className="body2">{message}</span>
      </div>
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: 3, ease: 'linear' }}
        className="absolute bottom-0 left-0 h-0.5 bg-white/40"
      />
    </motion.div>
  );
}
