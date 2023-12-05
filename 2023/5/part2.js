import runner from "../../runner.js";

let seeds = [];
let currentIndexMap = -1;
const maps = [];

function parseLine(line) {
  if (line === "") {
    return;
  }

  if (line.startsWith("seeds")) {
    const pairs = line.match(/\d+\s\d+/g);
    pairs.forEach((pair) => {
      const [start, range] = pair.split(" ").map((str) => Number(str));
      seeds.push([start, start + range]);
    });
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

function findSuitablePath(init, map) {
  return map.find(({ source, range }) => {
    if (init >= source && init <= source + range - 1) {
      return true;
    }
    return false;
  });
}

function applyPath(init, path) {
  if (path) {
    const { dest, source } = path;

    const diff = init - source;
    return dest + diff;
  }
  return init;
}

function getNewSegment([start, end], map) {
  const path = findSuitablePath(start, map);

  if (!path) {
    return [[start, end]];
  }

  const endPath = path.source + path.range - 1;
  if (end > endPath) {
    const newStart = applyPath(start, path);
    const newEnd = applyPath(endPath, path);
    return [[newStart, newEnd]].concat(getNewSegment([endPath + 1, end], map));
  } else {
    const newStart = applyPath(start, path);
    const newEnd = applyPath(end, path);
    return [[newStart, newEnd]];
  }
}

runner((data) => {
  data.forEach((line) => parseLine(line));

  const finalSegments = seeds.flatMap((seed, index) => {
    console.log(`Iteration seeds ${index}`);
    return maps.reduce(
      (segments, map) => {
        return segments.flatMap((segment) => {
          const newSegments = getNewSegment(segment, map);
          return newSegments;
        });
      },
      [seed]
    );
  });

  return finalSegments.reduce(
    (min, segment) => (segment[0] < min ? segment[0] : min),
    finalSegments[0][0]
  );
});
