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

const RED_LIMIT = 12;
const GREEN_LIMIT = 13;
const BLUE_LIMIT = 14;

function withinLimit({ max }) {
  const within =
    max.green <= GREEN_LIMIT && max.red <= RED_LIMIT && max.blue <= BLUE_LIMIT;
  return within;
}

runner((data) => {
  return data.reduce((acc, line) => {
    const game = parser(line);
    return withinLimit(game) ? game.id + acc : acc;
  }, 0);
});
