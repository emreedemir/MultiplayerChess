import { useEffect, useRef } from "react";
import { Alert } from "react-native";
import { Chess, Square, Move } from "chess.js";
import * as Haptics from 'expo-haptics';

import { IGameStrategy } from "../strategies/IGameStrategyState";
import { useGameStore } from "../store/useGameStore";

const PIECE_VALUES: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
const STARTING_PIECES = { p: 8, n: 2, b: 2, r: 2, q: 1 };

export function useChessCore(strategy: IGameStrategy) {
    const game = useRef(new Chess()).current;
    
    const { 
        setBoardMatrix, setGameStatus, updateGameState, setSelectedSquare, setValidMoves, 
        resetStore, setLastMove, decrementTime, setPendingPromotion, setMaterialData, setGameOverData
    } = useGameStore(state => state);

    const calculateMaterial = () => {
        const board = game.board();
        const currentPieces = { w: { p:0, n:0, b:0, r:0, q:0 }, b: { p:0, n:0, b:0, r:0, q:0 } };
        
        board.forEach(row => row.forEach(piece => {
            if (piece) currentPieces[piece.color][piece.type as keyof typeof STARTING_PIECES]++;
        }));

        const capturedByWhite: string[] = [];
        const capturedByBlack: string[] = [];
        let score = 0;

        Object.keys(STARTING_PIECES).forEach(type => {
            const startAmount = STARTING_PIECES[type as keyof typeof STARTING_PIECES];
            
            const missingBlack = startAmount - currentPieces['b'][type as keyof typeof STARTING_PIECES];
            for(let i=0; i<missingBlack; i++) { capturedByWhite.push(type); score += PIECE_VALUES[type]; }
            
            const missingWhite = startAmount - currentPieces['w'][type as keyof typeof STARTING_PIECES];
            for(let i=0; i<missingWhite; i++) { capturedByBlack.push(type); score -= PIECE_VALUES[type]; }
        });

        setMaterialData(capturedByWhite, capturedByBlack, score);
    };

    const syncBoardState = () => {
        setBoardMatrix(game.board());
        setGameStatus(game.isGameOver(), game.turn(), game.inCheck());
        calculateMaterial();
    };

    useEffect(() => {
        const timerInterval = setInterval(() => {
            const state = useGameStore.getState();
            if (state.isGameOver || state.gameState.isWaiting) return;

            if (state.currentTurn === 'w' && state.whiteTime <= 1) {
                setGameOverData({ visible: true, message: "Time's Up! Black Wins!" });
                clearInterval(timerInterval);
            } else if (state.currentTurn === 'b' && state.blackTime <= 1) {
                setGameOverData({ visible: true, message: "Time's Up! White Wins!" });
                clearInterval(timerInterval);
            } else {
                decrementTime(state.currentTurn);
            }
        }, 1000);
        return () => clearInterval(timerInterval);
    }, []);

    useEffect(() => {
        syncBoardState();
        strategy.init(game, {
            onBoardUpdate: () => {
                syncBoardState();
                const history = game.history({ verbose: true });
                if (history.length > 0) {
                    const last = history[history.length - 1];
                    setLastMove({ from: last.from as Square, to: last.to as Square });
                    
                    if (last.captured) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                    else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
            },
            onStateChange: (newState) => updateGameState(newState),
            onGameOver: (msg) => setGameOverData({ visible: true, message: msg })
        });
        return () => { strategy.destroy(); resetStore(); };
    }, [strategy, game]); 

    const executeMove = (from: Square, to: Square, promotionPiece?: 'q'|'r'|'b'|'n') => {
        try {
            const moveResult = game.move({ from, to, promotion: promotionPiece || 'q' });
            if (moveResult) {
                strategy.onPlayerMove(moveResult.san);
                setSelectedSquare(null);
                setValidMoves([]);
                setLastMove({ from, to });
                setPendingPromotion(null);
                syncBoardState();
                
                if (moveResult.captured || game.inCheck()) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                
                if (game.isCheckmate()) setGameOverData({ visible: true, message: "Checkmate! You Win!" });
            }
        } catch (e) {}
    };

    const handleSquarePress = (square: Square) => {
        const { isGameOver, gameState, selectedSquare, validMoves, pendingPromotion } = useGameStore.getState();
        if (isGameOver || gameState.isWaiting || game.turn() !== gameState.playerColor || pendingPromotion) return;

        const piece = game.get(square);
        const moves = game.moves({ square, verbose: true }) as Move[];

        if (selectedSquare) {
            const move = validMoves.find(m => m.to === square);
            if (move) {
                const isPawn = game.get(selectedSquare)?.type === 'p';
                if (isPawn && (square.endsWith('8') || square.endsWith('1'))) {
                    setPendingPromotion({ from: selectedSquare, to: square });
                    return; 
                }
                executeMove(selectedSquare, square);
                return;
            }
        }

        if (piece && piece.color === gameState.playerColor) {
            setSelectedSquare(square);
            setValidMoves(moves);
        } else {
            setSelectedSquare(null);
            setValidMoves([]);
        }
    };

    const handleResign = () => {
        Alert.alert("Resign", "Are you sure you want to resign?", [
            { text: "Cancel", style: "cancel" },
            { 
                text: "Resign", 
                style: "destructive", 
                onPress: () => {
                    strategy.onResign();
                    setGameOverData({ visible: true, message: "You resigned. Opponent wins." });
                }
            }
        ]);
    };

    return { handleSquarePress, executeMove, handleResign };
}