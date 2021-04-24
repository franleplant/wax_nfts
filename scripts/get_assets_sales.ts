import fs from "fs"
import fetch from "cross-fetch"
import {
  Sale,
  SaleSort,
  SortOrder,
  SaleState,
} from "atomicmarket/build/API/Explorer/Types"
import { ExplorerApi } from "atomicmarket"

import range from "./range"

const URL = "https://wax.api.atomicassets.io"
const NAMESPACE = "atomicmarket"
const api = new ExplorerApi(URL, NAMESPACE, { fetch: fetch as any })

export { Sale }

async function getPage(
  collection: string,
  schema: string,
  page: number
): Promise<Array<Sale>> {
  console.log(`page ${page}: fetching`)
  const sales = await api.getSales(
    {
      state: [SaleState.Listed],
      symbol: "WAX",
      collection_name: collection,
      schema_name: schema,
    },
    page,
    1000
  )
  console.log(`page ${page}: got ${sales.length} sales`)
  return sales
}

const SOFT_MAX = Infinity
export async function fetchAssets(
  collection: string,
  schema: string
): Promise<Array<Sale>> {
  console.log(`fetchAssets sales ${collection} ${schema}`)
  let sales: Array<Sale> = []
  let page = 1
  const batchSize = 5

  while (true) {
    try {
      let finalPage = false
      console.log(`batch from ${page} to ${page + batchSize}`)

      await Promise.all(
        range(page, page + batchSize).map(async page => {
          const salesPage = await getPage(collection, schema, page)
          if (salesPage.length === 0) {
            console.log("final page found", page)
            finalPage = true
          }
          sales = sales.concat(salesPage)
        })
      )

      page = page + batchSize
      if (page >= SOFT_MAX) {
        console.log("SOFT MAX reached")
        break
      }

      if (finalPage) {
        console.log("final page found")
        break
      }
    } catch (err) {
      console.error("error fetching pages", err)
      break
    }
  }

  console.log(`fetchAssets sales ${collection} ${schema} total ${sales.length}`)
  return sales
}

//async function main(): Promise<void> {
//const sales = await fetchAssets()
//const path = `./src/data/sales.json`
//fs.writeFileSync(path, JSON.stringify(sales, null, 2))
//console.log("wrote", path)
//}

//main().then(console.log, console.error)
