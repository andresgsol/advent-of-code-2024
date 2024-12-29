const fs = require("node:fs");
const input = fs.readFileSync("input/day12.txt", "utf-8");

class Plot {
  constructor(i, j) {
    this.i = i;
    this.j = j;
  }
  equals = (plot) => this.i === plot.i && this.j === plot.j;
}

class Crop {
  constructor() {
    this.plots = [];
  }
  contains = (plot1) => this.plots.some((plot2) => plot1.equals(plot2));
}

const getAdjacent = (plot, map) => {
  const adjacent = [];

  plot.i - 1 >= 0 && adjacent.push(new Plot(plot.i - 1, plot.j));
  plot.i + 1 < map.length && adjacent.push(new Plot(plot.i + 1, plot.j));
  plot.j - 1 >= 0 && adjacent.push(new Plot(plot.i, plot.j - 1));
  plot.j + 1 < map[plot.i].length &&
    adjacent.push(new Plot(plot.i, plot.j + 1));

  return adjacent;
};

const populateCrop = (crop, map, plot) => {
  if (crop.contains(plot)) {
    return;
  }
  crop.plots.push(plot);
  getAdjacent(plot, map)
    .filter((plot2) => map[plot.i][plot.j] === map[plot2.i][plot2.j])
    .forEach((plot2) => populateCrop(crop, map, plot2));
};

const area = (crop) => crop.plots.length;

const countContiguous = (plot, map) =>
  getAdjacent(plot, map).filter(
    (plot2) => map[plot.i][plot.j] === map[plot2.i][plot2.j]
  ).length;

const perimeter = (crop, map) =>
  crop.plots.reduce((count, plot) => count + 4 - countContiguous(plot, map), 0);

const isSame = (plot, other, map) => {
  return (
    other.i >= 0 &&
    other.i < map.length &&
    other.j >= 0 &&
    other.j < map[other.i].length &&
    map[other.i][other.j] === map[plot.i][plot.j]
  );
};

const isConvexCorner = (map, plot, adj1, adj2) => {
  const sameAdj1 = isSame(plot, adj1, map);
  const sameAdj2 = isSame(plot, adj2, map);
  return !sameAdj1 && !sameAdj2;
};

const isConcaveCorner = (map, plot, adj1, adj2, diag) => {
  const sameAdj1 = isSame(plot, adj1, map);
  const sameAdj2 = isSame(plot, adj2, map);
  const sameDiag = isSame(plot, diag, map);
  return sameAdj1 && sameAdj2 && !sameDiag;
};

const countCorners = (plot, map) => {
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

const sides = (crop, map) =>
  crop.plots.reduce((count, plot) => count + countCorners(plot, map), 0);

const part1 = (map, crops) => {
  const price = crops.reduce(
    (total, crop) => total + area(crop) * perimeter(crop, map),
    0
  );
  console.log(price);
};

const part2 = (map, crops) => {
  const price = crops.reduce(
    (total, crop) => total + area(crop) * sides(crop, map),
    0
  );
  console.log(price);
};

const map = input.split(/\r?\n/).map((line) => line.split(""));

const crops = [];
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
