// TODO rename to currencyMarket
import { useQuery, UseQueryResult } from "react-query";

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

export function useGetMarketAll(): UseQueryResult<Array<ICurrencyExchange>> {
  const url = "https://wax.alcor.exchange/api/markets";

  return useQuery<Array<ICurrencyExchange>>({
    queryKey: `market`,
    queryFn: async () => {
      const res = await fetch(url);
      const body = await res.json();
      return body;
    },
  });
}
