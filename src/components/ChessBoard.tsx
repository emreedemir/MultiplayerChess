import React from "react";
import { View, StyleSheet } from "react-native";
import { Square, Move } from "chess.js";
import ChessSquare from "./ChessSquare";

interface ChessBoardProps {
    boardMatrix: any[][];
    selectedSquare: Square | null;
    validMoves: Move[];
    playerColor: 'w' | 'b' | null;
    inCheck: boolean;
    lastMove: { from: Square, to: Square } | null;
    onSquarePress: (square: Square) => void;
}

export default function ChessBoard({ 
    boardMatrix, selectedSquare, validMoves, 
    playerColor, inCheck, lastMove, onSquarePress 
}: ChessBoardProps) {
    
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const isBlack = playerColor === 'b';

    const renderBoard = () => {
        const rows = [];
        for (let i = 0; i < 8; i++) {
            const cols = [];
            for (let j = 0; j < 8; j++) {
                const visualRow = isBlack ? 7 - i : i;
                const visualCol = isBlack ? 7 - j : j;
                
                const piece = boardMatrix[visualRow][visualCol];
                const squareName = `${files[visualCol]}${8 - visualRow}` as Square;
                const isWhiteSquare = (visualRow + visualCol) % 2 === 0; 
                
                const isSelected = selectedSquare === squareName;
                const isValidMove = validMoves.some(m => m.to === squareName);
                const isAttackable = isValidMove && piece !== null; 
                const isLastMove = lastMove?.from === squareName || lastMove?.to === squareName;
                const isKingInCheck = inCheck && piece?.type === 'k' && piece?.color === (playerColor || 'w');

                cols.push(
                    <ChessSquare
                        key={squareName}
                        squareName={squareName}
                        piece={piece}
                        isWhiteSquare={isWhiteSquare}
                        isSelected={isSelected}
                        isValidMove={isValidMove}
                        isAttackable={isAttackable}
                        isLastMove={isLastMove}
                        isKingInCheck={isKingInCheck}
                        onPress={onSquarePress}
                    />
                );
            }
            rows.push(<View key={`row-${i}`} style={styles.row}>{cols}</View>);
        }
        return rows;
    };

    return <View style={styles.board}>{renderBoard()}</View>;
}

const styles = StyleSheet.create({
    board: { borderWidth: 2, borderColor: '#111', marginVertical: 10 },
    row: { flexDirection: 'row' }
});