import React, { useRef, useEffect, useState } from "react";
import { useGameStore, type Ghost } from "../hooks/useGameStore";
import playerSpriteSrc from "../assets/player.png";
import ghostSpriteSrc from "../assets/ghost.png";
import mapSpriteSrc from "../assets/map.png";
import pythonSpriteSrc from "../assets/python.png";
import cppSpriteSrc from "../assets/cpp.png";
import jsSpriteSrc from "../assets/js.png";

const ROWS = 28;
const COLS = 29;
const CELL_SIZE = Math.floor(Math.min(
  window.innerHeight * 0.8 / ROWS,
  window.innerWidth * 0.7 / COLS
));
const BERRY_TIMEOUT = 10000; // 10 секунд эффекта

const BERRY_SCORE = 500;
const GHOST_SCORE = 500;
const DEATH_SCORE = -1000;

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

const map = [ // 28x29
            ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'], // 1
            ['W', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'W', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'W'], // 2
            ['W', 'N', 'W', 'W', 'W', 'W', 'W', 'N', 'W', 'W', 'W', 'W', 'W', 'N', 'W', 'N', 'W', 'W', 'W', 'W', 'W', 'N', 'W', 'W', 'W', 'W', 'W', 'N', 'W'], // 3
            ['W', 'N', 'W', 'W', 'W', 'W', 'W', 'N', 'W', 'W', 'W', 'W', 'W', 'N', 'W', 'N', 'W', 'W', 'W', 'W', 'W', 'N', 'W', 'W', 'W', 'W', 'W', 'N', 'W'], // 4
            ['W', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'W'], // 5
            ['W', 'N', 'W', 'W', 'W', 'W', 'W', 'N', 'W', 'W', 'N', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'N', 'W', 'W', 'N', 'W', 'W', 'W', 'W', 'W', 'N', 'W'], // 6
            ['W', 'N', 'W', 'W', 'W', 'W', 'W', 'N', 'W', 'W', 'N', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'N', 'W', 'W', 'N', 'W', 'W', 'W', 'W', 'W', 'N', 'W'], // 7
            ['W', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'W', 'W', 'N', 'N', 'N', 'N', 'W', 'N', 'N', 'N', 'N', 'W', 'W', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'W'], // 8
            ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'N', 'W', 'W', 'W', 'W', 'N', 'W', 'W', 'W', 'N', 'W', 'W', 'W', 'W', 'N', 'W', 'W', 'W', 'W', 'W', 'W', 'W'], // 9
            ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'N', 'W', 'W', 'W', 'W', 'N', 'W', 'W', 'W', 'N', 'W', 'W', 'W', 'W', 'N', 'W', 'W', 'W', 'W', 'W', 'W', 'W'], // 10
            ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'N', 'W', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'W', 'N', 'W', 'W', 'W', 'W', 'W', 'W', 'W'], // 11
            ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'N', 'W', 'N', 'W', 'W', 'W', 'W', 'P', 'W', 'W', 'W', 'W', 'N', 'W', 'N', 'W', 'W', 'W', 'W', 'W', 'W', 'W'], // 12
            ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'N', 'W', 'N', 'W', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'W', 'N', 'W', 'N', 'W', 'W', 'W', 'W', 'W', 'W', 'W'], // 13
            ['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'W', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'W', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N'], // 15
            ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'N', 'W', 'N', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'N', 'W', 'N', 'W', 'W', 'W', 'W', 'W', 'W', 'W'], // 15
            ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'N', 'W', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'W', 'N', 'W', 'W', 'W', 'W', 'W', 'W', 'W'], // 16
            ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'N', 'W', 'N', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'N', 'W', 'N', 'W', 'W', 'W', 'W', 'W', 'W', 'W'], // 17
            ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'N', 'W', 'N', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'N', 'W', 'N', 'W', 'W', 'W', 'W', 'W', 'W', 'W'], // 15
            ['W', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'W', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'W'], // 2
            ['W', 'N', 'W', 'W', 'W', 'W', 'W', 'N', 'W', 'W', 'W', 'W', 'W', 'N', 'W', 'N', 'W', 'W', 'W', 'W', 'W', 'N', 'W', 'W', 'W', 'W', 'W', 'N', 'W'], // 4
            ['W', 'N', 'W', 'W', 'W', 'W', 'W', 'N', 'W', 'W', 'W', 'W', 'W', 'N', 'W', 'N', 'W', 'W', 'W', 'W', 'W', 'N', 'W', 'W', 'W', 'W', 'W', 'N', 'W'], // 3
            ['W', 'N', 'N', 'N', 'W', 'W', 'W', "N', 'N', 'N', 'N', 'N", 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'W', 'W', 'W'],
            ['W', 'W', 'W', 'N', 'W', 'W', 'W', 'N', 'W', 'N', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'N', 'W', 'N', 'W', 'W', 'W', 'N', 'W', 'W', 'W'], // 3
            ['W', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'W', 'N', 'N', 'N', 'N', 'W', 'W', 'W', 'N', 'N', 'N', 'N', 'W', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'W'], // 2
            ['W', 'N', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'N', 'W', 'W', 'W', 'N', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'N', 'W'], // 2
            ['W', 'N', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'N', 'W', 'W', 'W', 'N', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'N', 'W'], // 2
            ['W', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'W'], // 2
            ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'], // 1
];
const techInfo: Record<string, any> = {
  python: {
    name: "Python",
    description: "Вы находите Python! Это высокоуровневый язык с динамической типизацией. Широко используется в вебе, Data Science и AI.",
    logo: pythonSpriteSrc, // Используем существующий импорт
    color: "from-blue-800 to-blue-600"
  },
  js: {
    name: "JavaScript",
    description: "Вы находите JavaScript! Это язык для интерактивных веб-страниц. Основа фронтенда и серверный (Node.js).",
    logo: jsSpriteSrc,
    color: "from-yellow-800 to-yellow-600"
  },
  cpp: {
    name: "C++",
    description: "Вы находите C++! Это компилируемый язык общего назначения. Используется в играх и системном программировании.",
    logo: cppSpriteSrc,
    color: "from-pink-800 to-pink-600"
  },
};

