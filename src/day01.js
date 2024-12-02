const fs = require("node:fs");
const input = fs.readFileSync("input/day01.txt", "utf-8");

const list1 = [];
const list2 = [];
input.split("\n").forEach((line) => {
  var nums = line.split(/ +/);
  list1.push(parseInt(nums[0]));
  list2.push(parseInt(nums[1]));
});
list1.sort();
list2.sort();

// part 1

let distance = 0;
for (let i = 0; i < list1.length; i++) {
  distance += Math.abs(list1[i] - list2[i]);
}
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
console.log(similarity)
