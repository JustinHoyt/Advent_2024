import { expose } from "npm:threads/worker";

enum Dir {
  UP = "^",
  RIGHT = ">",
  DOWN = "v",
  LEFT = "<",
}

type Position = {
  dir: Dir;
  row: number;
  col: number;
};

function turnRight(pos: Position): void {
  switch (pos.dir) {
    case Dir.UP:
      pos.dir = Dir.RIGHT;
      break;
    case Dir.RIGHT:
      pos.dir = Dir.DOWN;
      break;
    case Dir.DOWN:
      pos.dir = Dir.LEFT;
      break;
    case Dir.LEFT:
      pos.dir = Dir.UP;
      break;
  }
}

function moveForward(pos: Position): void {
  switch (pos.dir) {
    case Dir.UP:
      pos.row--;
      break;
    case Dir.RIGHT:
      pos.col++;
      break;
    case Dir.DOWN:
      pos.row++;
      break;
    case Dir.LEFT:
      pos.col--;
      break;
  }
}

function getNextCell(
  grid: string[][],
  { row, col, dir }: Position,
): string | undefined {
  switch (dir) {
    case Dir.UP:
      return grid[row - 1]?.[col];
    case Dir.RIGHT:
      return grid[row]?.[col + 1];
    case Dir.DOWN:
      return grid[row + 1]?.[col];
    case Dir.LEFT:
      return grid[row]?.[col - 1];
  }
}

function isLoop(grid: string[][], guardPos: Position): boolean {
  const pos = { ...guardPos };
  const obsructionsVisited = new Set<string>();

  while (true) {
    const serializedPos = `${pos.row},${pos.col},${pos.dir}`;
    const nextCell: string | undefined = getNextCell(grid, pos);

    // Guard exited the grid
    if (nextCell === undefined) return false;
    // Guard is in a loop
    if (nextCell === "#" && obsructionsVisited.has(serializedPos)) {
      return true;
    }

    if (nextCell === "#") {
      obsructionsVisited.add(serializedPos);
      turnRight(pos);
    } else { // no blockages
      moveForward(pos);
    }
  }
}

const countLoopsByRowWorker = {
  countLoopsByRow(
    grid: string[][],
    guardPos: Position,
    row: number,
  ): number {
    const newGrid = grid.map((line) => line.map((cell) => cell));
    let count = 0;
    for (let col = 0; col < grid[row].length; col++) {
      // can't obstruct the guard's starting point
      if (row === guardPos.row && col === guardPos.row) continue;
      // can't block if it's already obstructed
      if (grid[row][col] === "#") continue;

      newGrid[row][col] = "#";
      count += Number(isLoop(newGrid, guardPos));
      newGrid[row][col] = ".";
    }
    return count;
  },
};

export type CountLoopsByRowWorker = typeof countLoopsByRowWorker;

expose(countLoopsByRowWorker);
