import { assertEquals } from "@std/assert/equals";

if (import.meta.main) {
  const lines: string[] = Deno.readTextFileSync("input.txt")
    .trim()
    .split("\n");

  const targets = lines
    .map((line) => line.match(/(\d+): .*/)![1])
    .map(Number);

  const nums = lines
    .map((line) => line.match(/\d+: (.*)/)![1])
    .map((line) => line.split(/\s+/).map(Number));

  console.log(sumEquationsThatEqualTarget(nums, targets));
  console.log(sumEquationsThatEqualTargetWithConcat(nums, targets));
}

// Part 1

function sumEquationsThatEqualTarget(
  rowsOfNums: number[][],
  targets: number[],
): number {
  let sum = 0;

  for (const [r, target] of targets.entries()) {
    const nums = rowsOfNums[r];

    function canProduceTarget(
      sofar: number,
      currIdx = 1,
    ): boolean {
      if (currIdx === nums.length) return sofar === target;
      if (sofar > target) return false;

      return canProduceTarget(sofar + nums[currIdx], currIdx + 1) ||
        canProduceTarget(sofar * nums[currIdx], currIdx + 1);
    }

    if (canProduceTarget(rowsOfNums[r][0])) sum += target;
  }

  return sum;
}

Deno.test("Part 1: Given example", () => {
  const nums = [
    [10, 19],
    [81, 40, 27],
    [17, 5],
    [15, 6],
    [6, 8, 6, 15],
    [16, 10, 13],
    [17, 8, 14],
    [9, 7, 18, 13],
    [11, 6, 16, 20],
  ];

  const targets = [
    190,
    3267,
    83,
    156,
    7290,
    161011,
    192,
    21037,
    292,
  ];

  assertEquals(sumEquationsThatEqualTarget(nums, targets), 3749);
});

// Part 2

function sumEquationsThatEqualTargetWithConcat(
  rowsOfNums: number[][],
  targets: number[],
): number {
  let sum = 0;

  for (const [r, target] of targets.entries()) {
    const nums = rowsOfNums[r];

    function canProduceTarget(
      sofar: number,
      currIdx = 1,
    ): boolean {
      if (currIdx === nums.length) return sofar === target;
      if (sofar > target) return false;

      return canProduceTarget(sofar + nums[currIdx], currIdx + 1) ||
        canProduceTarget(sofar * nums[currIdx], currIdx + 1) ||
        canProduceTarget(
          Number(String(sofar) + String(nums[currIdx])),
          currIdx + 1,
        );
    }

    if (canProduceTarget(rowsOfNums[r][0])) sum += target;
  }

  return sum;
}

Deno.test("Part 2: Given example", () => {
  const nums = [
    [10, 19],
    [81, 40, 27],
    [17, 5],
    [15, 6],
    [6, 8, 6, 15],
    [16, 10, 13],
    [17, 8, 14],
    [9, 7, 18, 13],
    [11, 6, 16, 20],
  ];

  const targets = [
    190,
    3267,
    83,
    156,
    7290,
    161011,
    192,
    21037,
    292,
  ];

  assertEquals(sumEquationsThatEqualTargetWithConcat(nums, targets), 11387);
});
