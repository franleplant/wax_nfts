import fs from "fs";
import fetch from "node-fetch";

export default async function main(): Promise<void> {
  const res = await fetch("/report");
  const report = await res.json();

  fs.writeFileSync("./src/data/report.json", JSON.stringify(report));

  console.log("report written");
}

main().then(console.log, console.error);
