import runner from "../../runner.js";

runner((data) => {
  return data.reduce((acc, report) => {
    const reportToNumber = report.split(" ").map((str) => Number(str));

    const isIncreasing = reportToNumber[1] > reportToNumber[0];
    const isSafe = reportToNumber.every((value, index) => {
      if (index === 0) {
        return true;
      }
      const previousValue = reportToNumber[index - 1];
      const increase = Math.abs(value - reportToNumber[index - 1]);
      const trends = isIncreasing
        ? previousValue < value
        : previousValue > value;
      return increase > 0 && increase < 4 && trends;
    });

    return isSafe ? acc + 1 : acc;
  }, 0);
});
