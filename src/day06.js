const fs = require("node:fs");
const input = fs.readFileSync("input/day06.txt", "utf-8");

const map = input.split(/\r?\n/).map((line) => line.split(""));

const isInMap = (x, y) => {
  return x >= 0 && x < map[0].length && y >= 0 && y < map.length;
};

const start = input.replaceAll(/\r?\n/g, "").indexOf("^");
const xStart = start % map[0].length;
const yStart = Math.floor(start / map.length);

// part 1

let vector = {
  x: 0,
  y: -1,
  rotateRight() {
    const newX = -this.y;
    this.y = this.x;
    this.x = newX;
  },
};
let pos = {
  x: xStart,
  y: yStart,
  move(vector) {
    this.x += vector.x;
    this.y += vector.y;
  },
};
let visited = new Set();
while (isInMap(pos.x, pos.y)) {
  visited.add(`${pos.x},${pos.y}`);
  while (
    isInMap(pos.x + vector.x, pos.y + vector.y) &&
    map[pos.y + vector.y][pos.x + vector.x] == "#"
  ) {
    vector.rotateRight();
  }
  pos.move(vector);
}
console.log(visited.size);

// part 2

let loopCounter = 0;
for (let i = 0; i < map.length; i++) {
  for (let j = 0; j < map[i].length; j++) {
    if (map[i][j] == ".") {
      map[i][j] = "#";

      vector = { ...vector, x: 0, y: -1 };
      pos = { ...pos, x: xStart, y: yStart };
      visited = new Set();
      while (isInMap(pos.x, pos.y)) {
        if (visited.has(`${pos.x},${pos.y},${vector.x},${vector.y}`)) {
          loopCounter++;
          break;
        }
        visited.add(`${pos.x},${pos.y},${vector.x},${vector.y}`);
        while (
          isInMap(pos.x + vector.x, pos.y + vector.y) &&
          map[pos.y + vector.y][pos.x + vector.x] == "#"
        ) {
          vector.rotateRight();
        }
        pos.move(vector);
      }

      map[i][j] = ".";
    }
  }
}
console.log(loopCounter);
