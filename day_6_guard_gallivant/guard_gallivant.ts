import { assertEquals } from "@std/assert/equals";

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

if (import.meta.main) {
  const grid: string[][] = Deno.readTextFileSync("input.txt")
    .trim()
    .split("\n")
    .map((line) => Array.from(line));

  console.log(countCellsVisited(grid));
  console.log(countLoops(grid));
}

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

// Part 1

function findGuardStartingPoint(grid: string[][]): Position {
  for (const [r, row] of grid.entries()) {
    for (const [c, cell] of row.entries()) {
      if (cell === Dir.UP) return { row: r, col: c, dir: Dir.UP };
      if (cell === Dir.RIGHT) return { row: r, col: c, dir: Dir.RIGHT };
      if (cell === Dir.DOWN) return { row: r, col: c, dir: Dir.DOWN };
      if (cell === Dir.LEFT) return { row: r, col: c, dir: Dir.LEFT };
    }
  }
  throw new Error("no guard found");
}

function countCellsVisited(grid: string[][]): number {
  const cellsVisited = new Set<string>();

  function recurse(r: number, c: number, dir: Dir): void {
    cellsVisited.add(`${r},${c}`);

    switch (dir) {
      case Dir.UP: {
        const cellUp: string | undefined = grid[r - 1]?.[c];

        if (cellUp === undefined) return;
        else if (cellUp === "#") recurse(r, c + 1, Dir.RIGHT);
        else recurse(r - 1, c, Dir.UP);
        return;
      }
      case Dir.RIGHT: {
        const cellRight: string | undefined = grid[r]?.[c + 1];

        if (cellRight === undefined) return;
        else if (cellRight === "#") recurse(r + 1, c, Dir.DOWN);
        else recurse(r, c + 1, Dir.RIGHT);
        return;
      }
      case Dir.DOWN: {
        const cellDown: string | undefined = grid[r + 1]?.[c];

        if (cellDown === undefined) return;
        else if (cellDown === "#") recurse(r, c - 1, Dir.LEFT);
        else recurse(r + 1, c, Dir.DOWN);
        return;
      }
      case Dir.LEFT: {
        const cellLeft: string | undefined = grid[r]?.[c - 1];

        if (cellLeft === undefined) return;
        else if (cellLeft === "#") recurse(r - 1, c, Dir.UP);
        else recurse(r, c - 1, Dir.LEFT);
        return;
      }
    }
  }

  const { row, col, dir } = findGuardStartingPoint(grid);

  recurse(row, col, dir);
  return cellsVisited.size;
}

Deno.test("Part 1: Given example", () => {
  const input = [
    [".", ".", ".", ".", "#", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", "#"],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", "#", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", "#", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", "#", ".", ".", "^", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", "#", "."],
    ["#", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", "#", ".", ".", "."],
  ];
  assertEquals(countCellsVisited(input), 41);
});

// Part 2

function isLoop(grid: string[][], guardPos: Position): boolean {
  const pos = { ...guardPos };
  const obsructionsVisited = new Set<string>();

  while (true) {
    const coordString = JSON.stringify(pos);
    const nextCell: string | undefined = getNextCell(grid, pos);

    // Guard exited the grid
    if (nextCell === undefined) return false;
    // Guard is in a loop
    if (nextCell === "#" && obsructionsVisited.has(coordString)) return true;

    if (nextCell === "#") {
      obsructionsVisited.add(coordString);
      turnRight(pos);
    } else { // no blockages
      moveForward(pos);
    }
  }
}

function countLoops(grid: string[][]): number {
  const guardPos = findGuardStartingPoint(grid);
  let numLoops = 0;

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      // can't obstruct the guard's starting point
      if (i === guardPos.row && j === guardPos.row) continue;
      // can't block if it's already obstructed
      if (grid[i][j] === "#") continue;

      grid[i][j] = "#";
      numLoops += Number(isLoop(grid, guardPos));
      grid[i][j] = ".";
    }
  }
  return numLoops;
}

// The O's in the test are purely for illustrative purposes.
// They denote where the added obstructions should be placed
Deno.test("Part 2: Given example", () => {
  const input = [
    [".", ".", ".", ".", "#", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", "#"],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", "#", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", "#", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", "#", ".", "O", "^", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", "O", "O", "#", "."],
    ["#", "O", ".", "O", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", "#", "O", ".", "."],
  ];
  assertEquals(countLoops(input), 6);
});

Deno.test("Part 2: zero loops", () => {
  const input = [
    [".", ".", ".", ".", "#"],
    [".", ".", ".", ".", "."],
    [".", ".", ".", ".", "."],
    [".", ".", "#", ".", "."],
    [".", ".", ".", ".", "."],
    [".", ".", ".", ".", "."],
    [".", "#", ".", ".", "^"],
    [".", ".", ".", ".", "."],
    ["#", ".", ".", ".", "."],
    [".", ".", ".", ".", "."],
  ];
  assertEquals(countLoops(input), 0);
});

Deno.test("Part 2: loop that goes only up and down", () => {
  const input = [
    //0    1    2
    ["#", "#", "."], // 0
    [".", ".", "O"], // 1
    ["^", ".", "."], // 2
    ["#", ".", "."], // 3
    [".", "#", "#"], // 4
  ];
  assertEquals(countLoops(input), 1);
});