export const CanvasGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
	const {
		player,
    ghosts,
    berryPosition,
		score,
    setPlayer,
    setGhosts,
    setBerryPosition,
		setScreen,
		setScore
  } = useGameStore();

  const directionRef = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });
	const [effectActive, setEffectActive] = useState(false);
	const [isInitialized, setIsInitialized] = useState(false);

  const [logs, setLogs] = useState<string[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

	const [playerImage, setPlayerImage] = useState<HTMLImageElement | null>(null);
	const [ghostImage, setGhostImage] = useState<HTMLImageElement | null>(null);
	const [mapImage, setMapImage] = useState<HTMLImageElement | null>(null);
	const [pythonImage, setPythonImage] = useState<HTMLImageElement | null>(null);
	const [jsImage, setJsImage] = useState<HTMLImageElement | null>(null);
	const [cppImage, setCppImage] = useState<HTMLImageElement | null>(null);
	
	const [berryTech, setBerryTech] = useState<string>("");

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [time, setTime] = useState(0);

	const [angle, setAngle] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			if(!isPaused && isInitialized) {
				setTime(prev => prev + 1);
			}
		}, 1000);
		return () => clearInterval(interval);
	}, [isPaused, isInitialized])

	useEffect(() => {
		const pImg = new Image();
		pImg.src = playerSpriteSrc;
		pImg.onload = () => setPlayerImage(pImg);

		const gImg = new Image();
		gImg.src = ghostSpriteSrc;
		gImg.onload = () => setGhostImage(gImg);
		
		const mImg = new Image();
		mImg.src = mapSpriteSrc;
		mImg.onload = () => setMapImage(mImg);

		const pyImg = new Image();
		pyImg.src = pythonSpriteSrc;
		pyImg.onload = () => setPythonImage(pyImg);
		
		
		const jsImg = new Image();
		jsImg.src = jsSpriteSrc;
		jsImg.onload = () => setJsImage(jsImg);
		
		const cppImg = new Image();
		cppImg.src = cppSpriteSrc;
		cppImg.onload = () => setCppImage(cppImg);
	}, []);

  const addLog = (msg: string) => {
		if (logs[logs.length - 1] != msg) {
			setLogs(prev => {
				const next = [...prev, msg];
				return next.slice(-20);
			});
		}
	}

  const generateBerryPosition = () => {
    const emptyCells: { x: number; y: number }[] = [];
    
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        if (
          map[i][j] === "N" &&
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
		const a = Math.random();
		if (a < 0.33) {
			setBerryTech("python");
		} else if (a < 0.66) {
			setBerryTech("js");
		} else {
			setBerryTech("cpp");
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
        map[newX][newY] !== "W" && map[newX][newY] !== "P"
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
		if (isPaused) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      let dx = 0,
        dy = 0;
      if (e.key === "ArrowUp" || e.key === "w") {
				addLog("turtle.up()")
				setAngle(0);
				dx = -1;
			}
      else if (e.key === "ArrowDown" || e.key === "s") {
				addLog("turtle.down()")
				setAngle(Math.PI);
				dx = 1;
			}
      else if (e.key === "ArrowLeft" || e.key === "a") {
				addLog("turtle.left()")
				setAngle(3 * Math.PI / 2);
				dy = -1;
			}
      else if (e.key === "ArrowRight" || e.key === "d") {
				addLog("turtle.right()")
				setAngle(Math.PI / 2);
				dy = 1;
			}
      directionRef.current = { dx, dy };
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPaused]);


	// Инициализация призраков и ягодки
  useEffect(() => {
    setGhosts([
      { x: 1, y: 1, type: "CHASER", originalType: "CHASER" },
      { x: 1, y: COLS - 2, type: "CHASER", originalType: "CHASER" },
      { x: ROWS - 2, y: 1, type: "CHASER", originalType: "CHASER" },
      { x: ROWS - 2, y: COLS - 2, type: "CHASER", originalType: "CHASER" },
      { x: ROWS - 4, y: COLS - 4, type: "CHASER", originalType: "CHASER" },
      { x: 2, y: COLS - 6, type: "CHASER", originalType: "CHASER" }
    ]);
    generateBerryPosition();
		setIsInitialized(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      
			if (mapImage) {
				ctx.drawImage(
					mapImage,
					0,
					0,
					canvas.width,
					canvas.height,
				);
			}
			// // Отрисовка карты
			// ctx.globalAlpha = 0.5
   //    for (let i = 0; i < ROWS; i++) {
   //      for (let j = 0; j < COLS; j++) {
   //        ctx.fillStyle = map[i][j] === "W" ? "#1e40af" : "#000000";
   //        ctx.fillRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
   //      }
   //    }
			// ctx.globalAlpha = 1

      // Игрок
      // ctx.beginPath();
      // ctx.fillStyle = "yellow";
      // ctx.arc(
      //   player.y * CELL_SIZE + CELL_SIZE / 2,
      //   player.x * CELL_SIZE + CELL_SIZE / 2,
      //   CELL_SIZE / 2.5,
      //   0,
      //   2 * Math.PI
      // );
      // ctx.fill();
			// if (playerImage) {
			// 	ctx.drawImage(
			// 		playerImage,
			// 		player.y * CELL_SIZE - CELL_SIZE * 0.1,
			// 		player.x * CELL_SIZE - CELL_SIZE * 0.1,
			// 		CELL_SIZE * 1.2,
			// 		CELL_SIZE * 1.2,
			// 	);
			// }
			if (playerImage) {
	ctx.save(); // Сохраняем текущее состояние канваса

	// Переносим систему координат в центр черепахи
	const centerX = player.y * CELL_SIZE + CELL_SIZE / 2;
	const centerY = player.x * CELL_SIZE + CELL_SIZE / 2;
	ctx.translate(centerX, centerY);

	// Поворачиваем координатную систему
	ctx.rotate(angle);

	// Рисуем изображение со смещением от центра
	const size = CELL_SIZE * 1.2;
	ctx.drawImage(
		playerImage,
		-size / 2,
		-size / 2,
		size,
		size
	);

	ctx.restore(); // Возвращаем прежнее состояние канваса
}

      // Призраки
      ghosts.forEach((ghost) => {
				if (ghostImage) {
						ctx.drawImage(
							ghostImage,
							ghost.y * CELL_SIZE,
							ghost.x * CELL_SIZE,
							CELL_SIZE,
							CELL_SIZE,
						);
					}
        // ctx.beginPath();
        // ctx.fillStyle = ghost.type === "CHASER" 
        //   ? "red" 
        //   : ghost.type === "SHY" 
        //   ? "green" 
        //   : "pink";
        // ctx.arc(
        //   ghost.y * CELL_SIZE + CELL_SIZE / 2,
        //   ghost.x * CELL_SIZE + CELL_SIZE / 2,
        //   CELL_SIZE / 2.5,
        //   0,
        //   2 * Math.PI
        // );
        // ctx.fill();
      });

			// Отрисовка ягодки
			if (berryPosition) {
				let image;
				if (berryTech == "python") image = pythonImage;
				else if (berryTech == "js") image = jsImage;
				else if (berryTech == "cpp") image = cppImage;
				if (image) {
					ctx.drawImage(
						image,
						berryPosition.y * CELL_SIZE,
						berryPosition.x * CELL_SIZE,
						CELL_SIZE,
						CELL_SIZE,
					);
				}
			}
		};

    draw();
  }, [player, ghosts, berryPosition, effectActive]);

  // Добавим интервал для движения призраков
  useEffect(() => {
    const ghostInterval = setInterval(() => {
			if (isPaused) return;
      setGhosts((prev) => prev.map(moveGhost));
    }, 400);

    return () => clearInterval(ghostInterval);
  }, [setGhosts, isPaused]);

  // Логика движения игрока и подбора ягодки
  useEffect(() => {
    const interval = setInterval(() => {
			if (isPaused) return;
      const { dx, dy } = directionRef.current;
      
      setPlayer((prev) => {
        const newX = prev.x + dx;
        const newY = prev.y + dy;
        
        // Проверка на подбор ягодки
        if (berryPosition && newX === berryPosition.x && newY === berryPosition.y) {
					addLog("berry.eat()")
					setScore(score + BERRY_SCORE);
          setBerryPosition(null);
          setEffectActive(true);
					setIsModalOpen(true);
					setIsPaused(true);
					directionRef.current = {dx: 0, dy: 0}
          
          // Меняем тип призраков на SHY
          setGhosts(prevGhosts => 
            prevGhosts.map(g => ({
              ...g,
              type: "SHY"
            }))
          );
          
          // Возвращаем исходное состояние через таймаут
          setTimeout(() => {
						if (isPaused) return;
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
    }, 300);

    return () => {
			clearInterval(interval);
		}
  }, [berryPosition, isPaused]);

	useEffect(() => {
		for (const g of ghosts) {
			if (g.x == player.x && g.y == player.y) {
				if (effectActive) {
					addLog("turtle.eat(ghost)")
					setGhosts(prev => prev.filter(ghost => ghost !== g));
					setScore(score + GHOST_SCORE)
				} else {
					addLog("ghost.eat(turtle)")
					addLog("turtle.respawn()")
					setScore(score + DEATH_SCORE)
					// Респавн игрока
					setPlayer({ x: 13, y: 14 });
					// Сброс на4равления движения
					directionRef.current = { dx: 0, dy: 0 };
					// Сброс направления движения
				}
			}
		}
	}, [player, ghosts]);

	useEffect(() => {
		if (isInitialized && ghosts.length == 0) {
			setScore(Math.ceil(score / (time / 60)));
			setScreen("result")
		}
	}, [ghosts, isInitialized])

  return (
		<div className="flex flex-col w-full h-screen p-4 text-white mx-auto bg-black">
			<div className="text-9xl text-center mb-4">
				PAC-PYTURTLE
			</div>
			<div className="flex justify-center">
      <canvas
        ref={canvasRef}
        width={COLS * CELL_SIZE}
        height={ROWS * CELL_SIZE}
      />
      <div className="ml-4 flex flex-col w-1/3 border-4 border-blue-900 rounded p-4 overflow-y-auto h-[calc(100vh-280px)]">
        <div className="flex flex-col space-y-1 text-sm">
          {logs.map((log, i) => (
            <div key={i} className="text-4xl">
              - {log}
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      </div>
			</div>
		{isModalOpen && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
					<div className={`bg-gradient-to-br ${techInfo[berryTech]?.color} rounded-xl border-4 border-white/30 shadow-2xl max-w-2xl w-full overflow-hidden`}>
						<div className="flex flex-col md:flex-row">
							{/* Логотип языка */}
							<div className="bg-white/10 p-8 flex items-center justify-center md:w-1/3">
								{berryTech === "python" && pythonImage && (
									<img 
										src={pythonSpriteSrc} 
										alt="Python" 
										className="w-32 h-32 object-contain animate-bounce-slow"
									/>
								)}
								{berryTech === "js" && jsImage && (
									<img 
										src={jsSpriteSrc} 
										alt="JavaScript" 
										className="w-32 h-32 object-contain animate-bounce-slow"
									/>
								)}
								{berryTech === "cpp" && cppImage && (
									<img 
										src={cppSpriteSrc} 
										alt="C++" 
										className="w-32 h-32 object-contain animate-bounce-slow"
									/>
								)}
							</div>
							
							{/* Текстовая информация */}
							<div className="p-8 flex-1">
								<h2 className="text-4xl mb-6 font-bold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
									{techInfo[berryTech]?.name}
								</h2>
								<p className="text-xl mb-8 text-white/90 leading-relaxed">
									{techInfo[berryTech]?.description}
								</p>
								<button
									onClick={() => {
										setIsModalOpen(false);
										setIsPaused(false);
									}}
									className="w-full bg-white/20 hover:bg-white/30 text-white py-4 rounded-lg text-xl transition-all duration-300 font-bold uppercase tracking-wide shadow-lg hover:scale-[1.02]"
								>
									Продолжить
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
    </div>
   );
};
