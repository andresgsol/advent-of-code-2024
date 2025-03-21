import { readFileSync } from "node:fs";
const input = readFileSync("input/day17.txt", "utf-8");

const comboOperand = (operand: number) =>
  operand < 4 ? operand : registers[operand - 4];

const [input1, input2] = input.split(/(?:\r?\n){2,}/);
const registersIni = input1
  .split(/\r?\n/)
  .map((line) => Number(line.split(": ")[1]));
const program = input2.split(": ")[1].split(",").map(Number);

// part 1

let instructions = [
  //adv
  (operand: number) =>
    (registers[0] = Math.floor(registers[0] / 2 ** comboOperand(operand))),
  //bxl
  (operand: number) =>
    (registers[1] = Number(BigInt(operand) ^ BigInt(registers[1]))),
  //bst
  (operand: number) => (registers[1] = comboOperand(operand) % 8),
  //jnz
  (operand: number) => {
    if (registers[0]) i = operand - 2;
  },
  //bxc
  (operand: number) =>
    (registers[1] = Number(BigInt(registers[2]) ^ BigInt(registers[1]))),
  //out
  (operand: number) => output.push(comboOperand(operand) % 8),
  //bdv
  (operand: number) =>
    (registers[1] = Math.floor(registers[0] / 2 ** comboOperand(operand))),
  //cdv
  (operand: number) =>
    (registers[2] = Math.floor(registers[0] / 2 ** comboOperand(operand))),
];

let registers = [...registersIni];
let output: number[] = [];
let i: number; // instruction pointer
for (i = 0; i < program.length; i += 2) {
  const opcode = program[i];
  const operand = program[i + 1];
  instructions[opcode](operand);
}
console.log(output.join(","));

// part 2

output = [];
const dfs = (a: number, depth: number): number | undefined => {
  for (let aCandidate = 0; aCandidate < 8; aCandidate++) {
    registers[0] = a + aCandidate;
    // run program loop only once (stop before jump at the end)
    for (i = 0; i < program.length - 2; i += 2) {
      const opcode = program[i];
      const operand = program[i + 1];
      instructions[opcode](operand);
    }
    if (program[program.length - depth] === output.pop()) {
      if (program.length === depth) {
        return a + aCandidate;
      }
      const foundA = dfs((a + aCandidate) * 8, depth + 1);
      if (foundA) {
        return foundA;
      }
    }
  }
};
console.log(dfs(0, 1));

/*
do {
  B = A % 8
  B = B ^ 1
  C = A / 2**B
  A = A / 2**3
  B = B ^ C
  B = B ^ 6
  out(B % 8)
} while (A != 0) 
*/
