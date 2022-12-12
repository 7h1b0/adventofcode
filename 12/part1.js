const fs = require("fs");

function readFile() {
  return new Promise((resolve, reject) => {
    fs.readFile("./input.txt", "utf8", (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      const array = data.split("\n");
      resolve(array);
    });
  });
}

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";
const graph = new Map();

function getNodeId(column, row) {
  return `${column}-${row}`;
}

let startNode = "";
let endNode = "";
function readLine(line, row) {
  Array.from(line).forEach((elevation, column) => {
    const node = getNodeId(column, row);
    if (elevation === "S") {
      startNode = node;
      graph.set(node, 0);
      return;
    }
    if (elevation === "E") {
      endNode = node;
      graph.set(node, 25);
      return;
    }
    graph.set(node, ALPHABET.indexOf(elevation));
  });
}

function lowestCostNode(costs, visited) {
  return Object.keys(costs).reduce((lowest, node) => {
    if (lowest === null || costs[node] < costs[lowest]) {
      if (!visited.includes(node)) {
        lowest = node;
      }
    }
    return lowest;
  }, null);
}

function getReachableChildrens(nodeId) {
  const nodeCoord = nodeId.split("-");

  return [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ]
    .map((coord) =>
      getNodeId(...coord.map((el, index) => Number(nodeCoord[index]) + el))
    )
    .filter((children) => {
      return (
        graph.has(children) && graph.get(children) <= graph.get(nodeId) + 1
      );
    });
}

(async () => {
  const data = await readFile();
  data.forEach((line, index) => readLine(line, index));

  const rootChildrens = getReachableChildrens(startNode);
  const costs = { [endNode]: Infinity };
  rootChildrens.forEach((node) => {
    costs[node] = 1;
  });

  const visited = [];
  let node = lowestCostNode(costs, visited);

  while (node) {
    let cost = costs[node];
    let childrens = getReachableChildrens(node);
    childrens.forEach((children) => {
      let newCost = cost + 1;
      if (!costs[children] || costs[children] > newCost) {
        costs[children] = newCost;
      }
    });
    visited.push(node);
    node = lowestCostNode(costs, visited);
  }

  console.log(costs[endNode]);
})();
