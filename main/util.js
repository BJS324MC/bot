const fetch = require('node-fetch');

const parsePgn = pgn => {
  let s1 = pgn.split("\n\n");
  for (let i = 0; i < s1.length - 1; i++) {
    let s2 = s1[i].slice(s1[i].indexOf("White") + 6),
      s3 = s2.slice(0, s2.indexOf("]")),
      n = (s3 === "\"Bjs324Chess\"" || s3 === "\"BoayJS\"") ? 0 : 1;
    s1[i] = [n].concat(filterLine(s1[i + 1]));
    s1.splice(i + 1, 1);
  }
  if (s1[s1.length - 1] === "\n") s1.pop();
  return s1
}

const filterLine = line => line.replace(/\d\./g, "").replace(/\n/g, " ").split(" ").map(b => b.trim()).filter(c => isNaN(Number(c))).slice(0, -1);

const handleRandom = moves => {
  let sum = 0, sum2 = 0;
  for (let i in moves) sum += moves[i]; sum *= Math.random();
  for (let i in moves) if ((sum2 += moves[i]) > sum) return i;
}
const createTable = (parsed) => {
  const table = {};
  for (const line of parsed) {
    let n = line[0];
    for (let i = 1 + n; i < line.length - 1; i += 2) {
      let part = line.slice(1, i);
      if (part in table) {
        if (line[i] in table[part]) table[part][line[i]]++;
        else table[part][line[i]] = 1;
      } else {
        table[part] = { [line[i]]: 1 };
      }
    }
  }
  return table;
}

const getPgn = async url => parsePgn(await (await fetch(url)).text());