import fs from "fs";
import fetch from "cross-fetch";
import _ from "lodash";

// TODO move to env
const URL = "https://chain.wax.io/v1/chain/get_table_rows";

export interface IResponse {
  next_key: string;
  more: boolean;
  rows: Array<ICollectionStakingSettings>;
}

export interface ICollectionStakingSettings {
  id: string;
  contract: string;
  author: string;
  collection: string;
  schema: string;
  name_id: string;
  img_id: string;
  /**
   * the value of this key will be used to look for
   * the rarity of the assets, by doing the following
   * asset.data[rarity_id]
   */
  rarity_id: string;
  rarities: Array<IRarity>;
  r1: number;
  r2: number;
  r3: number;
}

export interface IRarity {
  rarity: string;
  uniq_assets: number;
  one_asset_value: number;
  collection_value: number;
  r1: number;
  r2: number;
}

/**
 * Get the staking configurations in rplanet. This will
 * be used later to cross reference it with the open listed
 * nfts and calculate the ROI of each nft based off its market price
 * and staking rewards.
 */
export async function getStakingConf(): Promise<IResponse> {
  const res = await fetch(URL, {
    method: "POST",
    body: JSON.stringify({
      json: true,
      code: "s.rplanet",
      scope: "s.rplanet",
      table: "collections",
      lower_bound: "",
      upper_bound: "",
      index_position: 1,
      key_type: "i64",
      limit: 1000,
      reverse: false,
      show_payer: false,
    }),
  });
  const data = await res.json();

  return data;
}

export default async function main(): Promise<void> {
  const { rows } = await getStakingConf();
  const path = `./src/data/staking.json`;
  fs.writeFileSync(path, JSON.stringify(rows, null, 2));
  console.log("wrote", path);

  const byCollection = _.groupBy(rows, "collection");
  const pathGrouped = `./src/data/staking_grouped.json`;
  fs.writeFileSync(pathGrouped, JSON.stringify(byCollection, null, 2));
  console.log("wrote", pathGrouped);
}

main().then(console.log, console.error);
