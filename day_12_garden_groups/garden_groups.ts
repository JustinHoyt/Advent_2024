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

// Part 2

class Grid<T> extends Array<Array<T>> {
  private r = 0;
  private c = 0;
  constructor(grid: T[][]) {
    super();
    for (const row of grid.values()) this.push(row);
  }

  set coords([r, c]: [number, number]) {
    this.r = r;
    this.c = c;
  }

  get coords(): [number, number] {
    return [this.r, this.c];
  }

  get topLeft() {
    return this[this.r - 1]?.[this.c - 1];
  }
  get top() {
    return this[this.r - 1]?.[this.c];
  }
  get topRight() {
    return this[this.r - 1]?.[this.c + 1];
  }

  get left() {
    return this[this.r]?.[this.c - 1];
  }
  get curr() {
    return this[this.r]?.[this.c];
  }
  get right() {
    return this[this.r]?.[this.c + 1];
  }

  get bottomLeft() {
    return this[this.r + 1]?.[this.c - 1];
  }
  get bottom() {
    return this[this.r + 1]?.[this.c];
  }
  get bottomRight() {
    return this[this.r + 1]?.[this.c + 1];
  }

  get isTopLeftAnOuterCorner(): boolean {
    return !!this.curr && !this.topLeft && !this.top && !this.left;
  }
  get isTopRightAnOuterCorner(): boolean {
    return !!this.curr && !this.topRight && !this.top && !this.right;
  }
  get isBottomLeftAnOuterCorner(): boolean {
    return !!this.curr && !this.bottomLeft && !this.bottom && !this.left;
  }
  get isBottomRightAnOuterCorner(): boolean {
    return !!this.curr && !this.bottomRight && !this.bottom && !this.right;
  }

  get isTopLeftAnInnerCorner(): boolean {
    return !!this.curr && !this.topLeft && !!this.top && !!this.left;
  }
  get isTopRightAnInnerCorner(): boolean {
    return !!this.curr && !this.topRight && !!this.top && !!this.right;
  }
  get isBottomLeftAnInnerCorner(): boolean {
    return !!this.curr && !this.bottomLeft && !!this.bottom && !!this.left;
  }
  get isBottomRightAnInnerCorner(): boolean {
    return !!this.curr && !this.bottomRight && !!this.bottom && !!this.right;
  }
}

type P2Context = {
  grid: string[][];
  areaVisited: Set<string>;
  plots: Grid<number>;
  r: number;
  c: number;
  plant: string;
};

function calcArea(
  ctx: P2Context,
): number {
  const { grid, areaVisited, plots, r, c, plant } = ctx;
  const cell: string | undefined = grid[r]?.[c];
  const key = `${r},${c}`;

  const isPerim = cell === undefined || cell !== plant;
  if (isPerim) {
    return 0;
  }

  if (areaVisited.has(key)) return 0;

  areaVisited.add(key);

  plots[r][c] = 1;
  return [
    1,
    calcArea({ ...ctx, r: r + 1 }),
    calcArea({ ...ctx, r: r - 1 }),
    calcArea({ ...ctx, c: c + 1 }),
    calcArea({ ...ctx, c: c - 1 }),
  ].reduce(
    (acc, res) => acc + res,
  );
}

function numFenceSides(ctx: P2Context): number {
  const { plots } = ctx;

  let numSides = 0;

  // cound islands where they have no vertical or horizontal neighbor
  for (let r = 0; r < plots.length; r++) {
    for (let c = 0; c < plots[r]?.length; c++) {
      plots.coords = [r, c];
      if (plots.isTopLeftAnOuterCorner) {
        numSides++;
      }
      if (plots.isTopRightAnOuterCorner) {
        numSides++;
      }
      if (plots.isBottomLeftAnOuterCorner) {
        numSides++;
      }
      if (plots.isBottomRightAnOuterCorner) {
        numSides++;
      }
      if (plots.isTopLeftAnInnerCorner) {
        numSides++;
      }
      if (plots.isTopRightAnInnerCorner) {
        numSides++;
      }
      if (plots.isBottomLeftAnInnerCorner) {
        numSides++;
      }
      if (plots.isBottomRightAnInnerCorner) {
        numSides++;
      }
    }
  }

  // console.log("DEBUGPRINT[4]: garden_groups.ts:254: ctx.plant=", ctx.plant);
  // console.log("DEBUGPRINT[18]: garden_groups.ts:185: numSides=", numSides);
  return numSides;
}
// 1_518_548 too high
function calcPricing2(grid: string[][]): number {
  let priceSum = 0;
  const areaVisited = new Set<string>();

  for (const r of grid.keys()) {
    for (const c of grid.keys()) {
      // Plots of a certain connected group of plant given as 1's. plots not in
      // that specific connected group are given as 0's.
      //
      // Add 2 rows and cols for accomidating the out of bounds perimeter
      const plots = new Grid(
        Array.from({ length: grid.length }).map(() =>
          Array.from({ length: grid[0]?.length }).map(() => 0)
        ),
      );
      const ctx = {
        grid,
        areaVisited,
        plots,
        r,
        c,
        plant: grid[r][c],
      };

      priceSum += calcArea(ctx) * numFenceSides(ctx);
    }
  }
  return priceSum;
}

Deno.test("Part 2: Simple given example", () => {
  const input = [
    ["A", "A", "A", "A"],
    ["B", "B", "C", "D"],
    ["B", "B", "C", "C"],
    ["E", "E", "E", "C"],
  ];

  assertEquals(calcPricing2(input), 80);
});

Deno.test("Part 2: Advanced given example", () => {
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

  // [
  //   [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
  //   [".", "R", "R", "R", "R", "I", "I", "C", "C", "F", "F", "."],
  //   [".", "R", "R", "R", "R", "I", "I", "C", "C", "C", "F", "."],
  //   [".", "V", "V", "R", "R", "R", "C", "C", "F", "F", "F", "."],
  //   [".", "V", "V", "R", "C", "C", "C", "J", "F", "F", "F", "."],
  //   [".", "V", "V", "V", "V", "C", "J", "J", "C", "F", "E", "."],
  //   [".", "V", "V", "I", "V", "C", "C", "J", "J", "E", "E", "."],
  //   [".", "V", "V", "I", "I", "I", "C", "J", "J", "E", "E", "."],
  //   [".", "M", "I", "I", "I", "I", "I", "J", "J", "E", "E", "."],
  //   [".", "M", "I", "I", "I", "S", "I", "J", "E", "E", "E", "."],
  //   [".", "M", "M", "M", "I", "S", "S", "J", "E", "E", "E", "."],
  //   [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
  // ];

  // 24 sides to the big C plot
  // [
  //   [".", ".", ".",|".", ".", ".", ".",+---------+".", ".", "."],
  //   [".", ".", ----+".", ".", ".", ".",|"C", "C",+----+".", "."],
  //   [".", ".", ".", "O", ".", ".",+----+"C", "C", "C",|".", "."],
  //   [".", ".", ".", ".",+---------+"C", "C",+---------+".", "."],
  //   [".", ".", ".", ".",|"C", "C", "C",+-O--+".", ".", ".", "."],
  //   [".", ".", ".", ".",+----+"C",:====:".", ".", ".", ".", "."],
  //   [".", ".", ".", ".", "O",|"C", "C",|".", ".", ".", ".", "."],
  //   [".", ".", ".", ".", ".",+----+"C",|".", ".", ".", ".", "."],
  //   [".", ".", ".", ".", ".", ".",+----+".", ".", ".", ".", "."],
  //   [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
  //   [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
  //   [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
  // ];

  assertEquals(calcPricing2(input), 1206);
});
