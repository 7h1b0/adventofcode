import runner from "../../runner.js";

function toNumbers(str) {
  return str.match(/\d+/g).map((match) => Number(match));
}

function getCopyWin(cardNumber, matchingNumber) {
  return Array.from({ length: matchingNumber }, (_, i) => i + cardNumber + 1);
}

runner((data) => {
  const map = [];

  data.forEach((line, index) => {
    const cardNumber = index + 1;
    const [cards, winingNumbers] = line
      .replace(/Card\s+\d+:/, "")
      .split("|")
      .map((str) => toNumbers(str));

    const matchingNumber = cards.reduce(
      (acc, card) => (winingNumbers.includes(card) ? acc + 1 : acc),
      0
    );

    let value = map[cardNumber];
    map[cardNumber] = value ? value + 1 : 1;

    const copiesWin = getCopyWin(cardNumber, matchingNumber);

    const score = map[cardNumber] ?? 1;
    copiesWin.forEach((copy) => {
      let value = map[copy];
      if (value === undefined) {
        map[copy] = score;
      } else {
        map[copy] = value + score;
      }
    });
  });

  return map.reduce((acc, val) => acc + val, 0);
});
