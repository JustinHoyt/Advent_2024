import { assertEquals } from "@std/assert/equals";

if (import.meta.main) {
  const grid: string[][] = Deno.readTextFileSync("input.txt")
    .trim()
    .split("\n")
    .map((line) => Array.from(line));

  console.log(numUniqueAntinodes(grid));
  console.log(numUniqueAntinodesRepeating(grid));
}

// Part 1

type CoordString = string;
type RadioFrequencyString = string;

function numUniqueAntinodes(grid: string[][]): number {
  const frequencyCoords = new Map<RadioFrequencyString, Set<CoordString>>();
  const antinodeCoords = new Set<CoordString>();

  for (const [r, row] of grid.entries()) {
    for (const [c, cell] of row.entries()) {
      if (cell === ".") continue;
      const coords = frequencyCoords.get(cell) ?? new Set();
      frequencyCoords.set(cell, coords.add(`${r},${c}`));
    }
  }

  for (const [_key, coords] of frequencyCoords.entries()) {
    for (const serializedCoord1 of coords.values()) {
      const [r1, c1] = serializedCoord1.split(",").map(Number);
      for (const serializedCoord2 of coords.values()) {
        if (serializedCoord1 === serializedCoord2) continue;

        const [r2, c2] = serializedCoord2.split(",").map(Number);

        const rowDiff = r1 - r2; // 1 - 2 = -1
        const colDiff = c1 - c2; // 8 - 5 = 3

        // 								  1  + -1 = 0
        const antinodeRow = r1 + rowDiff;
        // 								  8  + 3  = 11
        const antinodeCol = c1 + colDiff;

        if (grid[antinodeRow]?.[antinodeCol] !== undefined) {
          antinodeCoords.add(`${antinodeRow},${antinodeCol}`);
        }
      }
    }
  }

  return antinodeCoords.size;
}

/**
 * Example:
 * coord1:    1, 8
 * coord2:    2, 5
 * antinode1: 0,11
 * antinode2: 3, 2
 */

Deno.test("Part 1: Given example", () => {
  const input = [
    //0    1    2    3    4    5    6    7    8    9   10   11
    [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "#"], // 0
    [".", ".", ".", ".", ".", ".", ".", ".", "0", ".", ".", "."], // 1
    [".", ".", ".", ".", ".", "0", ".", ".", ".", ".", ".", "."], // 2
    [".", ".", "#", ".", ".", ".", ".", "0", ".", ".", ".", "."], // 3
    [".", ".", ".", ".", "0", ".", ".", ".", ".", ".", ".", "."], // 4
    [".", ".", ".", ".", ".", ".", "A", ".", ".", ".", ".", "."], // 5
    [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."], // 6
    [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."], // 7
    [".", ".", ".", ".", ".", ".", ".", ".", "A", ".", ".", "."], // 8
    [".", ".", ".", ".", ".", ".", ".", ".", ".", "A", ".", "."], // 9
    [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."], // 10
    [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."], // 11
  ];

  assertEquals(numUniqueAntinodes(input), 14);
});

function numUniqueAntinodesRepeating(grid: string[][]): number {
  const frequencyCoords = new Map<RadioFrequencyString, Set<CoordString>>();
  const antinodeCoords = new Set<CoordString>();

  const findAntinodes = (
    r1: number,
    c1: number,
    r2: number,
    c2: number,
  ): void => {
    while (true) {
      const rowDiff = r1 - r2;
      const colDiff = c1 - c2;
      const antinodeRow = r1 + rowDiff;
      const antinodeCol = c1 + colDiff;
      if (grid[antinodeRow]?.[antinodeCol] === undefined) break;

      antinodeCoords.add(`${antinodeRow},${antinodeCol}`);

      [r2, c2] = [r1, c1];
      [r1, c1] = [antinodeRow, antinodeCol];
    }
  };

  for (const [r, row] of grid.entries()) {
    for (const [c, cell] of row.entries()) {
      if (cell === ".") continue;
      const coords = frequencyCoords.get(cell) ?? new Set();
      const coord = `${r},${c}`;

      frequencyCoords.set(cell, coords.add(coord));
      // Every antenna is an antinode
      antinodeCoords.add(coord);
    }
  }

  for (const [_key, coords] of frequencyCoords.entries()) {
    for (const serializedCoord1 of coords.values()) {
      const [r1, c1] = serializedCoord1.split(",").map(Number);
      for (const serializedCoord2 of coords.values()) {
        if (serializedCoord1 === serializedCoord2) continue;
        const [r2, c2] = serializedCoord2.split(",").map(Number);

        findAntinodes(r1, c1, r2, c2);
      }
    }
  }

  return antinodeCoords.size;
}

/**
 * Example:
 * coord1:    1, 8
 * coord2:    2, 5
 * antinode1: 0,11
 * antinode2: 3, 2
 */

Deno.test("Part 2: Given example", () => {
  const input = [
    //0    1    2    3    4    5    6    7    8    9   10   11
    [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "#"], // 0
    [".", ".", ".", ".", ".", ".", ".", ".", "0", ".", ".", "."], // 1
    [".", ".", ".", ".", ".", "0", ".", ".", ".", ".", ".", "."], // 2
    [".", ".", "#", ".", ".", ".", ".", "0", ".", ".", ".", "."], // 3
    [".", ".", ".", ".", "0", ".", ".", ".", ".", ".", ".", "."], // 4
    [".", ".", ".", ".", ".", ".", "A", ".", ".", ".", ".", "."], // 5
    [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."], // 6
    [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."], // 7
    [".", ".", ".", ".", ".", ".", ".", ".", "A", ".", ".", "."], // 8
    [".", ".", ".", ".", ".", ".", ".", ".", ".", "A", ".", "."], // 9
    [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."], // 10
    [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."], // 11
  ];

  assertEquals(numUniqueAntinodesRepeating(input), 34);
});
