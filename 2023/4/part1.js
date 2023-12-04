import runner from "../../runner.js";

function toNumbers(str) {
  return str.match(/\d+/g).map((match) => Number(match));
}

function computeScore(match) {
  if (match === 0) {
    return 0;
  }
  return Math.pow(2, match - 1);
}

runner((data) => {
  return data.reduce((acc, line) => {
    const [cards, winingNumbers] = line
      .replace(/Card\s+\d+:/, "")
      .split("|")
      .map((str) => toNumbers(str));

    const matchingNumber = cards.reduce(
      (acc, card) => (winingNumbers.includes(card) ? acc + 1 : acc),
      0
    );

    return acc + computeScore(matchingNumber);
  }, 0);
});
