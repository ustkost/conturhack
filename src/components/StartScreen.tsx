import { useState } from "react";
import { useGameStore } from "../hooks/useGameStore";

export default function StartScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
	const [showHelp, setShowHelp] = useState(false);
	
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
					onClick={() => setShowHelp(true)}
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
			{showHelp && <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="relative bg-blue-900/95 p-8 rounded-lg border-4 border-yellow-400 w-full max-w-2xl animate-fade-in">
        <button
          onClick={() => setShowHelp(false)}
          className="absolute top-4 right-4 text-yellow-400 text-3xl hover:text-yellow-300"
        >
          ×
        </button>
        
        <h3 className="text-4xl text-yellow-400 mb-6 font-pacman text-center">
          Правила игры
        </h3>
        				<div>
				ATTENTION! Вы попали в мир программистов, и теперь ваша жизнь стала немного сложнее, будто маленькая черепашка в этом большом мире, на которую наваливаются баги и дедлайны. Помогите себе стать сильнее и справляться со всеми трудностями. Ловите бусты и сражайтесь против недосыпа и проблем вместе со знаниями.

Disclaimer:

    Остерегайтесь багов 🐞 и делайнов ❌, пока вы не получили достаточно знаний.
    У вас пошел таймер.
    Пока время буста не истекло, поймайте язык программирования, чтобы справиться с опасностями.
    А теперь - за работу в мир программистов!

				</div>
  
      </div>
    </div>}
  );
    </div>
  );
}

