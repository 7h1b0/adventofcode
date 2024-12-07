// @ts-check

import runner from "../../runner.js";

const graph = new Map();
const visited = new Set();
const SEPARATOR = ":";
const TOP = [0, -1];
const RIGHT = [1, 0];
const BOTTOM = [0, 1];
const LEFT = [-1, 0];

let loop = new Set();
let start = "";

// X / Y
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

/**
 * @param {number[]} direction
 * @returns nunber[]
 */
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
    default:
      return TOP;
  }
}

function hashNode(node) {
  return `${node[0]}/${getNodeId(...node[1])}`;
}

/**
 * @param {string} nodeId
 * @param {number[]} direction
 * @param {string} nextNode
 * @returns boolean
 */
function createLoop(nodeId, direction, nextNode) {
  graph.set(nextNode, "#");
  let visitedWithDirection = new Set();
  let next = [nodeId, direction];
  while (next !== null) {
    const previousSize = visitedWithDirection.size;
    const newSize = visitedWithDirection.add(hashNode(next)).size;
    if (newSize === previousSize) {
      loop.add(nextNode);
      graph.set(nextNode, ".");
      return;
    }
    next = getNext(...next, true);
  }

  graph.set(nextNode, ".");
}

function getNext(nodeId, direction, ignoreLoop = false) {
  const nodeCoord = nodeId.split(SEPARATOR);

  const nextNodeId = getNodeId(
    ...direction.map((el, index) => Number(nodeCoord[index]) + el)
  );
  const nextNode = graph.get(nextNodeId);

  if (nextNode === ".") {
    if (ignoreLoop) {
      return [nextNodeId, direction];
    }
    if (!visited.has(nextNodeId)) {
      createLoop(nodeId, direction, nextNodeId);
    }
    visited.add(nodeId);
    return [nextNodeId, direction];
  }
  if (nextNode === "#") {
    const nextDirection = getNextDirection(direction);
    return [nodeId, nextDirection];
  }

  return null;
}

runner((data) => {
  data.forEach((line, index) => feedGraph(line, index));

  let next = [start, TOP];
  while (next !== null) {
    next = getNext(...next, false);
  }

  return loop.size;
});
