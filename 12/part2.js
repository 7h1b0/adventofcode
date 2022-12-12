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

let startCoord = "";
function readLine(line, row) {
  Array.from(line).forEach((elevation, column) => {
    const node = getNodeId(column, row);
    if (elevation === "E") {
      startCoord = node;
      graph.set(node, 25);
      return;
    }
    if (elevation === "S") {
      graph.set(node, 0);
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
        graph.has(children) && graph.get(nodeId) <= graph.get(children) + 1
      );
    });
}

(async () => {
  const data = await readFile();
  data.forEach((line, index) => readLine(line, index));

  const rootChildrens = getReachableChildrens(startCoord);
  const costs = {};
  rootChildrens.forEach((node) => {
    costs[node] = 1;
  });

  const visited = [];
  let node = lowestCostNode(costs, visited);

  while (node) {
    let cost = costs[node];
    let children = getReachableChildrens(node);
    children.forEach((n) => {
      let newCost = cost + 1;
      if (!costs[n] || costs[n] > newCost) {
        costs[n] = newCost;
      }
    });
    visited.push(node);
    if (graph.get(node) === 0) {
      console.log(costs[node]);
      node = null;
    } else {
      node = lowestCostNode(costs, visited);
    }
  }
})();
