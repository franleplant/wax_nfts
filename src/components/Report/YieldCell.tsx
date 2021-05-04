import React, { useContext } from "react";
import { IReportRow } from "../../dal/report";
import { getYield } from "../../domain/currency";

import CurrencyExchangeContext from "./CurrencyExchangeContext";

export interface IProps {
  row: IReportRow;
}

export default function YieldCell(props: IProps): JSX.Element {
  const currencyExchange = useContext(CurrencyExchangeContext);

  const {
    avg_staking_price_ratio: avg,
    min_staking_price_ratio: min,
    max_staking_price_ratio: max,
  } = props.row;

  const avgYield = getYield(currencyExchange, avg);
  const minYield = getYield(currencyExchange, min);
  const maxYield = getYield(currencyExchange, max);

  return (
    <div>
      <div>{`avg APY ${avgYield.getApyFormatted()} %`}</div>
      <div>{`min APY ${minYield.getApyFormatted()} - max APY ${maxYield.getApyFormatted()}`}</div>
      <div>{`avg hourly yield ${avgYield.getHpyFormatted()} %`}</div>
      <div>{`avg aeth hour / wax ${avg}`}</div>
      <div>{`avg wax / aeth hour ${1 / avg}`}</div>
      <div>{`you will ${avgYield.getXFormatted()} x your capital in a year`}</div>
      <div>{`roi ${avgYield.getRoiFormatted()}`}</div>
    </div>
  );
}
