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

const LIST = [];
function readLine(line) {
  if (line === "") {
    return;
  }
  const array = eval(line);
  LIST.push(array);
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

  LIST.push([[6]], [[2]]);

  LIST.sort((left, right) => {
    const rightOrder = compareIntegers(left, right) ?? true;
    return rightOrder ? -1 : 1;
  });

  const first = LIST.findIndex((item) => JSON.stringify(item) === "[[2]]");
  const second = LIST.findIndex((item) => JSON.stringify(item) === "[[6]]");

  console.log((first + 1) * (second + 1));
})();
