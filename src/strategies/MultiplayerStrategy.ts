import { Chess } from "chess.js";
import { GameCallbacks,IGameStrategy } from "./IGameStrategyState";
import { IMultiplayerBackend } from "../services/IMultiplayerBackend"; 

export class MultiplayerStrategy implements IGameStrategy {
    private game!: Chess;
    private callbacks!: GameCallbacks;
    private backend: IMultiplayerBackend; 
    
    private playerId: string;
    private roomId: string;
    private isHost: boolean;

    constructor(playerId: string, roomId: string, isHost: boolean, backend: IMultiplayerBackend) {
        this.playerId = playerId;
        this.roomId = roomId;
        this.isHost = isHost;
        this.backend = backend;
    }

    init(chessInstance: Chess, callbacks: GameCallbacks) {
        this.game = chessInstance;
        this.callbacks = callbacks;
        this.callbacks.onStateChange({ isWaiting: true, playerColor: null, opponentName: this.isHost ? "Waiting for Opponent..." : "Connecting..." });

        this.backend.connect(this.playerId, {
            onMatchStart: (color, opponentName) => {
                this.callbacks.onStateChange({ playerColor: color, isWaiting: false, opponentName: opponentName });
            },
            onOpponentMove: (moveSan) => {
                try {
                    this.game.move(moveSan);
                    this.callbacks.onBoardUpdate();
                    if (this.game.isGameOver()) this.callbacks.onGameOver("Game Over!");
                } catch (e) {}
            },
            onOpponentDisconnected: () => this.callbacks.onGameOver("Opponent left the game."),
            onGameOverSync: (msg) => this.callbacks.onGameOver(msg)
        });

        this.backend.joinRoom(this.roomId, this.isHost);
    }

    onPlayerMove(moveSan: string) {
        this.backend.sendMove(this.roomId, moveSan);
    }

    onResign() {
        this.backend.sendGameOver(this.roomId, 'resigned');
    }

    destroy() {
        this.backend.disconnect();
    }
}