import { ref, set, update, onValue, off, get, onDisconnect } from 'firebase/database';
import { database } from './firebaseConfig';
import { IMultiplayerBackend, BackendCallbacks } from './IMultiplayerBackend';

export class FirebaseBackend implements IMultiplayerBackend {
    private playerId!: string;
    private callbacks!: BackendCallbacks;
    private roomId: string | null = null;
    private isHost: boolean = false;

    connect(playerId: string, callbacks: BackendCallbacks) {
        this.playerId = playerId;
        this.callbacks = callbacks;
    }

    async joinRoom(roomId: string, isHost: boolean) {
        this.roomId = roomId;
        this.isHost = isHost;
        const roomRef = ref(database, `rooms/${roomId}`);

        if (isHost) {
            await set(roomRef, {
                host: this.playerId,
                guest: null,
                status: 'waiting',
                lastMove: null,
                lastMoveBy: null,
                createdAt: Date.now()
            });
            onDisconnect(roomRef).remove();
        } else {
            const snapshot = await get(roomRef);
            if (snapshot.exists() && snapshot.val().status === 'waiting') {
                await update(roomRef, { guest: this.playerId, status: 'playing' });
            } else {
                this.callbacks.onOpponentDisconnected();
                return;
            }
        }
        this.listenToRoom();
    }

    sendMove(roomId: string, moveSan: string) {
        if (!roomId) return;
        update(ref(database, `rooms/${roomId}`), { lastMove: moveSan, lastMoveBy: this.playerId });
    }

    sendGameOver(roomId: string, reason: string) {
        if (!roomId) return;
        update(ref(database, `rooms/${roomId}`), { status: reason, endedBy: this.playerId });
    }

    disconnect() {
        if (this.roomId) {
            const roomRef = ref(database, `rooms/${this.roomId}`);
            off(roomRef);
        }
    }

    private listenToRoom() {
        if (!this.roomId) return;
        const roomRef = ref(database, `rooms/${this.roomId}`);
        let matchStarted = false;

        onValue(roomRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) return;

            if (data.status === 'playing' && !matchStarted) {
                matchStarted = true;
                this.callbacks.onMatchStart(this.isHost ? 'w' : 'b', this.isHost ? "Guest" : "Host");
            }

            if (data.status === 'playing' && data.lastMove && data.lastMoveBy !== this.playerId) {
                this.callbacks.onOpponentMove(data.lastMove);
            }

            if (data.status === 'resigned' && data.endedBy !== this.playerId) {
                this.callbacks.onGameOverSync("Opponent resigned. You win!");
            }

            if (data.status === 'finished' && data.endedBy !== this.playerId) {
                this.callbacks.onOpponentDisconnected();
            }
        });
    }
}