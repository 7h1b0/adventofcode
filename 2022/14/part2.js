const fs = require("fs");

const SAND = 0;
const ROCK = 1;

function readFile() {
  return new Promise((resolve, reject) => {
    fs.readFile("./input.txt", "utf8", (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data.split("\n"));
    });
  });
}

const grid = new Map();
let MAX_X = 0;
let MIN_X = Infinity;
let MAX_Y = 0;

function getNodeId(x, y) {
  return `${x}-${y}`;
}

function parseLine(line) {
  line.split(" -> ").reduce((previous, coord) => {
    const xy = coord.split(",");
    if (previous === null) {
      return xy;
    }

    const startX = Math.min(previous[0], xy[0]);
    const startY = Math.min(previous[1], xy[1]);
    MAX_X = Math.max(MAX_X, xy[0]);
    MAX_Y = Math.max(MAX_Y, xy[1]);
    MIN_X = Math.min(MIN_X, xy[0]);

    Array.from({ length: Math.abs(previous[0] - xy[0]) + 1 }, (_, i) => {
      grid.set(getNodeId(startX + i, xy[1]), ROCK);
    });
    Array.from({ length: Math.abs(previous[1] - xy[1]) + 1 }, (_, i) => {
      grid.set(getNodeId(xy[0], startY + i), ROCK);
    });

    return xy;
  }, null);
}

function getReachableChildrens(nodeId) {
  const nodeCoord = nodeId.split("-");

  return [
    [0, 1],
    [-1, 1],
    [1, 1],
  ]
    .map((coord) => coord.map((el, index) => Number(nodeCoord[index]) + el))
    .filter(([x, y]) => {
      const children = getNodeId(x, y);
      return !grid.has(children) && y < MAX_Y + 2;
    });
}

function handleOneSand(nodeId) {
  let nextNodeId = nodeId;
  while (true) {
    const childrens = getReachableChildrens(nextNodeId);
    if (childrens.length < 1) {
      break;
    }
    nextNodeId = childrens[0];
  }

  const [_, y] = nextNodeId.split("-");
  if (y === "0") {
    return false;
  }

  grid.set(nextNodeId, SAND);
  return true;
}

(async () => {
  const data = await readFile();
  data.forEach((line) => parseLine(line));

  let count = 0;
  while (handleOneSand(getNodeId(500, 0))) {
    count++;
  }
  console.log(count + 1); // add last one
})();
