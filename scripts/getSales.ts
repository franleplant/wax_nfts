import fs from "fs";
import fetch from "cross-fetch";
import {
  Sale,
  SaleSort,
  SortOrder,
  SaleState,
  SaleParams,
} from "atomicmarket/build/API/Explorer/Types";
import { ExplorerApi } from "atomicmarket";

import range from "./range";

// TODO extract from env, probably use dotenv or similar solutions
const URL = "https://wax.api.atomicassets.io";
const NAMESPACE = "atomicmarket";
const api = new ExplorerApi(URL, NAMESPACE, { fetch: fetch as any });

export { Sale, SaleParams, SaleState, SaleSort, SortOrder };

export interface IControlOptions {
  maxPages: number;
  batchSize: number;
  /**
   * custom condition to stop fetching pages early
   * This will cause to stop fetching page batches AFTER
   * the current badge (where sales page belongs to)
   */
  shouldStop: (salesPage: Array<Sale>) => boolean;
}

export const DEFAULT_CONTROL_OPTIONS: IControlOptions = {
  maxPages: Infinity,
  batchSize: 5,
  shouldStop: (salesPage: Array<Sale>) => false,
};

/**
 * get multiple pages of sales in
 * parallel badges taking in account
 * the rate limiting of the underlying api
 */
export async function getSalesBatched(
  params: SaleParams,
  controlOptions?: Partial<IControlOptions>
): Promise<Array<Sale>> {
  console.log(`getSalesBatched ${JSON.stringify(params)}`);

  const { batchSize, maxPages, shouldStop } = {
    ...DEFAULT_CONTROL_OPTIONS,
    ...controlOptions,
  };

  let sales: Array<Sale> = [];
  let page = 1;

  while (true) {
    try {
      let finalPage = false;
      console.log(`batch from ${page} to ${page + batchSize}`);

      const batchPages = await Promise.all(
        range(page, page + batchSize).map(async (page) => {
          const salesPage = await getPage(page, params);

          if (salesPage.length === 0) {
            console.log("final page found", page);
            finalPage = true;
          }
          if (shouldStop(salesPage)) {
            console.log("should stop returned true", page);
            finalPage = true;
          }

          return salesPage;
        })
      );

      // concat all the pages in the batch
      const newSales = ([] as Array<Sale>).concat(...batchPages);
      console.log(
        `batch from ${page} to ${page + batchSize} done, got ${newSales.length}`
      );
      sales = sales.concat(newSales);

      page = page + batchSize;

      if (page >= maxPages) {
        console.log("SOFT MAX reached");
        break;
      }

      if (finalPage) {
        console.log("final page found, stopping...");
        break;
      }
    } catch (err) {
      // TODO save errors in file system for later ref
      console.error("error fetching pages", err);
      break;
    }
  }

  console.log(
    `getSalesBatched ${JSON.stringify(params)} total  ${sales.length}`
  );
  return sales;
}

/**
 * Get a single page of sales with params
 */
async function getPage(page: number, params: SaleParams): Promise<Array<Sale>> {
  console.log(`page ${page}: fetching`);
  const sales = await api.getSales(params, page, 1000);
  console.log(`page ${page}: got ${sales.length} sales`);
  return sales;
}

//async function main(): Promise<void> {
//const sales = await fetchAssets()
//const path = `./src/data/sales.json`
//fs.writeFileSync(path, JSON.stringify(sales, null, 2))
//console.log("wrote", path)
//}

//main().then(console.log, console.error)
