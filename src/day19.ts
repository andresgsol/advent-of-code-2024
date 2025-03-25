import { readFileSync } from "node:fs";
const input = readFileSync("input/day19.txt", "utf-8");

const [input1, input2] = input.split(/(?:\r?\n){2,}/);
const towels = input1.split(", ");
const designs = input2.split(/\r?\n/);

const cache = new Map<string, number>();

const countCombinations = (towels: string[], design: string) => {
  if (cache.has(design)) {
    return cache.get(design)!;
  }

  if (design.length === 0) {
    return 1;
  }

  let counter = 0;
  for (const towel of towels) {
    if (design.indexOf(towel) === 0) {
      counter += countCombinations(towels, design.slice(towel.length));
    }
  }
  cache.set(design, counter);
  return counter;
};

const combinations = designs.map((design) => countCombinations(towels, design));

// Part 1
console.log(combinations.filter((combination) => combination).length);

// Part 2
console.log(combinations.reduce((prev, curr) => prev + curr, 0));
