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
  J: 0,
  Q: 11,
  K: 12,
  A: 13,
};

function getStrength(cards) {
  const map = { J: 0 };
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

function isFiveOfAKind(strength) {
  const { J, ...rest } = strength;

  const values = Object.values(rest);
  if (values.length > 0) {
    const max = Math.max(...Object.values(rest));
    return max + J === 5;
  }
  return J === 5;
}

function isFourOfAKind(strength) {
  const { J, ...rest } = strength;

  const max = Math.max(...Object.values(rest));
  return max + J === 4;
}

function isFullHouse(strength) {
  const strengthValues = Object.values(strength);

  const pair = strengthValues.indexOf(2);
  const three = strengthValues.indexOf(3);

  if (pair !== -1 && three !== -1) {
    return true;
  }

  if (strength["J"] === 1 && isTwoOfAKind(strength)) {
    return true;
  }

  return false;
}

function isThreeOfAKind(strength) {
  const { J, ...rest } = strength;

  const max = Math.max(...Object.values(rest));
  return max + J === 3;
}

function isTwoOfAKind(strength) {
  const strengthValues = Object.values(strength);

  const first = strengthValues.indexOf(2);
  const second = strengthValues.lastIndexOf(2);

  return first !== -1 && second !== -1 && first !== second;
}

function isOnePair(strength) {
  const { J, ...rest } = strength;

  const max = Math.max(...Object.values(rest));
  return max + J === 2;
}

function isHighCard(strength) {
  const { J, ...rest } = strength;
  return Object.values(rest).every((sum) => sum === 1);
}

function getScore(cards) {
  const strength = getStrength(cards);
  if (isFiveOfAKind(strength)) {
    return 20;
  }
  if (isFourOfAKind(strength)) {
    return 19;
  }
  if (isFullHouse(strength)) {
    return 18;
  }
  if (isThreeOfAKind(strength)) {
    return 17;
  }
  if (isTwoOfAKind(strength)) {
    return 16;
  }
  if (isOnePair(strength)) {
    return 15;
  }
  if (isHighCard(strength)) {
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
