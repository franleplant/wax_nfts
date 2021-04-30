export interface IReportRow {
  template: string
  name: string
  collection: string
  schema: string
  count: number
  avg_price_wax: number
  avg_staking_price_ratio: number
  min_staking_price_ratio: number
  max_staking_price_ratio: number
  aether_hour: number
  // TODO for now this is an array of strings but we could get
  // the asset json alomst directly
  assets: Array<string>
  // TODO is it string?
  sale_ids: Array<string>
}
