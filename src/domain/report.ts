import { meanBy, minBy, omit } from "lodash";
import { Sale as AMSale, SaleState } from "../dal/atomicmarket";
import { IReportRow, SaleSummary, PriceFlat } from "../dal/report";

export function getPriceInWax(sale: SaleSummary): number {
  const amount = sale["price.amount"];
  const precision = sale["price.token_precision"];
  const priceInWax = amount / Math.pow(10, precision);
  return priceInWax;
}

// TODO unify with lif-am-ingest
export function calcSaleStakingRatio(
  report: IReportRow,
  sale: SaleSummary
): SaleSummary {
  const stakingReward = report.aether_hour;

  const priceInWax = getPriceInWax(sale);
  const stakingPriceRatio = stakingReward / priceInWax;

  return {
    ...sale,
    staking_price_ratio: stakingPriceRatio,
  };
}

export function toSaleSummary(sale: AMSale): SaleSummary {
  const saleSummary = omit(sale, [
    "collection",
    "collection_name",
    "assets",
    "price",
  ]) as SaleSummary;

  const flatPrice: any = {};
  Object.values(sale.price).forEach(([key, value]) => {
    flatPrice[`price.${key}`] = value;
  });

  return {
    ...saleSummary,
    ...(flatPrice as PriceFlat),
  };
}

/**
 * This function takes a single report row
 * for a given template id
 * and a hash of freshly fetched sales
 * for that template id
 * and runs the neccesary transformations
 * and calculations to update the report row
 * with the potencial changes in prices,
 * sales that might have ended, etc.
 */
export function calcReportRow(
  report: IReportRow,
  updatedSalesById: Record<number, AMSale>
): IReportRow {
  const assets: Array<string> = [];

  console.log(report.sales);
  const activeSales = report.sales
    // replace the oldSales with the newest we just fetched
    .map((oldSale) => updatedSalesById[oldSale.sale_id])
    // filter out the sales that are not active
    .filter((sale) => sale?.sale_state === SaleState.Listed)
    // save the full Sale's asset
    .map((sale) => {
      // ugly side effect, sorry
      const id = sale.assets[0].asset_id;
      if (id) {
        assets.push(id.toString());
      }
      return calcSaleStakingRatio(report, toSaleSummary(sale));
    });

  const count = activeSales.length;
  const price_wax = meanBy(activeSales, (sale) => getPriceInWax(sale));
  const avg = meanBy(activeSales, (sale) => sale.staking_price_ratio);
  const min =
    minBy(activeSales, (sale) => sale.staking_price_ratio)
      ?.staking_price_ratio || 0;
  const max =
    minBy(activeSales, (sale) => sale.staking_price_ratio)
      ?.staking_price_ratio || 0;

  debugger;

  return {
    ...report,
    price_wax,
    count,
    avg_staking_price_ratio: avg,
    min_staking_price_ratio: min,
    max_staking_price_ratio: max,
    sales: activeSales,
    assets,
  };
}
