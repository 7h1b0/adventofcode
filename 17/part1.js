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
  rock = moveJet(rock, jets);
  const newRockPosition = apply(rock, TO_BOTTOM);
  if (isValidVertically(newRockPosition)) {
    return turn(newRockPosition, jets);
  }
  rock.forEach((r) => {
    placed.add(getNodeId(...r));
  });
  return rock[0][1];
}

function placeToStart(rock, top) {
  return apply(apply(apply(rock, TO_RIGHT), TO_RIGHT), [0, top + 4]);
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

(async () => {
  const data = await readFile();
  const jets = buildJets(data.split(""));

  const rocks = [HORIZONTAL, CROSS, L, VERTICAL, CUBE];
  let top = -1;
  Array.from({ length: 2022 }, (_, i) => {
    const rock = placeToStart(rocks[i % 5], top);
    const topCurrent = turn(rock, jets);
    top = topCurrent > top ? topCurrent : top;
  });

  console.log(top + 1);
})();
