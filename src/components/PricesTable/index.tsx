import React, { useState } from "react";
import { Table } from "antd";
import { getAllInUSDT, IRates, Token, convert } from "../../domain/currency";
import { ICurrencyExchange } from "../../dal/currency";
import USDT_ICON from "../../images/TOKEN_USDT.png";
import WAX_ICON from "../../images/TOKEN_WAX.svg";
import AETHER_ICON from "../../images/TOKEN_AETHER.png";
import CAPONIUM_ICON from "../../images/TOKEN_CAPON.png";
import ENEFT_ICON from "../../images/TOKEN_ENEFT.png";
import WAXON_ICON from "../../images/TOKEN_WAXON.png";
import WECAN_ICON from "../../images/TOKEN_WECAN.png";
import RateCell from "./RateCell";
import RateHead from "./RateHead";
import RateContext, { IRateContext, IForm } from "./RateContext";

const Icons: Record<Token, string> = {
  usdt: USDT_ICON,
  wax: WAX_ICON,
  aether: AETHER_ICON,
  caponium: CAPONIUM_ICON,
  enefterium: ENEFT_ICON,
  waxon: WAXON_ICON,
  wecanite: WECAN_ICON,
};

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 6,
});

export interface IRow {
  label: Token;
  price: number;
  icon: string;
}

export interface IProps {
  currencyExchange: Array<ICurrencyExchange>;
}

export default function PricesTable(props: IProps): JSX.Element {
  const rates = getAllInUSDT(props.currencyExchange);
  const [form, setForm] = useState<IForm>(calcNewState(rates, Token.USDT, 1));

  const dataSource = Object.entries(rates).map(
    ([label, price]) => ({ label, price, icon: Icons[label as Token] } as IRow)
  );

  // TODO we might want to put calcNewState into a hook for perf
  const context = {
    form,
    onChange: (tokenFrom) => (newValue) => {
      setForm(calcNewState(rates, tokenFrom, newValue));
    },
    reset: () => {
      setForm(calcNewState(rates, Token.USDT, 1));
    },
  } as IRateContext;

  return (
    <RateContext.Provider value={context}>
      <Table<IRow>
        size={"small"}
        pagination={false}
        dataSource={dataSource}
        rowKey="label"
        columns={[
          {
            title: "Token",
            dataIndex: "label",
            render: (label: string, row) => {
              return (
                <div>
                  <img
                    src={row.icon}
                    style={{ width: "15px", marginRight: "5px" }}
                  />
                  {label}
                </div>
              );
            },
          },
          {
            title: "Price",
            dataIndex: "price",
            render: (value: number) => {
              return <span>{priceFormatter.format(value)}</span>;
            },
          },
          {
            title: () => <RateHead />,
            dataIndex: "price",
            render: (_value: number, row) => <RateCell row={row} />,
          },
        ]}
      />
    </RateContext.Provider>
  );
}

function calcNewState(
  rates: IRates,
  tokenFrom: Token,
  newValue: number
): IForm {
  const valueInUsdt = rates[tokenFrom] * newValue;

  const form = { [tokenFrom]: newValue } as IForm;
  Object.values(Token)
    .filter((tokenTo) => tokenTo !== tokenFrom)
    .forEach((tokenTo) => {
      form[tokenTo] = convert(valueInUsdt, tokenTo, rates);
    });

  return form;
}
