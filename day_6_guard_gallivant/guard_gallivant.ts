import { Pool, spawn, Worker } from "npm:threads";
import { assertEquals } from "@std/assert/equals";
import { cpus } from "node:os";
import { CountLoopsByRowWorker } from "./worker.ts";

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
  console.log(await countLoops(grid));
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

async function countLoops(grid: string[][]): Promise<number> {
  const guardPos = findGuardStartingPoint(grid);
  const pool = Pool(
    () => spawn<CountLoopsByRowWorker>(new Worker("./worker.ts")),
    cpus().length,
  );

  let count = 0;
  for (let i = 0; i < grid.length; i++) {
    pool.queue(
      (worker) => worker.countLoopsByRow(grid, guardPos, i),
    ).then((isLoop) => count += Number(isLoop));
  }

  await pool.completed();
  await pool.terminate(true);

  return count;
}

// The O's in the test are purely for illustrative purposes.
// They denote where the added obstructions should be placed
Deno.test("Part 2: Given example", async () => {
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
  assertEquals(await countLoops(input), 6);
});

Deno.test("Part 2: zero loops", async () => {
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
  assertEquals(await countLoops(input), 0);
});

Deno.test("Part 2: loop that goes only up and down", async () => {
  const input = [
    //0    1    2
    ["#", "#", "."], // 0
    [".", ".", "O"], // 1
    ["^", ".", "."], // 2
    ["#", ".", "."], // 3
    [".", "#", "#"], // 4
  ];
  assertEquals(await countLoops(input), 1);
});
