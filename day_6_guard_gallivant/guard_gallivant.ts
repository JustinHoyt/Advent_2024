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
