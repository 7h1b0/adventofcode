import runner from "../../runner.js";

runner((data) => {
  const line = data[0];
  const matches = line.match(/mul\(\d+,\d+\)/g);

  return matches.reduce((acc, match) => {
    const factors = match.match(/\d+/g);
    return acc + Number(factors[0]) * Number(factors[1]);
  }, 0);
});
