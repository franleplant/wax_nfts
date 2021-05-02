import fs from "fs";
import fetch from "node-fetch";

const URL =
  "https://lif-runtime.azurewebsites.net/api/report?code=ar6CDy2rR1zglx0jE95/4WsKA90ApIRwatleryR5liTFj7/CGaPVXg==";

export default async function main(): Promise<void> {
  const res = await fetch(URL);
  const report = await res.json();

  fs.writeFileSync("./src/data/report.json", JSON.stringify(report));

  console.log("report written");
}

main().then(console.log, console.error);
