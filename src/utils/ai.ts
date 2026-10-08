import { CellValue, Player, GridSize, WinInfo, AIDifficulty } from '../types/game';

export function getTargetStreak(gridSize: GridSize): number {
  if (gridSize === 3) return 3;
  if (gridSize === 4) return 4;
  return 4; // 4 in a row for 5x5 grid ensures high tempo and avoids endless ties
}

/**
 * Precomputes all winning line combinations for a given grid size and win target
 */
export function getWinningLines(gridSize: GridSize): { line: number[]; direction: WinInfo['direction'] }[] {
  const target = getTargetStreak(gridSize);
  const lines: { line: number[]; direction: WinInfo['direction'] }[] = [];

  // Rows
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c <= gridSize - target; c++) {
      const line: number[] = [];
      for (let k = 0; k < target; k++) {
        line.push(r * gridSize + (c + k));
      }
      lines.push({ line, direction: 'horizontal' });
    }
  }

  // Columns
  for (let c = 0; c < gridSize; c++) {
    for (let r = 0; r <= gridSize - target; r++) {
      const line: number[] = [];
      for (let k = 0; k < target; k++) {
        line.push((r + k) * gridSize + c);
      }
      lines.push({ line, direction: 'vertical' });
    }
  }

  // Main Diagonals (\)
  for (let r = 0; r <= gridSize - target; r++) {
    for (let c = 0; c <= gridSize - target; c++) {
      const line: number[] = [];
      for (let k = 0; k < target; k++) {
        line.push((r + k) * gridSize + (c + k));
      }
      lines.push({ line, direction: 'diagonal-main' });
    }
  }

  // Anti Diagonals (/)
  for (let r = 0; r <= gridSize - target; r++) {
    for (let c = target - 1; c < gridSize; c++) {
      const line: number[] = [];
      for (let k = 0; k < target; k++) {
        line.push((r + k) * gridSize + (c - k));
      }
      lines.push({ line, direction: 'diagonal-anti' });
    }
  }

  return lines;
}

// Cache winning lines for each grid size
const WIN_LINES_CACHE: Record<GridSize, ReturnType<typeof getWinningLines>> = {
  3: getWinningLines(3),
  4: getWinningLines(4),
  5: getWinningLines(5),
};

export function checkWin(board: CellValue[], gridSize: GridSize): WinInfo | null {
  const lines = WIN_LINES_CACHE[gridSize];
  for (const { line, direction } of lines) {
    const first = board[line[0]];
    if (!first) continue;
    let match = true;
    for (let i = 1; i < line.length; i++) {
      if (board[line[i]] !== first) {
        match = false;
        break;
      }
    }
    if (match) {
      return { winner: first, line, direction };
    }
  }
  return null;
}

export function checkDraw(board: CellValue[], winInfo: WinInfo | null): boolean {
  if (winInfo) return false;
  return board.every(cell => cell !== null);
}

export function getAvailableMoves(board: CellValue[]): number[] {
  const moves: number[] = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) moves.push(i);
  }
  return moves;
}

/**
 * Minimax algorithm for 3x3 grid (optimal play)
 */
