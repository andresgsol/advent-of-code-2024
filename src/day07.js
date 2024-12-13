const fs = require("node:fs");
const input = fs.readFileSync("input/day07.txt", "utf-8");

const equations = input
  .split("\n")
  .map((line) => line.split(": "))
  .map((pair) => {
    return { target: Number(pair[0]), values: pair[1].split(" ").map(Number) };
  });

const calculateTotal = (values, operators) =>
  operators.reduce(
    (prev, curr, i) =>
      curr == "+" ? prev + values[i + 1] : prev * values[i + 1],
    values[0]
  );

// part 1

let isCorrect = (runningTotal, values, target) => {
  if (values.length == 0) {
    return runningTotal == target;
  }
  if (runningTotal + values[0] <= target) {
    if (isCorrect(runningTotal + values[0], values.slice(1), target)) {
      return true;
    }
  }
  if (runningTotal * values[0] <= target) {
    if (isCorrect(runningTotal * values[0], values.slice(1), target)) {
      return true;
    }
  }
  return false;
};

let correctEquations = equations.filter((equation) =>
  isCorrect(equation.values[0], equation.values.slice(1), equation.target)
);

console.log(correctEquations.reduce((prev, curr) => prev + curr.target, 0));

// part 2

const joinNumbers = (x, y) => Number("" + x + y);

isCorrect = (runningTotal, values, target) => {
  if (values.length == 0) {
    return runningTotal == target;
  }
  if (runningTotal + values[0] <= target) {
    if (isCorrect(runningTotal + values[0], values.slice(1), target)) {
      return true;
    }
  }
  if (runningTotal * values[0] <= target) {
    if (isCorrect(runningTotal * values[0], values.slice(1), target)) {
      return true;
    }
  }
  if (joinNumbers(runningTotal, values[0]) <= target) {
    if (
      isCorrect(joinNumbers(runningTotal, values[0]), values.slice(1), target)
    ) {
      return true;
    }
  }
  return false;
};

correctEquations = equations.filter((equation) =>
  isCorrect(equation.values[0], equation.values.slice(1), equation.target)
);

console.log(correctEquations.reduce((prev, curr) => prev + curr.target, 0));
