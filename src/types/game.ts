export type Player = 'X' | 'O';
export type CellValue = Player | null;

export type GameMode = 'ai' | 'pvp';
export type AIDifficulty = 'easy' | 'medium' | 'hard';
export type GridSize = 3 | 4 | 5;

export type ThemeId = 'cyber' | 'slate' | 'arcade' | 'frost';

export interface WinInfo {
  winner: Player;
  line: number[]; // cell indices
  direction: 'horizontal' | 'vertical' | 'diagonal-main' | 'diagonal-anti';
}

export interface MoveRecord {
  index: number;
  player: Player;
  grid: CellValue[];
}

export interface GameStats {
  xWins: number;
  oWins: number;
  draws: number;
  currentStreak: number;
  streakHolder: Player | null;
  totalGames: number;
}

export interface GameSettings {
  mode: GameMode;
  aiDifficulty: AIDifficulty;
  aiPlayer: Player; // which symbol AI plays
  gridSize: GridSize;
  soundEnabled: boolean;
  blitzSeconds: number; // 0 = disabled, 5, 10
  theme: ThemeId;
  playerXName: string;
  playerOName: string;
}
