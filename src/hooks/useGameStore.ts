import { create } from 'zustand';

export type GameScreen = 'menu' | 'game' | 'result';

export type Ghost = {
  x: number;
  y: number;
  type: "CHASER" | "SHY";
  originalType: "CHASER" | "SHY";
};

interface GameState {
  screen: GameScreen;
  score: number;
	player: { x: number, y: number };
	ghosts: Ghost[];
  berryPosition: { x: number; y: number } | null;
  setScreen: (screen: GameScreen) => void;
  setScore: (score: number) => void;
  setPlayer: (updater: { x: number; y: number } | ((prev: { x: number; y: number }) => { x: number; y: number })) => void
  setGhosts: (updater: Ghost[] | ((prev: Ghost[]) => Ghost[])) => void;
	setBerryPosition: (position: { x: number; y: number } | null) => void;
}

export const useGameStore = create<GameState>((set) => ({
  screen: 'menu',
  score: 0,
	player: { x: 11, y: 13 },
  ghosts: [],
  direction: null,
	berryPosition: null,
  setScreen: (screen) => set({ screen }),
  setScore: (score) => set({ score }),
	setPlayer: (updater) => 
    set((state) => ({
      player: typeof updater === 'function' 
        ? updater(state.player) 
        : updater
    })),
  setGhosts: (updater) => 
    set((state) => ({
      ghosts: typeof updater === 'function' 
        ? updater(state.ghosts) 
        : updater
    })),
  setBerryPosition: (position) => 
    set({ berryPosition: position }),
}));
