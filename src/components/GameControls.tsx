import { FC } from 'react';
import { RotateCcw, Undo2, Volume2, VolumeX, Settings, HelpCircle } from 'lucide-react';
import { ThemeConfig } from '../utils/theme';

interface GameControlsProps {
  canUndo: boolean;
  soundEnabled: boolean;
  theme: ThemeConfig;
  onNewGame: () => void;
  onUndo: () => void;
  onToggleSound: () => void;
  onOpenSettings: () => void;
  onOpenRules: () => void;
}

export const GameControls: FC<GameControlsProps> = ({
  canUndo,
  soundEnabled,
  theme,
  onNewGame,
  onUndo,
  onToggleSound,
  onOpenSettings,
  onOpenRules,
}) => {
  return (
    <div className="w-full max-w-[480px] mx-auto flex items-center justify-between gap-2 pt-2">
      {/* Primary New Round / Reset */}
      <button
        type="button"
        onClick={onNewGame}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-sm tracking-wide transition-all active:scale-95 cursor-pointer ${theme.primaryBtnClass}`}
      >
        <RotateCcw className="w-4 h-4" />
        <span>New Round</span>
      </button>

      {/* Undo move button */}
      <button
        type="button"
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo last move"
        aria-label="Undo move"
        className={`flex items-center justify-center p-2.5 rounded-xl font-medium text-sm transition-all border ${
          canUndo
            ? `${theme.secondaryBtnClass} cursor-pointer active:scale-95`
            : 'border-white/5 bg-white/5 text-neutral-600 cursor-not-allowed'
        }`}
      >
        <Undo2 className="w-4 h-4" />
      </button>

      {/* Sound toggle button */}
      <button
        type="button"
        onClick={onToggleSound}
        title={soundEnabled ? 'Mute sound' : 'Enable sound'}
        aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
        className={`flex items-center justify-center p-2.5 rounded-xl font-medium text-sm transition-all border cursor-pointer active:scale-95 ${theme.secondaryBtnClass}`}
      >
        {soundEnabled ? (
          <Volume2 className="w-4 h-4 text-cyan-400" />
        ) : (
          <VolumeX className="w-4 h-4 text-neutral-400" />
        )}
      </button>

      {/* Rules modal toggle */}
      <button
        type="button"
        onClick={onOpenRules}
        title="Game rules and tips"
        aria-label="Game rules and tips"
        className={`flex items-center justify-center p-2.5 rounded-xl font-medium text-sm transition-all border cursor-pointer active:scale-95 ${theme.secondaryBtnClass}`}
      >
        <HelpCircle className="w-4 h-4" />
      </button>

      {/* Settings modal toggle */}
      <button
        type="button"
        onClick={onOpenSettings}
        title="Game Settings"
        aria-label="Game Settings"
        className={`flex items-center justify-center p-2.5 rounded-xl font-medium text-sm transition-all border cursor-pointer active:scale-95 ${theme.secondaryBtnClass}`}
      >
        <Settings className="w-4 h-4" />
      </button>
    </div>
  );
};
