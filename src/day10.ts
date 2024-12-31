import { readFileSync } from "node:fs";
const input = readFileSync("input/day10.txt", "utf-8");

class Coords {
  i: number;
  j: number;

  constructor(i: number, j: number) {
    this.i = i;
    this.j = j;
  }

  toString() {
    return `${this.i},${this.j}`;
  }
}

const neighbors = (map: number[][], coords: Coords): Coords[] => {
  const neighbors: Coords[] = [];
  if (coords.i + 1 < map.length) {
    neighbors.push(new Coords(coords.i + 1, coords.j));
  }
  if (coords.j + 1 < map[coords.i].length) {
    neighbors.push(new Coords(coords.i, coords.j + 1));
  }
  if (coords.i - 1 >= 0) {
    neighbors.push(new Coords(coords.i - 1, coords.j));
  }
  if (coords.j - 1 >= 0) {
    neighbors.push(new Coords(coords.i, coords.j - 1));
  }
  return neighbors;
};

const findNines = (map: number[][], coords: Coords): Set<string> => {
  const current = map[coords.i][coords.j];
  let nines = new Set<string>();
  if (current === 9) {
    nines.add(coords.toString());
  } else {
    neighbors(map, coords)
      .filter((neighbor) => map[neighbor.i][neighbor.j] === current + 1)
      .forEach((neighbor) =>
        findNines(map, neighbor).forEach((nine) => nines.add(nine.toString()))
      );
  }
  return nines;
};

const countPaths = (map: number[][], coords: Coords): number => {
  const current = map[coords.i][coords.j];
  if (current === 9) {
    return 1;
  } else {
    return neighbors(map, coords)
      .filter((neighbor) => map[neighbor.i][neighbor.j] === current + 1)
      .map((neighbor) => countPaths(map, neighbor))
      .reduce((prev, curr) => prev + curr, 0);
  }
};

const part1 = (map: number[][], trailheads: Coords[]): void => {
  const result = trailheads
    .map((trailhead) => findNines(map, trailhead).size)
    .reduce((prev, curr) => prev + curr, 0);

  console.log(result);
};

const part2 = (map: number[][], trailheads: Coords[]): void => {
  const result = trailheads
    .map((trailhead) => countPaths(map, trailhead))
    .reduce((prev, curr) => prev + curr, 0);

  console.log(result);
};

const map = input.split(/\r?\n/).map((line) => line.split("").map(Number));

let trailheads: Coords[] = [];
map.forEach((line, i) =>
  line.forEach((value, j) => value === 0 && trailheads.push(new Coords(i, j)))
);

part1(map, trailheads);
part2(map, trailheads);
