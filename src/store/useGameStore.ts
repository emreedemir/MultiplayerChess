import { create } from 'zustand';
import { Square, Move } from 'chess.js';
import { GameStrategyState } from '../strategies/IGameStrategyState';

const initialGameState: GameStrategyState = { playerColor: null, isWaiting: true, opponentName: "Waiting...", isOpponentThinking: false };
const INITIAL_TIME = 600;

interface GameStoreState {
    boardMatrix: any[][];
    selectedSquare: Square | null;
    validMoves: Move[];
    gameState: GameStrategyState;
    isGameOver: boolean;
    currentTurn: 'w' | 'b';
    inCheck: boolean; 
    lastMove: { from: Square, to: Square } | null;
    whiteTime: number;
    blackTime: number;
    pendingPromotion: { from: Square, to: Square } | null;
    capturedByWhite: string[];
    capturedByBlack: string[];
    materialScore: number;
    gameOverData: { visible: boolean, message: string } | null;

    setBoardMatrix: (matrix: any[][]) => void;
    setSelectedSquare: (square: Square | null) => void;
    setValidMoves: (moves: Move[]) => void;
    updateGameState: (state: Partial<GameStrategyState>) => void;
    setGameStatus: (isGameOver: boolean, turn: 'w' | 'b', inCheck: boolean) => void;
    setLastMove: (move: { from: Square, to: Square } | null) => void;
    decrementTime: (turn: 'w' | 'b') => void; 
    setPendingPromotion: (move: { from: Square, to: Square } | null) => void;
    setMaterialData: (capW: string[], capB: string[], score: number) => void;
    setGameOverData: (data: { visible: boolean, message: string } | null) => void;
    resetStore: () => void; 
}

export const useGameStore = create<GameStoreState>((set) => ({
    boardMatrix: [], selectedSquare: null, validMoves: [], gameState: initialGameState,
    isGameOver: false, currentTurn: 'w', inCheck: false, lastMove: null,
    whiteTime: INITIAL_TIME, blackTime: INITIAL_TIME, pendingPromotion: null,
    capturedByWhite: [], capturedByBlack: [], materialScore: 0, gameOverData: null,

    setBoardMatrix: (matrix) => set({ boardMatrix: matrix }),
    setSelectedSquare: (square) => set({ selectedSquare: square }),
    setValidMoves: (moves) => set({ validMoves: moves }),
    updateGameState: (state) => set((prev) => ({ gameState: { ...prev.gameState, ...state } })),
    setGameStatus: (isGameOver, turn, inCheck) => set({ isGameOver, currentTurn: turn, inCheck }),
    setLastMove: (move) => set({ lastMove: move }),
    decrementTime: (turn) => set((state) => {
        if (turn === 'w') return { whiteTime: Math.max(0, state.whiteTime - 1) };
        return { blackTime: Math.max(0, state.blackTime - 1) };
    }),
    setPendingPromotion: (move) => set({ pendingPromotion: move }),
    setMaterialData: (capturedByWhite, capturedByBlack, materialScore) => set({ capturedByWhite, capturedByBlack, materialScore }),
    setGameOverData: (data) => set({ gameOverData: data, isGameOver: true }),
    
    resetStore: () => set({ 
        boardMatrix: [], selectedSquare: null, validMoves: [], gameState: initialGameState, 
        isGameOver: false, currentTurn: 'w', inCheck: false, lastMove: null,
        whiteTime: INITIAL_TIME, blackTime: INITIAL_TIME, pendingPromotion: null,
        capturedByWhite: [], capturedByBlack: [], materialScore: 0, gameOverData: null
    }),
}));