import runner from "../../runner.js";

const memo = new Map();

runner((data) => {
  const list1 = [];
  const list2 = [];

  const similarityScore = (value) => {
    if (memo.has(value)) {
      return memo.get(value);
    }
    const score = value * list2.filter((a) => a === value).length;
    memo.set(value, score);
    return score;
  };

  data.forEach((line) => {
    const [value1, value2] = line.split("   ");
    list1.push(Number(value1));
    list2.push(Number(value2));
  });

  return list1.reduce((acc, value) => {
    return acc + similarityScore(value);
  }, 0);
});
