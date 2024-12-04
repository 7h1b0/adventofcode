// @ts-check

import runner from "../../runner.js";

/**
 * @param {number[]} reportToNumber
 * @returns number
 */
const trends = (reportToNumber) => {
  const start = reportToNumber[0] < reportToNumber[1] ? 1 : -1;
  const end = reportToNumber.at(-2) < reportToNumber.at(-1) ? 1 : -1;

  const halfIndex = reportToNumber.length / 2;
  const half =
    reportToNumber.at(halfIndex) < reportToNumber.at(halfIndex + 1) ? 1 : -1;

  return start + end + half;
};

/**
 * @param {number[]} reportToNumber
 * @param {boolean} isIncreasing
 * @returns number
 */
const computeWrongIndex = (reportToNumber, isIncreasing) => {
  let wrongIndex = -1;
  const safe = reportToNumber.every((value, index) => {
    wrongIndex = index;
    if (index === 0) {
      return true;
    }
    const previousValue = reportToNumber[index - 1];
    const increase = Math.abs(value - reportToNumber[index - 1]);
    const trends = isIncreasing ? previousValue < value : previousValue > value;
    return increase > 0 && increase < 4 && trends;
  });

  return safe ? -1 : wrongIndex;
};

runner((data) => {
  return data.reduce((acc, report) => {
    const reportToNumber = report.split(" ").map((str) => Number(str));

    const isIncreasing = trends(reportToNumber) > 0;
    let wrongIndex = computeWrongIndex(reportToNumber, isIncreasing);

    if (wrongIndex === -1) {
      return acc + 1;
    }

    const newReportAfter = reportToNumber.filter((_, i) => i !== wrongIndex);
    wrongIndex = computeWrongIndex(newReportAfter, isIncreasing);

    if (wrongIndex === -1) {
      return acc + 1;
    }

    const newReportBefore = reportToNumber.filter(
      (_, i) => i !== wrongIndex - 1
    );
    wrongIndex = computeWrongIndex(newReportBefore, isIncreasing);

    if (wrongIndex === -1) {
      return acc + 1;
    }
    return acc;
  }, 0);
});
