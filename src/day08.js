const fs = require("node:fs");
const input = fs.readFileSync("input/day08.txt", "utf-8");

const length = input.split("\n").length;

const antennas = input
  .split("\n")
  .map((line, i) =>
    [...line.matchAll(/[a-zA-Z0-9]/g)].map((regExpExecArray) => ({
      i,
      j: regExpExecArray["index"],
      freq: regExpExecArray[0],
    }))
  )
  .flat();

const isSameAntenna = (antenna1, antenna2) =>
  antenna1.i == antenna2.i && antenna1.j == antenna2.j;

const isInMap = (coords) =>
  coords.i >= 0 && coords.i < length && coords.j >= 0 && coords.j < length;

// part 1

const doubleDistance = (antenna1, antenna2) => ({
  i: antenna2.i * 2 - antenna1.i,
  j: antenna2.j * 2 - antenna1.j,
});

let nodes = new Set();

antennas.forEach((antenna) => {
  antennas
    .filter(
      (other) =>
        antenna.freq == other.freq &&
        !isSameAntenna(antenna, other) &&
        isInMap(doubleDistance(antenna, other))
    )
    .map((other) => doubleDistance(antenna, other))
    .forEach((coords) => nodes.add(`${coords.i},${coords.j}`));
});

console.log(nodes.size);

// part 2

const multiDistance = (antenna1, antenna2) => {
  const distance = [antenna2.i - antenna1.i, antenna2.j - antenna1.j];
  const node = {i: antenna2.i, j: antenna2.j};
  const nodes = [];
  do {
    nodes.push({...node});
    node.i += distance[0];
    node.j += distance[1];
  } while (isInMap(node));
  return nodes;
};

nodes = new Set();

antennas.forEach((antenna) => {
  antennas
    .filter(
      (other) => antenna.freq == other.freq && !isSameAntenna(antenna, other)
    )
    .map((other) => multiDistance(antenna, other))
    .forEach((coordsList) =>
      coordsList.map((coords) => nodes.add(`${coords.i},${coords.j}`))
    );
});

console.log(nodes.size);
