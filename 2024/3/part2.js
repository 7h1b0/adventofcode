import runner from "../../runner.js";

runner((data) => {
  const line = data[0];
  const matches = line.match(/(?:mul\(\d+,\d+\))|do\(\)|don\'t\(\)/g);

  let enabled = true;
  return matches.reduce((acc, match) => {
    if (match === "do()") {
      enabled = true;
      return acc;
    } else if (match === "don't()") {
      enabled = false;
      return acc;
    }
    if (!enabled) {
      return acc;
    }
    const factors = match.match(/\d+/g);
    return acc + Number(factors[0]) * Number(factors[1]);
  }, 0);
});
