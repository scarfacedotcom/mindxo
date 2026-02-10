import { useState, useEffect, useCallback } from 'react';
import { Player, Board } from '@/utils/game';

interface GameMove {
  position: number;
  player: 'X' | 'O';
  timestamp: number;
  address: string;
}

interface UseGameMovesProps {
  gameId: bigint;
  myAddress?: string;
  mySymbol: Player;
  enabled: boolean; // Only sync when game has started (player2 joined)
}

export function useGameMoves({ gameId, myAddress, mySymbol, enabled }: UseGameMovesProps) {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastMoveCount, setLastMoveCount] = useState(0);
  const [lastMoveTimestamp, setLastMoveTimestamp] = useState<number>(0);

  const gameIdStr = gameId.toString();
  const storageKey = `game_${gameIdStr}_moves`;

  // Load moves from localStorage on mount
  useEffect(() => {
    if (!enabled) return;
    
    try {
      const cached = localStorage.getItem(storageKey);
      if (cached) {
        const moves: GameMove[] = JSON.parse(cached);
        if (moves.length > 0) {
          const newBoard: Board = Array(9).fill(null);
          moves.forEach(move => {
            if (move.position >= 0 && move.position <= 8) {
              newBoard[move.position] = move.player;
            }
          });
          setBoard(newBoard);
          setCurrentPlayer(moves.length % 2 === 0 ? 'X' : 'O');
          setLastMoveCount(moves.length);
          setLastMoveTimestamp(moves[moves.length - 1].timestamp);
        }
      }
    } catch (error) {
      console.error('Error loading cached moves:', error);
    }
  }, [enabled, gameIdStr, storageKey]);

  // Fetch moves from API
  const fetchMoves = useCallback(async () => {
    if (!enabled) return;

    try {
      // Try to get cached moves for recovery
      let url = `/api/game/${gameIdStr}/moves`;
      const cached = localStorage.getItem(storageKey);
      
      // If we have cached data, send it for potential server recovery
      if (cached) {
        try {
          const cachedMoves = JSON.parse(cached);
          if (cachedMoves.length > 0) {
            url += `?recovery=${encodeURIComponent(cached)}`;
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.success && data.moves) {
        const moves: GameMove[] = data.moves;
        
        // Save to localStorage for persistence across refreshes
        try {
          localStorage.setItem(storageKey, JSON.stringify(moves));
        } catch (error) {
          console.error('Error caching moves:', error);
        }
        
        // Update state if move count changed OR timestamp is different
        const hasNewMoves = moves.length !== lastMoveCount;
        const latestTimestamp = moves.length > 0 ? moves[moves.length - 1].timestamp : 0;
        const hasNewTimestamp = latestTimestamp !== lastMoveTimestamp && latestTimestamp > 0;
        
        if (hasNewMoves || hasNewTimestamp) {
          // Build board from moves (skip position -1 which indicates timeout)
          const newBoard: Board = Array(9).fill(null);
          moves.forEach(move => {
            if (move.position >= 0 && move.position <= 8) {
              newBoard[move.position] = move.player;
            }
            // position -1 means turn was skipped due to timeout
          });

          setBoard(newBoard);
          setCurrentPlayer(moves.length % 2 === 0 ? 'X' : 'O');
          setLastMoveCount(moves.length);
          
          // Always update last move timestamp if available
          if (moves.length > 0) {
            setLastMoveTimestamp(moves[moves.length - 1].timestamp);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching moves:', error);
    }
  }, [enabled, gameIdStr, lastMoveCount, storageKey]);

  // Poll for updates every 2 seconds
  useEffect(() => {
    if (!enabled) {
      // Reset board when not enabled
      setBoard(Array(9).fill(null));
      setCurrentPlayer('X');
      setLastMoveCount(0);
      return;
    }

    // Initial fetch
    fetchMoves();

    // Poll every 2 seconds
    const interval = setInterval(fetchMoves, 2000);

    return () => clearInterval(interval);
  }, [enabled, fetchMoves]);

  // Submit a move
  const makeMove = useCallback(async (position: number): Promise<boolean> => {
    if (!enabled || !myAddress || isSubmitting) return false;

    // Check if position is empty
    if (board[position] !== null) return false;

    // Check if it's my turn
    if (currentPlayer !== mySymbol) return false;

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/game/${gameIdStr}/moves`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          position,
          player: mySymbol,
          address: myAddress,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Immediately update local state for better UX
        const newBoard = [...board];
        newBoard[position] = mySymbol;
        setBoard(newBoard);
        setCurrentPlayer(mySymbol === 'X' ? 'O' : 'X');
        setLastMoveCount(lastMoveCount + 1);
        
        // Update timestamp immediately to reset turn timer
        setLastMoveTimestamp(Date.now());
        
        // Fetch latest state to ensure sync
        setTimeout(fetchMoves, 200);
        
        return true;
      } else {
        console.error('Move rejected:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Error submitting move:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [enabled, myAddress, mySymbol, board, currentPlayer, gameIdStr, lastMoveCount, fetchMoves, isSubmitting]);

  // Skip turn due to timeout
  const skipTurn = useCallback(async (): Promise<boolean> => {
    if (!enabled) return false;

    try {
      const response = await fetch(`/api/game/${gameIdStr}/moves`, {
        method: 'PATCH',
      });

      const data = await response.json();

      if (data.success) {
        // Fetch latest state
        setTimeout(fetchMoves, 200);
        return true;
      } else {
        console.error('Skip turn rejected:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Error skipping turn:', error);
      return false;
    }
  }, [enabled, gameIdStr, fetchMoves]);
  
  return {
    board,
    currentPlayer,
    makeMove,
    isSubmitting,
    lastMoveTimestamp,
    skipTurn,
  };
}