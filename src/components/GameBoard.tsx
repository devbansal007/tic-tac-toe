import { FC, useState } from 'react';
import { motion } from 'motion/react';
import { CellValue, Player, GridSize, WinInfo } from '../types/game';
import { THEMES, ThemeConfig } from '../utils/theme';
import { MarkIcon } from './MarkIcon';

interface GameBoardProps {
  board: CellValue[];
  gridSize: GridSize;
  currentPlayer: Player;
  winInfo: WinInfo | null;
  isDraw: boolean;
  isAiThinking: boolean;
  theme: ThemeConfig;
  onCellClick: (index: number) => void;
}

export const GameBoard: FC<GameBoardProps> = ({
  board,
  gridSize,
  currentPlayer,
  winInfo,
  isDraw,
  isAiThinking,
  theme,
  onCellClick,
}) => {
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);

  const winningSet = new Set(winInfo?.line ?? []);

  // Compute strike line coordinates in percentage
  let strikeCoords: { x1: number; y1: number; x2: number; y2: number } | null = null;
  if (winInfo && winInfo.line.length >= 2) {
    const firstIdx = winInfo.line[0];
    const lastIdx = winInfo.line[winInfo.line.length - 1];

    const r1 = Math.floor(firstIdx / gridSize);
    const c1 = firstIdx % gridSize;
    const r2 = Math.floor(lastIdx / gridSize);
    const c2 = lastIdx % gridSize;

    const rawX1 = ((c1 + 0.5) / gridSize) * 100;
    const rawY1 = ((r1 + 0.5) / gridSize) * 100;
    const rawX2 = ((c2 + 0.5) / gridSize) * 100;
    const rawY2 = ((r2 + 0.5) / gridSize) * 100;

    const dx = rawX2 - rawX1;
    const dy = rawY2 - rawY1;

    // Extend line slightly beyond center of edge cells
    const ext = 0.14;
    strikeCoords = {
      x1: Math.max(3, Math.min(97, rawX1 - dx * ext)),
      y1: Math.max(3, Math.min(97, rawY1 - dy * ext)),
      x2: Math.max(3, Math.min(97, rawX2 + dx * ext)),
      y2: Math.max(3, Math.min(97, rawY2 + dy * ext)),
    };
  }

  const gridColsClass =
    gridSize === 3 ? 'grid-cols-3' : gridSize === 4 ? 'grid-cols-4' : 'grid-cols-5';

  const gapClass = gridSize === 3 ? 'gap-3 sm:gap-4' : gridSize === 4 ? 'gap-2 sm:gap-3' : 'gap-1.5 sm:gap-2';
  const paddingClass = gridSize === 3 ? 'p-3 sm:p-4' : gridSize === 4 ? 'p-2.5 sm:p-3' : 'p-2 sm:p-2.5';

  return (
    <div className="relative w-full max-w-[440px] mx-auto select-none">
      {/* Board Outer Container */}
      <div
        className={`relative aspect-square w-full rounded-3xl ${paddingClass} ${theme.boardClass} transition-colors duration-300 shadow-2xl`}
      >
        <div className={`grid ${gridColsClass} ${gapClass} w-full h-full`}>
          {board.map((cellValue, index) => {
            const isWinningCell = winningSet.has(index);
            const isFilled = cellValue !== null;
            const isInteractive = !isFilled && !winInfo && !isDraw && !isAiThinking;
            const isGhostVisible = isInteractive && hoveredCell === index;

            return (
              <button
                key={index}
                type="button"
                onClick={() => {
                  if (isInteractive) {
                    onCellClick(index);
                  }
                }}
                onMouseEnter={() => setHoveredCell(index)}
                onMouseLeave={() => setHoveredCell(null)}
                disabled={!isInteractive}
                aria-label={`Cell ${index + 1}${cellValue ? `, marked by ${cellValue}` : ', empty'}`}
                className={`relative flex items-center justify-center rounded-2xl aspect-square transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  theme.cellClass
                } ${isInteractive ? theme.cellHoverClass + ' cursor-pointer' : 'cursor-default'} ${
                  isWinningCell
                    ? 'ring-2 ring-emerald-400 bg-emerald-500/20 scale-[1.03] z-10 shadow-[0_0_20px_rgba(52,211,153,0.35)]'
                    : ''
                }`}
              >
                {/* Cell Mark */}
                {cellValue && (
                  <motion.div
                    initial={{ scale: 0.2, rotate: cellValue === 'X' ? -25 : 25, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 420,
                      damping: 24,
                    }}
                    className={`w-full h-full flex items-center justify-center ${
                      cellValue === 'X' ? theme.xColorClass : theme.oColorClass
                    }`}
                  >
                    <MarkIcon player={cellValue} />
                  </motion.div>
                )}

                {/* Ghost mark on hover */}
                {isGhostVisible && (
                  <div
                    className={`w-full h-full flex items-center justify-center pointer-events-none transition-opacity ${
                      currentPlayer === 'X' ? theme.xColorClass : theme.oColorClass
                    }`}
                  >
                    <MarkIcon player={currentPlayer} isGhost />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic Strike-Through Line */}
        {strikeCoords && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* Outer Glow */}
            <motion.line
              x1={strikeCoords.x1}
              y1={strikeCoords.y1}
              x2={strikeCoords.x2}
              y2={strikeCoords.y2}
              stroke={winInfo?.winner === 'X' ? '#22d3ee' : '#f472b6'}
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.6"
              filter="blur(3px)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            />
            {/* Core Crisp Line */}
            <motion.line
              x1={strikeCoords.x1}
              y1={strikeCoords.y1}
              x2={strikeCoords.x2}
              y2={strikeCoords.y2}
              stroke="#ffffff"
              strokeWidth="2.8"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            />
          </svg>
        )}
      </div>
    </div>
  );
};
