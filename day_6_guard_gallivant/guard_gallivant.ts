import { assertEquals } from "@std/assert/equals";

enum Dir {
  UP = "^",
  RIGHT = ">",
  DOWN = "v",
  LEFT = "<",
}

if (import.meta.main) {
  const grid: string[][] = Deno.readTextFileSync("input.txt")
    .trim()
    .split("\n")
    .map((line) => Array.from(line));

  console.log(countCellsVisited(grid));
  console.log(countLoops(grid));
}

// Part 1

function findGuardStartingPoint(grid: string[][]): [number, number, Dir] {
  for (const [r, row] of grid.entries()) {
    for (const [c, cell] of row.entries()) {
      if (cell === Dir.UP) return [r, c, Dir.UP];
      if (cell === Dir.RIGHT) return [r, c, Dir.RIGHT];
      if (cell === Dir.DOWN) return [r, c, Dir.DOWN];
      if (cell === Dir.LEFT) return [r, c, Dir.LEFT];
    }
  }
  throw new Error("no guard found");
}

function countCellsVisited(grid: string[][]): number {
  const cellsVisited = new Set<string>();

  function recurse(r: number, c: number, currDir: Dir): void {
    cellsVisited.add(`${r},${c}`);

    switch (currDir) {
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

  const [r, c, currDir] = findGuardStartingPoint(grid);

  recurse(r, c, currDir);
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

function countLoops(grid: string[][]): number {
  const obsructionsVisited = new Set<string>();

  function isLoop(r: number, c: number, currDir: Dir): boolean {
    const blockedTwice = (cell: string, coord: string) =>
      cell === "#" && obsructionsVisited.has(coord);
    const blocked = (cell: string) => cell === "#";
    const exitedGrid = (cell: string) => cell === undefined;
    const moveUp = () => r--;
    const moveRight = () => c++;
    const moveDown = () => r++;
    const moveLeft = () => c--;

    while (true) {
      const coord = `${r},${c}: ${currDir}`;

      switch (currDir) {
        case Dir.UP: {
          const nextCell: string | undefined = grid[r - 1]?.[c];

          if (exitedGrid(nextCell)) return false;
          if (blocked(nextCell) && obsructionsVisited.has(coord)) return true;

          if (blocked(nextCell)) {
            obsructionsVisited.add(coord);
            currDir = Dir.RIGHT;
          } else { // no blockages
            moveUp();
          }

          break;
        }
        case Dir.RIGHT: {
          const nextCell: string | undefined = grid[r]?.[c + 1];

          if (exitedGrid(nextCell)) return false;
          if (blocked(nextCell) && obsructionsVisited.has(coord)) return true;

          if (blocked(nextCell)) {
            obsructionsVisited.add(coord);
            currDir = Dir.DOWN;
          } else { // no blockages
            moveRight();
          }

          break;
        }
        case Dir.DOWN: {
          const nextCell: string | undefined = grid[r + 1]?.[c];

          if (exitedGrid(nextCell)) return false;
          if (blocked(nextCell) && obsructionsVisited.has(coord)) return true;

          if (blocked(nextCell)) {
            obsructionsVisited.add(coord);
            currDir = Dir.LEFT;
          } else { // no blockages
            moveDown();
          }

          break;
        }
        case Dir.LEFT: {
          const nextCell: string | undefined = grid[r]?.[c - 1];

          if (exitedGrid(nextCell)) return false;
          if (blocked(nextCell) && obsructionsVisited.has(coord)) return true;

          if (blocked(nextCell)) {
            obsructionsVisited.add(coord);
            currDir = Dir.UP;
          } else { // no blockages
            moveLeft();
          }

          break;
        }
      }
    }
  }

  const [startingRow, startingCol, currDir] = findGuardStartingPoint(grid);
  let numLoops = 0;

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      // can't obstruct the guard's starting point
      if (i === startingRow && j === startingCol) continue;
      // can't block if it's already obstructed
      if (grid[i][j] === "#") continue;

      grid[i][j] = "#";
      numLoops += Number(isLoop(startingRow, startingCol, currDir));
      obsructionsVisited.clear();
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
    ["#", "#", "."],
    [".", ".", "O"],
    ["^", ".", "."],
    ["#", ".", "."],
    [".", "#", "#"],
  ];
  assertEquals(countLoops(input), 1);
});
