import React, { useRef, useEffect, useState } from "react";
import { useGameStore, type Ghost } from "../hooks/useGameStore";

const CELL_SIZE = 24;
const ROWS = 15;
const COLS = 15;
const BERRY_TIMEOUT = 5000; // 5 секунд эффекта

// Генерация карты
const generateMap = (): string[][] => {
  let a = Array.from({ length: ROWS }, (_, i) =>
    Array.from({ length: COLS }, (_, j) => {
      if (i === 0 || j === 0 || i === ROWS - 1 || j === COLS - 1) return "W";
      return "E";
    })
  );
  a[5][5] = "W";
  a[5][6] = "W";
  a[5][7] = "W";
  a[5][9] = "W";
  a[5][10] = "W";
  a[5][11] = "W";
  return a;
};

const map = generateMap();

export const CanvasGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
	const {
		player,
    ghosts,
    berryPosition,
    setPlayer,
    setGhosts,
    setBerryPosition
  } = useGameStore();

  const directionRef = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });
	const [effectActive, setEffectActive] = useState(false);

  const generateBerryPosition = () => {
    const emptyCells: { x: number; y: number }[] = [];
    
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        if (
          map[i][j] === "E" &&
          !ghosts.some(g => g.x === i && g.y === j) &&
          (player.x !== i || player.y !== j)
        ) {
          emptyCells.push({ x: i, y: j });
        }
      }
    }
    
    if (emptyCells.length > 0) {
      const randomPos = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      setBerryPosition(randomPos);
    }
  };

  // ИИ для призраков
  const moveGhost = (ghost: Ghost): Ghost => {
    const directions = [];
    
    // Для трусливого призрака
    if (ghost.type === "SHY") {
      const dx = player.x - ghost.x;
      const dy = player.y - ghost.y;
      const avoidDirection = {
        dx: dx > 0 ? -1 : 1,
        dy: dy > 0 ? -1 : 1
      };
      directions.push(
        { dx: avoidDirection.dx, dy: 0 },
        { dx: 0, dy: avoidDirection.dy },
        { dx: 1, dy: 0 },
        { dx: -1, dy: 0 },
        { dx: 0, dy: 1 },
        { dx: 0, dy: -1 }
      );
    }
    // Для преследователя
    else if (ghost.type === "CHASER") {
      const dx = player.x - ghost.x;
      const dy = player.y - ghost.y;
      directions.push(
        { dx: Math.sign(dx), dy: 0 },
        { dx: 0, dy: Math.sign(dy) },
        { dx: 1, dy: 0 },
        { dx: -1, dy: 0 },
        { dx: 0, dy: 1 },
        { dx: 0, dy: -1 }
      );
    }
    // Для случайного
    else {
      directions.push(
        { dx: 1, dy: 0 },
        { dx: -1, dy: 0 },
        { dx: 0, dy: 1 },
        { dx: 0, dy: -1 }
      );
    }

    // Фильтрация возможных направлений
    const validDirections = directions.filter(({ dx, dy }) => {
      const newX = ghost.x + dx;
      const newY = ghost.y + dy;
      return (
        newX >= 0 &&
        newX < ROWS &&
        newY >= 0 &&
        newY < COLS &&
        map[newX][newY] !== "W"
      );
    });

    if (validDirections.length === 0) return ghost;
    
    // Выбор случайного направления из допустимых
    const { dx, dy } = validDirections[
      Math.floor(Math.random() * validDirections.length)
    ];
    
    return { ...ghost, x: ghost.x + dx, y: ghost.y + dy };
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let dx = 0,
        dy = 0;
      if (e.key === "ArrowUp" || e.key === "w") dx = -1;
      else if (e.key === "ArrowDown" || e.key === "s") dx = 1;
      else if (e.key === "ArrowLeft" || e.key === "a") dy = -1;
      else if (e.key === "ArrowRight" || e.key === "d") dy = 1;
      directionRef.current = { dx, dy };
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);


	// Инициализация призраков и ягодки
  useEffect(() => {
    setGhosts([
      { x: 1, y: 1, type: "CHASER", originalType: "CHASER" },
      { x: 1, y: COLS - 2, type: "CHASER", originalType: "CHASER" },
      { x: ROWS - 2, y: 1, type: "CHASER", originalType: "CHASER" },
      { x: ROWS - 2, y: COLS - 2, type: "CHASER", originalType: "CHASER" }
    ]);
    generateBerryPosition();
  }, []);

   // Остальной код без изменений, добавим отрисовку призраков
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Отрисовка карты
      for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
          ctx.fillStyle = map[i][j] === "W" ? "#1e40af" : "#000000";
          ctx.fillRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
      }

      // Игрок
      ctx.beginPath();
      ctx.fillStyle = "yellow";
      ctx.arc(
        player.y * CELL_SIZE + CELL_SIZE / 2,
        player.x * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE / 2.5,
        0,
        2 * Math.PI
      );
      ctx.fill();

      // Призраки
      ghosts.forEach((ghost) => {
        ctx.beginPath();
        ctx.fillStyle = ghost.type === "CHASER" 
          ? "red" 
          : ghost.type === "SHY" 
          ? "green" 
          : "pink";
        ctx.arc(
          ghost.y * CELL_SIZE + CELL_SIZE / 2,
          ghost.x * CELL_SIZE + CELL_SIZE / 2,
          CELL_SIZE / 2.5,
          0,
          2 * Math.PI
        );
        ctx.fill();
      });

			// Отрисовка ягодки
			if (berryPosition) {
				ctx.beginPath();
				ctx.fillStyle = effectActive ? "#FF69B4" : "#FF0000";
				ctx.arc(
					berryPosition.y * CELL_SIZE + CELL_SIZE / 2,
					berryPosition.x * CELL_SIZE + CELL_SIZE / 2,
					CELL_SIZE / 3,
					0,
					2 * Math.PI
				);
				ctx.fill();
			}
		};

    draw();
  }, [player, ghosts, berryPosition, effectActive]);

  // Добавим интервал для движения призраков
  useEffect(() => {
    const ghostInterval = setInterval(() => {
      setGhosts((prev) => prev.map(moveGhost));
    }, 500);

    return () => clearInterval(ghostInterval);
  }, [setGhosts]);

  // Логика движения игрока и подбора ягодки
  useEffect(() => {
    const interval = setInterval(() => {
      const { dx, dy } = directionRef.current;
      
      setPlayer((prev) => {
        const newX = prev.x + dx;
        const newY = prev.y + dy;
        
        // Проверка на подбор ягодки
        if (berryPosition && newX === berryPosition.x && newY === berryPosition.y) {
          setBerryPosition(null);
          setEffectActive(true);
          
          // Меняем тип призраков на SHY
          setGhosts(prevGhosts => 
            prevGhosts.map(g => ({
              ...g,
              type: "SHY"
            }))
          );
          
          // Возвращаем исходное состояние через таймаут
          setTimeout(() => {
            setGhosts(prevGhosts => 
              prevGhosts.map(g => ({
                ...g,
                type: g.originalType
              }))
            );
            setEffectActive(false);
            generateBerryPosition();
          }, BERRY_TIMEOUT);
        }

        // Проверка валидности движения
        if (
          newX >= 0 &&
          newX < ROWS &&
          newY >= 0 &&
          newY < COLS &&
          map[newX][newY] !== "W"
        ) {
          return { x: newX, y: newY };
        }
        return prev;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [berryPosition]);

	useEffect(() => {
		console.log("Berry position:", berryPosition);
	}, [berryPosition]);

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <canvas
        ref={canvasRef}
        width={COLS * CELL_SIZE}
        height={ROWS * CELL_SIZE}
        className="border-4 border-white"
      />
    </div>
  );
};
