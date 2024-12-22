const fs = require("node:fs");
const input = fs.readFileSync("input/day09.txt", "utf-8");

const checksum = (disk) =>
  disk.reduce(
    (prev, curr, i) => (prev + (curr == "." ? 0 : Number(curr)) * i),
    0
  );

const countDots = (disk, index) => {
  let i = 0;
  for (; index + i < disk.length && disk[index + i] == "."; i++);
  return i;
};

const part1 = (disk) => {
  let i = 0;
  let j = disk.length - 1;
  while (i < j) {
    for (; disk[i] != "."; i++);
    for (; disk[j] == "."; j--);
    if (i < j) {
      disk[i] = disk[j];
      disk[j] = ".";
      i++;
      j--;
    }
  }

  console.log(checksum(disk));
};

const part2 = (disk) => {
  let j = disk.length - 1;
  while (j > 0) {
    for (; disk[j] == "."; j--);

    const end = (start = j);
    for (; disk[start] == disk[end]; start--);
    const size = end - start;

    let index = disk.findIndex(
      (value, index) =>
        value == "." && index <= start && countDots(disk, index) >= size
    );

    if (index != -1) {
      for (; j > start; j--) {
        disk[index] = disk[j];
        disk[j] = ".";
        index++;
      }
    } else {
      j = start;
    }
  }

  console.log(checksum(disk));
};

let disk = [];
for (let i = 0; i < input.length; i++) {
  const char = i % 2 == 0 ? i / 2 + "" : ".";
  for (let j = 0; j < input[i]; j++) {
    disk.push(char);
  }
}

part1([...disk]);
part2([...disk]);
