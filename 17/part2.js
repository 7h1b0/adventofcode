const fs = require("fs");

function readFile(file = "./input.txt") {
  return new Promise((resolve, reject) => {
    fs.readFile(file, "utf8", (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
}

const HORIZONTAL = [
  [0, 0],
  [1, 0],
  [2, 0],
  [3, 0],
];

const CROSS = [
  [1, 2],
  [0, 1],
  [1, 1],
  [2, 1],
  [1, 0],
];

const L = [
  [2, 2],
  [2, 1],
  [0, 0],
  [1, 0],
  [2, 0],
];

const VERTICAL = [
  [0, 3],
  [0, 2],
  [0, 1],
  [0, 0],
];

const CUBE = [
  [0, 1],
  [1, 1],
  [0, 0],
  [1, 0],
];

const placed = new Set();

const TO_RIGHT = [1, 0];
const TO_LEFT = [-1, 0];
const TO_BOTTOM = [0, -1];

function apply(rock, direction) {
  return rock.map((r) => r.map((c, i) => c + direction[i]));
}

function isValid(rock) {
  return rock.every(
    (r) => r[0] >= 0 && r[0] < 7 && !placed.has(getNodeId(...r))
  );
}

function isValidVertically(rock) {
  return rock.every((r) => r[1] >= 0 && !placed.has(getNodeId(...r)));
}

function getNodeId(x, y) {
  return `${x}|${y}`;
}

function moveJet(rock, jets) {
  const direction = jets.getDirection();

  const newRockPosition = apply(rock, direction);
  if (isValid(newRockPosition)) {
    return newRockPosition;
  }
  return rock;
}

function turn(rock, jets) {
  let queue = [rock];
  // let rock = null;

  for (let i = 0; i < queue.length; i++) {
    rock = moveJet(queue[i], jets);
    const newRockPosition = apply(rock, TO_BOTTOM);
    if (isValidVertically(newRockPosition)) {
      queue.push(newRockPosition);
    }
  }
  rock.forEach((r) => {
    placed.add(getNodeId(...r));
  });
  return rock[0][1];
}

function buildJets(jets) {
  let jetIndex = 0;
  let JETS_LIMIT = jets.length;

  function increaseJetIndex() {
    jetIndex++;
    if (jetIndex >= JETS_LIMIT) {
      jetIndex = 0;
    }
  }

  return {
    getDirection() {
      const jet = jets[jetIndex];
      increaseJetIndex();
      return jet === ">" ? TO_RIGHT : TO_LEFT;
    },
  };
}

function findCycle(top) {
  const part = Array.from(placed)
    .filter((r) => {
      const [_, yStr] = r.split("|");
      const y = Number(yStr);
      return (
        y === top ||
        y === top - 1 ||
        y === top - 2 ||
        y === top - 3 ||
        y === top - 4
      );
    })
    .map((r) => r.split("|"));

  // console.log(part, top);
  const direction = [0, -1];
  for (let i = 0; i < top; i++) {
    if (
      part
        .map((r) => r.map((e, i) => Number(e) + direction[i]))
        .every((r) => placed.has(getNodeId(...r)))
    ) {
      return i;
    }
  }

  return null;
}

(async () => {
  const data = await readFile();
  const jets = buildJets(data.split(""));

  const rocks = [HORIZONTAL, CROSS, L, VERTICAL, CUBE];
  let top = -1;
  Array.from({ length: 1000 }, (_, i) => {
    const rock = apply(rocks[i % 5], [2, top + 4]);
    const topCurrent = turn(rock, jets);
    top = topCurrent > top ? topCurrent : top;

    const cycle = findCycle(top);
    if (cycle !== null) {
      console.log("ALORS PEUT ETRE", cycle, i);
    }
  });

  console.log(top + 1);
})();
