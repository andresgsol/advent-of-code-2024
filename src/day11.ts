import { readFileSync } from "node:fs";
const input = readFileSync("input/day11.txt", "utf-8");

const insertInMap = (
  map: Map<string, number>,
  number: string,
  times: number
): void => {
  map.set(number, map.has(number) ? map.get(number)! + times : times);
};

const solve = (stones: string[], blinks: number): void => {
  let stonesMap = new Map<string, number>();
  stones.forEach((number) => insertInMap(stonesMap, number, 1));

  for (let i = 0; i < blinks; i++) {
    const updatedMap = new Map<string, number>();
    stonesMap.forEach((times, number) => {
      if (number === "0") {
        insertInMap(updatedMap, "1", times);
      } else if (number.length % 2 === 0) {
        insertInMap(updatedMap, number.slice(0, number.length / 2), times);
        insertInMap(
          updatedMap,
          Number(number.slice(number.length / 2)) + "",
          times
        );
      } else {
        insertInMap(updatedMap, Number(number) * 2024 + "", times);
      }
    });
    stonesMap = updatedMap;
  }

  const stoneCount = [...stonesMap.values()].reduce(
    (prev, curr) => prev + curr,
    0
  );
  console.log(stoneCount);
};

const part1 = (stones: string[]) => solve(stones, 25);
const part2 = (stones: string[]) => solve(stones, 75);

const stones = input.split(" ");

part1([...stones]);
part2([...stones]);
