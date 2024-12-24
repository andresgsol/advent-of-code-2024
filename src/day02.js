const fs = require("node:fs");
const input = fs.readFileSync("input/day02.txt", "utf-8");

const reports = input
  .split(/\r?\n/)
  .map((line) => line.split(" ").map((value) => parseInt(value)));

const isReportSafe = (levels) => {
  if (levels.length < 2) {
    return true;
  }
  if (levels[0] > levels[1]) {
    levels.reverse();
  }
  for (let i = 1; i < levels.length; i++) {
    const diff = levels[i] - levels[i - 1];
    if (diff < 1 || diff > 3) {
      return false;
    }
  }
  return true;
};

// part 1

let areReportsSafe = reports.map((levels) => isReportSafe(levels));

let count = areReportsSafe.filter((value) => value).length;

console.log(count);

// part 2

areReportsSafe = reports.map((levels) => {
  if (isReportSafe(levels)) {
    return true;
  }
  for (let i = 0; i < levels.length; i++) {
    if (isReportSafe(levels.filter((_, index) => index !== i))) {
      return true;
    }
  }
  return false;
});

count = areReportsSafe.filter((value) => value).length;

console.log(count);
