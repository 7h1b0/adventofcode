import runner from "../../runner.js";

const graph = new Map();

function getNodeId(column, row) {
  return `${column}-${row}`;
}

const SYMBOLS = "*";

function findSymbol(line, row) {
  Array.from(line).forEach((char, column) => {
    if (SYMBOLS.includes(char)) {
      graph.set(getNodeId(column, row), []);
    }
  });
}

function findAdjacentSymbol(nodeId) {
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
    .find((children) => graph.has(children));
}

function findGearCoor(coors) {
  for (let i = 0; i < coors.length; i++) {
    const coor = findAdjacentSymbol(coors[i]);
    if (coor !== undefined) {
      return coor;
    }
  }
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

    const gearCoor = findGearCoor(coors);

    if (gearCoor !== undefined) {
      const numbers = graph.get(gearCoor);
      graph.set(gearCoor, numbers.concat(Number(number)));
    }
  }

  return sum;
}

runner((data) => {
  data.forEach((line, index) => findSymbol(line, index));

  data.forEach((line, index) => {
    process(line, index);
  });

  return Array.from(graph.values()).reduce((acc, numbers) => {
    if (numbers.length == 2) {
      return acc + numbers[0] * numbers[1];
    }
    return acc;
  }, 0);
});
