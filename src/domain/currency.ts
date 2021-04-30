import moment from "moment"
import { ICurrencyExchange } from "../dal/currency"

// The quote_token is the token being priced
// in the base_token
const WAX_USDT = "WAX@eosio.token"
const AETHER_WAX = "AETHER@e.rplanet"

// the price of wax in dollars
export function getWaxInUSDT(
  marketData: Array<ICurrencyExchange>
): ICurrencyExchange | undefined {
  return marketData.find(market => market.quote_token.str === WAX_USDT)
}

// the price of aether in wax
export function getAetherInWax(
  marketData: Array<ICurrencyExchange>
): ICurrencyExchange | undefined {
  return marketData.find(
    market =>
      market.quote_token.str === AETHER_WAX &&
      market.base_token.str === "WAX@eosio.token"
  )
}

// Aether priced in usdt
export function getAetherInUSDT(marketData: Array<ICurrencyExchange>): number {
  const waxInUSDT = getWaxInUSDT(marketData)?.last_price || 0
  const aetherInWax = getAetherInWax(marketData)?.last_price || 0

  const price = aetherInWax * waxInUSDT

  return price
}

export type CurrencyConverter = (currency: number) => number

export function getConverters(marketData: Array<ICurrencyExchange>) {
  const aetherInWax = getAetherInWax(marketData)
  const waxInUSDT = getWaxInUSDT(marketData)

  const aetherToWax: CurrencyConverter = aether =>
    (aetherInWax?.last_price || 0) * aether
  const waxToAether: CurrencyConverter = wax =>
    wax / (aetherInWax?.last_price || 1)
  const waxToUsdt: CurrencyConverter = wax => (waxInUSDT?.last_price || 0) * wax
  const usdtToWax: CurrencyConverter = usdt =>
    usdt / (waxInUSDT?.last_price || 1)

  return {
    aetherToWax,
    waxToAether,
    waxToUsdt,
    usdtToWax,
  }
}

export class Yield {
  /**
   * APY, anualised percentage yield in usd, base 1
   */
  apy: number
  /**
   * hourly percentage yield in usd, base 1
   */
  hpy: number
  /**
   * how many hours for return on investment
   */
  roi: number

  constructor(hpy: number) {
    this.hpy = hpy
    this.apy = hpy * 24 * 365
    this.roi = 1 / hpy
  }

  /**
   * get APY base 100 in usd
   */
  getApy(): number {
    return this.apy * 100
  }

  /**
   * get HPY base 100 in usd
   */
  getHpy(): number {
    return this.hpy * 100
  }

  /**
   * Get APY percentage formatted but without the % sign
   */
  getApyFormatted(): string {
    return this.getApy().toFixed(2)
  }

  /**
   * Get HPY percentage formatted but without the % sign
   */
  getHpyFormatted(): string {
    return this.getHpy().toFixed(2)
  }

  /**
   * How many times it returns yierly
   */
  getXFormatted(): string {
    return (this.apy + 1).toFixed(2)
  }

  getRoiFormatted(): string {
    return moment.duration(this.roi, "hours").humanize()
  }
}

export function getYield(
  marketData: Array<ICurrencyExchange>,
  stakingRewardRatio: number
): Yield {
  const waxInUsdt = getWaxInUSDT(marketData)?.last_price || 0
  const aetherInUsdt = getAetherInUSDT(marketData)

  // The anualised percentage yield in usd dollars.
  // A/W = stakingRewardRatio is in Aether / Wax
  // U/A = aetherInUsdt is USDT / Aether
  // U/W = waxInUsdt is  USDT / Wax
  //
  // A/W * U/A = U/W
  //
  // U/W / U/W = U/W * W/U = U/U (USDT rewards over USDT invested)
  //
  // And U/U is per hour, so to know the yearly value we need to multiple that
  // for 24 * 365
  //
  // This is not compounded so a simple multiplication works,
  // we will eventually work on an automatic compounding mechanism
  // that will make this much more profitable
  const hpy = (stakingRewardRatio * aetherInUsdt) / waxInUsdt

  return new Yield(hpy)
}
