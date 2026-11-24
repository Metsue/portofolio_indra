import { cpSync, renameSync, writeFileSync } from "node:fs";

renameSync("dist-pages/pages.html", "dist-pages/index.html");
cpSync("public/assets", "dist-pages/assets", { recursive: true });
cpSync("public/favicon.svg", "dist-pages/favicon.svg");
writeFileSync("dist-pages/.nojekyll", "");
