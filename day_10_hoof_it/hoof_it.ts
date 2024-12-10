import { assertEquals } from "@std/assert/equals";

if (import.meta.main) {
  const grid: number[][] = Deno.readTextFileSync("input.txt")
    .trim()
    .split("\n")
    .map((line) => line.split("").map(Number));

  console.log(sumTrailheads(grid));
  console.log(sumUniqueTrails(grid));
}

// Part 1

type P1State = {
  grid: number[][];
  r: number;
  c: number;
  prev: number;
  visited: Set<string>;
};

function print(state: P1State) {
  console.log("DEBUGPRINT[1]: hoof_it.ts:17: state=", {
    ...state,
    grid: state.grid.map((l, i) =>
      l.map((x) => x === -1 ? "." : x).join(",") + ` | ${i}`
    ),
  });
}

function countTrailheads(state: P1State): number {
  const { grid, r, c, prev, visited } = state;
  const key = `${r},${c}`;
  const cell = grid[r]?.[c];
  if (cell === undefined) return 0;
  else if (cell !== prev + 1) return 0;
  else if (visited.has(key)) return 0;
  else visited.add(key);

  if (cell === 9) return 1;

  state.prev++;
  return countTrailheads({ ...state, r: r + 1 }) +
    countTrailheads({ ...state, r: r - 1 }) +
    countTrailheads({ ...state, c: c + 1 }) +
    countTrailheads({ ...state, c: c - 1 });
}

function sumTrailheads(grid: number[][]): number {
  let sum = 0;

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] === 0) {
        sum += countTrailheads({ grid, r, c, prev: -1, visited: new Set() });
      }
    }
  }

  return sum;
}

Deno.test("Part 1: Given example", () => {
  const input = [
    [8, 9, 0, 1, 0, 1, 2, 3],
    [7, 8, 1, 2, 1, 8, 7, 4],
    [8, 7, 4, 3, 0, 9, 6, 5],
    [9, 6, 5, 4, 9, 8, 7, 4],
    [4, 5, 6, 7, 8, 9, 0, 3],
    [3, 2, 0, 1, 9, 0, 1, 2],
    [0, 1, 3, 2, 9, 8, 0, 1],
    [1, 0, 4, 5, 6, 7, 3, 2],
  ];

  assertEquals(sumTrailheads(input), 36);
});

Deno.test("Part 1: Given example", () => {
  const input = [
    [-1, -1, 9, 0, -1, -1, 9],
    [-1, -1, -1, 1, -1, 9, 8],
    [-1, -1, -1, 2, -1, -1, 7],
    [6, 5, 4, 3, 4, 5, 6],
    [7, 6, 5, -1, 9, 8, 7],
    [8, 7, 6, -1, -1, -1, -1],
    [9, 8, 7, -1, -1, -1, -1],
  ];

  assertEquals(sumTrailheads(input), 4);
});

// Part 2

type P2State = {
  grid: number[][];
  r: number;
  c: number;
  prev: number;
};

function countUniqueTrails(state: P2State): number {
  const { grid, r, c, prev } = state;
  const cell = grid[r]?.[c];
  if (cell === undefined) return 0;
  else if (cell !== prev + 1) return 0;

  if (cell === 9) return 1;

  state.prev++;
  return countUniqueTrails({ ...state, r: r + 1 }) +
    countUniqueTrails({ ...state, r: r - 1 }) +
    countUniqueTrails({ ...state, c: c + 1 }) +
    countUniqueTrails({ ...state, c: c - 1 });
}

function sumUniqueTrails(grid: number[][]): number {
  let sum = 0;

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] === 0) {
        sum += countUniqueTrails({ grid, r, c, prev: -1 });
      }
    }
  }

  return sum;
}

Deno.test("Part 2: Given example", () => {
  const input = [
    [8, 9, 0, 1, 0, 1, 2, 3],
    [7, 8, 1, 2, 1, 8, 7, 4],
    [8, 7, 4, 3, 0, 9, 6, 5],
    [9, 6, 5, 4, 9, 8, 7, 4],
    [4, 5, 6, 7, 8, 9, 0, 3],
    [3, 2, 0, 1, 9, 0, 1, 2],
    [0, 1, 3, 2, 9, 8, 0, 1],
    [1, 0, 4, 5, 6, 7, 3, 2],
  ];

  assertEquals(sumUniqueTrails(input), 81);
});
