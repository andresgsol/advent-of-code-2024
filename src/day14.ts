import { readFileSync } from "node:fs";
const input = readFileSync("input/day14.txt", "utf-8");

const SECONDS = 100;
const WIDTH = 101;
const HEIGTH = 103;

type Coords = {
  x: number;
  y: number;
};

type Robot = {
  p: Coords;
  v: Coords;
};

const toRobot = (arr: Coords[]): Robot => ({ p: arr[0], v: arr[1] });

const toCoords = (arr: number[]): Coords => ({ x: arr[0], y: arr[1] });

const rawStringToCoords = (rawString: string): Coords =>
  toCoords(rawString.split("=")[1].split(",").map(Number));

const getQuadrant = ({ x, y }: Coords): number | undefined => {
  let quadrant;
  x < Math.floor(WIDTH / 2) && y < Math.floor(HEIGTH / 2) && (quadrant = 1);
  x > Math.floor(WIDTH / 2) && y < Math.floor(HEIGTH / 2) && (quadrant = 2);
  x < Math.floor(WIDTH / 2) && y > Math.floor(HEIGTH / 2) && (quadrant = 3);
  x > Math.floor(WIDTH / 2) && y > Math.floor(HEIGTH / 2) && (quadrant = 4);
  return quadrant;
};

const moveRobots = (robots: Robot[], seconds: number): Coords[] => {
  return robots.map(({ p, v }: Robot) => {
    const position: Coords = {
      x: (p.x + v.x * seconds) % WIDTH,
      y: (p.y + v.y * seconds) % HEIGTH,
    };
    position.x < 0 && (position.x += WIDTH);
    position.y < 0 && (position.y += HEIGTH);
    return position;
  });
};

const countPerQuadrant = (positions: Coords[]): number[] =>
  positions.reduce<number[]>(
    (prev, position) => {
      const quadrant = getQuadrant(position);
      if (quadrant) {
        prev[(quadrant as number) - 1]++;
      }
      return prev;
    },
    [0, 0, 0, 0]
  );

const hasSymmetrical = (coords: Coords, positions: Coords[]): boolean => {
  if (coords.x >= WIDTH / 2) {
    return false;
  }
  const symmetricalX = WIDTH - coords.x;
  return positions.some(
    (coords2) => coords.y === coords2.y && coords2.x === symmetricalX
  );
};

const countSymmetry = (positions: Coords[]): number => {
  return positions.filter((coords) => hasSymmetrical(coords, positions)).length;
};

const printPositions = (positions: Coords[]) => {
  for (let i = 0; i < HEIGTH; i++) {
    let line = "";
    for (let j = 0; j < WIDTH; j++) {
      line += positions.some((coords) => coords.x === j && coords.y === i)
        ? "X"
        : " ";
    }
    console.log(line);
  }
};

const part1 = (robots: Robot[]): void => {
  const finalPositions = moveRobots(robots, SECONDS);
  const quadrantCount = countPerQuadrant(finalPositions);
  const safetyFactor = quadrantCount.reduce((prev, curr) => prev * curr, 1);
  console.log(safetyFactor);
};

const part2 = (robots: Robot[]): void => {
  let [maxSymmetry, maxSymmetryIndex] = [0, 0];
  for (let i = 0; i < 10000; i++) {
    const positions = moveRobots(robots, i);
    const symmetryCount = countSymmetry(positions);
    if (symmetryCount > maxSymmetry) {
      maxSymmetry = symmetryCount;
      maxSymmetryIndex = i;
    }
  }
  console.log(maxSymmetryIndex);
};

const robots = input
  .split(/\r?\n/)
  .map((line) => line.split(" ").map(rawStringToCoords))
  .map(toRobot);

part1(robots);
part2(robots);
