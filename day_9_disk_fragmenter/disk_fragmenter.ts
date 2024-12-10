import { assertEquals } from "@std/assert/equals";

if (import.meta.main) {
  const grid: string = Deno.readTextFileSync("input.txt").trim();

  console.log(compactFiles(grid));
  console.log(compactFilesContiguously(grid));
}

type Type = "file" | "space";

function generateFilesAndFreeSpace(diskMap: string): string[] {
  const filesAndFreeSpace: string[] = [];
  let type = "file" as Type;

  let id = 0;
  for (const length of diskMap.split("").map(Number)) {
    switch (type) {
      case "file":
        for (let i = 0; i < length; i++) filesAndFreeSpace.push(`${id}`);
        id++;
        break;
      case "space":
        for (let i = 0; i < length; i++) filesAndFreeSpace.push(".");
        break;
    }

    type = type === "file" ? "space" : "file";
  }

  return filesAndFreeSpace;
}

function getChecksum(filesAndFreeSpace: string[]): number {
  // console.log(filesAndFreeSpace.join("|"));
  let count = 0;
  for (const [i, char] of filesAndFreeSpace.entries()) {
    if (char === ".") continue;
    count += i * Number(char);
  }
  return count;
}

function compactDisk(filesAndFreeSpace: string[]): string[] {
  const nextEmptySpace = (start: number): number => {
    for (let i = start; i < filesAndFreeSpace.length; i++) {
      if (filesAndFreeSpace[i] === ".") return i;
    }
    return -1;
  };

  const lastFilledSpace = (end: number): number => {
    for (let i = end; i > -1; i--) {
      if (filesAndFreeSpace[i] !== ".") return i;
    }
    return -1;
  };

  let start = nextEmptySpace(0);
  let end = lastFilledSpace(filesAndFreeSpace.length - 1);
  while (start < end && start !== -1 && end !== -1) {
    [
      filesAndFreeSpace[start],
      filesAndFreeSpace[end],
    ] = [
      filesAndFreeSpace[end],
      filesAndFreeSpace[start],
    ];

    start = nextEmptySpace(start);
    end = lastFilledSpace(end);
  }

  return filesAndFreeSpace;
}

// Part 1

// returns the checksum of the newly compacted files
function compactFiles(diskMap: string): number {
  const filesAndFreeSpace = generateFilesAndFreeSpace(diskMap);
  const compactedDisk = compactDisk(Array.from(filesAndFreeSpace));
  const checksum = getChecksum(compactedDisk);
  return checksum;
}

Deno.test("Part 1: Given example", () => {
  const input = "2333133121414131402";

  assertEquals(compactFiles(input), 1928);
});

// Part 2

function print(filesAndFreeSpace: string[], count = 10) {
  if (count++ < 10) {
    console.log(
      filesAndFreeSpace.map((_, i) => Math.floor(i / 10))
        .join("|"),
    );
    console.log(
      filesAndFreeSpace.map((_, i) => i % 10).join("|"),
    );
    console.log(
      filesAndFreeSpace.map(() => "-").join("|"),
    );
    console.log(
      filesAndFreeSpace.join("|"),
    );
    console.log();
  }
}

function firstEmptyRange(
  filesAndFreeSpace: string[],
  length: number,
): [number, number] | null {
  for (let l = 0; l < filesAndFreeSpace.length; l++) {
    const leftChar = filesAndFreeSpace[l];
    if (leftChar === ".") {
      for (let r = l; r < filesAndFreeSpace.length; r++) {
        const rightChar = filesAndFreeSpace[r];
        if (rightChar === "." && r - l === length - 1) return [l, r];
        if (rightChar !== ".") break;
      }
    }
  }

  return null;
}

function lastFilledRange(
  filesAndFreeSpace: string[],
  endIdx: number,
): [number, number] | null {
  for (let r = endIdx; r > -1; r--) {
    const rightChar = filesAndFreeSpace[r];
    if (rightChar !== ".") {
      for (let l = r; l > -1; l--) {
        if (filesAndFreeSpace[l] !== rightChar) {
          return [l + 1, r];
        }
      }
    }
  }
  return null;
}

function swapRanges(
  filesAndFreeSpace: string[],
  [emptyLeft, _emptyRight]: [number, number],
  [filledLeft, filledRight]: [number, number],
): void {
  for (let i = 0; i < filledRight - filledLeft + 1; i++) {
    [
      filesAndFreeSpace[emptyLeft + i],
      filesAndFreeSpace[filledLeft + i],
    ] = [
      filesAndFreeSpace[filledLeft + i],
      filesAndFreeSpace[emptyLeft + i],
    ];
  }
}
function compactDiskContiguously(filesAndFreeSpace: string[]): string[] {
  let rightIdx = filesAndFreeSpace.length;
  while (true) {
    const filledRange = lastFilledRange(filesAndFreeSpace, rightIdx - 1);
    if (filledRange == null) return filesAndFreeSpace;

    rightIdx = filledRange[0];
    const rangeLenth = filledRange[1] - filledRange[0] + 1;
    const emptyRange = firstEmptyRange(filesAndFreeSpace, rangeLenth);

    if (emptyRange == null || emptyRange[0] > filledRange[0]) continue;

    swapRanges(filesAndFreeSpace, emptyRange, filledRange);
  }
}

// returns the checksum of the newly compacted files
function compactFilesContiguously(diskMap: string): number {
  const filesAndFreeSpace = generateFilesAndFreeSpace(diskMap);
  const compactedDisk = compactDiskContiguously(Array.from(filesAndFreeSpace));
  const checksum = getChecksum(compactedDisk);
  return checksum;
}

Deno.test("Part 2: Given example", () => {
  const input = "2333133121414131402";

  assertEquals(compactFilesContiguously(input), 2858);
});

Deno.test("Part 2: Free memory directly adjacent to filled memory", () => {
  const input = "3322";

  assertEquals(compactFilesContiguously(input), 7);
});
