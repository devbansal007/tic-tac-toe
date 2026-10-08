/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Player,
  CellValue,
  GridSize,
  GameStats,
  GameSettings,
  WinInfo,
  MoveRecord,
} from './types/game';
import { THEMES } from './utils/theme';
import { checkWin, checkDraw, getAIMove } from './utils/ai';
import { sounds } from './utils/audio';
import { fireWinConfetti } from './utils/confetti';
import { GameBoard } from './components/GameBoard';
import { ScoreBoard } from './components/ScoreBoard';
import { GameControls } from './components/GameControls';
import { SettingsModal } from './components/SettingsModal';
import { RulesModal } from './components/RulesModal';
import { Sparkles, Trophy, RotateCcw } from 'lucide-react';

const STATS_STORAGE_KEY = 'tictactoe_stats_v1';
const SETTINGS_STORAGE_KEY = 'tictactoe_settings_v1';

const DEFAULT_SETTINGS: GameSettings = {
  mode: 'ai',
  aiDifficulty: 'hard',
  aiPlayer: 'O', // Player is X by default
  gridSize: 3,
  soundEnabled: true,
  blitzSeconds: 0,
  theme: 'cyber',
  playerXName: 'Player 1',
  playerOName: 'Player 2',
};

const DEFAULT_STATS: GameStats = {
  xWins: 0,
  oWins: 0,
  draws: 0,
  currentStreak: 0,
  streakHolder: null,
  totalGames: 0,
};

