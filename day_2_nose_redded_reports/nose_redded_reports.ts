import { assertEquals } from "jsr:@std/assert";

if (import.meta.main) {
  const parseNumArrray = (line: string) => line.split(/\s+/).map(Number);

  const input = Deno.readTextFileSync("input.txt")
    .trim()
    .split("\n")
    .map(parseNumArrray);

  console.log(numSafeReports(input));
  console.log(numSafeReportWithDampeners(input));
}

/**
 * A report is valid if the numbers increase by 1-3 until the end, or decrease
 * by 1-3 until the end
 */
function isSafeReport(report: number[]): boolean {
  if (report.length < 2) return true;

  const direction = report[0] < report[1] ? "asc" : "desc";

  for (let i = 0; i < report.length - 1; i++) {
    const change = report[i + 1] - report[i];

    if (direction === "asc" && (change < 1 || 3 < change)) return false;
    else if (direction === "desc" && (change < -3 || -1 < change)) return false;
  }

  return true;
}

function numSafeReports(reports: number[][]): number {
  return reports.reduce(
    (acc, report) => acc + Number(isSafeReport(report)),
    0,
  );
}

// Part 2

/**
 * The Problem Dampener allows us to remove one bad number in the sequence to
 * make some unsafe reports safe
 */
function isSafeReportWithDampener(report: number[], skipsAllowed = 1): boolean {
  if (report.length < 2) return true;

  let ascPairsMinusDescPairs = 0;
  for (let i = 0; i < report.length - 1; i++) {
    if (report[i + 1] - report[i] > 0) ascPairsMinusDescPairs += 1;
    else if (report[i + 1] - report[i] < 0) ascPairsMinusDescPairs -= 1;
  }

  const direction = ascPairsMinusDescPairs > 0 ? "asc" : "desc";

  for (let i = 0; i < report.length - 1; i++) {
    const change = report[i + 1] - report[i];

    const unchanged = change === 0;
    const ascAndOutOfBounds = direction === "asc" && (change < 1 || 3 < change);
    const descAndOutOfBounds = direction === "desc" &&
      (change < -3 || -1 < change);

    if (unchanged || ascAndOutOfBounds || descAndOutOfBounds) {
      if (skipsAllowed-- > 0) {
        return isSafeReportWithDampener(
          report.toSpliced(i, 1),
          skipsAllowed - 1,
        ) ||
          isSafeReportWithDampener(
            report.toSpliced(i + 1, 1),
            skipsAllowed - 1,
          );
      } else {
        return false;
      }
    }
  }

  return true;
}

function numSafeReportWithDampeners(reports: number[][]): number {
  return reports.reduce(
    (acc, report) => acc + Number(isSafeReportWithDampener(report)),
    0,
  );
}

Deno.test("safe with dampener", () => {
  assertEquals(isSafeReportWithDampener([7, 6, 4, 2, 1]), true);
});

Deno.test("unsafe with dampener", () => {
  assertEquals(isSafeReportWithDampener([1, 2, 7, 8, 9]), false);
});

Deno.test("unsafe with dampener", () => {
  assertEquals(isSafeReportWithDampener([9, 7, 6, 2, 1]), false);
});

Deno.test("safe with dampener", () => {
  assertEquals(isSafeReportWithDampener([1, 3, 2, 4, 5]), true);
});

Deno.test("safe with dampener", () => {
  assertEquals(isSafeReportWithDampener([8, 6, 4, 4, 1]), true);
});

Deno.test("safe with dampener", () => {
  assertEquals(isSafeReportWithDampener([1, 3, 6, 7, 9]), true);
});
