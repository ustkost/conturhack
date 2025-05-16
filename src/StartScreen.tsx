import { useGameStore } from "./hooks/useGameStore";

export default function StartScreen() {
  const setScreen = useGameStore((s) => s.setScreen);

  return (
    <div>
      <h1>Pacman IT</h1>
      <button onClick={() => setScreen('game')}>Начать игру</button>
    </div>
  );
}

