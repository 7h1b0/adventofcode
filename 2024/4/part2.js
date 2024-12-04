import runner from "../../runner.js";

const graph = new Map();
const solution = ["MMSS", "SMMS", "SSMM", "MSSM"];

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

  const mTop = graph.get(
    getNodeId(...[-1, -1].map((el, index) => Number(nodeCoord[index]) + el))
  );
  const sTop = graph.get(
    getNodeId(...[1, -1].map((el, index) => Number(nodeCoord[index]) + el))
  );
  const sBottom = graph.get(
    getNodeId(...[1, 1].map((el, index) => Number(nodeCoord[index]) + el))
  );
  const mBottom = graph.get(
    getNodeId(...[-1, 1].map((el, index) => Number(nodeCoord[index]) + el))
  );

  const seq = [mTop, sTop, sBottom, mBottom].join("");

  return solution.includes(seq) ? 1 : 0;
}

function process() {
  let sum = 0;

  const iterator = graph[Symbol.iterator]();

  for (const item of iterator) {
    const [nodeId, char] = item;
    if (char === "A") {
      sum = hasAdjacentSymbol(nodeId) + sum;
    }
  }

  return sum;
}

runner((data) => {
  data.forEach((line, index) => findSymbol(line, index));

  return process();
});
