import runner from "../../runner.js";

// For a given key, value should not be after
const map = new Map();

function sortByRole(produce) {
  return produce.sort((a, b) => {
    const problematicNumber = map.get(a);
    if (!problematicNumber) {
      return -1;
    }
    const bIsProblematic = problematicNumber.includes(b);

    return bIsProblematic ? 1 : -1;
  });
}

function isRight(produce) {
  return produce.every((v, index) => {
    const problematicNumber = map.get(v);
    if (!problematicNumber) {
      return true;
    }
    const restNumber = produce.slice(index);

    return problematicNumber.every((n) => {
      return !restNumber.includes(n);
    });
  });
}

runner((data) => {
  return data.reduce((acc, line) => {
    if (line.includes("|")) {
      const [x, y] = line.split("|").map((v) => Number(v));
      const existingX = map.get(y);
      if (existingX) {
        map.set(y, existingX.concat(x));
      } else {
        map.set(y, [x]);
      }
      return acc;
    }

    if (line.includes(",")) {
      const produce = line.split(",").map((v) => Number(v));
      const right = isRight(produce);

      if (right) {
        return acc;
      }
      const produceSorted = sortByRole(produce);

      const middle = produceSorted[Math.floor(produce.length / 2)];

      return acc + middle;
    }

    return acc;
  }, 0);
});
