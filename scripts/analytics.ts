import fs from "fs"
import { ICollectionStakingSettings } from "./getStakingSettings"
import { ISaleWithStaking } from "./getSalesStaking"
import _ from "lodash"

const path = `./src/data/staking_grouped.json`
const stakingByCollection = JSON.parse(
  fs.readFileSync(path, { encoding: "utf8" })
) as Record<string, Array<ICollectionStakingSettings>>

// sample, count
const sample: Record<number, number> = {}

let max: ISaleWithStaking | undefined

for (const collection of Object.values(stakingByCollection)) {
  const collectionName = collection[0].collection
  const path = `./src/data/salesWithStaking_${collectionName}.json`
  const salesWithStaking: Array<ISaleWithStaking> = JSON.parse(
    fs.readFileSync(path, { encoding: "utf8" })
  )
  salesWithStaking.forEach(sale => {
    const ratio = sale.stakingPriceRatio
    sample[ratio] = (sample[ratio] || 0) + 1

    if (sale.stakingPriceRatio > (max?.stakingPriceRatio || -Infinity)) {
      max = sale
    }
  })
}

//const max = _.max(Object.keys(sample).map(Number))

const waxPrice =
  (max?.price.amount || 0) / Math.pow(10, max?.price.token_precision || 0)
console.log("max", max, waxPrice)

const sampleArray = Object.entries(sample)

const mode = _.sortBy(sampleArray, ([sample, count]) => count)

console.log("mode", mode.slice(0, 10))

let sampleList: Array<number> = []
Object.entries(sample).forEach(([sample, count]) => {
  const unfolded = `x`
    .repeat(count)
    .split("")
    .map(() => Number(sample))
  sampleList = sampleList.concat(unfolded)
})

const avg = _.mean(sampleList)

console.log("avg", avg)
