import React from "react";
import { Table } from "antd";
import { getAllInUSDT } from "../../domain/currency";
import { ICurrencyExchange } from "../../dal/currency";

export interface IRow {
  label: string;
  price: number;
}

export interface IProps {
  currencyExchange: Array<ICurrencyExchange>;
}

export default function PricesTable(props: IProps): JSX.Element {
  const rates = getAllInUSDT(props.currencyExchange);

  const dataSource = Object.entries(rates).map(
    ([label, price]) => ({ label, price } as IRow)
  );

  return (
    <Table<IRow>
      dataSource={dataSource}
      columns={[
        {
          title: "Token",
          dataIndex: "label",
        },
        {
          title: "Price",
          dataIndex: "price",
          render: (value: number) => {
            return <span>{`$ ${value}`}</span>;
          },
        },
      ]}
    />
  );
}
