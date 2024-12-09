import { assertEquals } from "@std/assert/equals";

if (import.meta.main) {
  const grid: string = Deno.readTextFileSync("input.txt").trim();

  console.log(compactFile(grid));
}

// Part 1
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
  let count = 0;
  for (let i = 0; i < filesAndFreeSpace.length; i++) {
    if (filesAndFreeSpace[i] === ".") break;
    count += i * Number(filesAndFreeSpace[i]);
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

// returns the checksum of the newly compacted file
function compactFile(diskMap: string): number {
  const filesAndFreeSpace = generateFilesAndFreeSpace(diskMap);
  const compactedDisk = compactDisk(Array.from(filesAndFreeSpace));
  const checksum = getChecksum(compactedDisk);
  return checksum;
}

Deno.test("Part 1: Given example", () => {
  const input = "2333133121414131402";

  assertEquals(compactFile(input), 1928);
});
