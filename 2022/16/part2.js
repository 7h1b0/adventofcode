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

function parse(data) {
  const regexp =
    /Valve ([A-Z]{2,}) has flow rate=(\d+); tunnels? leads? to valves?\s(.*)/;
  return data.reduce((map, line) => {
    const [_, valveId, rate, nearValves] = regexp.exec(line);
    return map.set(valveId, {
      id: valveId,
      rate: Number(rate),
      nearValves: nearValves.split(", "),
      open: false,
    });
  }, new Map());
}

// Map<ID, Map<Id, distance>>
const distanceMap = new Map();
function distance(graph, start, map = new Map()) {
  if (distanceMap.has(start.id)) {
    return distanceMap.get(start.id);
  }

  function spread(valve, step) {
    valve.nearValves.forEach((valveId) => {
      if (map.get(valveId) < step || valveId === start.id) {
        return;
      }
      const valve = graph.get(valveId);
      map.set(valveId, step);
      spread(valve, step + 1);
    });
  }

  spread(start, 1);

  map.forEach((_, valveId) => {
    if (graph.get(valveId).rate === 0) {
      map.delete(valveId);
    }
  });
  distanceMap.set(start.id, map);
  return map;
}

function evaluate(valves, start, limit) {
  const queue = [{ curr: start, time: limit, flow: 0, path: [] }];

  for (let i = 0; i < queue.length; i++) {
    const distanceValves = distance(valves, queue[i].curr);
    const item = queue[i];
    if (item.time <= 0) {
      continue;
    }
    distanceValves.forEach((distance, valveId) => {
      if (item.path.includes(valveId)) {
        return;
      }

      const valve = valves.get(valveId);
      const remain = item.time - distance - 1;
      queue.push({
        curr: valve,
        path: item.path.concat(valveId),
        time: remain,
        flow: item.flow + remain * valve.rate,
      });
    });
  }
  return queue;
}

(async () => {
  const data = await readFile();
  const valves = parse(data);
  const queue = evaluate(valves, valves.get("AA"), 26);
  console.log(queue.length);

  let max = 0;
  for (let i = 0; i < queue.length; i++) {
    for (let j = i + 1; j < queue.length; j++) {
      const newMax = queue[i].flow + queue[j].flow;
      if (
        newMax > max &&
        queue[i].path.every((p) => !queue[j].path.includes(p))
      ) {
        max = newMax;
      }
    }
  }
  console.log(max);
})();
