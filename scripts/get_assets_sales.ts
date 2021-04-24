import fetch from "cross-fetch"
import {
  Sale,
  SaleSort,
  SortOrder,
  SaleState,
} from "atomicmarket/build/API/Explorer/Types"

import { ExplorerApi } from "atomicmarket"

const URL = "https://wax.api.aa.atomichub.io"
const NAMESPACE = "atomicmarket"
const api = new ExplorerApi(URL, NAMESPACE, { fetch: fetch as any })

async function fetchAssets(): Promise<Array<Sale>> {
  const sales = await api.getSales(
    {
      state: [SaleState.Listed],
      collection_name: "alien.worlds",
      // template_id,
      // schema_name,
      //match: options.search ? options.search : undefined, // FIXME must not be sent when not used
      //sort: SaleSort.Price,
      //order: SortOrder.Asc,
      symbol: "WAX",
    },
    1,
    10000
  )

  return sales
}

async function main(): Promise<void> {
  const sales = await fetchAssets()
  console.log(sales)
}

main().then(console.log, console.error)
