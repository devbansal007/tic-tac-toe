import { ThemeId } from '../types/game';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  bgClass: string;
  cardClass: string;
  boardClass: string;
  cellClass: string;
  cellHoverClass: string;
  xColorClass: string;
  oColorClass: string;
  winLineClass: string;
  primaryBtnClass: string;
  secondaryBtnClass: string;
  badgeClass: string;
  textMutedClass: string;
  isLight: boolean;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  cyber: {
    id: 'cyber',
    name: 'Cyberpunk Neon',
    bgClass: 'bg-[#090d16] text-slate-100',
    cardClass: 'bg-[#111827]/80 backdrop-blur-md border border-cyan-500/20 shadow-[0_8px_30px_rgb(0,0,0,0.4)]',
    boardClass: 'bg-[#0e1626]/90 border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/20',
    cellClass: 'bg-[#162238]/70 border border-cyan-500/20 active:scale-[0.97]',
    cellHoverClass: 'hover:bg-[#1e2f4d]/90 hover:border-cyan-400/50',
    xColorClass: 'text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.7)]',
    oColorClass: 'text-pink-400 drop-shadow-[0_0_12px_rgba(244,114,182,0.7)]',
    winLineClass: 'bg-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.9)]',
    primaryBtnClass: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]',
    secondaryBtnClass: 'bg-[#1c2942] hover:bg-[#253658] text-slate-200 border border-cyan-500/30',
    badgeClass: 'border-cyan-500/30 text-cyan-300 bg-cyan-950/40',
    textMutedClass: 'text-slate-400',
    isLight: false,
  },
  slate: {
    id: 'slate',
    name: 'Obsidian Minimal',
    bgClass: 'bg-neutral-950 text-neutral-100',
    cardClass: 'bg-neutral-900/90 backdrop-blur-md border border-neutral-800 shadow-2xl',
    boardClass: 'bg-neutral-900 border border-neutral-800 shadow-2xl ring-1 ring-neutral-700/30',
    cellClass: 'bg-neutral-800/80 border border-neutral-700/60 active:scale-[0.97]',
    cellHoverClass: 'hover:bg-neutral-750 hover:border-neutral-500',
    xColorClass: 'text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]',
    oColorClass: 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]',
    winLineClass: 'bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.8)]',
    primaryBtnClass: 'bg-white hover:bg-neutral-200 text-neutral-950 shadow-md',
    secondaryBtnClass: 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700',
    badgeClass: 'border-neutral-700 text-neutral-300 bg-neutral-800/60',
    textMutedClass: 'text-neutral-400',
    isLight: false,
  },
  arcade: {
    id: 'arcade',
    name: 'Retro Arcade',
    bgClass: 'bg-[#130d21] text-purple-100',
    cardClass: 'bg-[#1e1433]/90 backdrop-blur-md border border-purple-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)]',
    boardClass: 'bg-[#1a102e] border border-purple-500/40 shadow-[0_0_40px_rgba(168,85,247,0.2)] ring-1 ring-purple-500/30',
    cellClass: 'bg-[#281b45]/80 border border-purple-700/40 active:scale-[0.97]',
    cellHoverClass: 'hover:bg-[#342359] hover:border-purple-400/60',
    xColorClass: 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.7)]',
    oColorClass: 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.7)]',
    winLineClass: 'bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.9)]',
    primaryBtnClass: 'bg-purple-500 hover:bg-purple-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]',
    secondaryBtnClass: 'bg-[#2b1c4a] hover:bg-[#382560] text-purple-200 border border-purple-500/30',
    badgeClass: 'border-purple-500/40 text-purple-300 bg-purple-950/50',
    textMutedClass: 'text-purple-300/70',
    isLight: false,
  },
  frost: {
    id: 'frost',
    name: 'Nordic Clean',
    bgClass: 'bg-slate-50 text-slate-900',
    cardClass: 'bg-white/90 backdrop-blur-md border border-slate-200 shadow-xl',
    boardClass: 'bg-white border border-slate-200 shadow-xl ring-1 ring-slate-100',
    cellClass: 'bg-slate-100/90 border border-slate-200/90 active:scale-[0.97]',
    cellHoverClass: 'hover:bg-slate-200 hover:border-slate-300',
    xColorClass: 'text-indigo-600',
    oColorClass: 'text-rose-600',
    winLineClass: 'bg-indigo-600 shadow-md',
    primaryBtnClass: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md',
    secondaryBtnClass: 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 shadow-sm',
    badgeClass: 'border-slate-300 text-slate-700 bg-slate-100',
    textMutedClass: 'text-slate-500',
    isLight: true,
  },
};
