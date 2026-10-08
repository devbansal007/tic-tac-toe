import { FC } from 'react';
import { motion } from 'motion/react';
import { Player, GameStats, GameSettings, WinInfo } from '../types/game';
import { ThemeConfig } from '../utils/theme';
import { Bot, User, Flame, Clock } from 'lucide-react';

interface ScoreBoardProps {
  stats: GameStats;
  settings: GameSettings;
  currentPlayer: Player;
  winInfo: WinInfo | null;
  isDraw: boolean;
  isAiThinking: boolean;
  blitzRemaining: number | null;
  theme: ThemeConfig;
}

export const ScoreBoard: FC<ScoreBoardProps> = ({
  stats,
  settings,
  currentPlayer,
  winInfo,
  isDraw,
  isAiThinking,
  blitzRemaining,
  theme,
}) => {
  const isXTurn = !winInfo && !isDraw && currentPlayer === 'X';
  const isOTurn = !winInfo && !isDraw && currentPlayer === 'O';

  const isOBot = settings.mode === 'ai' && settings.aiPlayer === 'O';
  const isXBot = settings.mode === 'ai' && settings.aiPlayer === 'X';

  const blitzPercent =
    settings.blitzSeconds > 0 && blitzRemaining !== null
      ? Math.max(0, Math.min(100, (blitzRemaining / settings.blitzSeconds) * 100))
      : null;

  return (
    <div className="w-full max-w-[480px] mx-auto space-y-2">
      {/* Player Cards & Middle Score */}
      <div className="grid grid-cols-3 items-center gap-2 sm:gap-3">
        {/* Player X */}
        <div
          className={`relative p-3 rounded-2xl transition-all duration-300 border ${
            isXTurn
              ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.2)]'
              : 'border-white/10 bg-white/5 opacity-80'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-sm ${
                theme.xColorClass
              } bg-black/30 border border-white/10`}
            >
              {isXBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold truncate tracking-wide">
                {isXBot ? `Bot (${settings.aiDifficulty})` : settings.playerXName}
              </p>
              <span className={`text-[11px] font-bold ${theme.xColorClass}`}>PLAYER X</span>
            </div>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <span className="text-2xl font-black font-mono tracking-tight">{stats.xWins}</span>
            <span className="text-[11px] uppercase tracking-wider text-neutral-400">Wins</span>
          </div>

          {isXTurn && (
            <motion.div
              layoutId="active-indicator"
              className="absolute -top-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-cyan-400 text-slate-950 shadow-md"
            >
              {isAiThinking && isXBot ? 'Thinking...' : 'Your Turn'}
            </motion.div>
          )}
        </div>

        {/* Center / Draws / Streak */}
        <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-white/5 border border-white/10 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">DRAWS</span>
          <span className="text-xl font-black font-mono my-0.5">{stats.draws}</span>
          {stats.currentStreak > 1 && stats.streakHolder && (
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 pt-0.5">
              <Flame className="w-3.5 h-3.5 animate-pulse" />
              <span>{stats.streakHolder} {stats.currentStreak}x</span>
            </div>
          )}
          {stats.currentStreak <= 1 && (
            <span className="text-[10px] text-neutral-500 font-mono">
              Match {stats.totalGames + 1}
            </span>
          )}
        </div>

        {/* Player O */}
        <div
          className={`relative p-3 rounded-2xl transition-all duration-300 border ${
            isOTurn
              ? 'border-pink-400 bg-pink-500/10 shadow-[0_0_20px_rgba(244,114,182,0.2)]'
              : 'border-white/10 bg-white/5 opacity-80'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-sm ${
                theme.oColorClass
              } bg-black/30 border border-white/10`}
            >
              {isOBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold truncate tracking-wide">
                {isOBot ? `Bot (${settings.aiDifficulty})` : settings.playerOName}
              </p>
              <span className={`text-[11px] font-bold ${theme.oColorClass}`}>PLAYER O</span>
            </div>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <span className="text-2xl font-black font-mono tracking-tight">{stats.oWins}</span>
            <span className="text-[11px] uppercase tracking-wider text-neutral-400">Wins</span>
          </div>

          {isOTurn && (
            <motion.div
              layoutId="active-indicator"
              className="absolute -top-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-pink-400 text-slate-950 shadow-md"
            >
              {isAiThinking && isOBot ? 'Thinking...' : 'Your Turn'}
            </motion.div>
          )}
        </div>
      </div>

      {/* Blitz Timer Countdown Bar */}
      {settings.blitzSeconds > 0 && blitzRemaining !== null && !winInfo && !isDraw && (
        <div className="relative pt-1">
          <div className="flex items-center justify-between text-xs font-mono mb-1 text-neutral-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              Turn Timer
            </span>
            <span
              className={`font-bold ${
                blitzRemaining <= 2 ? 'text-red-400 animate-pulse' : 'text-neutral-200'
              }`}
            >
              {blitzRemaining.toFixed(1)}s
            </span>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className={`h-full transition-all duration-100 ${
                (blitzRemaining ?? 0) <= 2
                  ? 'bg-red-500'
                  : (blitzRemaining ?? 0) <= 4
                  ? 'bg-amber-400'
                  : 'bg-cyan-400'
              }`}
              style={{ width: `${blitzPercent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
