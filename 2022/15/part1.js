const fs = require("fs");

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

const SENSOR = "SENSOR";
const BEACON = "BEACON";

function getNodeId(x, y) {
  return `${x}|${y}`;
}

function getDistance(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function parseLine(line) {
  const matches = line.matchAll(/x=(?<x>-?\d+),\sy=(?<y>-?\d+)/g);
  const [[x1, y1], [x2, y2]] = Array.from(matches).reduce((acc, match) => {
    acc.push([Number(match.groups.x), Number(match.groups.y)]);
    return acc;
  }, []);

  const distance = getDistance(x1, y1, x2, y2);
  map.set(getNodeId(x1, y1), {
    minY: y1 - distance,
    maxY: y1 + distance,
    y: y1,
    x: x1,
    id: getNodeId(x1, y1),
    distance,
    type: SENSOR,
  });
  map.set(getNodeId(x2, y2), {
    type: BEACON,
  });
}

function generateNodesId(x, y, nth) {
  const start = x - Math.ceil(nth / 2) + 1;
  return Array.from({ length: nth }, (_, index) => {
    return getNodeId(start + index, y);
  });
}

function filterBeacon(givenY) {
  return Array.from(map.values())
    .filter((node) => {
      return node.minY <= givenY && node.maxY >= givenY;
    })
    .reduce((acc, node) => {
      let nthNode = 0;
      if (givenY > node.y) {
        nthNode = node.maxY - givenY;
      } else {
        nthNode = givenY - node.minY;
      }
      return acc.concat(generateNodesId(node.x, givenY, nthNode * 2 + 1));
    }, [])
    .filter((nodeId) => !map.has(nodeId));
}

const map = new Map();

(async () => {
  const data = await readFile();
  data.forEach((line) => parseLine(line));

  const Y = 2000000;
  const allNodeAtGivenY = filterBeacon(Y);
  const uniqNode = new Set(allNodeAtGivenY);

  console.log(uniqNode.size);
})();
