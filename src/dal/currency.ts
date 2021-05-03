// TODO rename to currencyMarket
import { useQuery, UseQueryResult } from "react-query";

export const USDT = "WAXUSDT@eth.token";
export const WAX = "WAX@eosio.token";
export interface ICurrencyExchange {
  id: number;
  base_token: {
    contract: string;
    symbol: {
      name: string;
      precision: number;
    };
    str: string;
  };
  quote_token: {
    contract: string;
    symbol: {
      name: string;
      precision: number;
    };
    str: string;
  };
  min_buy: string;
  min_sell: string;
  frozen: number;
  last_price: number;
  volume24: number;
  volumeWeek: number;
  volumeMonth: number;
  change24: number;
  changeWeek: number;
}

export interface ICoinGeckoData {
  id: string;
  symbol: string;
  market_data: {
    current_price: {
      usd: number
    }
  }
}

export function useGetMarketAll(): UseQueryResult<Array<ICurrencyExchange>> {
  const alcorUrl = "https://wax.alcor.exchange/api/markets";
  
  return useQuery<Array<ICurrencyExchange>>({
    queryKey: `market`,
    queryFn: async () => {
      const res = await fetch(alcorUrl);
      const body = await res.json() as Array<ICurrencyExchange>;
      await updateWaxPrice(body);
      return body;
    },
  });
}

/**
 * Obtain updated Wax price in USD and replace it in provided exchange 
 * @param exchange 
 */
async function updateWaxPrice(exchange: Array<ICurrencyExchange>) {
  const coinGeckoUrl = "https://api.coingecko.com/api/v3/coins/wax?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false";
  const res = await fetch(coinGeckoUrl);
  const coinGeckoData = await res.json() as ICoinGeckoData;
  const waxPair = exchange.find(
    ({ quote_token, base_token }) =>
      quote_token.str === WAX && base_token.str === USDT
  );
  if (waxPair) {
    waxPair.last_price = coinGeckoData.market_data.current_price.usd;
  }
}

