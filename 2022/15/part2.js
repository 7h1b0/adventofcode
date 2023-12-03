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
  sensors.push({
    id: `${x1}|${y1}`,
    y: y1,
    x: x1,
    range: distance,
  });
}

function getBoundaryNodes(node, limitMin, limitMax) {
  const nodesOnEdge = node.range + 1;
  const nodes = [];

  function add(node) {
    if (node.every((el) => el >= limitMin && el <= limitMax)) {
      nodes.push(node);
    }
  }

  const BOTTOM_RIGHT = [1, 1];
  const top = [node.x, node.minY - 1];
  Array.from({ length: nodesOnEdge }).reduce((previous) => {
    const newNode = previous.map((el, index) => BOTTOM_RIGHT[index] + el);
    add(newNode);
    return newNode;
  }, top);

  const BOTTOM_lEFT = [-1, 1];
  const right = [node.x + nodesOnEdge, node.y];
  Array.from({ length: nodesOnEdge }).reduce((previous) => {
    const newNode = previous.map((el, index) => BOTTOM_lEFT[index] + el);
    add(newNode);
    return newNode;
  }, right);

  const TOP_lEFT = [-1, -1];
  const bottom = [node.x, node.maxY + 1];
  Array.from({ length: nodesOnEdge }).reduce((previous) => {
    const newNode = previous.map((el, index) => TOP_lEFT[index] + el);
    add(newNode);
    return newNode;
  }, bottom);

  const TOP_RIGTH = [1, -1];
  const left = [node.x - nodesOnEdge, node.y];
  Array.from({ length: nodesOnEdge }).reduce((previous) => {
    const newNode = previous.map((el, index) => TOP_RIGTH[index] + el);
    add(newNode);
    return newNode;
  }, left);

  return nodes;
}

function isIncluded(node, currentSensor) {
  return sensors
    .filter((sensor) => sensor.id !== currentSensor.id)
    .some((sensor) => {
      const distance = getDistance(node.x, node.y, sensor.x, sensor.y);
      return distance <= sensor.range;
    });
}

const sensors = [];
(async () => {
  const data = await readFile();
  data.forEach((line) => parseLine(line));

  for (let sensor of sensors) {
    const boundaryNodes = getBoundaryNodes(sensor, 0, 4000000);

    for (let node of boundaryNodes) {
      if (!isIncluded(node, sensor)) {
        console.log(node.x * 4000000 + node.y);
        return;
      }
    }
  }
})();
