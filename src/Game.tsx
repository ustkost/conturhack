import { GameMap } from "./components/GameMap";
import { useGameStore } from "./hooks/useGameStore";

export default function Game() {
  const setScreen = useGameStore((s) => s.setScreen);
  const setScore = useGameStore((s) => s.setScore);

  const finishGame = () => {
    setScore(123);
    setScreen('result');
  };

  return (
    <div>
      <GameMap />
      <button onClick={finishGame}>Закончить игру</button>
    </div>
  );
}
