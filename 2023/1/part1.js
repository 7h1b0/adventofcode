import runner from "../../runner.js";

runner((data) => {
  return data.reduce((acc, line) => {
    const match = line.match(/\d/g);

    const first = match.at(0);
    const last = match.at(-1);

    const number = Number(first + last);

    return acc + number;
  }, 0);
});
