import runner from "../../runner.js";

let PATH = [];
let indexPath = 0;
let map = new Map();

function processLine(line) {
  const matches = line.match(/[A-Z0-9]{3}/g);

  if (matches) {
    const [node, left, right] = matches;
    map.set(node, [left, right]);
  }
}

function getDirection() {
  const index = indexPath % PATH.length;
  return PATH[index];
}

function getNextNode(currentNode) {
  const direction = getDirection();
  const nextNode = map.get(currentNode);
  if (direction === "R") {
    return nextNode[1];
  }
  return nextNode[0];
}

function getAllStartingNode() {
  return Array.from(map.keys()).filter((key) => key.endsWith("A"));
}

function lcm(a, b) {
  let lar = Math.max(a, b);
  let small = Math.min(a, b);

  let i = lar;
  while (i % small !== 0) {
    i += lar;
  }

  return i;
}

function getStepFor(node) {
  let currentNode = node;
  while (!currentNode.endsWith("Z")) {
    currentNode = getNextNode(currentNode);
    indexPath++;
  }
  return indexPath;
}

runner((data) => {
  PATH = data[0].split("");

  data.forEach((line) => processLine(line));

  let currentNodes = getAllStartingNode();

  const steps = currentNodes.map((node) => {
    indexPath = 0;
    return getStepFor(node);
  });

  return steps.reduce((acc, step) => {
    return lcm(acc, step);
  }, 1);
});
