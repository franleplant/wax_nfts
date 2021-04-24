import fs from "fs"
import fetch from "cross-fetch"
import { ApiAsset } from "atomicassets/build/API/Explorer/Types"
import { ExplorerApi } from "atomicassets"

const URL = "https://wax.api.atomicassets.io"
const NAMESPACE = "atomicassets"
const api = new ExplorerApi(URL, NAMESPACE, { fetch: fetch as any })

async function fetchAssetsPage(page: number = 1): Promise<Array<ApiAsset>> {
  // 1000 is the max (got that from experimenting)
  console.log(`page ${page}: fetching`)
  const assets = await api.getAssets({}, page, 1000)
  console.log(`page ${page}: got ${assets.length} assets`)

  return assets
}

function range(from: number, to: number): Array<number> {
  const list = []
  for (let index = from; index < to; index++) {
    list.push(index)
  }

  return list
}

async function fetchAssets(): Promise<void> {
  let page = 1
  // 50 reached the rate limit
  const batchSize = 20

  while (true) {
    try {
      let didPageFailed = false
      console.log(`batch from ${page} to ${page + batchSize}`)

      await Promise.all(
        range(page, page + batchSize).map(async page => {
          try {
            const assets = await fetchAssetsPage(page)
            const path = `./src/data/atomicAssets${page
              .toString()
              .padStart(6, "0")}.json`
            fs.writeFileSync(path, JSON.stringify(assets, null, 2))
            console.log("wrote", path)
          } catch (err) {
            console.log(err)
            didPageFailed = true
            return [page, []]
          }
        })
      )

      page = page + batchSize

      if (didPageFailed) {
        console.log("one page failed")
        break
      }
    } catch (err) {
      console.error("error fetching pages", err)
      break
    }
  }

  console.log(`fetched all pages`)
}

async function main(): Promise<void> {
  await fetchAssets()
}

main().then(console.log, console.error)
