import runner from "../../runner.js";

// For a given key, value should not be after
const map = new Map();

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
      const middle = produce[Math.floor(produce.length / 2)];

      return right ? acc + middle : acc;
    }

    return acc;
  }, 0);
});
