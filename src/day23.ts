import { readFileSync } from "node:fs";
const input = readFileSync("input/day23.txt", "utf-8");

const pairs = input.split(/\r?\n/).map((line) => line.split("-"));

const adjacencyMap = new Map<string, string[]>();

const addToAdjMap = (node1: string, node2: string) =>
  adjacencyMap.has(node1)
    ? adjacencyMap.set(node1, [...adjacencyMap.get(node1)!, node2])
    : adjacencyMap.set(node1, [node2]);

pairs.forEach((pair) => {
  addToAdjMap(pair[0], pair[1]);
  addToAdjMap(pair[1], pair[0]);
});

// unused
const findAdjacents = (node: string, candidates: string[]) => {
  const adjacents = adjacencyMap.get(node)!;
  return adjacents.filter((adj) => candidates.includes(adj));
};

const isAdjacent = (node1: string, node2: string) =>
  adjacencyMap.get(node1)!.includes(node2);

const triangles = new Set<string>();

const key = (node1: string, node2: string, node3: string) =>
  [node1, node2, node3].sort().join(",");

[...adjacencyMap.keys()]
  .filter((node) => node.substring(0, 1) === "t")
  .forEach((tnode) => {
    const adjacents = adjacencyMap.get(tnode)!;
    for (let i = 0; i < adjacents.length; i++) {
      for (let j = i; j < adjacents.length; j++) {
        if (isAdjacent(adjacents[i], adjacents[j])) {
          triangles.add(key(tnode, adjacents[i], adjacents[j]));
        }
      }
    }
  });

console.log(triangles.size);
