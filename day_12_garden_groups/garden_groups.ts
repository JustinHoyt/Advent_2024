import { assertEquals } from "@std/assert/equals";

if (import.meta.main) {
  const grid: string[][] = Deno.readTextFileSync("input.txt")
    .trim()
    .split("\n")
    .map((line) => line.split(""));

  console.log(calcPricing(grid));
}

// Part 1

type Context = {
  grid: string[][];
  areaVisited: Set<string>;
  r: number;
  c: number;
  plant: string;
};

function calcAreaAndPerimeter(
  ctx: Context,
): { area: number; perim: number } {
  const { grid, areaVisited, r, c, plant } = ctx;
  const cell: string | undefined = grid[r]?.[c];
  const key = `${r},${c}`;

  const isPerim = cell === undefined || cell !== plant;
  if (isPerim) {
    return { area: 0, perim: 1 };
  }

  if (areaVisited.has(key)) return { area: 0, perim: 0 };

  areaVisited.add(key);

  return [
    { area: 1, perim: 0 },
    calcAreaAndPerimeter({ ...ctx, r: r + 1 }),
    calcAreaAndPerimeter({ ...ctx, r: r - 1 }),
    calcAreaAndPerimeter({ ...ctx, c: c + 1 }),
    calcAreaAndPerimeter({ ...ctx, c: c - 1 }),
  ].reduce(
    (acc, res) => ({
      area: acc.area + res.area,
      perim: acc.perim + res.perim,
    }),
  );
}

function calcPricing(grid: string[][]): number {
  let priceSum = 0;
  const areaVisited = new Set<string>();

  for (const r of grid.keys()) {
    for (const c of grid.keys()) {
      const { area, perim } = calcAreaAndPerimeter({
        grid,
        areaVisited,
        r,
        c,
        plant: grid[r][c],
      });
      priceSum += area * perim;
    }
  }
  return priceSum;
}

Deno.test("Part 1: Simple given example", () => {
  const input = [
    ["A", "A", "A", "A"],
    ["B", "B", "C", "D"],
    ["B", "B", "C", "C"],
    ["E", "E", "E", "C"],
  ];

  assertEquals(calcPricing(input), 140);
});

Deno.test("Part 1: Advanced given example", () => {
  const input = [
    ["R", "R", "R", "R", "I", "I", "C", "C", "F", "F"],
    ["R", "R", "R", "R", "I", "I", "C", "C", "C", "F"],
    ["V", "V", "R", "R", "R", "C", "C", "F", "F", "F"],
    ["V", "V", "R", "C", "C", "C", "J", "F", "F", "F"],
    ["V", "V", "V", "V", "C", "J", "J", "C", "F", "E"],
    ["V", "V", "I", "V", "C", "C", "J", "J", "E", "E"],
    ["V", "V", "I", "I", "I", "C", "J", "J", "E", "E"],
    ["M", "I", "I", "I", "I", "I", "J", "J", "E", "E"],
    ["M", "I", "I", "I", "S", "I", "J", "E", "E", "E"],
    ["M", "M", "M", "I", "S", "S", "J", "E", "E", "E"],
  ];

  assertEquals(calcPricing(input), 1930);
});
