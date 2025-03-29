import { readFileSync } from "node:fs";
const input = readFileSync("input/day20.txt", "utf-8");

let start: [number, number] = [0, 0];
let end: [number, number] = [0, 0];
const map = input.split(/\r?\n/).map((row, i) => {
  const tiles = row.split("");
  tiles.forEach((cell, j) => {
    if (cell == "S") {
      start = [i, j];
    } else if (cell == "E") {
      end = [i, j];
    }
  });
  return tiles;
});

const times: number[][] = Array.from({ length: map.length }, () =>
  Array(map[0].length)
);

const cheats: {
  origin: [number, number];
  destination: [number, number];
  saving?: number;
}[] = [];

const bfs = (start: [number, number]) => {
  const queue = [{ pos: start, time: 0 }];
  const visited = Array.from({ length: map.length }, () =>
    Array(map[0].length).fill(false)
  );

  while (queue.length > 0) {
    const curr = queue.shift()!;
    const [i, j] = curr.pos;
    const time = curr.time;

    times[i][j] = time;
    visited[i][j] = true;
    [
      [i + 1, j],
      [i - 1, j],
      [i, j + 1],
      [i, j - 1],
    ]
      .filter(([ni, nj]) => !visited[ni][nj])
      .forEach(([ni, nj]) => {
        if (map[ni][nj] === "#") {
          cheat([ni, nj], [i, j]);
        } else {
          queue.push({ pos: [ni, nj], time: time + 1 });
        }
      });
  }
};

const cheat = ([i, j]: [number, number], [pi, pj]: [number, number]) => {
  [
    [i + 1, j],
    [i - 1, j],
    [i, j + 1],
    [i, j - 1],
  ]
    .filter(
      ([ni, nj]) =>
        (ni !== pi || nj !== pj) &&
        ni > 0 &&
        ni < map.length - 1 &&
        nj > 0 &&
        nj < map[0].length - 1
    )
    .forEach(([ni, nj]) => {
      if (map[ni][nj] !== "#") {
        cheats.push({ origin: [pi, pj], destination: [ni, nj] });
      }
    });
};

bfs(start);

cheats.forEach((cheat) => {
  const [oi, oj] = [...cheat.origin];
  const [di, dj] = [...cheat.destination];
  cheat.saving = times[di][dj] - times[oi][oj] - 2;
});

console.log(cheats.filter((c) => c.saving! >= 100).length);

const printTimes = () => {
  for (let i = 0; i < times.length; i++) {
    let line = "";
    for (let j = 0; j < times[0].length; j++) {
      line +=
        times[i][j] === undefined
          ? "XX"
          : times[i][j] < 10
          ? `0${times[i][j]}`
          : times[i][j];
      if (j < times[0].length - 1) {
        line += " ";
      }
    }
    console.log(line);
  }
};
