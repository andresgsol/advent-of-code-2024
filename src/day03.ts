import { readFileSync } from "node:fs";
const input = readFileSync("input/day03.txt", "utf-8");

// part 1

let operations = [...input.matchAll(/mul\([0-9]{1,3},[0-9]{1,3}\)/g)].map(
  (regExpExecArray) => regExpExecArray[0]
);

let result = operations
  .map((operation) => {
    const x = parseInt(operation.substring(4, operation.indexOf(",")));
    const y = parseInt(
      operation.substring(operation.indexOf(",") + 1, operation.indexOf(")"))
    );
    return x * y;
  })
  .reduce((prev, curr) => prev + curr, 0);

console.log(result);

// part 2

operations = [
  ...input.matchAll(/mul\([0-9]{1,3},[0-9]{1,3}\)|do\(\)|don\'t\(\)/g),
].map((regExpExecArray) => regExpExecArray[0]);

var isDo = true;
result = 0;
for (const operation of operations) {
  if (operation.startsWith("don't")) {
    isDo = false;
  } else if (operation.startsWith("do")) {
    isDo = true;
  } else if (isDo) {
    const x = parseInt(operation.substring(4, operation.indexOf(",")));
    const y = parseInt(
      operation.substring(operation.indexOf(",") + 1, operation.indexOf(")"))
    );
    result += x * y;
  }
}

console.log(result);
