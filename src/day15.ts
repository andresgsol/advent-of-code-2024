import { readFileSync } from "node:fs";
const input = readFileSync("input/day15.txt", "utf-8");

type Coords = {
  x: number;
  y: number;
};

const [input1, input2] = input.split(/(?:\r?\n){2,}/);

const walls: Coords[] = [];
const boxes: Coords[] = [];
let robot: Coords = { x: 0, y: 0 };

input1.split(/\r?\n/).map((line, y) =>
  line.split("").forEach((value, x) => {
    if (value === "O") {
      boxes.push({ x, y });
    } else if (value === "#") {
      walls.push({ x, y });
    } else if (value === "@") {
      robot = { x, y };
    }
  })
);

const moves = input2.split("");

console.log(walls);
console.log(boxes);
console.log(robot);
console.log(moves);
