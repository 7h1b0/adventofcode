import runner from "../../runner.js";

function getNextValue(line) {
  const [first, ...rest] = line;
  let prev = first;
  return rest.map((value) => {
    const newValue = value - prev;
    prev = value;
    return newValue;
  });
}

function isAllZero(line) {
  return line.every((value) => value === 0);
}

function getExtrapolatedValue(path) {
  path.reverse();
  return path.reduce((diff, line) => {
    const first = line.at(0);
    const newValue = first - diff;
    line.unshift(newValue);
    return newValue;
  }, 0);
}

function processLine(line) {
  let newLine = getNextValue(line);
  let path = [line, newLine];

  while (!isAllZero(newLine)) {
    newLine = getNextValue(newLine);
    path.push(newLine);
  }

  return getExtrapolatedValue(path);
}

runner((data) => {
  const lines = data.map((line) => line.split(" ").map((n) => Number(n)));

  const nextValues = lines.map((line) => {
    return processLine(line);
  });

  return nextValues.reduce((acc, value) => acc + value, 0);
});
