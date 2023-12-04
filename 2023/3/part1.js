import runner from "../../runner.js";

const graph = new Map();

function getNodeId(column, row) {
  return `${column}-${row}`;
}

const SYMBOLS = "!@#$%&*+_-=/";

function findSymbol(line, row) {
  Array.from(line).forEach((char, column) => {
    if (SYMBOLS.includes(char)) {
      graph.set(getNodeId(column, row), true);
    }
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
    .map((coord) =>
      getNodeId(...coord.map((el, index) => Number(nodeCoord[index]) + el))
    )
    .some((children) => graph.has(children));
}

function process(line, index) {
  const regexp = /\d+/g;
  let sum = 0;
  let res;

  while ((res = regexp.exec(line)) !== null) {
    const number = res[0];
    const coors = Array.from(number, (_, col) =>
      getNodeId(col + res.index, index)
    );

    const isAPart = coors.some((coor) => hasAdjacentSymbol(coor));

    if (isAPart) {
      sum += Number(number);
    }
  }

  return sum;
}

runner((data) => {
  data.forEach((line, index) => findSymbol(line, index));

  return data.reduce((acc, line, index) => {
    return process(line, index) + acc;
  }, 0);
});
