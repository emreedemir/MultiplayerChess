import { useState } from "react";
import { View, Text, Modal, StyleSheet, TouchableOpacity } from "react-native";

interface PlayWithAiProps {
    visible: boolean;
    onClose: () => void;
    onStart: (color: string) => void;
}

export default function PlayWithAiModal({ visible, onClose, onStart }: PlayWithAiProps) {
    const [playerPieceColor, setPlayerPieceColor] = useState<"white" | "black">("white");

    const getPlayerPieceType = () => playerPieceColor === "white" ? "♔" : "♚";
    const getAiPieceType = () => playerPieceColor === "white" ? "♚" : "♔";

    const handlePressedPlayerPieceType = () => {
        setPlayerPieceColor(prev => prev === "white" ? "black" : "white");
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.centered}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Play With AI</Text>
                    </View>
                    <Text style={styles.contentText}>Choose Your Piece Color</Text>
                    <View style={styles.subSection}>
                        <View style={styles.playerContainer}>
                            <Text style={styles.playerLabelText}>You</Text>
                            <TouchableOpacity
                                style={[styles.pieceStyle, styles.playerPieceStyle]}
                                onPress={handlePressedPlayerPieceType}
                            >
                                <Text style={styles.pieceText}>{getPlayerPieceType()}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.playerContainer}>
                            <Text style={styles.playerLabelText}>AI</Text>
                            <View style={[styles.pieceStyle, styles.aiPieceStyle]}>
                                <Text style={styles.pieceText}>{getAiPieceType()}</Text>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.startGameButton} onPress={() => onStart(playerPieceColor)}>
                        <Text style={styles.startGameText}>Start Game</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.8)", justifyContent: "center", alignItems: "center" },
    centered: { backgroundColor: "white", width: 320, borderRadius: 20, padding: 20 },
    header: { alignItems: "center", marginBottom: 10 },
    headerText: { fontSize: 24, fontWeight: "800", color: "black" },
    contentText: { textAlign: "center", color: "black", marginBottom: 25 },
    subSection: { flexDirection: "row", justifyContent: "space-around", marginBottom: 30 },
    playerContainer: { alignItems: "center" },
    playerLabelText: { fontSize: 18, fontWeight: "700", color: "white", marginBottom: 10 },
    pieceStyle: { width: 70, height: 70, borderRadius: 35, justifyContent: "center", alignItems: "center" },
    playerPieceStyle: { backgroundColor: "#4caf50" },
    aiPieceStyle: { backgroundColor: "#e53935" },
    pieceText: { fontSize: 40 },
    startGameButton: { backgroundColor: "black", borderRadius: 12, paddingVertical: 12, alignItems: "center", marginBottom: 15 },
    startGameText: { color: "white", fontSize: 16, fontWeight: "700" },
    closeText: { textAlign: "center", color: "black", fontSize: 16 },
    closeButton:{
        borderWidth:0.2,
        borderRadius:10,
        width:100,
        alignSelf:'center',
        height:30,
        alignItems:'center',
        justifyContent:'center',
        margin:10

    }
});