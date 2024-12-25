const fs = require("node:fs");
const input = fs.readFileSync("input/day11.txt", "utf-8");

const insertInMap = (map, number, times) =>
  map.set(number, map.has(number) ? map.get(number) + times : times);

const solve = (stones, blinks) => {
  let stonesMap = new Map();
  stones.forEach((number) => insertInMap(stonesMap, number, 1));

  for (let i = 0; i < blinks; i++) {
    const updatedMap = new Map();
    stonesMap.forEach((times, number) => {
      if (number === "0") {
        insertInMap(updatedMap, "1", times);
      } else if (number.length % 2 == 0) {
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

const part1 = (stones) => solve(stones, 25);
const part2 = (stones) => solve(stones, 75);

const stones = input.split(" ");

part1([...stones]);
part2([...stones]);
