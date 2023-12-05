import runner from "../../runner.js";

let seeds = [];
let currentIndexMap = -1;
const maps = [];

function parseLine(line) {
  if (line === "") {
    return;
  }

  if (line.startsWith("seeds")) {
    seeds = line.match(/\d+/g).map((str) => Number(str));
    return;
  }

  if (/^[a-z]/i.test(line)) {
    maps[++currentIndexMap] = [];
    return;
  }

  if (/^\d/.test(line)) {
    const [dest, source, range] = line.match(/\d+/g).map((str) => Number(str));
    maps[currentIndexMap].push({ dest, source, range });
  }
}

function findInMap(init, map) {
  const found = map.find(({ source, range }) => {
    if (init >= source && init <= source + range) {
      return true;
    }
    return false;
  });

  if (found) {
    const { dest, source } = found;

    const diff = init - source;
    return dest + diff;
  }
  return init;
}

runner((data) => {
  data.forEach((line) => parseLine(line));

  const locations = seeds.map((seed) => {
    return maps.reduce((prev, map) => {
      return findInMap(prev, map);
    }, seed);
  });

  console.log(locations);

  return locations.reduce(
    (min, value) => (value < min ? value : min),
    locations[0]
  );
});
