import { readFileSync } from "node:fs";
const input = readFileSync("input/day01.txt", "utf-8");

const [list1, list2] = input
  .split(/\r?\n/)
  .reduce<number[][]>(
    (lists, line: string) => {
      line
        .split(/ +/)
        .forEach((value, index) => lists[index].push(parseInt(value)));
      return lists;
    },
    [[], []]
  )
  .map((list) => list.sort());

// part 1

const distance = list1.reduce<number>(
  (prev, _, index) => prev + Math.abs(list1[index] - list2[index]),
  0
);
console.log(distance);

// part 2

let similarity = 0;
let j = 0;
for (let i = 0; i < list1.length; i++) {
  if (list1[i] < list2[j]) {
    continue;
  }
  while (list1[i] > list2[j]) {
    j++;
  }
  while (list1[i] === list2[j]) {
    similarity += list1[i];
    j++;
  }
}
console.log(similarity);
