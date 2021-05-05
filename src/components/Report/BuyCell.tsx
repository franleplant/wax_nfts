import React, { useContext } from "react";
import { Tag } from "antd";
import { IReportRow } from "../../dal/report";
import CurrencyExchangeContext from "./CurrencyExchangeContext";
import { getWaxInUSDT } from "../../domain/currency";
import { OutboundLink } from "gatsby-plugin-google-gtag";

// TODO abstract?
const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

export interface IProps {
  row: IReportRow;
}

export default function BuyCell(props: IProps): JSX.Element {
  const currencyExchange = useContext(CurrencyExchangeContext);

  const waxInUSDT = getWaxInUSDT(currencyExchange)?.last_price || 0;

  return (
    <div>
      {props.row.sales
        .sort((saleA, saleB) => saleB.price_wax - saleA.price_wax)
        .map((sale) => {
          // TODO abstract into domain/currency
          const amount = Number(sale["price.amount"]);
          const precision = sale["price.token_precision"];
          const priceWax = amount / Math.pow(10, precision);
          const priceUSDT = priceWax * waxInUSDT;
          return (
            <Tag key={sale.sale_id} color="magenta">
              <OutboundLink
                target="_blank"
                rel="noreferrer"
                href={`https://wax.atomichub.io/market/sale/${sale.sale_id}`}
                style={{ color: "inherit" }}
              >
                {`${priceWax.toFixed(2)} wax (${priceFormatter.format(
                  priceUSDT
                )})`}
              </OutboundLink>
            </Tag>
          );
        })}
    </div>
  );
}
