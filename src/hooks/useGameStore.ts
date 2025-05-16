import { create } from 'zustand';

export type GameScreen = 'menu' | 'game' | 'result';

interface GameState {
  screen: GameScreen;
  score: number;
  setScreen: (screen: GameScreen) => void;
  setScore: (score: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  screen: 'menu',
  score: 0,
  setScreen: (screen) => set({ screen }),
  setScore: (score) => set({ score }),
}));
