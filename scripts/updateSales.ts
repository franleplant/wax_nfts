import fs from "fs";
import { getSalesBatched, SaleParams, SortOrder } from "./getSales";

const saleParams: SaleParams = {
  //state: [SaleState.Listed],
  // TODO type information looks outdated
  // but swagger says we can use the sort param
  sort: "updated" as any,
  order: SortOrder.Desc,
  symbol: "WAX",
};

const oneDay = 24 * 60 * 60 * 1000;

async function main(): Promise<void> {
  // for now using 1 day
  const cutTime = new Date().getTime() - oneDay;
  const sales = await getSalesBatched(saleParams, {
    shouldStop: (salesPage) => {
      return salesPage.some((sale) => sale.updated_at_time < cutTime);
    },
  });

  console.log(`got updated sales ${sales.length}`);
  fs.writeFileSync(
    "./src/data/updatedSales.json",
    JSON.stringify(sales, null, 2)
  );
}

main().then(console.log, console.error);
