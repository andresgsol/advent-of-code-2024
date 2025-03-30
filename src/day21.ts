import { readFileSync } from "node:fs";
const input = readFileSync("input/day21.txt", "utf-8");

class Keypad {
  matrix: (string | null)[][];
  gap: [number, number];
  pos: [number, number];

  constructor(matrix: (string | null)[][]) {
    this.matrix = matrix;
    this.gap = this.findChar(null);
    // always start pointing at A
    this.pos = this.findChar("A");
  }

  findChar = (char: string | null): [number, number] => {
    const i = this.matrix.findIndex((row) => row.includes(char));
    const j = this.matrix[i].findIndex((value) => value === char);
    return [i, j];
  };

  isValid = ([i, j]: [number, number]) =>
    this.gap[0] !== i || this.gap[1] !== j;

  /*
   * Get all shortest sequences of dpad inputs that would cause the pad to enter a code.
   */
  getSequences = (code: string): string[] => {
    let sequences = [""];
    code.split("").forEach((char) => {
      const paths = this.moveTo(char).map((path) => path + "A");
      const newSequences: string[] = [];
      // expand each existing sequence with possible new paths
      sequences.forEach((sequence) => {
        paths.forEach((path) => {
          newSequences.push(sequence + path);
        });
      });
      sequences = newSequences;
    });
    return sequences;
  };

  /*
   * Move the pos to the given char, and also return all shortest combinations of dpad inputs that would
   * move the pos to the given char.
   * This method is wrapper around getPaths.
   */
  moveTo = (char: string): string[] => {
    const targetPos = this.findChar(char);
    const paths = this.getPaths(this.pos, targetPos);
    this.pos = targetPos;
    return paths;
  };

  /*
   * Return all shortest sequences of dpad inputs that would take the pos from [i,j] to [toI,toJ].
   * This method works as a recursive dfs.
   */
  getPaths = ([i, j]: [number, number], [toI, toJ]: [number, number]) => {
    const paths: string[] = [];
    if (i < toI && this.isValid([i + 1, j])) {
      this.getPaths([i + 1, j], [toI, toJ]).forEach((path) => {
        paths.push("v" + path);
      });
    } else if (i > toI && this.isValid([i - 1, j])) {
      this.getPaths([i - 1, j], [toI, toJ]).forEach((path) => {
        paths.push("^" + path);
      });
    }
    if (j < toJ && this.isValid([i, j + 1])) {
      this.getPaths([i, j + 1], [toI, toJ]).forEach((path) => {
        paths.push(">" + path);
      });
    } else if (j > toJ && this.isValid([i, j - 1])) {
      this.getPaths([i, j - 1], [toI, toJ]).forEach((path) => {
        paths.push("<" + path);
      });
    }
    return paths.length > 0 ? paths : [""];
  };
}

const numpad = new Keypad([
  ["7", "8", "9"],
  ["4", "5", "6"],
  ["1", "2", "3"],
  [null, "0", "A"],
]);

const dpad = new Keypad([
  [null, "^", "A"],
  ["<", "v", ">"],
]);

/*
 * Translates a code into all shortest dpad sequences that would cause it to be inputted in a
 * numpad buried deep under a number of layers of dpads.
 */
const translateCodeToDpadSequences = (
  code: string,
  layers: number
): string[] => {
  if (layers === 0) {
    return numpad.getSequences(code);
  }
  const lowerLayerCodes = translateCodeToDpadSequences(code, layers - 1);
  return lowerLayerCodes.flatMap((lowerLayerCode) =>
    dpad.getSequences(lowerLayerCode)
  );
};

const calculateComplexity = (code: string, sequence: string) =>
  sequence.length * Number(code.substring(0, 3));

const codes = input.split(/\r?\n/);

const complexity = codes.reduce((runningComplexity, code) => {
  const sequences = translateCodeToDpadSequences(code, 2);
  const shortest = sequences.sort((a, b) => a.length - b.length)[0];
  return runningComplexity + calculateComplexity(code, shortest);
}, 0);

console.log(complexity);