function minimax3x3(
  board: CellValue[],
  depth: number,
  isMaximizing: boolean,
  aiPlayer: Player,
  humanPlayer: Player,
  alpha: number,
  beta: number
): number {
  const win = checkWin(board, 3);
  if (win) {
    return win.winner === aiPlayer ? 10 - depth : depth - 10;
  }
  const available = getAvailableMoves(board);
  if (available.length === 0) return 0; // tie

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of available) {
      board[move] = aiPlayer;
      const evaluation = minimax3x3(board, depth + 1, false, aiPlayer, humanPlayer, alpha, beta);
      board[move] = null;
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of available) {
      board[move] = humanPlayer;
      const evaluation = minimax3x3(board, depth + 1, true, aiPlayer, humanPlayer, alpha, beta);
      board[move] = null;
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

/**
 * Heuristic evaluation for larger grids (4x4, 5x5)
 */
function evaluateBoard(board: CellValue[], gridSize: GridSize, aiPlayer: Player, humanPlayer: Player): number {
  const lines = WIN_LINES_CACHE[gridSize];
  let score = 0;

  for (const { line } of lines) {
    let aiCount = 0;
    let humanCount = 0;
    for (const idx of line) {
      if (board[idx] === aiPlayer) aiCount++;
      else if (board[idx] === humanPlayer) humanCount++;
    }

    if (aiCount > 0 && humanCount > 0) continue; // blocked line
    if (aiCount === 4) score += 1000;
    else if (aiCount === 3) score += 50;
    else if (aiCount === 2) score += 5;

    if (humanCount === 4) score -= 1000;
    else if (humanCount === 3) score -= 80;
    else if (humanCount === 2) score -= 10;
  }

  return score;
}

function minimaxDepthLimited(
  board: CellValue[],
  depth: number,
  maxDepth: number,
  isMaximizing: boolean,
  aiPlayer: Player,
  humanPlayer: Player,
  gridSize: GridSize,
  alpha: number,
  beta: number
): number {
  const win = checkWin(board, gridSize);
  if (win) {
    return win.winner === aiPlayer ? 10000 - depth : depth - 10000;
  }
  const available = getAvailableMoves(board);
  if (available.length === 0) return 0;
  if (depth >= maxDepth) {
    return evaluateBoard(board, gridSize, aiPlayer, humanPlayer);
  }

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of available) {
      board[move] = aiPlayer;
      const evaluation = minimaxDepthLimited(board, depth + 1, maxDepth, false, aiPlayer, humanPlayer, gridSize, alpha, beta);
      board[move] = null;
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of available) {
      board[move] = humanPlayer;
      const evaluation = minimaxDepthLimited(board, depth + 1, maxDepth, true, aiPlayer, humanPlayer, gridSize, alpha, beta);
      board[move] = null;
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

/**
 * Main AI decision engine
 */
export function getAIMove(
  board: CellValue[],
  gridSize: GridSize,
  difficulty: AIDifficulty,
  aiPlayer: Player
): number {
  const humanPlayer: Player = aiPlayer === 'X' ? 'O' : 'X';
  const available = getAvailableMoves(board);

  if (available.length === 0) return -1;

  // Easy: Mostly random, slight chance of picking winning move
  if (difficulty === 'easy') {
    if (Math.random() < 0.35) {
      // Check immediate win
      for (const move of available) {
        board[move] = aiPlayer;
        if (checkWin(board, gridSize)) {
          board[move] = null;
          return move;
        }
        board[move] = null;
      }
    }
    return available[Math.floor(Math.random() * available.length)];
  }

  // Medium: Always win or block immediate threat, otherwise center/corner or random
  if (difficulty === 'medium') {
    // 1. Instant win
    for (const move of available) {
      board[move] = aiPlayer;
      if (checkWin(board, gridSize)) {
        board[move] = null;
        return move;
      }
      board[move] = null;
    }
    // 2. Block instant human win
    for (const move of available) {
      board[move] = humanPlayer;
      if (checkWin(board, gridSize)) {
        board[move] = null;
        return move;
      }
      board[move] = null;
    }
    // 3. Take center if free (for 3x3)
    if (gridSize === 3 && board[4] === null && Math.random() < 0.8) {
      return 4;
    }
    // 4. Random from corners or available
    const corners = gridSize === 3 ? [0, 2, 6, 8].filter(c => board[c] === null) : [];
    if (corners.length > 0 && Math.random() < 0.6) {
      return corners[Math.floor(Math.random() * corners.length)];
    }
    return available[Math.floor(Math.random() * available.length)];
  }

  // Hard: Unbeatable Minimax for 3x3, Depth-limited Minimax for 4x4 and 5x5
  if (gridSize === 3) {
    // First move optimization for instant response
    if (available.length === 9) {
      // Start in center or corner
      const opening = [0, 2, 4, 6, 8];
      return opening[Math.floor(Math.random() * opening.length)];
    }

    let bestScore = -Infinity;
    let bestMoves: number[] = [];

    for (const move of available) {
      board[move] = aiPlayer;
      const score = minimax3x3(board, 0, false, aiPlayer, humanPlayer, -Infinity, Infinity);
      board[move] = null;

      if (score > bestScore) {
        bestScore = score;
        bestMoves = [move];
      } else if (score === bestScore) {
        bestMoves.push(move);
      }
    }

    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
  } else {
    // 4x4 or 5x5
    // Immediate win check
    for (const move of available) {
      board[move] = aiPlayer;
      if (checkWin(board, gridSize)) {
        board[move] = null;
        return move;
      }
      board[move] = null;
    }
    // Immediate block check
    for (const move of available) {
      board[move] = humanPlayer;
      if (checkWin(board, gridSize)) {
        board[move] = null;
        return move;
      }
      board[move] = null;
    }

    const maxDepth = gridSize === 4 ? 3 : 2;
    let bestScore = -Infinity;
    let bestMove = available[0];

    // Evaluate available moves, prioritizing moves near existing pieces
    const sortedMoves = [...available].sort((a, b) => {
      const aDist = Math.abs(Math.floor(a / gridSize) - Math.floor(gridSize / 2)) + Math.abs((a % gridSize) - Math.floor(gridSize / 2));
      const bDist = Math.abs(Math.floor(b / gridSize) - Math.floor(gridSize / 2)) + Math.abs((b % gridSize) - Math.floor(gridSize / 2));
      return aDist - bDist;
    });

    for (const move of sortedMoves) {
      board[move] = aiPlayer;
      const score = minimaxDepthLimited(board, 0, maxDepth, false, aiPlayer, humanPlayer, gridSize, -Infinity, Infinity);
      board[move] = null;

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  }
}
