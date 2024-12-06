import { assertEquals } from "@std/assert/equals";

if (import.meta.main) {
  const [orderingPairs, updateLines] = Deno.readTextFileSync("input.txt")
    .trim()
    .split("\n\n");

  const numericOrderedPairs: Array<[number, number]> = orderingPairs
    .split("\n")
    .map((line) => line.split("|"))
    .map(([key, value]) => [Number(key), Number(value)]);
  const orderingMap = new Map<number, Set<number>>();
  for (const [key, value] of numericOrderedPairs) {
    const set = orderingMap.get(key) ?? new Set();
    orderingMap.set(key, set.add(value));
  }

  const numericUpdatedLines = updateLines
    .split("\n")
    .map((line) => line.split(",").map(Number));

  console.log(sumValidUpdates(
    orderingMap,
    numericUpdatedLines,
  ));
  console.log(sumInvalidUpdates(
    orderingMap,
    numericUpdatedLines,
  ));
}

// Part 1

function sumValidUpdates(
  orderingPairs: Map<number, Set<number>>,
  updateLines: number[][],
): number {
  function isOrdered(updateLine: number[]): boolean {
    for (let i = 0; i < updateLine.length; i++) {
      for (let j = i + 1; j < updateLine.length; j++) {
        if (orderingPairs.get(updateLine[j])?.has(updateLine[i])) return false;
      }
    }
    return true;
  }

  let sum = 0;

  for (const updateLine of updateLines) {
    const midIdx = Math.floor(updateLine.length / 2);
    if (isOrdered(updateLine)) sum += updateLine[midIdx];
  }

  return sum;
}

Deno.test("Part 1: Given example", () => {
  const orderingPairs = new Map([
    [47, new Set([53, 13, 61, 29])],
    [97, new Set([13, 61, 47, 29, 53, 75])],
    [75, new Set([29, 53, 47, 61, 13])],
    [61, new Set([13, 53, 29])],
    [29, new Set([13])],
    [53, new Set([29, 13])],
  ]);

  const updateLines = [
    [75, 47, 61, 53, 29],
    [97, 61, 53, 29, 13],
    [75, 29, 13],
    [75, 97, 47, 61, 53],
    [61, 13, 29],
    [97, 13, 75, 29, 47],
  ];

  assertEquals(sumValidUpdates(orderingPairs, updateLines), 143);
});

// Part 2

function sumInvalidUpdates(
  orderingPairs: Map<number, Set<number>>,
  updateLines: number[][],
): number {
  let sum = 0;

  for (const updateLine of updateLines) {
    const sortedUpdateLine = updateLine.toSorted(
      (a, b) => orderingPairs.get(a)?.has(b) ? -1 : 1,
    );

    if (JSON.stringify(updateLine) !== JSON.stringify(sortedUpdateLine)) {
      const midIdx = Math.floor(updateLine.length / 2);
      sum += sortedUpdateLine[midIdx];
    }
  }

  return sum;
}

Deno.test("Part 2: Given example", () => {
  const orderingPairs = new Map([
    [47, new Set([53, 13, 61, 29])],
    [97, new Set([13, 61, 47, 29, 53, 75])],
    [75, new Set([29, 53, 47, 61, 13])],
    [61, new Set([13, 53, 29])],
    [29, new Set([13])],
    [53, new Set([29, 13])],
  ]);

  const updateLines = [
    [75, 47, 61, 53, 29],
    [97, 61, 53, 29, 13],
    [75, 29, 13],
    [75, 97, 47, 61, 53],
    [61, 13, 29],
    [97, 13, 75, 29, 47],
  ];

  assertEquals(sumInvalidUpdates(orderingPairs, updateLines), 123);
});
