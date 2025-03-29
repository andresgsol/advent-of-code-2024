import { readFileSync } from "node:fs";
const input = readFileSync("input/day20.txt", "utf-8");

type Cheat = {
  origin: [number, number];
  destination: [number, number];
  saving: number;
};

const manhattan = (i: number, j: number, di: number, dj: number) =>
  Math.abs(di - i) + Math.abs(dj - j);

const calculateCheats = (
  map: string[][],
  times: number[][],
  maxCheatTime: number
) => {
  const cheats: Cheat[] = [];
  map.forEach((row, i) =>
    row.forEach((cell, j) => {
      if (cell === "#") {
        return;
      }
      map.forEach((destRow, di) =>
        destRow.forEach((destCell, dj) => {
          const distance = manhattan(i, j, di, dj);
          if (destCell !== "#" && 1 < distance && distance <= maxCheatTime) {
            cheats.push({
              origin: [i, j],
              destination: [di, dj],
              saving: times[di][dj] - times[i][j] - distance,
            });
          }
        })
      );
    })
  );
  return cheats;
};

let start: [number, number] = [0, 0];
const map = input.split(/\r?\n/).map((row, i) => {
  const tiles = row.split("");
  tiles.forEach((cell, j) => {
    if (cell == "S") {
      start = [i, j];
    }
  });
  return tiles;
});

const times: number[][] = Array.from({ length: map.length }, () =>
  Array(map[0].length)
);

// bfs walk through the maze to populate the times array
const queue = [{ pos: start, time: 0 }];

while (queue.length > 0) {
  const curr = queue.shift()!;
  const [i, j] = curr.pos;
  const time = curr.time;
  
  if (times[i][j] !== undefined) continue;
  times[i][j] = time;

  [
    [i + 1, j],
    [i - 1, j],
    [i, j + 1],
    [i, j - 1],
  ]
    .forEach(([ni, nj]) => {
      if (map[ni][nj] !== "#") {
        queue.push({ pos: [ni, nj], time: time + 1 });
      }
    });
}

const threshold = 100;

// part 1
console.log(
  calculateCheats(map, times, 2).filter((c) => c.saving >= threshold).length
);

// part 2
console.log(
  calculateCheats(map, times, 20).filter((c) => c.saving >= threshold).length
);