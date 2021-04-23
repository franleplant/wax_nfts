import { IMarketData } from "../dal/market"

// The quote_token is the token being priced
// in the base_token
const WAX_USDT = "WAX@eosio.token"
const AETHER_WAX = "AETHER@e.rplanet"

export function calcAetherUSDT(marketData: Array<IMarketData>): number {
  // the price of wax in dollars
  const waxUSDT = marketData.find(market => market.quote_token.str === WAX_USDT)
  // the price of aether in wax
  const aetherWax = marketData.find(
    market => market.quote_token.str === AETHER_WAX
  )

  const price = aetherWax.last_price * waxUSDT.last_price

  return price
}
