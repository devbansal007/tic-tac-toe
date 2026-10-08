import { FC } from 'react';
import { GameSettings, GameMode, AIDifficulty, GridSize, ThemeId, Player } from '../types/game';
import { THEMES, ThemeConfig } from '../utils/theme';
import { X, Bot, Users, Sparkles, Trash2, ShieldAlert } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  settings: GameSettings;
  theme: ThemeConfig;
  onClose: () => void;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onResetStats: () => void;
}

export const SettingsModal: FC<SettingsModalProps> = ({
  isOpen,
  settings,
  theme,
  onClose,
  onUpdateSettings,
  onResetStats,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl p-5 sm:p-6 shadow-2xl border ${
          theme.isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-neutral-900 border-neutral-700 text-neutral-100'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold">Game Settings</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="p-1.5 rounded-xl hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 text-sm">
          {/* Game Mode */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Game Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onUpdateSettings({ mode: 'ai' })}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-medium border transition-all cursor-pointer ${
                  settings.mode === 'ai'
                    ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 font-bold'
                    : 'border-white/10 bg-white/5 hover:bg-white/10 text-neutral-300'
                }`}
              >
                <Bot className="w-4 h-4" />
                <span>Vs AI Bot</span>
              </button>
              <button
                type="button"
                onClick={() => onUpdateSettings({ mode: 'pvp' })}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-medium border transition-all cursor-pointer ${
                  settings.mode === 'pvp'
                    ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 font-bold'
                    : 'border-white/10 bg-white/5 hover:bg-white/10 text-neutral-300'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>2 Players (Local)</span>
              </button>
            </div>
          </div>

          {/* AI Settings (if mode == ai) */}
          {settings.mode === 'ai' && (
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-2">
                  AI Difficulty
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['easy', 'medium', 'hard'] as AIDifficulty[]).map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => onUpdateSettings({ aiDifficulty: diff })}
                      className={`py-2 px-2 rounded-lg font-medium text-xs capitalize border transition-all cursor-pointer ${
                        settings.aiDifficulty === diff
                          ? 'border-cyan-400 bg-cyan-500/25 text-cyan-300 font-bold'
                          : 'border-transparent bg-white/5 hover:bg-white/10 text-neutral-400'
                      }`}
                    >
                      {diff === 'hard' ? 'Grandmaster' : diff === 'medium' ? 'Tactician' : 'Rookie'}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-neutral-400 mt-1.5">
                  {settings.aiDifficulty === 'hard'
                    ? '⚡ Optimal Minimax. Mathematically unbeatable!'
                    : settings.aiDifficulty === 'medium'
                    ? '🎯 Blocks threats and seizes winning lines.'
                    : '🌱 Relaxed and casual gameplay.'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-2">
                  You Play As
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ aiPlayer: 'O' })}
                    className={`py-2 px-3 rounded-lg font-bold border transition-all cursor-pointer ${
                      settings.aiPlayer === 'O'
                        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300'
                        : 'border-white/10 bg-white/5 hover:bg-white/10 text-neutral-300'
                    }`}
                  >
                    X (First Turn)
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ aiPlayer: 'X' })}
                    className={`py-2 px-3 rounded-lg font-bold border transition-all cursor-pointer ${
                      settings.aiPlayer === 'X'
                        ? 'border-pink-400 bg-pink-500/20 text-pink-300'
                        : 'border-white/10 bg-white/5 hover:bg-white/10 text-neutral-300'
                    }`}
                  >
                    O (AI Goes First)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Player Names (if PvP) */}
          {settings.mode === 'pvp' && (
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-cyan-300 mb-1">
                  Player X Name
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={settings.playerXName}
                  onChange={(e) => onUpdateSettings({ playerXName: e.target.value || 'Player 1' })}
                  className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/15 text-white font-medium focus:border-cyan-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-pink-300 mb-1">
                  Player O Name
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={settings.playerOName}
                  onChange={(e) => onUpdateSettings({ playerOName: e.target.value || 'Player 2' })}
                  className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/15 text-white font-medium focus:border-pink-400 outline-none"
                />
              </div>
            </div>
          )}

          {/* Grid Size */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Board Dimensions
            </label>
            <div className="grid grid-cols-3 gap-2">
              {([3, 4, 5] as GridSize[]).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => onUpdateSettings({ gridSize: size })}
                  className={`py-2.5 px-3 rounded-xl font-bold border transition-all cursor-pointer flex flex-col items-center ${
                    settings.gridSize === size
                      ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300'
                      : 'border-white/10 bg-white/5 hover:bg-white/10 text-neutral-300'
                  }`}
                >
                  <span>{size}×{size}</span>
                  <span className="text-[10px] font-normal text-neutral-400">
                    {size === 3 ? 'Win 3' : 'Win 4'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Turn Timer (Blitz Mode) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Turn Timer (Speed Mode)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { sec: 0, label: 'Unlimited' },
                { sec: 10, label: '10s (Fast)' },
                { sec: 5, label: '5s (Blitz!)' },
              ].map(({ sec, label }) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => onUpdateSettings({ blitzSeconds: sec })}
                  className={`py-2 px-2 rounded-xl font-medium text-xs border transition-all cursor-pointer ${
                    settings.blitzSeconds === sec
                      ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 font-bold'
                      : 'border-white/10 bg-white/5 hover:bg-white/10 text-neutral-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Visual Theme
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(THEMES).map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => onUpdateSettings({ theme: th.id })}
                  className={`py-2.5 px-3 rounded-xl font-medium text-xs border transition-all cursor-pointer text-left ${
                    settings.theme === th.id
                      ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 font-bold'
                      : 'border-white/10 bg-white/5 hover:bg-white/10 text-neutral-300'
                  }`}
                >
                  {th.name}
                </button>
              ))}
            </div>
          </div>

          {/* Danger Zone: Reset Scores */}
          <div className="pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                if (confirm('Are you sure you want to reset all game win/draw stats and streaks?')) {
                  onResetStats();
                }
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Scoreboard & Streaks</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-3 border-t border-white/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className={`py-2 px-6 rounded-xl font-bold text-sm cursor-pointer ${theme.primaryBtnClass}`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
