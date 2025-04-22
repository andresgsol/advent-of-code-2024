import { readFileSync } from "node:fs";
const input = readFileSync("input/day24.txt", "utf-8");

// wire -> expression
const map = new Map<string, string>();

// part 1

/*
 * Recursively traverse the tree represented by map.
 * An expression can be "wire gate wire" or a literal value ("1" or "0")
 */
const evaluate = (exp: string): boolean => {
  if (exp === "1") return true;
  if (exp === "0") return false;

  const [wire1, gate, wire2] = exp.split(" ");
  const [val1, val2] = [wire1, wire2].map((wire) => {
    const wireExp = map.get(wire)!;
    return evaluate(wireExp);
  });

  switch (gate) {
    case "AND":
      return val1 && val2;
    case "OR":
      return val1 || val2;
    default: // XOR
      return val1 != val2;
  }
};

/*
 * Get from the map the binary values for the wires with the given letter
 * and combine them as a number
 */
const combineBits = (letter: string) => {
  const binaryString = [...map.keys()]
    .filter((wire) => wire.substring(0, 1) === letter)
    .sort()
    .reverse()
    .map((wire) => (evaluate(map.get(wire)!) ? "1" : "0"))
    .join("");
  return parseInt(binaryString, 2);
};

const [input1, input2] = input.split(/(?:\r?\n){2,}/);

// populate map
input1.split(/\r?\n/).forEach((line) => {
  const [wire, value] = line.split(": ");
  map.set(wire, value);
});
input2.split(/\r?\n/).forEach((line) => {
  const [expression, wire] = line.split(" -> ");
  map.set(wire, expression);
});

console.log(combineBits("z"));

// part 2

const checkAdder = (
  zwire: string
): { wrongWire: string; msg: string } | undefined => {
  const zexp = map.get(zwire)!;
  const [wire1, gate, wire2] = zexp.split(" ");
  if (zwire === "z45") {
    // last carry bit
    if (gate !== "OR")
      return {
        wrongWire: zwire,
        msg: `Wire ${zwire} is connected to a gate ${gate} instead of OR`,
      };
    return;
  }
  if (gate !== "XOR") {
    return {
      wrongWire: zwire,
      msg: `Wire ${zwire} is connected to a gate ${gate} instead of XOR`,
    };
  }
  if (zwire === "z00") return; // half adder
  const bitpos = zwire.substring(1.3);

  const additionError1 = checkAdditionSide(wire1, bitpos);
  const additionError2 = checkAdditionSide(wire2, bitpos);
  const carryError1 = checkCarrySide(wire1, bitpos);
  const carryError2 = checkCarrySide(wire2, bitpos);

  if (isAdditionSide(wire1, bitpos) && carryError2) {
    return {
      wrongWire: carryError2.wrongWire,
      msg: `${carryError2.msg}, which caused wire ${wire2} to fail as the carry side of ${zwire}`,
    };
  }
  if (isAdditionSide(wire2, bitpos) && carryError1) {
    return {
      wrongWire: carryError1.wrongWire,
      msg: `${carryError1.msg}, which caused wire ${wire1} to fail as the carry side of ${zwire}`,
    };
  }
  if (additionError1) {
    return {
      wrongWire: additionError1.wrongWire,
      msg: `${additionError1.msg}, which caused wire ${wire1} to fail as the addition side of ${zwire}`,
    };
  }
  if (additionError2) {
    return {
      wrongWire: additionError2.wrongWire,
      msg: `${additionError2.msg}, which caused wire ${wire2} to fail as the addition side of ${zwire}`,
    };
  }
};

const isAdditionSide = (wire: string, bitpos: string) => {
  const exp = map.get(wire)!;
  const [wire1, gate, wire2] = exp.split(" ");
  if (
    wire1.substring(1, 3) === bitpos &&
    wire2.substring(1, 3) === bitpos &&
    gate === "XOR"
  )
    return true;
};

const checkAdditionSide = (wire: string, bitpos: string) => {
  const exp = map.get(wire)!;
  const [wire1, gate, wire2] = exp.split(" ");
  if (
    wire1.substring(1, 3) === bitpos &&
    wire2.substring(1, 3) === bitpos &&
    gate !== "XOR"
  )
    return {
      wrongWire: wire,
      msg: `Wire ${wire} is connected to a gate ${gate} instead of XOR`,
    };
};

const checkCarrySide = (wire: string, bitpos: string) => {
  const exp = map.get(wire)!;
  const [wire1, gate, wire2] = exp.split(" ");
  // half adder carry
  if (wire1.substring(1, 3) === "00" && wire2.substring(1, 3) === "00") {
    if (gate !== "AND") {
      return {
        wrongWire: wire,
        msg: `Wire ${wire} is connected to a gate ${gate} instead of AND`,
      };
    }
    return;
  }
  // normal carry
  if (gate !== "OR")
    return {
      wrongWire: wire,
      msg: `Wire ${wire} is connected to a gate ${gate} instead of OR`,
    };
  const exp1 = map.get(wire1)!;
  const [wire11, gate1] = exp1.split(" ");
  if (gate1 !== "AND")
    return {
      wrongWire: wire1,
      msg: `Wire ${wire1} is connected to a gate ${gate1} instead of AND`,
    };
  const exp2 = map.get(wire2)!;
  const [wire21, gate2] = exp2.split(" ");
  if (gate2 !== "AND")
    return {
      wrongWire: wire2,
      msg: `Wire ${wire2} is connected to a gate ${gate2} instead of OR`,
    };
};

const wrongWires: string[] = [];
[...map.keys()]
  .filter((wire) => wire.substring(0, 1) === "z")
  .sort()
  .forEach((zwire) => {
    const result = checkAdder(zwire);
    if (result) {
      console.debug(result.msg);
      wrongWires.push(result.wrongWire);
    }
  });
console.log(wrongWires.sort().join());
