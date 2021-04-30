import { Sale as AMSale } from "./atomicmarket";

export type SaleSummary = Omit<
  AMSale,
  "assets" | "collection" | "collection_name"
>;

export interface IReportRow {
  template_id: string;
  name: string;
  collection: string;
  schema: string;
  max_suply: number;
  issued_supply: number;
  immutable_data: any;
  count: number;
  price_wax: number;
  avg_staking_price_ratio: number;
  min_staking_price_ratio: number;
  max_staking_price_ratio: number;
  aether_hour: number;
  assets: Array<string>;
  sales: Array<SaleSummary>;
}
