import runner from "../../runner.js";

const POINT = {
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
  7: 6,
  8: 7,
  9: 8,
  T: 9,
  J: 10,
  Q: 11,
  K: 12,
  A: 13,
};

function isFiveOfAKind(cards) {
  return cards.every((card) => card === cards[0]);
}

function getStrength(cards) {
  const map = {};
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const score = map[card];
    if (score) {
      map[card] = score + 1;
    } else {
      map[card] = 1;
    }
  }

  return map;
}

function isFourOfAKind(cards) {
  const strength = getStrength(cards);
  return Object.values(strength).some((sum) => sum === 4);
}

function isFullHouse(cards) {
  return isThreeOfAKind(cards) && isOnePair(cards);
}

function isThreeOfAKind(cards) {
  const strength = getStrength(cards);
  return Object.values(strength).some((sum) => sum === 3);
}

function isTwoOfAKind(cards) {
  const strength = getStrength(cards);
  const strengthValues = Object.values(strength);

  const first = strengthValues.indexOf(2);
  const second = strengthValues.lastIndexOf(2);

  return first !== -1 && second !== -1 && first !== second;
}

function isOnePair(cards) {
  const strength = getStrength(cards);
  return Object.values(strength).some((sum) => sum === 2);
}

function isHighCard(cards) {
  const strength = getStrength(cards);
  return Object.values(strength).every((sum) => sum === 1);
}

function getScore(cards) {
  if (isFiveOfAKind(cards)) {
    return 20;
  }
  if (isFourOfAKind(cards)) {
    return 19;
  }
  if (isFullHouse(cards)) {
    return 18;
  }
  if (isThreeOfAKind(cards)) {
    return 17;
  }
  if (isTwoOfAKind(cards)) {
    return 16;
  }
  if (isOnePair(cards)) {
    return 15;
  }
  if (isHighCard(cards)) {
    return 14;
  }
  return -1;
}

function compareCards(a, b) {
  let i = 0;
  while (a[i] === b[i]) {
    i++;
  }

  return POINT[a[i]] - POINT[b[i]];
}

runner((data) => {
  const hands = data
    .map((line) => line.split(" "))
    .map(([cards, value]) => [cards.split(""), Number(value)]);

  const sorted = hands.sort((a, b) => {
    const scoreA = getScore(a[0]);
    const scoreB = getScore(b[0]);

    if (scoreA === scoreB) {
      return compareCards(a[0], b[0]);
    }
    return scoreA - scoreB;
  });

  return sorted.reduce((acc, hands, index) => acc + hands[1] * (index + 1), 0);
});
