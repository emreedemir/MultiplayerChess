import { Chess } from "chess.js";

const pieceValues: Record<string, number> = {
    p: -10, n: -30, b: -30, r: -50, q: -90, k: -900,
    P: 10, N: 30, B: 30, R: 50, Q: 90, K: 900
};

function evaluateBoard(game: Chess): number {
    let totalEvaluation = 0;
    const board = game.board();

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const square = board[i][j];
            if (square) {
                const piece = square.color === 'w' ? square.type.toUpperCase() : square.type;
                totalEvaluation += pieceValues[piece] || 0;
            }
        }
    }
    return totalEvaluation;
}

function minimax(depth: number, game: Chess, alpha: number, beta: number, isMaximizingPlayer: boolean): number {
    if (depth === 0 || game.isGameOver()) {
        return evaluateBoard(game);
    }

    const moves = game.moves();

    if (isMaximizingPlayer) {
        let bestVal = -9999;
        for (let i = 0; i < moves.length; i++) {
            game.move(moves[i]);
            bestVal = Math.max(bestVal, minimax(depth - 1, game, alpha, beta, !isMaximizingPlayer));
            game.undo();
            alpha = Math.max(alpha, bestVal);
            if (beta <= alpha) break;
        }
        return bestVal;
    } else {
        let bestVal = 9999;
        for (let i = 0; i < moves.length; i++) {
            game.move(moves[i]);
            bestVal = Math.min(bestVal, minimax(depth - 1, game, alpha, beta, !isMaximizingPlayer));
            game.undo();
            beta = Math.min(beta, bestVal);
            if (beta <= alpha) break;
        }
        return bestVal;
    }
}

export function getBestMove(depth: number, game: Chess, isMaximizingPlayer: boolean): string | null {
    const moves = game.moves();
    if (moves.length === 0) return null;

    let bestMove = -9999;
    let bestMoveFound = moves[0];

    for (let i = 0; i < moves.length; i++) {
        const move = moves[i];
        game.move(move);
        const value = minimax(depth - 1, game, -10000, 10000, !isMaximizingPlayer);
        game.undo();

        // Siyah (AI) için en küçük değeri, Beyaz (AI) için en büyük değeri arıyoruz.
        // Bu kodda AI'ı siyah kabul ediyoruz (!isMaximizingPlayer = false) 
        // Yani Siyah en düşük skoru (negatif) arar.
        if (isMaximizingPlayer) {
             if (value >= bestMove) {
                bestMove = value;
                bestMoveFound = move;
            }
        } else {
            // Siyah oynuyorsa Minimizer'dır. 
            // Kodu basitleştirmek için root seviyesinde de aynı mantığı kurmalıyız.
            // Yukarıdaki bestMove başlangıcını bu duruma göre ayarlıyoruz.
             bestMoveFound = move; // İlk hamleyi varsayılan yap
             break; // Hata düzeltme: Aşağıdaki bloğa geçmek için burada döngüyü yeniden kurmalıyız.
        }
    }

    // Siyah (Minimizer) için doğru root mantığı:
    if (!isMaximizingPlayer) {
        let minBestMove = 9999;
        let minBestMoveFound = moves[0];
         for (let i = 0; i < moves.length; i++) {
            const move = moves[i];
            game.move(move);
            const value = minimax(depth - 1, game, -10000, 10000, true); // Bir sonraki tur beyazın (Maximizer)
            game.undo();

            if (value <= minBestMove) {
                minBestMove = value;
                minBestMoveFound = move;
            }
        }
        return minBestMoveFound;
    }

    return bestMoveFound;
}
