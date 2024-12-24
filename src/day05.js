const fs = require("node:fs");
const input = fs.readFileSync("input/day05.txt", "utf-8");

let [input1, input2] = input
  .split(/(?:\r?\n){2,}/)
  .map((section) => section.split(/\r?\n/));

const rules = input1.map((rule) => rule.split("|"));
const updates = input2.map((update) => update.split(","));

const isCorrect = (page1, page2) =>
  !rules.some((rule) => rule[0] == page2 && rule[1] == page1);

const middleSum = (list) =>
  list
    .map((update) => +update[Math.floor(update.length / 2)])
    .reduce((prev, curr) => prev + curr, 0);

// part 1

const correctUpdates = updates.filter((update) =>
  update
    .map((page1, i) =>
      update
        .filter((_, j) => i < j)
        .map((page2) => isCorrect(page1, page2))
        .reduce((prev, curr) => prev && curr, true)
    )
    .reduce((prev, curr) => prev && curr, true)
);

console.log(middleSum(correctUpdates));

// part 2

const incorrectUpdates = updates.filter(
  (update) => !correctUpdates.includes(update)
);

const fixedUpdates = incorrectUpdates.map((update) =>
  update.sort((a, b) => -isCorrect(a, b) + 0.5)
);

result = console.log(middleSum(fixedUpdates));
