import { readFileSync } from "node:fs";
const input = readFileSync("input/day21.txt", "utf-8");

class Cache extends Map<string, number> {
  static toKey = (prevChar: string, char: string, depth: number) =>
    `${prevChar},${char},${depth}`;
}
const cache = new Cache();

// get the length of the sequence that would input a code on a certain depth of dpads
const getCodeSeqLen = (code: string, depth: number, maxDepth: number) => {
  const codeArr = code.split("");
  return codeArr.reduce((len, char, i) => {
    const prevChar = i === 0 ? "A" : codeArr[i - 1];
    return getCharSeqLen(prevChar, char, depth, maxDepth) + len;
  }, 0);
};

// get the length of the sequence that would input a character on a certain depths of dpads
const getCharSeqLen = (
  prevChar: string,
  char: string,
  depth: number,
  maxDepth: number
) => {
  if (depth === maxDepth) {
    return 1;
  }
  const cacheLenKey = Cache.toKey(prevChar, char, depth);
  if (!cache.has(cacheLenKey)) {
    // translate, then get the shortest length of the translated seqs
    const translatedSeqs = (depth === 0 ? numpad.getPaths : dpad.getPaths)(
      prevChar,
      char
    ).map((seq) => seq + "A");
    const translatedLens = translatedSeqs.map((seq) =>
      getCodeSeqLen(seq, depth + 1, maxDepth)
    );
    cache.set(cacheLenKey, translatedLens.sort((a, b) => a - b)[0]);
  }
  return cache.get(cacheLenKey)!;
};

class Keypad {
  readonly matrix: (string | null)[][];
  readonly gap: [number, number];
  readonly A: [number, number];

  constructor(matrix: (string | null)[][]) {
    this.matrix = matrix;
    this.gap = this.findChar(null);
    this.A = this.findChar("A");
  }

  findChar = (char: string | null): [number, number] => {
    const i = this.matrix.findIndex((row) => row.includes(char));
    const j = this.matrix[i].findIndex((value) => value === char);
    return [i, j];
  };

  isValid = ([i, j]: [number, number]) =>
    this.gap[0] !== i || this.gap[1] !== j;

  //Return all shortest sequences of dpad inputs that would take you from a char to another
  getPaths = (fromChar: string, toChar: string) =>
    this.getPathsDfs(this.findChar(fromChar), this.findChar(toChar));

  //Return all shortest sequences of dpad inputs that would take you from [i,j] to [toI,toJ].
  getPathsDfs = ([i, j]: [number, number], [toI, toJ]: [number, number]) => {
    const paths: string[] = [];
    if (i < toI && this.isValid([i + 1, j])) {
      this.getPathsDfs([i + 1, j], [toI, toJ]).forEach((path) => {
        paths.push("v" + path);
      });
    } else if (i > toI && this.isValid([i - 1, j])) {
      this.getPathsDfs([i - 1, j], [toI, toJ]).forEach((path) => {
        paths.push("^" + path);
      });
    }
    if (j < toJ && this.isValid([i, j + 1])) {
      this.getPathsDfs([i, j + 1], [toI, toJ]).forEach((path) => {
        paths.push(">" + path);
      });
    } else if (j > toJ && this.isValid([i, j - 1])) {
      this.getPathsDfs([i, j - 1], [toI, toJ]).forEach((path) => {
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

const codes = input.split(/\r?\n/);

// part 1
let complexity = codes.reduce((runningComplexity, code) => {
  return (
    runningComplexity +
    Number(code.substring(0, 3)) * getCodeSeqLen(code, 0, 3)
  );
}, 0);
console.log(complexity);

// part 2
cache.clear();
complexity = codes.reduce((runningComplexity, code) => {
  return (
    runningComplexity +
    Number(code.substring(0, 3)) * getCodeSeqLen(code, 0, 26)
  );
}, 0);
console.log(complexity);
