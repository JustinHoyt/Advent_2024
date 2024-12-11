import { assertEquals } from "@std/assert/equals";

if (import.meta.main) {
  const stones: string[] = Deno.readTextFileSync("input.txt")
    .trim()
    .split(" ");

  console.log(countStonesAfter25Blinks(stones));
  console.log(countStonesAfter75Blinks(stones));
}

// Part 1

type State = {
  stones: string[];
};

function print(state: State) {
  console.log(state.stones.join(","));
}

function countStonesAfter25Blinks(stones: string[]): number {
  const numBlinks = 25;

  for (let i = 0; i < numBlinks; i++) {
    const origLength = stones.length;
    // if (i < 10) print({ stones });
    for (let i = 0; i < origLength; i++) {
      const stone = stones[i];
      if (stone.length % 2 === 0) {
        const midIdx = stone.length / 2;
        // remove leading 0's. put a single 0 back if it leaves the string empty
        stones.push(stone.slice(midIdx).replace(/^0*/, "") || "0");
        stones[i] = stone.slice(0, midIdx).replace(/^0*/, "") || "0";
      } else if (stone === "0") {
        stones[i] = "1";
      } else {
        stones[i] = String(+stone * 2024);
      }
    }
  }

  return stones.length;
}

Deno.test("Part 1: Given example", () => {
  const input = ["125", "17"];

  assertEquals(countStonesAfter25Blinks(input), 55312);
});

function countStonesAfter75Blinks(stones: string[]): number {
  const numBlinks = 25;

  for (let i = 0; i < numBlinks; i++) {
    const origLength = stones.length;
    // if (i < 10) print({ stones });
    for (let i = 0; i < origLength; i++) {
      const stone = stones[i];
      if (stone.length % 2 === 0) {
        const midIdx = stone.length / 2;
        // remove leading 0's. put a single 0 back if it leaves the string empty
        stones.push(stone.slice(midIdx).replace(/^0*/, "") || "0");
        stones[i] = stone.slice(0, midIdx).replace(/^0*/, "") || "0";
      } else if (stone === "0") {
        stones[i] = "1";
      } else {
        stones[i] = String(+stone * 2024);
      }
    }
  }

  return stones.length;
}
