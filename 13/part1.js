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

const PAIR = [[]];
function readLine(line) {
  if (line === "") {
    return;
  }
  const array = eval(line);
  const lastPair = PAIR.at(-1);
  if (lastPair.length === 2) {
    PAIR.push([array]);
  } else {
    lastPair.push(array);
  }
}

function compareIntegers(left, right, nested = false) {
  for (let i = 0; i < left.length; i++) {
    const leftItem = left[i];
    const rightItem = right[i];

    if (rightItem === undefined) {
      return false;
    }

    let res = null;
    if (Array.isArray(leftItem) && Array.isArray(rightItem)) {
      res = compareIntegers(leftItem, rightItem, true);
    } else if (Array.isArray(leftItem)) {
      res = compareIntegers(leftItem, [rightItem], true);
    } else if (Array.isArray(rightItem)) {
      res = compareIntegers([leftItem], rightItem, true);
    }
    if (res !== null) {
      return res;
    }

    if (leftItem < rightItem) {
      return true;
    }

    if (leftItem > rightItem) {
      return false;
    }
  }

  if (nested && right.length > left.length) {
    return true;
  }

  return null;
}

(async () => {
  const data = await readFile();
  data.forEach((line) => readLine(line));

  const inRightOrder = PAIR.map(([left, right]) => {
    return compareIntegers(left, right) ?? true;
  });

  console.log(
    inRightOrder.reduce((acc, value, index) => {
      const score = value ? index + 1 : 0;
      return acc + score;
    }, 0)
  );
})();
