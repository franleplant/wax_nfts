import React, { useContext } from "react";
import { IReportRow } from "../../dal/report";
import { getWaxInUSDT } from "../../domain/currency";

import CurrencyExchangeContext from "./CurrencyExchangeContext";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 1,
});

export interface IProps {
  row: IReportRow;
}

export default function PriceCell(props: IProps): JSX.Element {
  const currencyExchange = useContext(CurrencyExchangeContext);

  const waxInUSDT = getWaxInUSDT(currencyExchange)?.last_price || 0;

  const priceWax = props.row.avg_price_wax;
  const priceUSDT = priceWax * waxInUSDT;

  return (
    <>
      {`${priceWax.toFixed(2)} wax`}
      {` `}
      {`(${priceFormatter.format(priceUSDT)})`}
    </>
  );
}
