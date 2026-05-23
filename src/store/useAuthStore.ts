import { create } from 'zustand';

interface AuthState {
    playerId: string;
    playerName: string;
    isAuthLoading: boolean;
    setAuth: (id: string, name: string) => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    playerId: "",
    playerName: "",
    isAuthLoading: true,
    
    setAuth: (id, name) => set({ playerId: id, playerName: name, isAuthLoading: false }),
    setLoading: (loading) => set({ isAuthLoading: loading }),
}));