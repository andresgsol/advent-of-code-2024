import { readFileSync } from "node:fs";
const input = readFileSync("input/day16.txt", "utf-8");

class PriorityQueue {
  queue: Score[] = [];
  offer = (score: Score) => this.queue.push(score);
  poll = () => {
    this.queue.sort(({ score: s1 }, { score: s2 }) => s1 - s2);
    return this.queue.shift();
  };
  isEmpty = () => this.queue.length === 0;
}

type Position = {
  i: number;
  j: number;
  o: number;
};

type Score = {
  position: Position;
  score: number;
  prev: Position[]; // where did we reach this score from?
};

const equalsPosition = (p1: Position, p2: Position) =>
  p1.i === p2.i && p1.j === p2.j && p1.o === p2.o;

// clockwise order
const directions = [
  { i: 0, j: 1 }, // right
  { i: 1, j: 0 }, // down
  { i: 0, j: -1 }, // left
  { i: -1, j: 0 }, // up
];

const moveForward = ({ i, j, o }: Position): Position => ({
  i: i + directions[o].i,
  j: j + directions[o].j,
  o,
});

const turnLeft = (position: Position): Position => ({
  ...position,
  o: (position.o + 3) % 4,
});

const turnRight = (position: Position): Position => ({
  ...position,
  o: (position.o + 1) % 4,
});

let start: Position = {
  i: 0,
  j: 0,
  o: 0,
};
let end = { i: 0, j: 0 };
const map = input.split(/\r?\n/).map((line, i) => {
  const tiles = line.split("");
  tiles.forEach((tile, j) => {
    if (tile == "S") {
      [start.i, start.j] = [i, j];
    } else if (tile == "E") {
      end = { i, j };
    }
  });
  return tiles;
});

// part 1: Dijkstra
const scores: Score[] = [{ position: start, score: 0, prev: [] }];
const visited: Position[] = [];
const pq = new PriorityQueue();
pq.offer({ position: start, score: 0, prev: [] });

while (!pq.isEmpty()) {
  const { position: currentPos, score } = pq.poll()!;

  if (visited.some((position) => equalsPosition(position, currentPos)))
    continue;
  visited.push(currentPos);

  const neighbors: Score[] = [
    {
      position: moveForward(currentPos),
      score: score + 1,
      prev: [{ ...currentPos }],
    },
    {
      position: turnLeft(currentPos),
      score: score + 1000,
      prev: [{ ...currentPos }],
    },
    {
      position: turnRight(currentPos),
      score: score + 1000,
      prev: [{ ...currentPos }],
    },
  ].filter(({ position: { i, j } }) => map[i][j] != "#");

  neighbors.forEach((neighbor) => {
    const existingScore = scores.find(({ position }) =>
      equalsPosition(position, neighbor.position)
    );

    if (!existingScore) {
      scores.push(neighbor);
      pq.offer(neighbor);
    } else if (existingScore.score > neighbor.score) {
      existingScore.score = neighbor.score;
      pq.offer(neighbor);
    } else if (
      existingScore.score === neighbor.score &&
      !existingScore.prev.some((existingPrev) =>
        equalsPosition(existingPrev, currentPos)
      )
    ) {
      existingScore.prev.push({ ...currentPos });
    }
  });
}
const endScore = scores
  .filter(({ position: { i, j } }) => i === end.i && j === end.j)
  .sort(({ score: s1 }, { score: s2 }) => s1 - s2)[0];
console.log(endScore.score);

// part 2: backtrack using prev
const queue = [endScore];
const set = new Set();
while (queue.length > 0) {
  const curr = queue.pop()!;
  set.add(`${curr.position.i},${curr.position.j}`);
  curr.prev.forEach((prev) =>
    queue.push(scores.find(({ position }) => equalsPosition(position, prev))!)
  );
}
console.log(set.size);
