import { lookupService } from "node:dns";
import { readFileSync } from "node:fs";
const input = readFileSync("input/day25.txt", "utf-8");

const locks: number[][] = [];
const keys: number[][] = [];

const toColumns = (matrix: string[][]) => {
  // basically transposing the matrix
  const columns: string[] = [];
  for (let i = 0; i < matrix[0].length; i++) {
    let row = "";
    for (let j = 0; j < matrix.length; j++) {
      row += matrix[j][i];
    }
    columns.push(row);
  }
  return columns;
}

const parseKeyLock = (columns: string[]) => {
  const isLock = columns[0][0] === "#";
  const heights = columns.map((col) => col.indexOf(isLock ? "." : "#") - 1);
  if (isLock) {
    locks.push(heights);
  } else {
    keys.push(heights);
  }
};

const doesOverlap = (lock: number[], key: number[]) => {
  for (let i = 0; i < lock.length; i++) {
    if (lock[i] > key[i]) return false;
  }
  return true;
}

input
  .split(/(?:\r?\n){2,}/)
  .map((block) => block.split(/\r?\n/).map((line) => line.split("")))
  .map(toColumns).map(parseKeyLock);

console.log(
  keys.reduce((total, key) => total + locks.filter(lock => doesOverlap(lock, key)).length, 0)
)