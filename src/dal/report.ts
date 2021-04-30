import { Sale as AMSale } from "./atomicmarket"

type Sale = Omit<AMSale, "assets" | "collection" | "collection_name">

export interface IReportRow {
  template_id: string
  name: string
  collection: string
  schema: string
  max_suply: number
  issued_supply: number
  immutable_data: any
  count: number
  avg_price_wax: number
  avg_staking_price_ratio: number
  min_staking_price_ratio: number
  max_staking_price_ratio: number
  aether_hour: number
  assets: Array<string>
  sale_ids: Array<Sale>
}