export default function App() {
  // Load settings & stats from localStorage
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [stats, setStats] = useState<GameStats>(() => {
    try {
      const saved = localStorage.getItem(STATS_STORAGE_KEY);
      return saved ? { ...DEFAULT_STATS, ...JSON.parse(saved) } : DEFAULT_STATS;
    } catch {
      return DEFAULT_STATS;
    }
  });

  // Game Board State
  const [board, setBoard] = useState<CellValue[]>(() =>
    new Array(settings.gridSize * settings.gridSize).fill(null)
  );
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winInfo, setWinInfo] = useState<WinInfo | null>(null);
  const [isDraw, setIsDraw] = useState<boolean>(false);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [moveHistory, setMoveHistory] = useState<MoveRecord[]>([]);

  // Blitz Timer State
  const [blitzRemaining, setBlitzRemaining] = useState<number | null>(null);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  const theme = THEMES[settings.theme] || THEMES.cyber;

  // Sync sound setting to sound controller
  useEffect(() => {
    sounds.enabled = settings.soundEnabled;
  }, [settings.soundEnabled]);

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  // Persist stats
  useEffect(() => {
    try {
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
    } catch {
      // ignore
    }
  }, [stats]);

  // Reset board when grid size changes
  useEffect(() => {
    resetGame();
  }, [settings.gridSize]);

  // Turn timer (Blitz mode)
  useEffect(() => {
    if (settings.blitzSeconds <= 0 || winInfo || isDraw) {
      setBlitzRemaining(null);
      return;
    }

    setBlitzRemaining(settings.blitzSeconds);

    const interval = setInterval(() => {
      setBlitzRemaining((prev) => {
        if (prev === null) return null;
        if (prev <= 0.1) {
          // Timer expired: sound alert & pass turn
          sounds.playTick();
          setCurrentPlayer((curr) => (curr === 'X' ? 'O' : 'X'));
          return settings.blitzSeconds;
        }
        return Math.max(0, prev - 0.1);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentPlayer, winInfo, isDraw, settings.blitzSeconds]);

  // Handle Game Restart
  const resetGame = useCallback(() => {
    const totalCells = settings.gridSize * settings.gridSize;
    setBoard(new Array(totalCells).fill(null));
    setCurrentPlayer('X');
    setWinInfo(null);
    setIsDraw(false);
    setIsAiThinking(false);
    setMoveHistory([]);
    if (settings.blitzSeconds > 0) {
      setBlitzRemaining(settings.blitzSeconds);
    } else {
      setBlitzRemaining(null);
    }
  }, [settings.gridSize, settings.blitzSeconds]);

  // Process Move
  const makeMove = useCallback(
    (index: number, player: Player) => {
      setBoard((prevBoard) => {
        if (prevBoard[index] !== null) return prevBoard;

        const nextBoard = [...prevBoard];
        nextBoard[index] = player;

        // Play sound
        if (player === 'X') {
          sounds.playMarkX();
        } else {
          sounds.playMarkO();
        }

        // Record history
        setMoveHistory((prev) => [...prev, { index, player, grid: nextBoard }]);

        // Check Win
        const win = checkWin(nextBoard, settings.gridSize);
        if (win) {
          setWinInfo(win);
          sounds.playWin();
          fireWinConfetti(win.winner);

          // Update stats
          setStats((prevStats) => {
            const isXWin = win.winner === 'X';
            const newStreak =
              prevStats.streakHolder === win.winner ? prevStats.currentStreak + 1 : 1;
            return {
              ...prevStats,
              xWins: isXWin ? prevStats.xWins + 1 : prevStats.xWins,
              oWins: !isXWin ? prevStats.oWins + 1 : prevStats.oWins,
              currentStreak: newStreak,
              streakHolder: win.winner,
              totalGames: prevStats.totalGames + 1,
            };
          });
          return nextBoard;
        }

        // Check Draw
        const draw = checkDraw(nextBoard, win);
        if (draw) {
          setIsDraw(true);
          sounds.playDraw();

          setStats((prevStats) => ({
            ...prevStats,
            draws: prevStats.draws + 1,
            currentStreak: 0,
            streakHolder: null,
            totalGames: prevStats.totalGames + 1,
          }));
          return nextBoard;
        }

        // Switch Turn
        setCurrentPlayer(player === 'X' ? 'O' : 'X');
        return nextBoard;
      });
    },
    [settings.gridSize]
  );

  // Trigger AI Move when required
  useEffect(() => {
    if (
      settings.mode !== 'ai' ||
      winInfo ||
      isDraw ||
      currentPlayer !== settings.aiPlayer ||
      isAiThinking
    ) {
      return;
    }

    setIsAiThinking(true);

    const timer = setTimeout(() => {
      const aiMove = getAIMove(board, settings.gridSize, settings.aiDifficulty, settings.aiPlayer);
      if (aiMove >= 0) {
        makeMove(aiMove, settings.aiPlayer);
      }
      setIsAiThinking(false);
    }, 420); // human-like slight delay

    return () => clearTimeout(timer);
  }, [
    board,
    currentPlayer,
    settings.mode,
    settings.aiPlayer,
    settings.aiDifficulty,
    settings.gridSize,
    winInfo,
    isDraw,
    isAiThinking,
    makeMove,
  ]);

  // Human Cell Click Handler
  const handleCellClick = (index: number) => {
    if (winInfo || isDraw || isAiThinking) return;
    if (board[index] !== null) return;

    if (settings.mode === 'ai' && currentPlayer === settings.aiPlayer) {
      return; // Not human's turn
    }

    makeMove(index, currentPlayer);
  };

  // Undo Move
  const handleUndo = () => {
    if (moveHistory.length === 0 || isAiThinking) return;
    sounds.playClick();

    if (settings.mode === 'ai') {
      // Revert 2 moves if AI has made a move, or 1 move if human just played
      const movesToRevert = moveHistory.length >= 2 ? 2 : 1;
      const targetHistory = moveHistory.slice(0, moveHistory.length - movesToRevert);

      if (targetHistory.length === 0) {
        resetGame();
      } else {
        const lastMove = targetHistory[targetHistory.length - 1];
        setBoard([...lastMove.grid]);
        setMoveHistory(targetHistory);
        setCurrentPlayer(settings.aiPlayer === 'O' ? 'X' : 'O');
        setWinInfo(null);
        setIsDraw(false);
      }
    } else {
      // PvP: revert 1 move
      const targetHistory = moveHistory.slice(0, -1);
      if (targetHistory.length === 0) {
        resetGame();
      } else {
        const lastMove = targetHistory[targetHistory.length - 1];
        setBoard([...lastMove.grid]);
        setMoveHistory(targetHistory);
        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
        setWinInfo(null);
        setIsDraw(false);
      }
    }
  };

  // Reset Stats
  const handleResetStats = () => {
    sounds.playClick();
    setStats({
      xWins: 0,
      oWins: 0,
      draws: 0,
      currentStreak: 0,
      streakHolder: null,
      totalGames: 0,
    });
    localStorage.removeItem(STATS_STORAGE_KEY);
  };

  const getWinnerName = () => {
    if (!winInfo) return '';
    if (settings.mode === 'ai') {
      if (winInfo.winner === settings.aiPlayer) {
        return `Bot (${settings.aiDifficulty})`;
      }
      return 'You';
    }
    return winInfo.winner === 'X' ? settings.playerXName : settings.playerOName;
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-between p-4 sm:p-6 transition-colors duration-300 font-sans ${theme.bgClass}`}
    >
      {/* Top Header */}
      <header className="w-full max-w-[480px] flex items-center justify-between pb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-pink-500 flex items-center justify-center font-black text-slate-950 text-base shadow-md">
            #
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight leading-none flex items-center gap-1.5">
              TicTacToe Master
            </h1>
            <p className="text-[11px] font-medium text-neutral-400 mt-0.5">
              {settings.gridSize}×{settings.gridSize} ·{' '}
              {settings.mode === 'ai'
                ? `Vs Bot (${settings.aiDifficulty})`
                : 'Pass & Play'}
            </p>
          </div>
        </div>

        {/* Quick Mode Tag */}
        <div className="flex items-center gap-2">
          <span
            className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${theme.badgeClass}`}
          >
            {settings.gridSize === 3 ? 'Classic 3x3' : `${settings.gridSize}x${settings.gridSize} Grid`}
          </span>
        </div>
      </header>

      {/* Main Game Section */}
      <main className="w-full max-w-[480px] flex flex-col items-center gap-4 sm:gap-5 my-auto">
        {/* Score Board */}
        <ScoreBoard
          stats={stats}
          settings={settings}
          currentPlayer={currentPlayer}
          winInfo={winInfo}
          isDraw={isDraw}
          isAiThinking={isAiThinking}
          blitzRemaining={blitzRemaining}
          theme={theme}
        />

        {/* Interactive Board */}
        <GameBoard
          board={board}
          gridSize={settings.gridSize}
          currentPlayer={currentPlayer}
          winInfo={winInfo}
          isDraw={isDraw}
          isAiThinking={isAiThinking}
          theme={theme}
          onCellClick={handleCellClick}
        />

        {/* Status Callout / Game Over Banner */}
        <div className="w-full h-11 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {winInfo ? (
              <motion.div
                key="win-banner"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-sm shadow-lg"
              >
                <Trophy className="w-4 h-4 text-emerald-400 animate-bounce" />
                <span>
                  {getWinnerName()} Won! (Player {winInfo.winner})
                </span>
                <button
                  type="button"
                  onClick={resetGame}
                  className="ml-2 px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 text-xs font-black hover:bg-emerald-400 transition-colors cursor-pointer"
                >
                  Play Again
                </button>
              </motion.div>
            ) : isDraw ? (
              <motion.div
                key="draw-banner"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-sm shadow-lg"
              >
                <span>Game Drawn! Perfectly matched.</span>
                <button
                  type="button"
                  onClick={resetGame}
                  className="ml-2 px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 text-xs font-black hover:bg-amber-300 transition-colors cursor-pointer"
                >
                  Rematch
                </button>
              </motion.div>
            ) : isAiThinking ? (
              <motion.div
                key="ai-thinking"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-xs font-medium text-neutral-400"
              >
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>AI is calculating next move...</span>
              </motion.div>
            ) : (
              <motion.div
                key="turn-indicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs font-medium text-neutral-400 tracking-wide"
              >
                {settings.mode === 'ai' ? (
                  currentPlayer === settings.aiPlayer ? (
                    'Bot Turn'
                  ) : (
                    'Your Turn — place your mark'
                  )
                ) : (
                  `Player ${currentPlayer}'s turn`
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <GameControls
          canUndo={moveHistory.length > 0 && !winInfo && !isDraw && !isAiThinking}
          soundEnabled={settings.soundEnabled}
          theme={theme}
          onNewGame={() => {
            sounds.playClick();
            resetGame();
          }}
          onUndo={handleUndo}
          onToggleSound={() => {
            setSettings((s) => ({ ...s, soundEnabled: !s.soundEnabled }));
          }}
          onOpenSettings={() => {
            sounds.playClick();
            setIsSettingsOpen(true);
          }}
          onOpenRules={() => {
            sounds.playClick();
            setIsRulesOpen(true);
          }}
        />
      </main>

      {/* Footer / Tactile Bar */}
      <footer className="w-full max-w-[480px] text-center pt-3 pb-1">
        <p className="text-[11px] text-neutral-500 font-medium">
          Minimax AI · Sound Synthesizer · Speed Blitz · Pass & Play
        </p>
      </footer>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        theme={theme}
        onClose={() => setIsSettingsOpen(false)}
        onUpdateSettings={(newSettings) => {
          sounds.playClick();
          setSettings((prev) => {
            const updated = { ...prev, ...newSettings };
            return updated;
          });
        }}
        onResetStats={handleResetStats}
      />

      <RulesModal
        isOpen={isRulesOpen}
        theme={theme}
        onClose={() => setIsRulesOpen(false)}
      />
    </div>
  );
}
