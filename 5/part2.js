const fs = require("fs");

const STACKS = [[], [], [], [], [], [], [], [], []];

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

const STACK =
  /(.{3})\s(.{3})\s(.{3})\s(.{3})\s(.{3})\s(.{3})\s(.{3})\s(.{3})\s(.{3})/;
const INSTRUCTION = /move\s(\d+)\sfrom\s([\d]+)\sto\s(\d)+/;

const FROM = 1;
const TO = 2;
const TIMES = 0;

function isStack(line) {
  const matches = line.match(STACK);
  return !!matches;
}

function parseStack(line) {
  const matches = line.match(STACK);

  matches.slice(1, 10).forEach((match, index) => {
    const letter = match.match(/[\A-Z]{1}/);
    if (letter) {
      STACKS.at(index).unshift(letter);
    }
  });
}

function isIntrusction(line) {
  const matches = line.match(INSTRUCTION);
  return !!matches;
}

function parseInstruction(line) {
  const matches = line.match(INSTRUCTION);

  const instructions = matches.slice(1, 4).map((i) => Number(i));

  const from = instructions.at(FROM) - 1;
  const to = instructions.at(TO) - 1;

  if (instructions.at(TIMES) > STACKS.at(from).length) {
    throw new Error("Error occured");
  }

  const additions = STACKS.at(from).slice(-1 * instructions.at(TIMES));
  Array.from({ length: instructions.at(TIMES) }).forEach(() => {
    STACKS.at(from).pop();
  });
  STACKS.at(to).push(...additions);
}

function readLine(line) {
  if (isStack(line)) {
    parseStack(line);
  } else if (isIntrusction(line)) {
    parseInstruction(line);
  }
}

function readResult() {
  return STACKS.map((pile) => pile.pop()).join("");
}

(async () => {
  const data = await readFile();
  data.forEach((line) => readLine(line));

  console.log(readResult());
})();
