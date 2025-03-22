import { readFileSync } from "node:fs";
const input = readFileSync("input/day18.txt", "utf-8");

const size = 71;
const fallenBytesCount = 1024;

const bytes = input.split(/\r?\n/).map((pair) => ({
  x: Number(pair.split(",")[0]),
  y: Number(pair.split(",")[1]),
}));

const getNeighbors = ({ x, y }: { x: number; y: number }) =>
  [
    { x: x + 1, y: y },
    { x: x - 1, y: y },
    { x: x, y: y + 1 },
    { x: x, y: y - 1 },
  ].filter(
    ({ x, y }) =>
      x >= 0 &&
      y >= 0 &&
      x < size &&
      y < size &&
      !fallenBytes.some((byte) => byte.x === x && byte.y === y)
  );

const bfs = () => {
  const queue = [{ x: 0, y: 0 }];
  const dist: number[][] = Array(size);
  for (let i = 0; i < dist.length; i++) {
    dist[i] = Array(size).fill(-1);
  }
  dist[0][0] = 0;

  while (queue.length > 0) {
    const curr = queue.shift()!;
    getNeighbors(curr).forEach((neighbor) => {
      if (dist[neighbor.y][neighbor.x] === -1) {
        dist[neighbor.y][neighbor.x] = dist[curr.y][curr.x] + 1;
        queue.push(neighbor);
      }
    });
  }
  return dist;
};

// part 1

let fallenBytes = bytes.slice(0, fallenBytesCount);
let dist = bfs();
console.log(dist[size - 1][size - 1]);

// part 2

let [curr, min, max] = [-1, fallenBytesCount, bytes.length - 1];
for (
  ;
  min < max;
  dist[size - 1][size - 1] === -1 ? (max = curr) : (min = curr + 1)
) {
  curr = Math.floor((max + min) / 2);
  fallenBytes = bytes.slice(0, curr + 1);
  dist = bfs();
}
console.log(bytes[max]);
