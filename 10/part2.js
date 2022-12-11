const fs = require("fs");

const STACKS = [1];
const SCREEN = [[], [], [], [], [], [], [], []];

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

function drawInScreen(lit) {
  const length = STACKS.length;
  const x = Math.floor((length - 1) / 40);

  SCREEN[x].push(lit ? "#" : ".");
}

function isLit() {
  const value = STACKS.at(-1);
  const length = STACKS.length % 40;

  return value === length || value + 1 === length || value + 2 === length;
}

function readLine(line) {
  const last = STACKS.at(-1);
  if (line === "noop") {
    drawInScreen(isLit());
    STACKS.push(last);
  } else {
    const [_, value] = line.split(" ");
    drawInScreen(isLit());
    STACKS.push(last);
    drawInScreen(isLit());
    STACKS.push(last + Number(value));
  }
}

(async () => {
  const data = await readFile();
  data.forEach((line) => readLine(line));

  console.log(SCREEN.map((a) => a.join("")).join("\n"));
})();
