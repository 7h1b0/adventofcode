import runner from "../../runner.js";

function parser(line) {
  const match = line.match(/Game (\d+): (.*)/);

  const id = Number(match[1]);
  const games = match[2];

  const splitGames = games.split(";");
  const max = splitGames.reduce(
    (acc, game) => {
      const splitRevealed = game.split(",");
      splitRevealed.forEach((reveal) => {
        const res = reveal.match(/(\d+) (green|blue|red)/);
        const value = Number(res[1]);
        const color = res[2];

        if (acc[color] < value) {
          acc[color] = value;
        }
      });

      return acc;
    },
    { green: 0, red: 0, blue: 0 }
  );

  return { id, max };
}

function power({ max }) {
  return max.red * max.green * max.blue;
}

runner((data) => {
  return data.reduce((acc, line) => {
    const game = parser(line);
    return power(game) + acc;
  }, 0);
});
