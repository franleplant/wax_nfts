import React from "react";
import { ColumnsType } from "antd/lib/table";
import { IReportRow } from "../../dal/report";
import YieldCell from "./YieldCell";
import PriceCell from "./PriceCell";
import BuyCell from "./BuyCell";

const columns: ColumnsType<IReportRow> = [
  {
    title: "NFT",
    dataIndex: "immutable_data",
    render: (data: any): JSX.Element => {
      const img = data.img;
      let isUrl = true;
      try {
        new URL(img);
      } catch (err) {
        isUrl = false;
      }

      const url = isUrl ? img : `https://ipfs.io/ipfs/${img}`;

      return <img src={url} style={{ width: "100px" }} />;
    },
  },
  {
    title: "template and name",
    dataIndex: "template_id",
    responsive: ["xs"],
    render: (value: string, record): JSX.Element => {
      return (
        <dl>
          <dt>template id</dt>
          <dd>{record.template_id}</dd>

          <dt>name</dt>
          <dd>{record.name}</dd>
        </dl>
      );
    },
  },
  {
    title: "collection and schema",
    dataIndex: "template_id",
    responsive: ["xs"],
    render: (value: string, record): JSX.Element => {
      return (
        <dl>
          <dt>schema</dt>
          <dd>{record.schema}</dd>

          <dt>collection</dt>
          <dd>{record.collection}</dd>
        </dl>
      );
    },
  },
  {
    title: "Template",
    dataIndex: "template_id",
    responsive: ["md"],
  },
  {
    title: "Name",
    dataIndex: "name",
    responsive: ["md"],
    //key: 'age',
  },
  {
    title: "Collection",
    dataIndex: "collection",
    responsive: ["md"],
  },
  {
    title: "Schema",
    dataIndex: "schema",
    responsive: ["md"],
  },
  {
    title: "Count",
    dataIndex: "count",
    responsive: ["md"],
  },
  {
    title: "Avg Price (WAX)",
    dataIndex: "avg_price_wax",
    render: (priceWax: number, record) => <PriceCell row={record} />,
  },
  {
    title: "Aether / Hour",
    dataIndex: "aether_hour",
    responsive: ["md"],
    render: (value: number): JSX.Element => {
      return <>{value.toFixed(2)}</>;
    },
  },
  {
    title: "Aether / Hour",
    dataIndex: "aether_hour",
    responsive: ["xs"],
    render: (value: number): JSX.Element => {
      return <>{`${value.toFixed(2)} aeth / hour`}</>;
    },
  },
  {
    title: "Yield",
    dataIndex: "avg_staking_price_ratio",
    className: "yield",
    render: (_value, record) => <YieldCell row={record} />,
  },
  {
    title: "Buy",
    dataIndex: "sales",
    width: "20%",
    render: (value: any, record: IReportRow) => <BuyCell row={record} />,
  },
];

export default columns;
