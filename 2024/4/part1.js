import runner from "../../runner.js";

const graph = new Map();

function getNodeId(column, row) {
  return `${column}-${row}`;
}

function findSymbol(line, row) {
  Array.from(line).forEach((char, column) => {
    graph.set(getNodeId(column, row), char);
  });
}

function hasAdjacentSymbol(nodeId) {
  const nodeCoord = nodeId.split("-");

  return [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ]
    .map((direction) => {
      const m = graph.get(
        getNodeId(
          ...direction.map((el, index) => Number(nodeCoord[index]) + el)
        )
      );
      const a = graph.get(
        getNodeId(
          ...direction.map((el, index) => Number(nodeCoord[index]) + el * 2)
        )
      );
      const s = graph.get(
        getNodeId(
          ...direction.map((el, index) => Number(nodeCoord[index]) + el * 3)
        )
      );

      return s === "S" && a === "A" && m === "M" ? 1 : 0;
    })
    .reduce((acc, sum) => acc + sum, 0);
}

function process() {
  let sum = 0;

  const iterator = graph[Symbol.iterator]();

  for (const item of iterator) {
    const [nodeId, char] = item;
    if (char === "X") {
      sum = hasAdjacentSymbol(nodeId, char) + sum;
    }
  }

  return sum;
}

runner((data) => {
  data.forEach((line, index) => findSymbol(line, index));

  return process();
});
