import { readFileSync } from "node:fs";

const input = readFileSync("input/day16.txt", "utf-8");

type Coords = {
  i: number;
  j: number;
};

const addCoords = (c1: Coords, c2: Coords) => ({
  i: c1.i + c2.i,
  j: c1.j + c2.j,
});

const equalCoords = (c1: Coords, c2: Coords) => c1.i === c2.i && c1.j === c2.j;

type Position = {
  coords: Coords;
  orientation: Coords;
};

const equalPosition = (p1: Position, p2: Position) =>
  equalCoords(p1.coords, p2.coords) &&
  equalCoords(p1.orientation, p2.orientation);

type Score = {
  position: Position;
  score: number;
};

const getNeighbors = (map: string[][], current: Position) => {
  const orientations = [
    { i: -1, j: 0 },
    { i: 1, j: 0 },
    { i: 0, j: -1 },
    { i: 0, j: 1 },
  ];
  const neighbors: Position[] = orientations
    .filter(
      (o) => !(-o.i === current.orientation.i && -o.j === current.orientation.j)
    )
    .map((o) => ({
      coords: { i: current.coords.i + o.i, j: current.coords.j + o.j },
      orientation: o,
    }));
  return neighbors.filter(
    (neighbor) => map[neighbor.coords.i][neighbor.coords.j] != "#"
  );
};

let start: Coords = { i: 0, j: 0 };
let end: Coords = { i: 0, j: 0 };
const map = input.split(/\r?\n/).map((line, i) => {
  const tiles = line.split("");
  tiles.forEach((tile, j) => {
    if (tile == "S") {
      start = { i, j };
    } else if (tile == "E") {
      end = { i, j };
    }
  });
  return tiles;
});

const part1 = (map: string[][], start: Coords, end: Coords) => {
  // dijkstra

  // scores is a pseudo map
  const scores: Score[] = [
    { position: { coords: start, orientation: { i: 0, j: 1 } }, score: 0 },
  ];
  const visited: Position[] = [];
  const queue: Position[] = [{ coords: start, orientation: { i: 0, j: 1 } }];

  while (queue.length > 0) {
    // instead of priority queue, I just sort the queue by looking up the scores
    queue.sort((a, b) => {
      const scoreA = scores.find((score) =>
        equalPosition(score.position, a)
      )!.score;
      const scoreB = scores.find((score) =>
        equalPosition(score.position, b)
      )!.score;
      return scoreA - scoreB;
    });
    const current = queue.shift()!;

    if (visited.some((position) => equalPosition(position, current))) continue;
    visited.push(current);

    getNeighbors(map, current).forEach((neighbor) => {
      // score increase from current depends on if it's in straigh line or I have to turn
      const scoreDelta = equalCoords(
        addCoords(current.coords, current.orientation),
        neighbor.coords
      )
        ? 1
        : 1001;

      const newScore =
        scores.find((score) => equalPosition(score.position, current))!
          .score + scoreDelta;

      const oldScore = scores.find((score) =>
        equalPosition(score.position, neighbor)
      );

      if (!oldScore) {
        scores.push({ position: neighbor, score: newScore });
      } else if (newScore < oldScore.score) {
        oldScore.score = newScore;
      }

      if (!visited.some((position) => equalPosition(position, neighbor))) {
        queue.push(neighbor);
      }
    });
  }

  const scoreEnd = scores.filter((score) => equalCoords(score.position.coords, end)).sort((a, b) => a.score - b.score)[0];

  console.log(scoreEnd!.score);
};

part1(map, start, end);
