import { Chess } from "chess.js";

export interface GameStrategyState {
    playerColor: 'w' | 'b' | null;
    isWaiting: boolean;
    opponentName: string;
    isOpponentThinking: boolean;
}

export interface GameCallbacks {
    onBoardUpdate: () => void;
    onStateChange: (state: Partial<GameStrategyState>) => void;
    onGameOver: (message: string) => void;
}

export interface IGameStrategy {
    init(chessInstance: Chess, callbacks: GameCallbacks): void;
    onPlayerMove(moveSan: string): void;
    onResign(): void;
    destroy(): void;
}