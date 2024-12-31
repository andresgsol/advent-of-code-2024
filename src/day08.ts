import { readFileSync } from "node:fs";
const input = readFileSync("input/day08.txt", "utf-8");

const length = input.split(/\r?\n/).length;

interface Coords {
  i: number;
  j: number;
}

interface Antenna extends Coords {
  freq: string;
}

const antennas: Antenna[] = input.split(/\r?\n/).flatMap((line, i) =>
  [...line.matchAll(/[a-zA-Z0-9]/g)].map((match) => ({
    i,
    j: match.index!,
    freq: match[0],
  }))
);

const isSameAntenna = (a1: Antenna, a2: Antenna): boolean =>
  a1.i === a2.i && a1.j === a2.j;

const isInMap = (coords: Coords): boolean =>
  coords.i >= 0 && coords.i < length && coords.j >= 0 && coords.j < length;

// part 1

const calculateDoubleDistance = (a1: Coords, a2: Coords): Coords => ({
  i: a2.i * 2 - a1.i,
  j: a2.j * 2 - a1.j,
});

let nodes = new Set();

antennas.forEach((antenna) => {
  antennas
    .filter(
      (other) =>
        antenna.freq === other.freq &&
        !isSameAntenna(antenna, other) &&
        isInMap(calculateDoubleDistance(antenna, other))
    )
    .forEach((other) => {
      const coords = calculateDoubleDistance(antenna, other);
      nodes.add(`${coords.i},${coords.j}`);
    });
});

console.log(nodes.size);

// part 2

const calculateMultiDistance = (a1: Coords, a2: Coords): Coords[] => {
  const delta: Coords = { i: a2.i - a1.i, j: a2.j - a1.j };
  const nodes: Coords[] = [];
  let current: Coords = { ...a2 };

  while (isInMap(current)) {
    nodes.push({ ...current });
    current.i += delta.i;
    current.j += delta.j;
  }

  return nodes;
};

nodes = new Set();

antennas.forEach((antenna) => {
  antennas
    .filter(
      (other) => antenna.freq === other.freq && !isSameAntenna(antenna, other)
    )
    .flatMap((other) => calculateMultiDistance(antenna, other))
    .forEach((coords) => nodes.add(`${coords.i},${coords.j}`));
});

console.log(nodes.size);
