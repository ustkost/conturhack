import React from "react";
import { getMap, type CellType } from "../map/getMap";

const CELL_SIZE = 32;

const getCellColor = (type: CellType): string => {
  switch (type) {
    case "W":
      return "bg-blue-800";
    case "E":
      return "bg-black";
    case "F":
      return "bg-yellow-400";
    case "P":
      return "bg-green-500";
    case "G":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export const GameMap: React.FC = () => {
	const gameMap = getMap();

  return (
    <div className="inline-block border-4 border-white bg-black">
      {gameMap.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              className={`${getCellColor(cell)} border border-gray-700`}
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

