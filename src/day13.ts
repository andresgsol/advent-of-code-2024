import { readFileSync } from "node:fs";
const input = readFileSync("input/day13.txt", "utf-8");

type Coords = {
  x: number;
  y: number;
};

type ClawMachine = {
  a: Coords;
  b: Coords;
  prize: Coords;
};

const toCoords = (arr: number[]): Coords => ({ x: arr[0], y: arr[1] });

const rawStringToCoords = (buttonRaw: string, separator: string): Coords =>
  toCoords(
    buttonRaw
      .split(": ")[1]
      .split(", ")
      .map<number>((value) => Number(value.split(separator)[1]))
  );

const solveClawMachine = ({ a, b, prize }: ClawMachine): number => {
  // solve equation system by elimination
  const pressB = (a.y * prize.x - a.x * prize.y) / (a.y * b.x - a.x * b.y);
  const pressA = (prize.x - b.x * pressB) / a.x;
  return Number.isInteger(pressA) && Number.isInteger(pressB)
    ? pressA * 3 + pressB
    : 0;
};

const part1 = (clawMachines: ClawMachine[]): void => {
  const tokens = clawMachines
    .map((clawMachine) => solveClawMachine(clawMachine))
    .reduce((prev, curr) => prev + curr, 0);
  console.log(tokens);
};

const part2 = (clawMachines: ClawMachine[]): void => {
  const tokens = clawMachines
    .map((clawMachine) => {
      clawMachine.prize.x += 10000000000000;
      clawMachine.prize.y += 10000000000000;
      return solveClawMachine(clawMachine);
    })
    .reduce((prev, curr) => prev + curr, 0);
  console.log(tokens);
};

const clawMachinesRaw = input
  .split(/(?:\r?\n){2}/)
  .map((value) => value.split(/\r?\n/));

const clawMachines = clawMachinesRaw.map<ClawMachine>((value) => ({
  a: rawStringToCoords(value[0], "+"),
  b: rawStringToCoords(value[1], "+"),
  prize: rawStringToCoords(value[2], "="),
}));

part1(clawMachines);
part2(clawMachines);