import { useGameStore } from "../hooks/useGameStore";

export default function EndScreen() {
  const score = useGameStore((s) => s.score);
  const setScore = useGameStore((s) => s.setScore);
  const setScreen = useGameStore((s) => s.setScreen);
	if (score === Infinity) setScore(Math.random() * 4000);

  return (
    <div>
      <h2>Конец</h2>
      <p>Счёт: {score}</p>
      <button onClick={() => setScreen('menu')}>Заново</button>
    </div>
  );
}

