import { readFileSync } from "node:fs";
const input = readFileSync("input/day15.txt", "utf-8");

type Coords = {
  i: number;
  j: number;
};

const getDirection = (move: string): Coords => {
  switch (move) {
    case "<":
      return { i: 0, j: -1 };
    case ">":
      return { i: 0, j: 1 };
    case "^":
      return { i: -1, j: 0 };
    case "v":
      return { i: 1, j: 0 };
    default:
      throw "wtf";
  }
};

const add = (coords1: Coords, coords2: Coords) => ({
  i: coords1.i + coords2.i,
  j: coords1.j + coords2.j,
});

const swap = (map: string[][], coords1: Coords, coords2: Coords) =>
  ([map[coords1.i][coords1.j], map[coords2.i][coords2.j]] = [
    map[coords2.i][coords2.j],
    map[coords1.i][coords1.j],
  ]);

const findRobot = (map: string[][]) => ({
  i: map.findIndex((row) => row.includes("@")),
  j: map[map.findIndex((row) => row.includes("@"))].findIndex(
    (value) => value === "@"
  ),
});

const calculateBoxesGps = (map: string[][], boxChar: string) =>
  map.reduce(
    (total, row, i) =>
      total +
      row.reduce(
        (rowTotal, value, j) => rowTotal + (value == boxChar ? i * 100 + j : 0),
        0
      ),
    0
  );

const printMap = (map: string[][]) => {
  map.forEach((row) => {
    let string = "";
    row.forEach((value) => {
      string += value;
    });
    console.log(string);
  });
};

const part1 = (map: string[][], moves: string[]) => {
  const pushBox = (pos: Coords, direction: Coords) => {
    const target = add(pos, direction);
    switch (map[target.i][target.j]) {
      case "#":
        return false;
      case ".":
        swap(map, pos, target);
        return true;
      default:
        if (pushBox(target, direction)) {
          swap(map, pos, target);
          return true;
        }
        return false;
    }
  };

  let robot: Coords = findRobot(map);

  moves.forEach((move) => {
    const direction = getDirection(move);
    if (pushBox(robot, direction)) {
      robot = add(robot, direction);
    }
  });

  console.log(calculateBoxesGps(map, "O"));
};

const part2 = (map: string[][], moves: string[]) => {
  type Box = {
    left: Coords;
    right: Coords;
  };

  const getBox = (coords: Coords) => {
    switch (map[coords.i][coords.j]) {
      case "[":
        return {
          left: { i: coords.i, j: coords.j },
          right: { i: coords.i, j: coords.j + 1 },
        };
      case "]":
        return {
          left: { i: coords.i, j: coords.j - 1 },
          right: { i: coords.i, j: coords.j },
        };
      default:
        throw "nope";
    }
  };

  const widenMap = (map: string[][]) =>
    map.map((row) =>
      row
        .map((value) => {
          switch (value) {
            case "@":
              return ["@", "."];
            case "O":
              return ["[", "]"];
            default:
              return [value, value];
          }
        })
        .flat()
    );

  const pushBoxHorizontal = (box: Box, direction: Coords) => {
    const [near, far] =
      direction.j == 1 ? [box.left, box.right] : [box.right, box.left];
    const target = add(far, direction);
    switch (map[target.i][target.j]) {
      case "#":
        return false;
      case ".":
        swap(map, far, target);
        swap(map, near, far);
        return true;
      default:
        const nextBox = getBox(target);
        if (pushBoxHorizontal(nextBox, direction)) {
          swap(map, far, target);
          swap(map, near, far);
          return true;
        }
        return false;
    }
  };

  const pushBoxVertical = (box: Box, direction: Coords, forReal: boolean): boolean => {
    const targetLeft = add(box.left, direction);
    const targetRight = add(box.right, direction);
    const targetLeftChar = map[targetLeft.i][targetLeft.j];
    let targetRightChar = map[targetRight.i][targetRight.j];

    let canPushBoxLeft = targetLeftChar != "#";
    if (["[", "]"].includes(targetLeftChar)) {
      canPushBoxLeft = pushBoxVertical(getBox(targetLeft), direction, false);
    }
    let canPushBoxRight = targetRightChar != "#";
    if (["[", "]"].includes(targetRightChar)) {
      canPushBoxRight = pushBoxVertical(getBox(targetRight), direction, false);
    }

    if (canPushBoxLeft && canPushBoxRight && forReal) {
      if (["[", "]"].includes(targetLeftChar)) {
        pushBoxVertical(getBox(targetLeft), direction, true);
        targetRightChar = map[targetRight.i][targetRight.j];
      }
      if (targetRightChar == "[") {
        pushBoxVertical(getBox(targetRight), direction, true);
      }
      swap(map, box.left, targetLeft);
      swap(map, box.right, targetRight);
    }
    return canPushBoxLeft && canPushBoxRight;
  };

  map = widenMap(map);

  let robot: Coords = findRobot(map);

  moves.forEach((move) => {
    const direction = getDirection(move);
    const target = add(robot, direction);

    switch (map[target.i][target.j]) {
      case "#":
        break;
      case ".":
        swap(map, robot, target);
        robot = add(robot, direction);
        break;
      default:
        const box = getBox(target);
        let boxWasPushed =
          direction.i == 0
            ? pushBoxHorizontal(box, direction)
            : pushBoxVertical(box, direction, true);
        if (boxWasPushed) {
          swap(map, robot, target);
          robot = add(robot, direction);
        }
    }
  });

  console.log(calculateBoxesGps(map, "["));
};

const [input1, input2] = input.split(/(?:\r?\n){2,}/);

const map = input1.split(/\r?\n/).map((line) => line.split(""));
const moves = input2
  .split(/\r?\n/)
  .reduce((prev, curr) => (prev += curr), "")
  .split("");

part1(JSON.parse(JSON.stringify(map)), moves);
part2(map, moves);
