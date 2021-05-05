import React, { useContext } from "react";
import { Tooltip } from "antd";
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
        <Stat title="Average Hourly Percentage Yield in USD">
          {`hpy ${avgYield.getHpyFormatted()} %`}
        </Stat>

        <Stat title="Average Reward to Price Ratio (RPR), the aether per hour that the asset generates divided by the average wax price">
          {`rpr ${avg.toFixed(2)}`}
        </Stat>

        <Stat title="Average Reward to Price Ratio (RPR), the aether per hour that the asset generates divided by the average wax price">
          {`prr ${(1 / avg).toFixed(2)}`}
        </Stat>
      </div>

      <div className="yield-row__apy">
        <Stat
          className="yield-row__apy__main"
          title="Average APY (anualized percentage yield) in USD using the average price of all assets being sold"
        >
          {`APY ${avgYield.getApyFormatted()}%`}
        </Stat>

        <div className="yield-row__apy__items">
          <Stat
            className="yield-row__apy__x"
            title="Minimum APY (using the highest asset price)"
          >
            {`min ${minYield.getApyFormatted()}%`}
          </Stat>
          <Stat
            className="yield-row__apy__x"
            title="Maximum APY (using the lowest asset price)"
          >
            {`max ${maxYield.getApyFormatted()}%`}
          </Stat>
        </div>
      </div>

      <Stat title="you will multiply your capital by x">
        {`you will ${avgYield.getXFormatted()} x your capital in a year`}
      </Stat>
      <Stat title="return on investment time">
        {`roi ${avgYield.getRoiFormatted()}`}
      </Stat>
    </div>
  );
}

export interface IStatProps {
  className?: string;
  title: string;
  children: JSX.Element | string;
}

export function Stat(props: IStatProps): JSX.Element {
  const trigger = ["hover", "focus", "click"];

  return (
    <Tooltip trigger={trigger} title={props.title}>
      <div title={props.title}>{props.children}</div>
    </Tooltip>
  );
}
