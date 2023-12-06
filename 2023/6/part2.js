import runner from "../../runner.js";

function getDistance(holdTime, maxTime) {
  const remainingTime = maxTime - holdTime;

  return remainingTime * holdTime;
}

function joinNumber(arr) {
  console.log(arr, arr.join(""));
  return Number(arr.join(""));
}

runner((data) => {
  const [time, distanceToBeat] = data
    .map((line) => line.match(/\d+/g))
    .map((str) => joinNumber(str));

  let ways = 0;

  for (let i = 0; i < time; i++) {
    const traveled = getDistance(i, time);
    if (traveled > distanceToBeat) {
      ways++;
    }
  }
  return ways;
});
