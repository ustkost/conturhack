import { useGameStore } from "../hooks/useGameStore";
import { CanvasGame } from "./CanvasGame";

export default function Game() {
  const setScreen = useGameStore((s) => s.setScreen);
  const setScore = useGameStore((s) => s.setScore);

  const finishGame = () => {
    setScore(123);
    setScreen('result');
  };

  return (
    <div>
      <CanvasGame />
      <button onClick={finishGame}>Закончить игру</button>
    </div>
  );
}
