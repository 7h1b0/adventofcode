import runner from "../../runner.js";

function getDistance(holdTime, maxTime) {
  const remainingTime = maxTime - holdTime;

  return remainingTime * holdTime;
}

runner((data) => {
  const [times, distances] = data.map((line) => line.match(/\d+/g));

  const numberOfWays = times.map((time, index) => {
    const distanceToBeat = distances[index];
    let ways = 0;

    for (let i = 0; i < time; i++) {
      const traveled = getDistance(i, time);
      if (traveled > distanceToBeat) {
        ways++;
      }
    }
    return ways;
  });

  return numberOfWays.reduce((acc, way) => acc * way, 1);
});
