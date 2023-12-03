const fs = require("fs");

function readFile() {
  return new Promise((resolve, reject) => {
    fs.readFile("./input.txt", "utf8", (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data.split("\n"));
    });
  });
}

(async () => {
  const data = await readFile();

  const sum = data.reduce((acc, line) => {
    const match = line.match(/\d/g);

    const first = match.at(0);
    const last = match.at(-1);

    const number = Number(first + last);

    return acc + number;
  }, 0);

  console.log(sum);
})();
