import { FC } from 'react';
import { X, Trophy, Swords, Zap, Lightbulb } from 'lucide-react';
import { ThemeConfig } from '../utils/theme';

interface RulesModalProps {
  isOpen: boolean;
  theme: ThemeConfig;
  onClose: () => void;
}

export const RulesModal: FC<RulesModalProps> = ({ isOpen, theme, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md max-h-[85vh] overflow-y-auto rounded-3xl p-5 sm:p-6 shadow-2xl border ${
          theme.isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-neutral-900 border-neutral-700 text-neutral-100'
        }`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold">Rules & Strategy</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close rules"
            className="p-1.5 rounded-xl hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs leading-relaxed text-neutral-300">
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
            <Swords className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-white text-sm mb-0.5">Objective</h3>
              <p>
                Take turns placing marks. The first player to connect an unbroken line of marks horizontally, vertically, or diagonally wins the match!
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Grid Win Conditions
            </h3>
            <ul className="space-y-1.5 list-disc list-inside text-neutral-300 pl-1">
              <li><strong className="text-white">3×3 Classic:</strong> Connect 3 marks in a row.</li>
              <li><strong className="text-white">4×4 Tactical:</strong> Connect 4 marks in a row.</li>
              <li><strong className="text-white">5×5 Grand:</strong> Connect 4 marks in a row (tactical Gomoku style).</li>
            </ul>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
            <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-white text-sm mb-0.5">Blitz Turn Timer</h3>
              <p>
                When Blitz Mode is active (5s or 10s), make your move before the bar empties. If time runs out, your turn is forfeited and passed to the opponent!
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-cyan-950/30 border border-cyan-500/20">
            <Lightbulb className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-cyan-300 text-sm mb-0.5">Pro Strategy Tips</h3>
              <p>
                • In 3×3, seizing the center cell provides control over 4 potential winning lines.<br />
                • Corner squares create dangerous two-way "forks" that force opponents into impossible blocks.<br />
                • Against the Grandmaster AI, any mistake will be capitalized upon, but a perfect game will earn you a draw!
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-white/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className={`py-2 px-6 rounded-xl font-bold text-sm cursor-pointer ${theme.primaryBtnClass}`}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
