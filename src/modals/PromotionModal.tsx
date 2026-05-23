import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';

interface PromotionModalProps {
    visible: boolean;
    color: 'w' | 'b';
    onSelect: (piece: 'q' | 'r' | 'b' | 'n') => void;
}

const PIECE_SYMBOLS = {
    w: { q: "♛\uFE0E", r: "♜\uFE0E", b: "♝\uFE0E", n: "♞\uFE0E" },
    b: { q: "♛\uFE0E", r: "♜\uFE0E", b: "♝\uFE0E", n: "♞\uFE0E" }
};

export default function PromotionModal({ visible, color, onSelect }: PromotionModalProps) {
    const pieces: ('q' | 'r' | 'b' | 'n')[] = ['q', 'r', 'b', 'n'];

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Choose Piece</Text>
                    <View style={styles.piecesRow}>
                        {pieces.map(p => (
                            <TouchableOpacity 
                                key={p} 
                                style={styles.pieceButton}
                                onPress={() => onSelect(p)}
                            >
                                <Text style={[styles.pieceText, color === 'w' && styles.whitePiece]}>
                                    {PIECE_SYMBOLS[color][p]}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
    container: { backgroundColor: '#2b2b2b', padding: 20, borderRadius: 15, alignItems: 'center', borderWidth: 2, borderColor: '#444' },
    title: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
    piecesRow: { flexDirection: 'row', gap: 15 },
    pieceButton: { backgroundColor: '#404040', padding: 10, borderRadius: 10, width: 60, height: 60, justifyContent: 'center', alignItems: 'center' },
    pieceText: { fontSize: 35, color: 'black' },
    whitePiece: { color: 'white', textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 1 }
});