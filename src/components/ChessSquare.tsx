import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Square } from "chess.js";

const PIECE_SYMBOLS = {
    w: { p: "♟\uFE0E", r: "♜\uFE0E", n: "♞\uFE0E", b: "♝\uFE0E", q: "♛\uFE0E", k: "♚\uFE0E" },
    b: { p: "♟\uFE0E", r: "♜\uFE0E", n: "♞\uFE0E", b: "♝\uFE0E", q: "♛\uFE0E", k: "♚\uFE0E" }
};

interface ChessSquareProps {
    squareName: Square;
    piece: { type: string; color: 'w' | 'b' } | null;
    isWhiteSquare: boolean;
    isSelected: boolean;
    isValidMove: boolean;
    isAttackable: boolean;
    isLastMove: boolean;
    isKingInCheck: boolean;
    onPress: (square: Square) => void;
}

const TILE_SIZE = 40;

export default function ChessSquare({
    squareName, piece, isWhiteSquare, isSelected, 
    isValidMove, isAttackable, isLastMove, isKingInCheck, onPress
}: ChessSquareProps) {
    return (
        <View
            style={[
                styles.tile,
                isWhiteSquare ? styles.tileWhite : styles.tileBlack,
                isLastMove && styles.tileLastMove,
                isSelected && styles.tileSelected,
                isAttackable && styles.tileAttackable,
                isKingInCheck && styles.tileCheck
            ]}
        >
            <TouchableOpacity style={styles.touchable} onPress={() => onPress(squareName)}>
                {isValidMove && !isAttackable && <View style={styles.validMoveDot} />}
                {piece && (
                    <Text style={[
                        styles.pieceText,
                        { color: piece.color === 'w' ? '#ffffff' : '#000000' },
                        piece.color === 'w' && styles.whitePieceShadow
                    ]}>
                        {PIECE_SYMBOLS[piece.color][piece.type as keyof typeof PIECE_SYMBOLS['w']]}
                    </Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    tile: { width: TILE_SIZE, height: TILE_SIZE, position: 'relative' },
    tileWhite: { backgroundColor: '#eeeebd' },
    tileBlack: { backgroundColor: '#739552' },
    tileSelected: { backgroundColor: '#f6f669' },
    tileLastMove: { backgroundColor: 'rgba(246, 246, 105, 0.5)' },
    tileAttackable: { backgroundColor: '#ff5c5c' },
    tileCheck: { backgroundColor: 'red' },
    validMoveDot: { position: 'absolute', width: 12, height: 12, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 6, alignSelf: 'center', top: 14 },
    touchable: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    pieceText: { fontSize: 28, textAlign: 'center' },
    whitePieceShadow: { textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 1 }
});