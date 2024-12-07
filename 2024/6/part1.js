import runner from "../../runner.js";

const graph = new Map();
const visited = new Set();
const SEPARATOR = ":";
const TOP = [0, -1];
const RIGHT = [1, 0];
const BOTTOM = [0, 1];
const LEFT = [-1, 0];

let start = "";

function getNodeId(column, row) {
  return `${column}${SEPARATOR}${row}`;
}

function feedGraph(line, row) {
  Array.from(line).forEach((char, column) => {
    if (char === "^") {
      start = getNodeId(column, row);
      graph.set(start, ".");
      return;
    }
    graph.set(getNodeId(column, row), char);
  });
}

function getNextDirection(direction) {
  const nodeId = getNodeId(...direction);
  switch (nodeId) {
    case "0:-1":
      return RIGHT;
    case "1:0":
      return BOTTOM;
    case "0:1":
      return LEFT;
    case "-1:0":
      return TOP;
  }
}

function getNext(nodeId, direction) {
  const nodeCoord = nodeId.split(SEPARATOR);

  const nextNodeId = getNodeId(
    ...direction.map((el, index) => Number(nodeCoord[index]) + el)
  );
  const nextNode = graph.get(nextNodeId);

  if (nextNode === ".") {
    visited.add(nodeId);
    return [nextNodeId, direction];
  }
  if (nextNode === "#") {
    const nextDirection = getNextDirection(direction);
    return [nodeId, nextDirection];
  }

  visited.add(nodeId);
  return null;
}

runner((data) => {
  data.forEach((line, index) => feedGraph(line, index));

  let next = [start, TOP];
  while (next !== null) {
    next = getNext(...next);
  }

  return visited.size;
});
