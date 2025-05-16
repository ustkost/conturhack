// store/gameStore.ts
import { create } from 'zustand';

type Position = { x: number; y: number };
type GameStatus = 'playing' | 'game-over' | 'won';

interface GameState {
  playerPos: Position;
  enemies: Position[];
  food: Position[];
  score: number;
  gameStatus: GameStatus;
  movePlayer: (direction: 'up' | 'down' | 'left' | 'right') => void;
  moveEnemies: () => void;
  checkCollisions: () => void;
  generateFood: () => void;
  resetGame: () => void;
}

const GRID_SIZE = 15;
const CELL_SIZE = 32;

export const useGameStore = create<GameState>((set, get) => ({
  playerPos: { x: 7, y: 7 },
  enemies: [{ x: 1, y: 1 }, { x: 13, y: 13 }],
  food: [],
  score: 0,
  gameStatus: 'playing',

  movePlayer: (direction) => {
    if (get().gameStatus !== 'playing') return;

    const newPos = { ...get().playerPos };
    switch (direction) {
      case 'up': newPos.y = Math.max(0, newPos.y - 1); break;
      case 'down': newPos.y = Math.min(GRID_SIZE - 1, newPos.y + 1); break;
      case 'left': newPos.x = Math.max(0, newPos.x - 1); break;
      case 'right': newPos.x = Math.min(GRID_SIZE - 1, newPos.x + 1); break;
    }
    
    set({ playerPos: newPos });
    get().checkCollisions();
  },

  moveEnemies: () => {
    const playerPos = get().playerPos;
    set(state => ({
      enemies: state.enemies.map(enemy => {
        const dx = playerPos.x - enemy.x;
        const dy = playerPos.y - enemy.y;
        
        return {
          x: enemy.x + Math.sign(dx),
          y: enemy.y + Math.sign(dy)
        };
      })
    }));
    get().checkCollisions();
  },

  checkCollisions: () => {
    const { playerPos, enemies, food } = get();
    
    // Check enemy collision
    if (enemies.some(e => e.x === playerPos.x && e.y === playerPos.y)) {
      set({ gameStatus: 'game-over' });
      return;
    }

    // Collect food
    const eatenFood = food.findIndex(f => f.x === playerPos.x && f.y === playerPos.y);
    if (eatenFood !== -1) {
      set(state => ({
        food: state.food.filter((_, i) => i !== eatenFood),
        score: state.score + 10
      }));
    }

    // Check win condition
    if (food.length === 0) {
      set({ gameStatus: 'won' });
    }
  },

  generateFood: () => {
    const newFood: Position[] = [];
    for (let i = 0; i < 10; i++) {
      newFood.push({
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      });
    }
    set({ food: newFood });
  },

  resetGame: () => {
    set({
      playerPos: { x: 7, y: 7 },
      enemies: [{ x: 1, y: 1 }, { x: 13, y: 13 }],
      score: 0,
      gameStatus: 'playing'
    });
    get().generateFood();
  }
}));
