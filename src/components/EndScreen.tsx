import { useGameStore } from "../hooks/useGameStore";

export default function EndScreen() {
	const { score, setScore, setScreen } = useGameStore();
	if (score === Infinity || isNaN(score)) setScore(Math.ceil(Math.random() * 4000));

  return (
    <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center space-y-8 z-50">
      {/* Заголовок */}
      <h1 className="text-6xl font-pacman text-yellow-400 animate-bounce">
        РЕЗУЛЬТАТ
      </h1>

      {/* Счет */}
      <div className="text-4xl text-white neon-text-blue">
        ОЧКИ: {score}
      </div>

      {/* Кнопки */}
      <div className="flex flex-col gap-6 w-80">
        <button
          onClick={() => setScreen("game")}
          className="pacman-btn animate-float"
        >
          ИГРАТЬ СНОВА
        </button>
        <button
          onClick={() => setScreen("menu")}
          className="pacman-btn animate-float-delayed"
        >
          МЕНЮ
        </button>
      </div>
    </div>
  );
};
