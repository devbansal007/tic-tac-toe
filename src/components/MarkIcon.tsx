import { FC } from 'react';
import { motion } from 'motion/react';
import { Player } from '../types/game';

interface MarkIconProps {
  player: Player;
  isGhost?: boolean;
  className?: string;
}

export const MarkIcon: FC<MarkIconProps> = ({ player, isGhost = false, className = '' }) => {
  if (player === 'X') {
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full p-3 sm:p-4 ${className} ${isGhost ? 'opacity-35' : 'opacity-100'}`}
      >
        <motion.line
          x1="22"
          y1="22"
          x2="78"
          y2="78"
          stroke="currentColor"
          strokeWidth="13"
          strokeLinecap="round"
          initial={isGhost ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
        />
        <motion.line
          x1="78"
          y1="22"
          x2="22"
          y2="78"
          stroke="currentColor"
          strokeWidth="13"
          strokeLinecap="round"
          initial={isGhost ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.22, delay: 0.08, ease: 'easeOut' }}
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-full p-3 sm:p-4 ${className} ${isGhost ? 'opacity-35' : 'opacity-100'}`}
    >
      <motion.circle
        cx="50"
        cy="50"
        r="30"
        stroke="currentColor"
        strokeWidth="12"
        strokeLinecap="round"
        initial={isGhost ? false : { pathLength: 0, rotate: -90 }}
        animate={{ pathLength: 1, rotate: 0 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
      />
    </svg>
  );
};
