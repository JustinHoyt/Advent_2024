export function add(a: number, b: number): number {
  return a + b;
}

export function sum(list: number[]): number {
  return list.reduce(add, 0);
}

export function mul(a: number, b: number) {
  return a * b;
}

export function product(list: number[]) {
  return list.reduce(mul, 1);
}
