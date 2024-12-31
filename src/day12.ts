import { readFileSync } from "node:fs";
const input = readFileSync("input/day12.txt", "utf-8");

class Plot {
  constructor(public i: number, public j: number) {}

  equals(plot: Plot): boolean {
    return this.i === plot.i && this.j === plot.j;
  }
}

class Crop {
  plots: Plot[] = [];

  contains(plot: Plot): boolean {
    return this.plots.some((existingPlot) => existingPlot.equals(plot));
  }
}

type MapType = string[][];

const getAdjacent = (plot: Plot, map: MapType): Plot[] => {
  const adjacent: Plot[] = [];

  plot.i - 1 >= 0 && adjacent.push(new Plot(plot.i - 1, plot.j));
  plot.i + 1 < map.length && adjacent.push(new Plot(plot.i + 1, plot.j));
  plot.j - 1 >= 0 && adjacent.push(new Plot(plot.i, plot.j - 1));
  plot.j + 1 < map[plot.i].length &&
    adjacent.push(new Plot(plot.i, plot.j + 1));

  return adjacent;
};

const populateCrop = (crop: Crop, map: MapType, plot: Plot): void => {
  if (crop.contains(plot)) {
    return;
  }
  crop.plots.push(plot);
  getAdjacent(plot, map)
    .filter((plot2) => map[plot.i][plot.j] === map[plot2.i][plot2.j])
    .forEach((plot2) => populateCrop(crop, map, plot2));
};

const area = (crop: Crop): number => crop.plots.length;

const countContiguous = (plot: Plot, map: MapType): number =>
  getAdjacent(plot, map).filter(
    (plot2) => map[plot.i][plot.j] === map[plot2.i][plot2.j]
  ).length;

const perimeter = (crop: Crop, map: MapType): number =>
  crop.plots.reduce((count, plot) => count + 4 - countContiguous(plot, map), 0);

const isSame = (plot: Plot, other: Plot, map: MapType): boolean =>
  other.i >= 0 &&
  other.i < map.length &&
  other.j >= 0 &&
  other.j < map[other.i].length &&
  map[other.i][other.j] === map[plot.i][plot.j];

const isConvexCorner = (
  map: MapType,
  plot: Plot,
  adj1: Plot,
  adj2: Plot
): boolean => {
  const sameAdj1 = isSame(plot, adj1, map);
  const sameAdj2 = isSame(plot, adj2, map);
  return !sameAdj1 && !sameAdj2;
};

const isConcaveCorner = (
  map: MapType,
  plot: Plot,
  adj1: Plot,
  adj2: Plot,
  diag: Plot
): boolean => {
  const sameAdj1 = isSame(plot, adj1, map);
  const sameAdj2 = isSame(plot, adj2, map);
  const sameDiag = isSame(plot, diag, map);
  return sameAdj1 && sameAdj2 && !sameDiag;
};

const countCorners = (plot: Plot, map: MapType): number => {
  let corners = 0;

  isConvexCorner(
    map,
    plot,
    new Plot(plot.i, plot.j - 1),
    new Plot(plot.i - 1, plot.j)
  ) && corners++;
  isConvexCorner(
    map,
    plot,
    new Plot(plot.i, plot.j + 1),
    new Plot(plot.i - 1, plot.j)
  ) && corners++;
  isConvexCorner(
    map,
    plot,
    new Plot(plot.i, plot.j - 1),
    new Plot(plot.i + 1, plot.j)
  ) && corners++;
  isConvexCorner(
    map,
    plot,
    new Plot(plot.i, plot.j + 1),
    new Plot(plot.i + 1, plot.j)
  ) && corners++;

  isConcaveCorner(
    map,
    plot,
    new Plot(plot.i, plot.j - 1),
    new Plot(plot.i - 1, plot.j),
    new Plot(plot.i - 1, plot.j - 1)
  ) && corners++;
  isConcaveCorner(
    map,
    plot,
    new Plot(plot.i, plot.j + 1),
    new Plot(plot.i - 1, plot.j),
    new Plot(plot.i - 1, plot.j + 1)
  ) && corners++;
  isConcaveCorner(
    map,
    plot,
    new Plot(plot.i, plot.j - 1),
    new Plot(plot.i + 1, plot.j),
    new Plot(plot.i + 1, plot.j - 1)
  ) && corners++;
  isConcaveCorner(
    map,
    plot,
    new Plot(plot.i, plot.j + 1),
    new Plot(plot.i + 1, plot.j),
    new Plot(plot.i + 1, plot.j + 1)
  ) && corners++;

  return corners;
};

const sides = (crop: Crop, map: MapType): number =>
  crop.plots.reduce((count, plot) => count + countCorners(plot, map), 0);

const part1 = (map: MapType, crops: Crop[]): void => {
  const price = crops.reduce(
    (total, crop) => total + area(crop) * perimeter(crop, map),
    0
  );
  console.log(price);
};

const part2 = (map: MapType, crops: Crop[]): void => {
  const price = crops.reduce(
    (total, crop) => total + area(crop) * sides(crop, map),
    0
  );
  console.log(price);
};

const map: MapType = input.split(/\r?\n/).map((line) => line.split(""));

const crops: Crop[] = [];
map.forEach((line, i) =>
  line.forEach((_, j) => {
    const plot = new Plot(i, j);
    if (!crops.some((crop) => crop.contains(plot))) {
      const crop = new Crop();
      populateCrop(crop, map, plot);
      crops.push(crop);
    }
  })
);

part1(map, crops);
part2(map, crops);
