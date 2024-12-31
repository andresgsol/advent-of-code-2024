import { readFileSync } from "node:fs";
const input = readFileSync("input/day06.txt", "utf-8");

const map = input.split(/\r?\n/).map((line) => line.split(""));

const isInMap = (x: number, y: number) => {
  return x >= 0 && x < map[0].length && y >= 0 && y < map.length;
};

const start = input.replaceAll(/\r?\n/g, "").indexOf("^");
const xStart = start % map[0].length;
const yStart = Math.floor(start / map.length);

interface Vector {
  x: number;
  y: number;
  rotateRight(): void;
}

interface Position {
  x: number;
  y: number;
  move(vector: Vector): void;
}

let vector: Vector = {
  x: 0,
  y: -1,
  rotateRight() {
    const newX = -this.y;
    this.y = this.x;
    this.x = newX;
  },
};

let pos: Position = {
  x: xStart,
  y: yStart,
  move(vector: Vector) {
    this.x += vector.x;
    this.y += vector.y;
  },
};

// part 1

let visited: Set<string> = new Set();
while (isInMap(pos.x, pos.y)) {
  visited.add(`${pos.x},${pos.y}`);
  while (
    isInMap(pos.x + vector.x, pos.y + vector.y) &&
    map[pos.y + vector.y][pos.x + vector.x] === "#"
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
    if (map[i][j] === ".") {
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
          map[pos.y + vector.y][pos.x + vector.x] === "#"
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
