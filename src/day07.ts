import { readFileSync } from "node:fs";
const input = readFileSync("input/day07.txt", "utf-8");

interface Equation {
  target: number;
  values: number[];
}

type operator = "+" | "*";

const equations: Equation[] = input
  .split(/\r?\n/)
  .map((line) => line.split(": "))
  .map((pair) => ({
    target: Number(pair[0]),
    values: pair[1].split(" ").map(Number),
  }));

const calculateTotal = (values: number[], operators: operator[]): number =>
  operators.reduce(
    (prev, curr, i) =>
      curr === "+" ? prev + values[i + 1] : prev * values[i + 1],
    values[0]
  );

// part 1

let isCorrect = (runningTotal: number, values: number[], target: number) => {
  if (values.length === 0) {
    return runningTotal === target;
  }

  const [nextValue, ...remainingValues] = values;

  if (
    runningTotal + nextValue <= target &&
    isCorrect(runningTotal + nextValue, remainingValues, target)
  ) {
    return true;
  }
  if (
    runningTotal * nextValue <= target &&
    isCorrect(runningTotal * nextValue, remainingValues, target)
  ) {
    return true;
  }
  return false;
};

let correctEquations = equations.filter((equation) =>
  isCorrect(equation.values[0], equation.values.slice(1), equation.target)
);

console.log(correctEquations.reduce((prev, curr) => prev + curr.target, 0));

// part 2

const joinNumbers = (x: number, y: number): number => Number(`${x}${y}`);

isCorrect = (runningTotal, values, target) => {
  if (values.length === 0) {
    return runningTotal === target;
  }

  const [nextValue, ...remainingValues] = values;

  if (
    runningTotal + nextValue <= target &&
    isCorrect(runningTotal + nextValue, remainingValues, target)
  ) {
    return true;
  }
  if (
    runningTotal * nextValue <= target &&
    isCorrect(runningTotal * nextValue, remainingValues, target)
  ) {
    return true;
  }
  if (
    joinNumbers(runningTotal, nextValue) <= target &&
    isCorrect(joinNumbers(runningTotal, nextValue), remainingValues, target)
  ) {
    return true;
  }
  return false;
};

correctEquations = equations.filter((equation) =>
  isCorrect(equation.values[0], equation.values.slice(1), equation.target)
);

console.log(correctEquations.reduce((prev, curr) => prev + curr.target, 0));
