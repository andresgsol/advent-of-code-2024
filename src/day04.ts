import { readFileSync } from "node:fs";
const input = readFileSync("input/day04.txt", "utf-8");

const x = input.split(/\r?\n/).map((line) => line.split(""));

// part 1

const isForwards = (x: string[][], i: number, j: number) =>
  j + 3 < x[i].length && isXmas(x[i][j], x[i][j + 1], x[i][j + 2], x[i][j + 3])
    ? 1
    : 0;
const isBackwards = (x: string[][], i: number, j: number) =>
  j - 3 >= 0 && isXmas(x[i][j], x[i][j - 1], x[i][j - 2], x[i][j - 3]) ? 1 : 0;
const isDownwards = (x: string[][], i: number, j: number) =>
  i + 3 < x.length && isXmas(x[i][j], x[i + 1][j], x[i + 2][j], x[i + 3][j])
    ? 1
    : 0;
const isUpwards = (x: string[][], i: number, j: number) =>
  i - 3 >= 0 && isXmas(x[i][j], x[i - 1][j], x[i - 2][j], x[i - 3][j]) ? 1 : 0;
const isDiagonalUpLeft = (x: string[][], i: number, j: number) =>
  i - 3 >= 0 &&
  j - 3 >= 0 &&
  isXmas(x[i][j], x[i - 1][j - 1], x[i - 2][j - 2], x[i - 3][j - 3])
    ? 1
    : 0;
const isDiagonalUpRight = (x: string[][], i: number, j: number) =>
  i - 3 >= 0 &&
  j + 3 < x[i].length &&
  isXmas(x[i][j], x[i - 1][j + 1], x[i - 2][j + 2], x[i - 3][j + 3])
    ? 1
    : 0;
const isDiagonalDownLeft = (x: string[][], i: number, j: number) =>
  i + 3 < x.length &&
  j - 3 >= 0 &&
  isXmas(x[i][j], x[i + 1][j - 1], x[i + 2][j - 2], x[i + 3][j - 3])
    ? 1
    : 0;
const isDiagonalDownRight = (x: string[][], i: number, j: number) =>
  i + 3 < x.length &&
  j + 3 < x[i].length &&
  isXmas(x[i][j], x[i + 1][j + 1], x[i + 2][j + 2], x[i + 3][j + 3])
    ? 1
    : 0;

const isXmas = (x: string, m: string, a: string, s: string) =>
  x === "X" && m === "M" && a === "A" && s === "S";

let counter = 0;

for (let i = 0; i < x.length; i++) {
  for (let j = 0; j < x[i].length; j++) {
    counter +=
      isForwards(x, i, j) +
      isBackwards(x, i, j) +
      isUpwards(x, i, j) +
      isDownwards(x, i, j) +
      isDiagonalUpLeft(x, i, j) +
      isDiagonalUpRight(x, i, j) +
      isDiagonalDownLeft(x, i, j) +
      isDiagonalDownRight(x, i, j);
  }
}

console.log(counter);

// part 2

const isX_mas = (x: string[][], i: number, j: number) =>
  (isMas(x[i][j], x[i + 1][j + 1], x[i + 2][j + 2]) ||
    isMas(x[i + 2][j + 2], x[i + 1][j + 1], x[i][j])) &&
  (isMas(x[i][j + 2], x[i + 1][j + 1], x[i + 2][j]) ||
    isMas(x[i + 2][j], x[i + 1][j + 1], x[i][j + 2]))
    ? 1
    : 0;

const isMas = (m: string, a: string, s: string) =>
  m === "M" && a === "A" && s === "S";

counter = 0;

for (let i = 0; i + 2 < x.length; i++) {
  for (let j = 0; j + 2 < x[i].length; j++) {
    counter += isX_mas(x, i, j);
  }
}

console.log(counter);
