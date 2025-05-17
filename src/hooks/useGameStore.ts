import { create } from 'zustand';

export type GameScreen = 'menu' | 'game' | 'result';

type Ghost = {
  x: number;
  y: number;
  type: "RANDOM" | "CHASER" | "SHY";
};

interface GameState {
  screen: GameScreen;
  score: number;
	player: { x: number, y: number }; // логическая позиция
	ghosts: Ghost[];
  setScreen: (screen: GameScreen) => void;
  setScore: (score: number) => void;
  setPlayer: (player: { x: number, y: number }) => void;
  setGhosts: (updater: Ghost[] | ((prev: Ghost[]) => Ghost[])) => void;
}

export const useGameStore = create<GameState>((set) => ({
  screen: 'menu',
  score: 0,
	player: { x: 7, y: 7 },
  ghosts: [],
  direction: null,
  setScreen: (screen) => set({ screen }),
  setScore: (score) => set({ score }),
  setPlayer: (player) => set({ player }),
  setGhosts: (updater) => 
    set((state) => ({
      ghosts: typeof updater === 'function' 
        ? updater(state.ghosts) 
        : updater
    })),
}));
