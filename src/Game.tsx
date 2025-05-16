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
      {/* Тут игра */}
      <button onClick={finishGame}>Закончить игру</button>
    </div>
  );
}
