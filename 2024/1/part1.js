import runner from "../../runner.js";

runner((data) => {
  const list1 = [];
  const list2 = [];
  data.forEach((line) => {
    const [value1, value2] = line.split("   ");
    list1.push(Number(value1));
    list2.push(Number(value2));
  });

  list1.sort((a, b) => a - b);
  list2.sort((a, b) => a - b);

  return list1.reduce((acc, value, index) => {
    return acc + Math.abs(value - list2[index]);
  }, 0);
});
