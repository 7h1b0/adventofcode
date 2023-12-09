import runner from "../../runner.js";

let PATH = [];
let indexPath = 0;
let map = new Map();

function processLine(line) {
  const matches = line.match(/[A-Z]{3}/g);

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

runner((data) => {
  PATH = data[0].split("");

  data.forEach((line) => processLine(line));

  let currentNode = "AAA";
  while (currentNode !== "ZZZ") {
    currentNode = getNextNode(currentNode);
    indexPath++;
  }

  return indexPath;
});
