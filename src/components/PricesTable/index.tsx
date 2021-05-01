import React from "react";
import { Table } from "antd";
import { getAllInUSDT } from "../../domain/currency";
import { ICurrencyExchange } from "../../dal/currency";
import WAX_ICON from "../../images/TOKEN_WAX.svg";
import AETHER_ICON from "../../images/TOKEN_AETHER.png";
import CAPONIUM_ICON from "../../images/TOKEN_CAPON.png";
import ENEFT_ICON from "../../images/TOKEN_ENEFT.png";
import WAXON_ICON from "../../images/TOKEN_WAXON.png";
import WECAN_ICON from "../../images/TOKEN_WECAN.png";

const Icons: Record<string, string> = {
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
  label: string;
  price: number;
  icon: string;
}

export interface IProps {
  currencyExchange: Array<ICurrencyExchange>;
}

export default function PricesTable(props: IProps): JSX.Element {
  const rates = getAllInUSDT(props.currencyExchange);

  const dataSource = Object.entries(rates).map(
    ([label, price]) => ({ label, price, icon: Icons[label] } as IRow)
  );

  return (
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
      ]}
    />
  );
}
