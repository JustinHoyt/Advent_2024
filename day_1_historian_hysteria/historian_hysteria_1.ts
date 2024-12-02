if (import.meta.main) {
  const parseNumArrray = (line: string) => line.split(/\s+/).map(Number);

  const pairs = Deno.readTextFileSync("input.txt")
    .trim()
    .split("\n")
    .map(parseNumArrray) as Array<[number, number]>;

  const arr1 = [];
  const arr2 = [];
  for (const [left, right] of pairs) {
    arr1.push(left);
    arr2.push(right);
  }
  arr1.sort();
  arr2.sort();

  console.log(sumDistances(arr1, arr2));
  console.log(sumSimilarityScore(arr1, arr2));
}

function sumDistances(arr1: number[], arr2: number[]) {
  let sum = 0;

  for (let i = 0; i < arr1.length; i++) {
    sum += Math.abs(arr1[i] - arr2[i]);
  }

  return sum;
}

function sumSimilarityScore(arr1: number[], arr2: number[]) {
  let sum = 0;
  const occurancesOfList2 = new Map<number, number>();
  for (const num of arr2) {
    occurancesOfList2.set(
      num,
      (occurancesOfList2.get(num) ?? 0) + 1,
    );
  }

  for (const num of arr1) {
    sum += num * (occurancesOfList2.get(num) ?? 0);
  }

  return sum;
}
