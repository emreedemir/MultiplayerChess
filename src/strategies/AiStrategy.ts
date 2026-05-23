import { Chess } from "chess.js";
import { GameCallbacks,IGameStrategy } from "./IGameStrategyState";
import { getBestMove } from "../utils/aiBrain";

export class AiStrategy implements IGameStrategy {
    private game!: Chess;
    private callbacks!: GameCallbacks;
    private aiTimer: NodeJS.Timeout | null = null;

    init(chessInstance: Chess, callbacks: GameCallbacks) {
        this.game = chessInstance;
        this.callbacks = callbacks;
        
        this.callbacks.onStateChange({
            playerColor: 'w',
            isWaiting: false,
            opponentName: "🤖 AI",
            isOpponentThinking: false
        });
    }

    onPlayerMove(moveSan: string) {
        this.callbacks.onStateChange({ isOpponentThinking: true });

        this.aiTimer = setTimeout(() => {
            const bestMove = getBestMove(3, this.game, false);
            if (bestMove) {
                this.game.move(bestMove);
                this.callbacks.onBoardUpdate();
                
                if (this.game.isGameOver()) {
                    this.callbacks.onGameOver("Game Over!");
                }
            }
            this.callbacks.onStateChange({ isOpponentThinking: false });
        }, 1000);
    }

    onResign() {}

    destroy() {
        if (this.aiTimer) clearTimeout(this.aiTimer);
    }
}