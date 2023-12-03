const fs = require("fs");

let MONKEYS = [];

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
  if (line.startsWith("Monkey")) {
    MONKEYS.push({
      items: [],
      operation: [],
      condition: null,
      actions: {},
      itemInspected: 0,
    });
  }

  if (line.includes("Starting")) {
    const matches = line.matchAll(/\d{2,}/g);
    const items = [...matches].map((match) => Number(match[0]));
    MONKEYS.at(-1).items = items;
  }

  if (line.includes("Operation")) {
    const match = line.match(/new\s=\s(old|\d+)\s([+*])\s(old|\d+)/);
    MONKEYS.at(-1).operation = match.slice(1, 4);
  }

  if (line.includes("Test")) {
    const match = line.match(/\d+/);
    MONKEYS.at(-1).condition = Number(match[0]);
  }

  if (line.includes("If true")) {
    const match = line.match(/\d+/);
    MONKEYS.at(-1).actions[true] = Number(match[0]);
  }

  if (line.includes("If false")) {
    const match = line.match(/\d+/);
    MONKEYS.at(-1).actions[false] = Number(match[0]);
  }
}

function computeWorryLevel(item, operation) {
  let [first, operand, second] = operation;
  first = first === "old" ? item : Number(first);
  second = second === "old" ? item : Number(second);

  return operand === "*" ? first * second : first + second;
}

function inspectItem(monkey, item) {
  const worryLevel = computeWorryLevel(item, monkey.operation);
  const newWorryLevel = Math.floor(worryLevel / 3);

  const isDivisible = newWorryLevel % monkey.condition;
  const monkeyToPass = monkey.actions[isDivisible === 0];

  MONKEYS.at(monkeyToPass).items.push(newWorryLevel);
  monkey.items.shift();
  monkey.itemInspected += 1;
}

function getScore() {
  return MONKEYS.sort((a, b) => b.itemInspected - a.itemInspected)
    .splice(0, 2)
    .reduce((acc, monkey) => acc * monkey.itemInspected, 1);
}

(async () => {
  const data = await readFile();
  data.forEach((line) => readLine(line));

  Array.from({ length: 20 }).forEach(() => {
    MONKEYS.forEach((monkey) => {
      while (monkey.items.length > 0) {
        inspectItem(monkey, monkey.items[0]);
      }
    });
  });

  console.log(getScore());
})();
