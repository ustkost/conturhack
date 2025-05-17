// W - wall
// E - enemy
// F - food
// P - player start
// G - ghost start
export type CellType = 'W' | 'E' | 'F' | 'P' | 'G';

export function getMap(): CellType[][] {
	return [
		['W', 'W', 'W', 'W', 'W', 'W', 'W'],
		['W', 'F', 'F', 'E', 'F', 'F', 'W'],
		['W', 'F', 'W', 'E', 'W', 'F', 'W'],
		['W', 'F', 'W', 'P', 'W', 'F', 'W'],
		['W', 'F', 'W', 'G', 'W', 'F', 'W'],
		['W', 'F', 'F', 'F', 'F', 'F', 'W'],
		['W', 'W', 'W', 'W', 'W', 'W', 'W']
	]
}
