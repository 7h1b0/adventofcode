const fs = require("fs");

const RIGHT = [0, 1];
const LEFT = [0, -1];
const TOP = [1, 0];
const BOTTOM = [-1, 0];

const TOP_RIGHT = [1, 1];
const TOP_LEFT = [1, -1];
const BOTTOM_RIGHT = [-1, 1];
const BOTTOM_LEFT = [-1, -1];

let VISITED = [[0, 0]];

function addVisited(coord) {
  const hasPoint = VISITED.find(([y, x]) => y === coord[0] && coord[1] === x);
  if (!hasPoint) {
    VISITED.push(coord);
  }
}

function isHeadAround(head, tail) {
  const diffX = Math.abs(head[0] - tail[0]);
  const diffY = Math.abs(head[1] - tail[1]);

  return diffX <= 1 && diffY <= 1;
}

function getMovingDirection(head, tail) {
  if (head[0] === tail[0]) {
    return head[1] > tail[1] ? RIGHT : LEFT;
  } else if (head[1] === tail[1]) {
    return head[0] > tail[0] ? TOP : BOTTOM;
  } else {
    if (head[0] === tail[0] + 1) {
      return head[1] > tail[1] ? TOP_RIGHT : TOP_LEFT;
    } else if (head[0] === tail[0] - 1) {
      return head[1] > tail[1] ? BOTTOM_RIGHT : BOTTOM_LEFT;
    } else if (head[1] === tail[1] + 1) {
      return head[0] > tail[0] ? TOP_RIGHT : BOTTOM_RIGHT;
    } else if (head[1] === tail[1] - 1) {
      return head[0] > tail[0] ? TOP_LEFT : BOTTOM_LEFT;
    } else if (head[0] > tail[0]) {
      return head[1] > tail[1] ? TOP_RIGHT : TOP_LEFT;
    } else if (head[0] < tail[0]) {
      return head[1] > tail[1] ? BOTTOM_RIGHT : BOTTOM_LEFT;
    } else if (head[1] > tail[1]) {
      return head[0] > tail[0] ? TOP_RIGHT : BOTTOM_RIGHT;
    } else if (head[1] < tail[1]) {
      return head[0] > tail[0] ? TOP_LEFT : BOTTOM_LEFT;
    }
    throw new Error("An error occured");
  }
}

function moveTail(head, tail, follow = false) {
  if (isHeadAround(head, tail)) {
    return tail;
  }

  const direction = getMovingDirection(head, tail);
  const newTail = apply(tail, direction);

  if (follow) {
    addVisited(newTail);
  }
  return moveTail(head, newTail, follow);
}

function apply(coords, direction) {
  return coords.map((coor, index) => coor + direction[index]);
}

function moveHead(head, direction) {
  switch (direction) {
    case "R":
      return apply(head, RIGHT);
    case "U":
      return apply(head, TOP);
    case "L":
      return apply(head, LEFT);
    case "D":
      return apply(head, BOTTOM);
  }
}

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

(async () => {
  const data = await readFile();

  let head = [[0, 0]];
  let tail = [];
  data.forEach((line) => {
    const [direction, times] = line.split(" ");

    Array.from({ length: times }, () => {
      head[0] = moveHead(head[0], direction);
      const SIZE = 9;
      Array.from({ length: SIZE }, (_, index) => {
        tail[index] = moveTail(
          head[index],
          tail[index] ?? [0, 0],
          index === SIZE - 1
        );
        head[index + 1] = tail[index];
      });
    });
  });

  console.log(VISITED.length);
})();
