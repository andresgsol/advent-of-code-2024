import { readFileSync } from "node:fs";
const input = readFileSync("input/day22.txt", "utf-8");

const initialSecrets = input.split(/\r?\n/).map(Number);

// part 1

const mix = (secret: number, value: number) =>
  Number(BigInt(secret) ^ BigInt(value));
const prune = (secret: number) => secret % 16777216;

const evolve = (secret: number) => {
  secret = prune(mix(secret, secret * 64));
  secret = prune(mix(secret, Math.floor(secret / 32)));
  secret = prune(mix(secret, secret * 2048));
  return secret;
};

const secrets = initialSecrets.map((secret) => {
  const buyerSecrets = [secret];
  for (let i = 0; i < 2000; i++) {
    buyerSecrets.push(evolve(buyerSecrets[i]));
  }
  return buyerSecrets;
});

console.log(
  secrets.reduce((total, buyerSecrets) => total + buyerSecrets[2000], 0)
);

// part 2

const prices = secrets.map((buyerSecrets) =>
  buyerSecrets.map((secret) => secret % 10)
);
const priceChanges = prices.map((buyerPrices) => {
  const buyerPriceChanges: [number, number][] = [];
  buyerPrices.forEach(
    (price, i, buyerPrices) =>
      i !== 0 && buyerPriceChanges.push([price, price - buyerPrices[i - 1]])
  );
  return buyerPriceChanges;
});
const sequences = priceChanges.map((buyerPriceChanges, buyerI) => {
  const buyerSequences: [number, number[]][] = [];
  buyerPriceChanges.forEach(
    (priceChanges, i, buyerPriceChanges) =>
      i >= 3 &&
      buyerSequences.push([
        priceChanges[0],
        buyerPriceChanges
          .slice(i - 3, i + 1)
          .map((priceChange) => priceChange[1]),
      ])
  );
  return buyerSequences;
});

const map = new Map<string, number>();
sequences.forEach((buyerSequences) => {
  const set = new Set<string>();
  buyerSequences.forEach((sequence) => {
    const key = (([a, b, c, d]: number[]) => `${a},${b},${c},${d}`)(sequence[1]);
    if (set.has(key)) return;
    set.add(key);
    const currSeqValue = map.has(key) ? map.get(key)! : 0;
    map.set(key, currSeqValue + sequence[0]);
  });
});

console.log([...map.values()].sort((a, b) => b - a)[0]);
