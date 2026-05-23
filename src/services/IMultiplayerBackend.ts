export interface BackendCallbacks {
    onMatchStart: (color: 'w' | 'b', opponentName: string) => void;
    onOpponentMove: (moveSan: string) => void;
    onOpponentDisconnected: () => void;
    onGameOverSync: (message: string) => void;
}

export interface IMultiplayerBackend {
    connect(playerId: string, callbacks: BackendCallbacks): void;
    joinRoom(roomId: string, isHost: boolean): void;
    sendMove(roomId: string, moveSan: string): void;
    sendGameOver(roomId: string, reason: string): void;
    disconnect(): void;
}