import { useGameStore } from "../hooks/useGameStore";

export default function EndScreen() {
  const score = useGameStore((s) => s.score);
  const setScreen = useGameStore((s) => s.setScreen);

  return (
    <div>
      <h2>Конец</h2>
      <p>Счёт: {score}</p>
      <button onClick={() => setScreen('menu')}>Заново</button>
    </div>
  );
}

