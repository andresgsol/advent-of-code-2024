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

const isAdjacent = (node1: string, node2: string) =>
  adjacencyMap.get(node1)!.includes(node2);

const key = (nodes: string[]) => [...nodes].sort().join(",");

// part 1

const triangles = new Set<string>();

[...adjacencyMap.keys()]
  .filter((node) => node.substring(0, 1) === "t")
  .forEach((tnode) => {
    const adjacents = adjacencyMap.get(tnode)!;
    for (let i = 0; i < adjacents.length; i++) {
      for (let j = i; j < adjacents.length; j++) {
        if (isAdjacent(adjacents[i], adjacents[j])) {
          triangles.add(key([tnode, adjacents[i], adjacents[j]]));
        }
      }
    }
  });

console.log(triangles.size);

// part 2

const lanParties = new Set<string>();

[...adjacencyMap.keys()].forEach((node) => {
    // sort of a customized bfs
    const group = new Set<string>();
    const visited = new Set<string>();
    const queue = [node];
    while (queue.length > 0) {
        const next = queue.shift()!;
        if (visited.has(next)) continue;
        visited.add(next);
        if ([...group.values()].every(grpNode => isAdjacent(next,grpNode))) {
            group.add(next);
        }
        queue.push(...adjacencyMap.get(next)!);
    }
    lanParties.add(key([...group.values()]));
});

const password = [...lanParties.values()].sort((a,b) => b.length - a.length)[0]

console.log(password);