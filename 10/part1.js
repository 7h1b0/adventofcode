const fs = require("fs");

const STACKS = [1];

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

function readLine(line) {
  const last = STACKS.at(-1);
  if (line === "noop") {
    STACKS.push(last);
  } else {
    const [_, value] = line.split(" ");
    STACKS.push(last);
    STACKS.push(last + Number(value));
  }
}

function computeSum() {
  return [20, 60, 100, 140, 180, 220].reduce(
    (acc, index) => acc + index * STACKS[index - 1],
    0
  );
}

(async () => {
  const data = await readFile();
  data.forEach((line) => readLine(line));

  console.log(computeSum());
})();
