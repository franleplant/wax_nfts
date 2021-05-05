import React from "react";
import { ColumnsType } from "antd/lib/table";
import { IReportRow } from "../../dal/report";
import YieldCell from "./YieldCell";
import PriceCell from "./PriceCell";
import BuyCell from "./BuyCell";
import DataCell from "./DataCell";
import DetailsMobileCell from "./DetailsMobileCell";
import ImgCell from "./ImgCell";

const columns: ColumnsType<IReportRow> = [
  {
    title: "NFT",
    dataIndex: "immutable_data",
    className: "image",
    render: (_data: unknown, record: IReportRow): JSX.Element => (
      <ImgCell row={record} />
    ),
  },
  {
    title: "details",
    dataIndex: "template_id",
    responsive: ["xs"],
    className: "details",
    render: (value: string, record: IReportRow): JSX.Element => (
      <DetailsMobileCell row={record} />
    ),
  },
  //{
  //title: "collection and schema",
  //dataIndex: "template_id",
  //responsive: ["xs"],
  //render: (value: string, record: IReportRow): JSX.Element => {
  //return (
  //<dl>
  //<dt>schema</dt>
  //<dd>{record.schema}</dd>

  //<dt>collection</dt>
  //<dd>{record.collection}</dd>
  //</dl>
  //);
  //},
  //},
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
    className: "price",
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
    className: "aether_hour",
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
  {
    title: "Data",
    width: "100px",
    dataIndex: "immutable_data",
    responsive: ["md"],
    render: (value: any, record: IReportRow) => <DataCell row={record} />,
  },
];

export default columns;
