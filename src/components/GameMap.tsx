import React, { useEffect, useRef } from "react";
import { getMap } from "../getMap";

const CELL_SIZE = 32;
const SPEED = 160; // pixels per second

const getCellColor = (type: string): string => {
  switch (type) {
    case "W": return "bg-blue-800";
    case "E": return "bg-black";
    case "F": return "bg-yellow-400";
    case "G": return "bg-red-500";
    default: return "bg-gray-500";
  }
};

export const GameMap: React.FC = () => {
  const gameMap = getMap();

  const direction = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });
  const pos = useRef<{ x: number; y: number }>({ x: 1 * CELL_SIZE, y: 1 * CELL_SIZE }); // стартовая позиция
  const lastTime = useRef<number | null>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  const isWall = (x: number, y: number) => {
    const cellX = Math.floor(y / CELL_SIZE);
    const cellY = Math.floor(x / CELL_SIZE);
    return (
      cellY < 0 ||
      cellY >= gameMap.length ||
      cellX < 0 ||
      cellX >= gameMap[0].length ||
      gameMap[cellY][cellX] === "W"
    );
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "w":
        case "ArrowUp":
          direction.current = { dx: 0, dy: -1 };
          break;
        case "s":
        case "ArrowDown":
          direction.current = { dx: 0, dy: 1 };
          break;
        case "a":
        case "ArrowLeft":
          direction.current = { dx: -1, dy: 0 };
          break;
        case "d":
        case "ArrowRight":
          direction.current = { dx: 1, dy: 0 };
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const loop = (time: number) => {
      if (lastTime.current === null) lastTime.current = time;
      const delta = (time - lastTime.current) / 1000; // seconds
      lastTime.current = time;

      const moveX = direction.current.dx * SPEED * delta;
      const moveY = direction.current.dy * SPEED * delta;

      const newX = pos.current.x + moveX;
      const newY = pos.current.y + moveY;

      if (!isWall(newX, pos.current.y)) {
        pos.current.x = newX;
      }

      if (!isWall(pos.current.x, newY)) {
        pos.current.y = newY;
      }

      if (playerRef.current) {
        playerRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }, [gameMap]);

  return (
    <div
      className="inline-block border-4 border-white bg-black"
      style={{
				position: "relative",
        width: gameMap[0].length * CELL_SIZE,
        height: gameMap.length * CELL_SIZE,
      }}
    >
      {gameMap.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              className={`${getCellColor(cell)} border border-gray-700`}
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
								boxSizing: "border-box",
              }}
            />
          ))}
        </div>
      ))}

      <div
        ref={playerRef}
        className="absolute bg-green-500"
        style={{
          width: CELL_SIZE,
          height: CELL_SIZE,
          transform: `translate(${pos.current.x}px, ${pos.current.y}px)`,
					
        }}
      />
    </div>
  );
};

