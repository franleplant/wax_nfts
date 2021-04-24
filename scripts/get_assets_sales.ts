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
  const res = await fetch(
    "https://wax.api.aa.atomichub.io/atomicmarket/v1/sales?page=1&limit=1000&state=1&collection_name=alien.worlds&symbol=WAX",
    {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache",
        pragma: "no-cache",
        "sec-ch-ua":
          '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
      },
      referrer: "http://localhost:8000/",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "GET",
      mode: "cors",
      credentials: "omit",
    }
  )

  const sales = await res.text()
  console.log(sales)
  //const sales = await api.getSales(
  //{
  //state: [SaleState.Listed],
  //collection_name: "alien.worlds",
  //// template_id,
  //// schema_name,
  ////match: options.search ? options.search : undefined, // FIXME must not be sent when not used
  ////sort: SaleSort.Price,
  ////order: SortOrder.Asc,
  //symbol: "WAX",
  //},
  //1,
  //10000
  //)

  return sales as any
}

async function main(): Promise<void> {
  const sales = await fetchAssets()
  console.log(sales)
}

main().then(console.log, console.error)
