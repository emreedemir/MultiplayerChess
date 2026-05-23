import React, { useMemo } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from "../types/navigation";
import ChessBoard from "../components/ChessBoard";
import PromotionModal from "../modals/PromotionModal";
import GameOverModal from "../modals/GameOverModal"; 
import { useChessCore } from "../hooks/useChessCore";
import { useGameStore } from "../store/useGameStore";
import { useAuthStore } from "../store/useAuthStore";
import { AiStrategy } from '../strategies/AiStrategy';
import { MultiplayerStrategy } from '../strategies/MultiplayerStrategy';
import { FirebaseBackend } from '../services/FirebaseBackend';

const TILE_SIZE = 40;
const PIECE_SYMBOLS: Record<string, string> = { p: "♟\uFE0E", r: "♜\uFE0E", n: "♞\uFE0E", b: "♝\uFE0E", q: "♛\uFE0E" };

const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
};

export default function GenericGameScreen() {
    const route = useRoute<RouteProp<RootStackParamList, 'GenericGameScreen'>>();
    const navigation = useNavigation();
    
    const { mode, roomId, isHost } = route.params;
    const playerId = useAuthStore(state => state.playerId);

    const strategy = useMemo(() => {
        if (mode === 'Solo') return new AiStrategy();
        return new MultiplayerStrategy(playerId, roomId!, isHost!, new FirebaseBackend());
    }, [mode, playerId, roomId, isHost]);

    const { handleSquarePress, executeMove, handleResign } = useChessCore(strategy);

    const { 
        boardMatrix, selectedSquare, validMoves, gameState, currentTurn, inCheck, lastMove, 
        isGameOver, whiteTime, blackTime, pendingPromotion, 
        capturedByWhite, capturedByBlack, materialScore, gameOverData 
    } = useGameStore();

    if (gameState.isWaiting) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#f6f669" />
                <Text style={styles.text}>{gameState.opponentName}</Text>
                <TouchableOpacity style={{alignSelf:'center' ,marginTop:100}} onPress={()=>navigation.goBack()}>
                    <Text style={{fontSize:20,fontWeight:'600',color:'white'}}>Quit</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const isWhite = gameState.playerColor === 'w';
    const myTime = isWhite ? whiteTime : blackTime;
    const opponentTime = isWhite ? blackTime : whiteTime;
    const opponentColor = isWhite ? 'b' : 'w';

    const myCaptured = isWhite ? capturedByWhite : capturedByBlack;
    const opponentCaptured = isWhite ? capturedByBlack : capturedByWhite;
    
    const myScoreAdvantage = isWhite ? materialScore : -materialScore;
    const oppScoreAdvantage = isWhite ? -materialScore : materialScore;

    return (
        <View style={styles.container}>
            
            <View style={styles.playerInfoContainer}>
                <View style={styles.infoLeft}>
                    <Text style={styles.playerName}>{gameState.opponentName}</Text>
                    
                    <View style={styles.capturedRow}>
                        {opponentCaptured.map((p, i) => <Text key={i} style={styles.capturedPiece}>{PIECE_SYMBOLS[p]}</Text>)}
                        {oppScoreAdvantage > 0 && <Text style={styles.scoreText}>+{oppScoreAdvantage}</Text>}
                    </View>
                </View>
                <View style={[styles.timerBox, currentTurn === opponentColor && !isGameOver && styles.activeTimer]}>
                    <Text style={styles.timerText}>{formatTime(opponentTime)}</Text>
                </View>
            </View>

            <ChessBoard 
                boardMatrix={boardMatrix} selectedSquare={selectedSquare} validMoves={validMoves}
                playerColor={gameState.playerColor} inCheck={inCheck} lastMove={lastMove}
                onSquarePress={handleSquarePress}
            />
            
            <View style={styles.playerInfoContainer}>
                <View style={styles.infoLeft}>
                    <Text style={styles.playerName}>👤 You ({isWhite ? 'White' : 'Black'})</Text>
                    
                    <View style={styles.capturedRow}>
                        {myCaptured.map((p, i) => <Text key={i} style={styles.capturedPiece}>{PIECE_SYMBOLS[p]}</Text>)}
                        {myScoreAdvantage > 0 && <Text style={styles.scoreText}>+{myScoreAdvantage}</Text>}
                    </View>
                </View>
                <View style={[styles.timerBox, currentTurn === gameState.playerColor && !isGameOver && styles.activeTimer]}>
                    <Text style={styles.timerText}>{formatTime(myTime)}</Text>
                </View>
            </View>

            <View style={styles.actionRow}>
                <TouchableOpacity style={styles.resignButton} onPress={handleResign} disabled={isGameOver}>
                    <Text style={styles.resignText}>🏳️ Resign</Text>
                </TouchableOpacity>
            </View>

            {pendingPromotion && gameState.playerColor && (
                <PromotionModal visible={!!pendingPromotion} color={gameState.playerColor} onSelect={(piece) => executeMove(pendingPromotion.from, pendingPromotion.to, piece)} />
            )}

            {gameOverData && (
                <GameOverModal visible={gameOverData.visible} message={gameOverData.message} onGoBack={() => navigation.goBack()} />
            )}
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#2b2b2b" },
    center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#2b2b2b" },
    text: { color: "white", fontSize: 18, fontWeight: "bold", marginTop: 10 },
    
    playerInfoContainer: { flexDirection: 'row', width: TILE_SIZE * 8, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15 },
    infoLeft: { flexDirection: 'column', alignItems: 'flex-start' },
    playerName: { color: 'white', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
    
    capturedRow: { flexDirection: 'row', alignItems: 'center', minHeight: 20 },
    capturedPiece: { color: 'gray', fontSize: 16, marginRight: 2 },
    scoreText: { color: '#a3a3a3', fontSize: 12, marginLeft: 5, fontWeight: 'bold' },
    
    timerBox: { backgroundColor: '#404040', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4, borderWidth: 2, borderColor: 'transparent' },
    activeTimer: { borderColor: '#f6f669', backgroundColor: '#505050' },
    timerText: { color: 'white', fontSize: 18, fontWeight: 'bold', fontVariant: ['tabular-nums'] },

    actionRow: { width: TILE_SIZE * 8, flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
    resignButton: { backgroundColor: '#4a1010', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8, borderWidth: 1, borderColor: '#ff4444' },
    resignText: { color: '#ff4444', fontWeight: 'bold', fontSize: 14 }
});