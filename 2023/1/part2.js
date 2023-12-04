import runner from "../../runner.js";

function letterToNumber(data) {
  switch (data) {
    case "one":
      return "1";
    case "two":
      return "2";
    case "three":
      return "3";
    case "four":
      return "4";
    case "five":
      return "5";
    case "six":
      return "6";
    case "seven":
      return "7";
    case "eight":
      return "8";
    case "nine":
      return "9";
    default:
      return data;
  }
}

function parser(line) {
  const match = line.match(/(\d|two|one|three|four|five|six|seven|eight|nine)/);

  if (match) {
    const number = match.at(0);
    const newString = line.substring(match.index + 1);

    return [number, newString];
  }
  return null;
}

runner((data) => {
  return data.reduce((acc, line) => {
    let match = [];
    let res = parser(line);
    while (res != null) {
      match.push(res[0]);
      res = parser(res[1]);
    }

    const first = letterToNumber(match.at(0));
    const last = letterToNumber(match.at(-1));

    const number = Number(first + last);

    return acc + number;
  }, 0);
});
