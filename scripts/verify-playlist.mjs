import fs from "node:fs";
const ids = [
  ...fs.readFileSync("src/data/playlist.ts", "utf8").matchAll(/id:'([^']+)'/g),
].map((x) => x[1]);
const results = await Promise.all(
  ids.map(async (id) => {
    try {
      const r = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`,
        { signal: AbortSignal.timeout(20000) },
      );
      const j = await r.json();
      return { id, status: r.status, title: j.title, author: j.author_name };
    } catch (e) {
      return { id, error: e.name };
    }
  }),
);
fs.writeFileSync(
  ".qa/playlist-verification.json",
  JSON.stringify(results, null, 2),
);
console.log(results);
