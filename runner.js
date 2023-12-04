import fs from "node:fs";

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

export default async function runner(callback) {
  const data = await readFile();

  performance.mark("start");
  const res = callback(data);

  const t = performance.measure("runner", "start");

  console.log(res);
  console.log(`duration: ${t.duration}ms`);
}
