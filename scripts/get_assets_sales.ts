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

const URL = "https://wax.api.aa.atomichub.io"
const NAMESPACE = "atomicmarket"
const api = new ExplorerApi(URL, NAMESPACE, { fetch: fetch as any })

async function getPage(page: number): Promise<Array<Sale>> {
  console.log(`page ${page}: fetching`)
  const sales = await api.getSales(
    { state: [SaleState.Listed], symbol: "WAX" },
    page,
    1000
  )
  console.log(`page ${page}: got ${sales.length} sales`)
  return sales
}

async function fetchAssets(): Promise<Array<Sale>> {
  let sales: Array<Sale> = []
  let page = 1
  const batchSize = 20

  while (true) {
    try {
      let finalPage = false
      console.log(`batch from ${page} to ${page + batchSize}`)

      await Promise.all(
        range(page, page + batchSize).map(async page => {
          const sales = await getPage(page)
          if (sales.length === 0) {
            finalPage = true
          }
          return sales
        })
      )

      page = page + batchSize

      if (finalPage) {
        console.log("final page found")
        break
      }
    } catch (err) {
      console.error("error fetching pages", err)
      break
    }
  }

  console.log(`total sales ${sales.length}`)

  return sales
}

async function main(): Promise<void> {
  const sales = await fetchAssets()
  const path = `./src/data/sales.json`
  fs.writeFileSync(path, JSON.stringify(sales, null, 2))
  console.log("wrote", path)
}

main().then(console.log, console.error)
