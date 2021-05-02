import React from "react";
import { ColumnsType } from "antd/lib/table";
import { IReportRow } from "../../dal/report";
import YieldCell from "./YieldCell";
import PriceCell from "./PriceCell";
import BuyCell from "./BuyCell";

const columns: ColumnsType<IReportRow> = [
  {
    title: "Template",
    dataIndex: "template_id",
  },
  {
    title: "Img",
    dataIndex: "immutable_data",
    render: (data: any) => {
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
    title: "Name",
    dataIndex: "name",
    //key: 'age',
  },
  {
    title: "Collection",
    dataIndex: "collection",
  },
  {
    title: "Schema",
    dataIndex: "schema",
  },
  {
    title: "Count",
    dataIndex: "count",
  },
  {
    title: "Avg Price (WAX)",
    dataIndex: "avg_price_wax",
    render: (priceWax: number, record) => <PriceCell row={record} />,
  },
  {
    title: "Yield",
    dataIndex: "avg_staking_price_ratio",
    render: (_value, record) => <YieldCell row={record} />,
  },
  {
    title: "Aether / Hour",
    dataIndex: "aether_hour",
    render: (value: number) => {
      return <>{value.toFixed(2)}</>;
    },
  },
  {
    title: "Buy",
    dataIndex: "sales",
    width: "20%",
    render: (value: any, record: IReportRow) => <BuyCell row={record} />,
  },
];

export default columns;
