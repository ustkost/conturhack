import { useGameStore } from "../hooks/useGameStore";

export default function StartScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
	
	return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center space-y-8 z-50">
      {/* Заголовок */}
      <div className="relative text-yellow-400 mb-12">
        <h1 className="text-8xl font-pacman tracking-wide animate-pulse">
          PAC-PYTURTLE
        </h1>
        <div className="absolute -bottom-6 right-0 left-0 flex justify-center">
          <div className="w-24 h-3 bg-yellow-400 animate-blink" />
        </div>
      </div>

      {/* Кнопки меню */}
      <div className="flex flex-col gap-6 w-80">
        <button
          onClick={() => setScreen("game")}
          className="pacman-btn animate-float"
        >
          ИГРАТЬ
        </button>
        <button
          className="pacman-btn animate-float-delayed"
        >
          ПОМОЩЬ
        </button>
      </div>

      {/* Анимационные точки */}
      <div className="absolute bottom-20 flex gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 bg-yellow-400 rounded-full animate-dots"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}

