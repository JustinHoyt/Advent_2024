import { assertEquals } from "@std/assert/equals";

if (import.meta.main) {
  const stones: string[] = Deno.readTextFileSync("input.txt")
    .trim()
    .split(" ");

  console.log(countStonesAfter75Blinks(stones));
}

// Part 1

type Context = {
  stones: string[];
};

function countStonesAfter25Blinks(stones: string[]): number {
  let sum = 0;
  const origLength = stones.length;
  for (let i = 0; i < origLength; i++) {
    sum += countStonesRec({
      stone: stones[i],
      blinksRemaining: 25,
      memo: new Map(),
      idx: i,
    });
  }
  return sum;
}

Deno.test("Part 1: Given example", () => {
  const input = ["125", "17"];

  assertEquals(countStonesAfter25Blinks(input), 55312);
});

type P2Context = {
  stone: string;
  idx: number;
  blinksRemaining: number;
  memo: Map<string, number>;
};

function countStonesRec(ctx: P2Context): number {
  const { stone, blinksRemaining, memo } = ctx;
  const key = `${stone},${blinksRemaining}`;

  if (blinksRemaining === 0) return 1;
  else ctx.blinksRemaining--;

  if (memo.has(key)) return memo.get(key)!;
  if (stone.length % 2 === 0) {
    const leftHalf = stone.slice(0, stone.length / 2);
    const rightHalf = stone.slice(stone.length / 2)
      .replace(/^0+(?=.)/, "");
    memo.set(
      key,
      countStonesRec({ ...ctx, stone: leftHalf }) +
        countStonesRec({ ...ctx, stone: rightHalf }),
    );
  } else if (stone === "0") {
    memo.set(key, countStonesRec({ ...ctx, stone: "1" }));
  } else {
    memo.set(
      key,
      countStonesRec({ ...ctx, stone: String(+stone * 2024) }),
    );
  }

  return memo.get(key)!;
}

function countStonesRecObj(ctx: any): number {
  const { stone, blinksRemaining, memo } = ctx;
  const key = `${stone},${blinksRemaining}`;

  if (blinksRemaining === 0) return 1;
  else ctx.blinksRemaining--;

  if (memo[key] !== undefined) return memo[key];
  if (stone.length % 2 === 0) {
    const leftHalf = stone.slice(0, stone.length / 2);
    const rightHalf = stone.slice(stone.length / 2)
      .replace(/^0+(?=.)/, "");
    memo[key] = countStonesRecObj({ ...ctx, stone: leftHalf }) +
      countStonesRecObj({ ...ctx, stone: rightHalf });
  } else if (stone === "0") {
    memo[key] = countStonesRecObj({ ...ctx, stone: "1" });
  } else {
    memo[key] = countStonesRecObj({ ...ctx, stone: String(+stone * 2024) });
  }

  return memo[key];
}

function countStonesAfter75Blinks(stones: string[]): number {
  let sum = 0;
  const origLength = stones.length;
  for (let i = 0; i < origLength; i++) {
    sum += countStonesRec({
      stone: stones[i],
      blinksRemaining: 1000,
      memo: new Map(),
      idx: i,
    });
  }
  return sum;
}
function countStonesAfter75BlinksObj(stones: string[]): number {
  let sum = 0;
  const origLength = stones.length;
  for (let i = 0; i < origLength; i++) {
    sum += countStonesRecObj({
      stone: stones[i],
      blinksRemaining: 1000,
      memo: {},
      idx: i,
    });
  }
  return sum;
}

Deno.test("Part 2: Given example", () => {
  const input = ["125", "17"];

  assertEquals(countStonesAfter75Blinks(input), 5.4741524973376205e+181);
});
