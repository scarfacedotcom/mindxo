import { NextRequest, NextResponse } from 'next/server';

// Use global variable to persist across serverless function invocations
// This provides better persistence than a regular Map in serverless environments
declare global {
  var gameMovesStore: Map<string, GameMove[]> | undefined;
}

// In-memory storage for game moves with global persistence
const gameMovesStore = global.gameMovesStore || new Map<string, GameMove[]>();

if (!global.gameMovesStore) {
  global.gameMovesStore = gameMovesStore;
}

interface GameMove {
  position: number;
  player: 'X' | 'O';
  timestamp: number;
  address: string;
}

// GET /api/game/[gameId]/moves - Fetch all moves for a game
export async function GET(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    const gameId = params.gameId;
    const moves = gameMovesStore.get(gameId) || [];
    
    // Check if client is providing cached moves for recovery
    const url = new URL(request.url);
    const recoveryData = url.searchParams.get('recovery');
    
    // If server lost state and client has cached data, restore it
    if (moves.length === 0 && recoveryData) {
      try {
        const cachedMoves: GameMove[] = JSON.parse(decodeURIComponent(recoveryData));
        if (Array.isArray(cachedMoves) && cachedMoves.length > 0) {
          gameMovesStore.set(gameId, cachedMoves);
          console.log(`Recovered ${cachedMoves.length} moves for game ${gameId} from client cache`);
          return NextResponse.json({ 
            success: true, 
            moves: cachedMoves,
            count: cachedMoves.length,
            recovered: true
          });
        }
      } catch (error) {
        console.error('Error recovering moves:', error);
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      moves,
      count: moves.length 
    });
  } catch (error) {
    console.error('Error fetching moves:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch moves' },
      { status: 500 }
    );
  }
}

// POST /api/game/[gameId]/moves - Submit a new move
export async function POST(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    const gameId = params.gameId;
    const body = await request.json();
    const { position, player, address } = body;

    // Validate input
    if (typeof position !== 'number' || position < 0 || position > 8) {
      return NextResponse.json(
        { success: false, error: 'Invalid position' },
        { status: 400 }
      );
    }

    if (player !== 'X' && player !== 'O') {
      return NextResponse.json(
        { success: false, error: 'Invalid player' },
        { status: 400 }
      );
    }

    if (!address || typeof address !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid address' },
        { status: 400 }
      );
    }

    // Get existing moves
    const moves = gameMovesStore.get(gameId) || [];

    // Check if position is already taken
    const positionTaken = moves.some(move => move.position === position);
    if (positionTaken) {
      return NextResponse.json(
        { success: false, error: 'Position already taken' },
        { status: 400 }
      );
    }

    // Validate turn order (X always goes first, then alternates)
    const expectedPlayer = moves.length % 2 === 0 ? 'X' : 'O';
    if (player !== expectedPlayer) {
      return NextResponse.json(
        { success: false, error: 'Not your turn' },
        { status: 400 }
      );
    }

    // Check turn timer (2 minutes = 120 seconds)
    if (moves.length > 0) {
      const lastMove = moves[moves.length - 1];
      const timeSinceLastMove = Date.now() - lastMove.timestamp;
      
      // If last player took more than 2 minutes, they forfeit their turn
      // This is just a warning - the frontend will handle the UI
      if (timeSinceLastMove > 120000) {
        console.log(`Warning: Previous player took ${Math.floor(timeSinceLastMove / 1000)}s for their turn`);
      }
    }

    // Add new move
    const newMove: GameMove = {
      position,
      player,
      timestamp: Date.now(),
      address: address.toLowerCase()
    };

    moves.push(newMove);
    gameMovesStore.set(gameId, moves);

    return NextResponse.json({ 
      success: true, 
      move: newMove,
      totalMoves: moves.length 
    });
  } catch (error) {
    console.error('Error submitting move:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit move' },
      { status: 500 }
    );
  }
}

// DELETE /api/game/[gameId]/moves - Reset game (optional, for testing)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    const gameId = params.gameId;
    gameMovesStore.delete(gameId);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Game moves reset' 
    });
  } catch (error) {
    console.error('Error resetting moves:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reset moves' },
      { status: 500 }
    );
  }
}

// PATCH /api/game/[gameId]/moves - Skip turn due to timeout
export async function PATCH(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    const gameId = params.gameId;
    const moves = gameMovesStore.get(gameId) || [];

    if (moves.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No moves to skip' },
        { status: 400 }
      );
    }

    const lastMove = moves[moves.length - 1];
    const timeSinceLastMove = Date.now() - lastMove.timestamp;

    // Log warning if being called before 2 minutes (but still allow it)
    if (timeSinceLastMove < 120000) {
      console.log(`Warning: Skip called after ${Math.floor(timeSinceLastMove / 1000)}s (less than 120s)`);
    }

    // Add a "skip" move with position -1 (invalid position to indicate skip)
    const expectedPlayer = moves.length % 2 === 0 ? 'X' : 'O';
    const skipMove: GameMove = {
      position: -1,
      player: expectedPlayer,
      timestamp: Date.now(),
      address: 'TIMEOUT_SKIP'
    };

    moves.push(skipMove);
    gameMovesStore.set(gameId, moves);

    return NextResponse.json({ 
      success: true, 
      message: 'Turn skipped due to timeout',
      skippedPlayer: expectedPlayer
    });
  } catch (error) {
    console.error('Error skipping turn:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to skip turn' },
      { status: 500 }
    );
  }
}
