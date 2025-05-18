import React, { useRef, useEffect, useState } from "react";
import { useGameStore, type Ghost } from "../hooks/useGameStore";

const CELL_SIZE = 30;
const ROWS = 29;
const COLS = 28;
const BERRY_TIMEOUT = 5000; // 5 секунд эффекта

// Генерация карты
// const generateMap = (): string[][] => {
//   let a = Array.from({ length: ROWS }, (_, i) =>
//     Array.from({ length: COLS }, (_, j) => {
//       if (i === 0 || j === 0 || i === ROWS - 1 || j === COLS - 1) return "W";
//       return "E";
//     })
//   );
//   a[5][5] = "W";
//   a[5][6] = "W";
//   a[5][7] = "W";
//   a[5][9] = "W";
//   a[5][10] = "W";
//   a[5][11] = "W";
//   return a;
// };
//
// const map = generateMap();

const map = [
            ['W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W'],
            ['W','N','N','N','N','N','N','N','N','N','N','N','N','W','W','N','N','N','N','N','N','N','N','N','N','N','N','W'],
            ['W','N','W','W','W','W','N','W','W','W','W','W','N','W','W','N','W','W','W','W','W','N','W','W','W','W','N','W'],
            ['W','N','W','W','W','W','N','W','W','W','W','W','N','W','W','N','W','W','W','W','W','N','W','W','W','W','N','W'],
            ['W','N','W','W','W','W','N','W','W','W','W','W','N','W','W','N','W','W','W','W','W','N','W','W','W','W','N','W'],
            ['W','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','W'],
            ['W','N','W','W','W','W','N','W','W','N','W','W','W','W','W','W','W','W','N','W','W','N','W','W','W','W','N','W'],
            ['W','N','W','W','W','W','N','W','W','N','W','W','W','W','W','W','W','W','N','W','W','N','W','W','W','W','N','W'],
            ['W','N','N','N','N','N','N','W','W','N','N','N','N','W','W','N','N','N','N','W','W','N','N','N','N','N','N','W'],
            ['W','W','W','W','W','W','N','W','W','W','W','W','N','W','W','N','W','W','W','W','W','N','W','W','W','W','W','W'],
            ['W','W','W','W','W','W','N','W','W','W','W','W','N','W','W','N','W','W','W','W','W','N','W','W','W','W','W','W'],
            ['W','W','W','W','W','W','N','W','W','N','N','N','N','N','N','N','N','N','N','W','W','N','W','W','W','W','W','W'],
            ['W','W','W','W','W','W','N','W','W','N','W','W','W','W','W','W','W','W','N','W','W','N','W','W','W','W','W','W'],
            ['W','N','N','N','N','N','N','N','N','N','W','W','W','W','W','W','W','W','N','N','N','N','N','N','N','N','N','W'],
            ['W','W','W','W','W','W','N','W','W','N','W','W','W','W','W','W','W','W','N','W','W','N','W','W','W','W','W','W'],
            ['W','W','W','W','W','W','N','W','W','N','N','N','N','N','N','N','N','N','N','W','W','N','W','W','W','W','W','W'],
            ['W','W','W','W','W','W','N','W','W','N','W','W','W','W','W','W','W','W','N','W','W','N','W','W','W','W','W','W'],
            ['W','W','W','W','W','W','N','W','W','N','W','W','W','W','W','W','W','W','N','W','W','N','W','W','W','W','W','W'],
            ['W','N','N','N','N','N','N','N','N','N','N','N','N','W','W','N','N','N','N','N','N','N','N','N','N','N','N','W'],
            ['W','N','W','W','W','W','N','W','W','W','W','W','N','W','W','N','W','W','W','W','W','N','W','W','W','W','N','W'],
            ['W','N','W','W','W','W','N','W','W','W','W','W','N','W','W','N','W','W','W','W','W','N','W','W','W','W','N','W'],
            ['W','N','N','N','W','W','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','W','W','N','N','N','W'],
            ['W','W','W','N','W','W','N','W','W','N','W','W','W','W','W','W','W','W','N','W','W','N','W','W','N','W','W','W'],
            ['W','W','W','N','W','W','N','W','W','N','W','W','W','W','W','W','W','W','N','W','W','N','W','W','N','W','W','W'],
            ['W','N','N','N','N','N','N','W','W','N','N','N','N','W','W','N','N','N','N','W','W','N','N','N','N','N','N','W'],
            ['W','N','W','W','W','W','W','W','W','W','W','W','N','W','W','N','W','W','W','W','W','W','W','W','W','W','N','W'],
            ['W','N','W','W','W','W','W','W','W','W','W','W','N','W','W','N','W','W','W','W','W','W','W','W','W','W','N','W'],
            ['W','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','W'],
            ['W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W'],
        ];

