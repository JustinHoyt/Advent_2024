import { assertEquals } from "@std/assert/equals";

type Dir = "N" | "S" | "E" | "W" | "NE" | "NW" | "SE" | "SW";
const dirs: Dir[] = ["N", "S", "E", "W", "NE", "NW", "SE", "SW"];

if (import.meta.main) {
  const input = Deno.readTextFileSync("input.txt")
    .trim()
    .split("\n");

  console.log(countXmasMatches(input));
}

// Part 1

function countXmasMatches(grid: string[]): number {
  function countXmasRec(
    r: number,
    c: number,
    wordSoFar: string,
    dir: Dir,
  ): number {
    if (
      (r < 0 || grid.length <= r) ||
      (c < 0 || grid[r].length <= c) ||
      // break if it's not a prefix of 'XMAS'
      !"XMAS".startsWith(`${wordSoFar}${grid[r][c]}`)
    ) {
      return 0;
    }
    const letter = grid[r][c];
    const newWord = `${wordSoFar}${letter}`;

    if (newWord === "XMAS") {
      return 1;
    }

    if (dir === "NW") return countXmasRec(r - 1, c - 1, newWord, dir);
    else if (dir === "N") return countXmasRec(r - 1, c, newWord, dir);
    else if (dir === "NE") return countXmasRec(r - 1, c + 1, newWord, dir);
    else if (dir === "W") return countXmasRec(r, c - 1, newWord, dir);
    else if (dir === "E") return countXmasRec(r, c + 1, newWord, dir);
    else if (dir === "SW") return countXmasRec(r + 1, c - 1, newWord, dir);
    else if (dir === "S") return countXmasRec(r + 1, c, newWord, dir);
    else if (dir === "SE") return countXmasRec(r + 1, c + 1, newWord, dir);
    else throw new Error("invalid direction");
  }

  let count = 0;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      for (const dir of dirs) {
        count += countXmasRec(r, c, "", dir as Dir);
      }
    }
  }
  return count;
}

Deno.test("default input", () => {
  const input = [
    "MMMSXXMASM",
    "MSAMXMSMSA",
    "AMXSXMAAMM",
    "MSAMASMSMX",
    "XMASAMXAMM",
    "XXAMMXXAMA",
    "SMSMSASXSS",
    "SAXAMASAAA",
    "MAMMMXMMMM",
    "MXMXAXMASX",
  ];
  assertEquals(countXmasMatches(input), 18);
});

Deno.test("default input", () => {
  const input = [
    "..X...",
    ".SAMX.",
    ".A..A.",
    "XMAS.S",
    ".X....",
  ];
  assertEquals(countXmasMatches(input), 4);
});

// Part 2
