export type Player = 'X' | 'O' | null;
export type Board = Player[];
export type GameMode = 'ai' | 'pvp';
export type AIDifficulty = 'easy' | 'medium' | 'hard';

export interface GameState {
  board: Board;
  currentPlayer: Player;
  winner: Player;
  winningLine: number[] | null;
  isDraw: boolean;
  mode: GameMode;
  difficulty: AIDifficulty;
}

export interface MatchmakingPlayer {
  address: string;
  username: string;
  wins: number;
  losses: number;
  isReady: boolean;
}

export interface LeaderboardEntry {
  address: string;
  username: string;
  wins: number;
  losses: number;
  winRate: number;
  rank: number;
}

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function checkWinner(board: Board): { winner: Player; winningLine: number[] | null } {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], winningLine: combination };
    }
  }
  return { winner: null, winningLine: null };
}

export function checkDraw(board: Board): boolean {
  return board.every((cell) => cell !== null) && !checkWinner(board).winner;
}

export function getAvailableMoves(board: Board): number[] {
  return board.map((cell, index) => (cell === null ? index : -1)).filter((i) => i !== -1);
}

function minimax(
  board: Board,
  depth: number,
  isMaximizing: boolean,
  alpha: number,
  beta: number,
  maxDepth: number
): number {
  const { winner } = checkWinner(board);
  
  if (winner === 'O') return 10 - depth;
  if (winner === 'X') return depth - 10;
  if (checkDraw(board) || depth >= maxDepth) return 0;

  const moves = getAvailableMoves(board);

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      board[move] = 'O';
      const evaluation = minimax(board, depth + 1, false, alpha, beta, maxDepth);
      board[move] = null;
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      board[move] = 'X';
      const evaluation = minimax(board, depth + 1, true, alpha, beta, maxDepth);
      board[move] = null;
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

export function getAIMove(board: Board, difficulty: AIDifficulty): number {
  const moves = getAvailableMoves(board);
  if (moves.length === 0) return -1;

  if (difficulty === 'easy') {
    // Random move
    return moves[Math.floor(Math.random() * moves.length)];
  }

  if (difficulty === 'medium') {
    // 50% optimal, 50% random
    if (Math.random() < 0.5) {
      return moves[Math.floor(Math.random() * moves.length)];
    }
  }

  // Hard mode: minimax with alpha-beta pruning
  const maxDepth = difficulty === 'hard' ? 9 : 5;
  let bestMove = moves[0];
  let bestValue = -Infinity;

  for (const move of moves) {
    board[move] = 'O';
    const moveValue = minimax(board, 0, false, -Infinity, Infinity, maxDepth);
    board[move] = null;

    if (moveValue > bestValue) {
      bestValue = moveValue;
      bestMove = move;
    }
  }

  return bestMove;
}

export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function calculateWinRate(wins: number, losses: number): number {
  const total = wins + losses;
  if (total === 0) return 0;
  return Math.round((wins / total) * 100);
}
