import fs from "fs"
import _ from "lodash"
import { ICollectionStakingSettings } from "./getStakingSettings"
import { getSalesBatched, Sale, SaleState, SaleParams } from "./getSales"

export interface ISaleWithStaking extends Sale {
  /* aether per hour yield */
  stakingReward: number
  /* aether per hour yield per wax*/
  stakingPriceRatio: number
}

export const saleParams: SaleParams = {
  state: [SaleState.Listed],
  symbol: "WAX",
}

export async function main() {
  const path = `./src/data/staking_grouped.json`
  const stakingByCollection = JSON.parse(
    fs.readFileSync(path, { encoding: "utf8" })
  ) as Record<string, Array<ICollectionStakingSettings>>

  for (const collection of Object.values(stakingByCollection)) {
    const collectionName = collection[0].collection
    let collectionSalesWithStaking: Array<ISaleWithStaking> = []
    for (const collectionBySchema of collection) {
      const schemaName = collectionBySchema.schema
      const sales = await getSalesBatched({
        ...saleParams,
        collection_name: collectionName,
        schema_name: schemaName,
      })
      const salesWithStaking = getSalesWithStaking(sales, collectionBySchema)

      collectionSalesWithStaking = collectionSalesWithStaking.concat(
        salesWithStaking
      )
    }

    collectionSalesWithStaking = collectionSalesWithStaking.sort(
      sortByHighestStakingPriceRatio
    )
    const path = `./src/data/salesWithStaking_${collectionName}.json`
    fs.writeFileSync(path, JSON.stringify(collectionSalesWithStaking, null, 2))
    console.log("wrote", path)
  }
}

main().then(console.log, console.error)

export function sortByHighestStakingPriceRatio(
  elementA: ISaleWithStaking,
  elementB: ISaleWithStaking
): number {
  return elementB.stakingPriceRatio - elementA.stakingPriceRatio
}

export function getSalesWithStaking(
  sales: Array<Sale>,
  schema: ICollectionStakingSettings
): Array<ISaleWithStaking> {
  return (
    sales
      // we only care about sigle asset sells
      .filter(sale => sale.assets.length === 1)
      .map(sale => {
        const asset = sale.assets[0]
        const rarityKey = schema.rarity_id
        const rarity = asset.data[rarityKey] || ""
        //console.log("RARITY", rarity)

        const rarityConf = schema.rarities.find(
          element => element.rarity.toUpperCase() === rarity.toUpperCase()
        )

        //console.log("rarityConf", rarityConf)
        if (!rarityConf) {
          console.log("we fucked up", schema, asset)
        }
        const stakingRewardRaw = rarityConf?.one_asset_value || 0
        // this is because this freaking thing comes shifted to the left
        const stakingReward = stakingRewardRaw / 10000

        //console.log("stakingReward", stakingReward, stakingRewardRaw)

        const priceInWax =
          sale.price.amount / Math.pow(10, sale.price.token_precision)
        const stakingPriceRatio = stakingReward / priceInWax
        //console.log("staklingPriceRatio", stakingPriceRatio, priceInWax)

        return {
          ...sale,
          stakingReward,
          stakingPriceRatio,
        }
      })
  )
}