export const CanvasGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
	const {
		player,
    ghosts,
    berryPosition,
    setPlayer,
    setGhosts,
    setBerryPosition,
		setScreen
  } = useGameStore();

  const directionRef = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });
	const [effectActive, setEffectActive] = useState(false);
	const [isInitialized, setIsInitialized] = useState(false);

  const [logs, setLogs] = useState<string[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    setLogs(prev => {
      const next = [...prev, msg];
      return next.slice(-15); // Ограничим последние 30 сообщений
    });
	}

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
      if (e.key === "ArrowUp" || e.key === "w") {
				addLog("turtle.up()")
				dx = -1;
			}
      else if (e.key === "ArrowDown" || e.key === "s") {
				addLog("turtle.down()")
				dx = 1;
			}
      else if (e.key === "ArrowLeft" || e.key === "a") {
				addLog("turtle.left()")
				dy = -1;
			}
      else if (e.key === "ArrowRight" || e.key === "d") {
				addLog("turtle.right()")
				dy = 1;
			}
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
		setIsInitialized(true);
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
				ctx.fillStyle = "blue";
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
					addLog("berry.eat()")
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
						addLog("berry.spawn(random())")
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
		for (const g of ghosts) {
			if (g.x == player.x && g.y == player.y) {
				if (effectActive) {
					addLog("turtle.eat(ghost)")
					setGhosts(prev => prev.filter(ghost => ghost !== g));
				} else {
					addLog("ghost.eat(turtle) turtle.respawn()")
					// Респавн игрока
					setPlayer({ x: 11, y: 13 });
					// Сброс направления движения
					directionRef.current = { dx: 0, dy: 0 };

					setGhosts(prev => 
						prev.map(ghost => ({
							...ghost,
							x: [1, 1, ROWS-2, ROWS-2][prev.indexOf(ghost)],
							y: [1, COLS-2, 1, COLS-2][prev.indexOf(ghost)],
							type: ghost.originalType
						}))
					);
				}
			}
		}
	}, [player, ghosts]);

	useEffect(() => {
		if (isInitialized && ghosts.length == 0) {
			setScreen("result")
		}
	}, [ghosts, isInitialized])

  return (
		<div className="flex flex-col w-full h-screen p-4 bg-gray-900 text-white mx-auto">
			<div className="text-7xl text-center">
				PAC-PYTURTLE
			</div>
			<div className="flex justify-center">
      <canvas
        ref={canvasRef}
        width={COLS * CELL_SIZE}
        height={ROWS * CELL_SIZE}
        className="border border-white"
      />
      <div className="ml-4 flex flex-col w-1/3 border-4 border-blue-600 rounded p-4 overflow-y-auto max-h-full">
        <div className="flex flex-col space-y-1 text-sm">
          {logs.map((log, i) => (
            <div key={i} className="text-5xl">
              - {log}
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      </div>
			</div>
			{/* Управление кнопками */}
			<div className="mt-4 flex justify-center items-center text-6xl">
				
				<button
					onClick={() => {
						directionRef.current = {dx: 0, dy: -1}
						addLog("turtle.left()")
					}}
					className="border-4 border-blue-600 p-6"
				>
					turtle.left()
				</button>
				<button onClick={() => {
						directionRef.current = { dx: -1, dy: 0 };
						addLog("turtle.up()")
					}}
					className="border-4 border-blue-600 p-6 ml-4"
				>
					turtle.up()
				</button>
				<button
					onClick={() => {
						directionRef.current = {dx: 1, dy: 0}
						addLog("turtle.down()")
					}}
					className="border-4 border-blue-600 p-6 ml-4"
				>
					turtle.down()
				</button>
				<button
					onClick={() => {
						directionRef.current = {dx: 0, dy: 1}
						addLog("turtle.right()")
					}}
					className="border-4 border-blue-600 p-6 ml-4"
				>
					turtle.right()
				</button>
			</div>
    </div>
   );
};
