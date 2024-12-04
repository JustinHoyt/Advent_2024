if (import.meta.main) {
  const input = Deno.readTextFileSync("input.txt")
    .trim()
    .split("\n");

  console.log(addUpMultiplications(input));
  console.log(addUpMultiplicationsWithDoStatements(input));
}

// Part 1

function parseMults(line: string): Array<[number, number]> {
  return line
    .matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g)
    .map(([_wholeMatch, num1, num2]) => [Number(num1), Number(num2)])
    .toArray() as [number, number][];
}

function addUpMultiplications(lines: string[]): number {
  return parseMults(lines.join("\n"))
    .map(([num1, num2]) => num1 * num2)
    .reduce((acc, num) => acc + num, 0);
}

// Part 2

function parseMultsWithDoStatements(
  line: string,
): Array<[number, number]> {
  // Regex matching is easier when adding `do` and `don't` statements around
  // the whole text because it makes the start of string and end of string
  // cases no longer special cases
  const lineWrappedWithDoBlock = `do()${line}don't()`;

  // find all `do()...don't()` blocks and parse out the multiplications for each
  return lineWrappedWithDoBlock
    .matchAll(/do\(\).*?don't\(\)/gs)
    .toArray()
    .flatMap(([doBlock]) => parseMults(doBlock));
}

function addUpMultiplicationsWithDoStatements(lines: string[]): number {
  return parseMultsWithDoStatements(lines.join("\n"))
    .map(([num1, num2]) => num1 * num2)
    .reduce((acc, num) => acc + num, 0);
}
