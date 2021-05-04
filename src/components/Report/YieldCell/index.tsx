import React, { useContext } from "react";
import { IReportRow } from "../../../dal/report";
import { getYield } from "../../../domain/currency";

import CurrencyExchangeContext from "../CurrencyExchangeContext";
import "./styles.css";

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
    <div className="yield-row">
      <div className="yield-row__rates">
        <div title="average hourly percentage yield">{`hpy ${avgYield.getHpyFormatted()} %`}</div>
        <div title="average aether hour per wax production (reward to price ratio)">{`rpr ${avg.toFixed(
          2
        )}`}</div>
        <div title="average wax per aether hour production (price to reward ratio)">{`prr ${(
          1 / avg
        ).toFixed(2)}`}</div>
      </div>

      <div className="yield-row__apy">
        <div
          className="yield-row__apy__main"
          title="average APY"
        >{`APY ${avgYield.getApyFormatted()}%`}</div>
        <div className="yield-row__apy__items">
          <div
            className="yield-row__apy__x"
            title="minimum APY"
          >{`min ${minYield.getApyFormatted()}%`}</div>
          <div
            className="yield-row__apy__x"
            title="maximum APY"
          >{`max ${maxYield.getApyFormatted()}%`}</div>
        </div>
      </div>

      <div title="you will multiply your capital by x">{`you will ${avgYield.getXFormatted()} x your capital in a year`}</div>
      <div title="return on investment time">{`roi ${avgYield.getRoiFormatted()}`}</div>
    </div>
  );
}
