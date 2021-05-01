import moment from "moment";
import { ICurrencyExchange } from "../dal/currency";

// The quote_token is the token being priced
// in the base_token
const USDT = "WAXUSDT@eth.token";
const WAX = "WAX@eosio.token";
const AETHER = "AETHER@e.rplanet";
const WECANITE = "WECAN@e.rplanet";
const ENEFTERIUM = "ENEFT@e.rplanet";
const WAXON = "WAXON@e.rplanet";
const CAPONIUM = "CAPON@e.rplanet";

export enum Token {
  USDT = "usdt",
  WAX = "wax",
  AETHER = "aether",
  WECANITE = "wecanite",
  ENEFTERIUM = "enefterium",
  WAXON = "waxon",
  CAPONIUM = "caponium",
}

// the price of wax in dollars
export function getWaxInUSDT(
  exchange: Array<ICurrencyExchange>
): ICurrencyExchange | undefined {
  return exchange.find(
    ({ quote_token, base_token }) =>
      quote_token.str === WAX && base_token.str === USDT
  );
}

// the price of aether in wax
export function getAetherInWax(
  exchange: Array<ICurrencyExchange>
): ICurrencyExchange | undefined {
  return exchange.find(
    ({ quote_token, base_token }) =>
      quote_token.str === AETHER && base_token.str === WAX
  );
}

export function getWecaniteInWax(
  exchange: Array<ICurrencyExchange>
): ICurrencyExchange | undefined {
  return exchange.find(
    ({ quote_token, base_token }) =>
      quote_token.str === WECANITE && base_token.str === WAX
  );
}

export function getEnefteriumInWax(
  exchange: Array<ICurrencyExchange>
): ICurrencyExchange | undefined {
  return exchange.find(
    ({ quote_token, base_token }) =>
      quote_token.str === ENEFTERIUM && base_token.str === WAX
  );
}

export function getWaxonInWax(
  exchange: Array<ICurrencyExchange>
): ICurrencyExchange | undefined {
  return exchange.find(
    ({ quote_token, base_token }) =>
      quote_token.str === WAXON && base_token.str === WAX
  );
}

export function getCaponiumInWax(
  exchange: Array<ICurrencyExchange>
): ICurrencyExchange | undefined {
  return exchange.find(
    ({ quote_token, base_token }) =>
      quote_token.str === CAPONIUM && base_token.str === WAX
  );
}

export function fromWaxToUSDT(
  currencyInWax: ICurrencyExchange | number | undefined,
  exchange: Array<ICurrencyExchange>
): number {
  const waxInUSDT = getWaxInUSDT(exchange)?.last_price || 0;
  const priceInWax =
    typeof currencyInWax === "object"
      ? currencyInWax.last_price
      : currencyInWax;

  return (priceInWax || 0) * waxInUSDT;
}

// Aether priced in usdt
export function getAetherInUSDT(exchange: Array<ICurrencyExchange>): number {
  const aetherInWax = getAetherInWax(exchange);

  return fromWaxToUSDT(aetherInWax, exchange);
}

export type IRates = Record<Token, number>;

export function getAllInUSDT(exchange: Array<ICurrencyExchange>): IRates {
  const wax = getWaxInUSDT(exchange)?.last_price || 0;
  const aether = fromWaxToUSDT(getAetherInWax(exchange), exchange);
  const wecanite = fromWaxToUSDT(getWecaniteInWax(exchange), exchange);
  const enefterium = fromWaxToUSDT(getEnefteriumInWax(exchange), exchange);
  const waxon = fromWaxToUSDT(getWaxonInWax(exchange), exchange);
  const caponium = fromWaxToUSDT(getCaponiumInWax(exchange), exchange);

  return {
    usdt: 1,
    wax,
    aether,
    wecanite,
    enefterium,
    waxon,
    caponium,
  };
}

/**
 * convert a quantity from one token into another
 * based off of the USDT value of each
 */
export function convert(valueInUsdt: number, to: Token, rates: IRates): number {
  return valueInUsdt / rates[to];
}

export class Yield {
  /**
   * APY, anualised percentage yield in usd, base 1
   */
  apy: number;
  /**
   * hourly percentage yield in usd, base 1
   */
  hpy: number;
  /**
   * how many hours for return on investment
   */
  roi: number;

  constructor(hpy: number) {
    this.hpy = hpy;
    this.apy = hpy * 24 * 365;
    this.roi = 1 / hpy;
  }

  /**
   * get APY base 100 in usd
   */
  getApy(): number {
    return this.apy * 100;
  }

  /**
   * get HPY base 100 in usd
   */
  getHpy(): number {
    return this.hpy * 100;
  }

  /**
   * Get APY percentage formatted but without the % sign
   */
  getApyFormatted(): string {
    return this.getApy().toFixed(2);
  }

  /**
   * Get HPY percentage formatted but without the % sign
   */
  getHpyFormatted(): string {
    return this.getHpy().toFixed(2);
  }

  /**
   * How many times it returns yierly
   */
  getXFormatted(): string {
    return (this.apy + 1).toFixed(2);
  }

  getRoiFormatted(): string {
    return moment.duration(this.roi, "hours").humanize();
  }
}

export function getYield(
  exchange: Array<ICurrencyExchange>,
  stakingRewardRatio: number
): Yield {
  const waxInUsdt = getWaxInUSDT(exchange)?.last_price || 0;
  const aetherInUsdt = getAetherInUSDT(exchange);

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
  const hpy = (stakingRewardRatio * aetherInUsdt) / waxInUsdt;

  return new Yield(hpy);
}
