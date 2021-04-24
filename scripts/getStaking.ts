import fs from "fs"
import _ from "lodash"
import { IStakableCollection } from "./get_aether_staking"
import { fetchAssets, Sale } from "./get_assets_sales"

export interface ISaleWithStaking extends Sale {
  /* aether per hour yield */
  stakingReward: number
  /* aether per hour yield per wax*/
  stakingPriceRatio: number
}

export async function main() {
  const path = `./src/data/staking_grouped.json`
  const stakingConf = JSON.parse(
    fs.readFileSync(path, { encoding: "utf8" })
  ) as Record<string, Array<IStakableCollection>>

  //Object.values(stakingConf)
  //.map(collection => {
  //const collectionName = collection[0].collection
  //return collection.map(async schema => {
  //const schemaName = schema.schema
  //const assets = await fetchAssets(collectionName, schemaName)
  //})
  //})

  for (const collection of Object.values(stakingConf)) {
    const collectionName = collection[0].collection
    let collectionSalesWithStaking: Array<ISaleWithStaking> = []
    for (const schema of collection) {
      const schemaName = schema.schema
      const sales = await fetchAssets(collectionName, schemaName)
      const salesWithStaking = sales
        // we only care about sigle asset sells
        .filter(sale => sale.assets.length === 1)
        .map(sale => {
          const asset = sale.assets[0]
          const rarityKey = schema.rarity_id
          const rarity = asset.data[rarityKey] || ""
          //console.log("RARITY", rarity)

          const rarityConf = schema.rarities.find(
            element => element.rarity === rarity
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
          } as ISaleWithStaking
        })
      // sort by highest stakingPriceRatio
      //.sort(sortByHighestStakingPriceRatio)
      // get the top 1000 (remove the crust)
      //.slice(0, 1000)

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
