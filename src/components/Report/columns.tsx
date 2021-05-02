import React from "react";
import { ColumnsType } from "antd/lib/table";
import { IReportRow, SaleSummary } from "../../dal/report";
import YieldCell from "./YieldCell";
import PriceCell from "./PriceCell";

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
  },
  {
    title: "Buy",
    dataIndex: "sales",
    render: (
      value: Array<SaleSummary> = [],
      _record: IReportRow
    ): JSX.Element => {
      return (
        <>
          {value.map((sale) => (
            <div key={sale.sale_id}>
              <a
                target="_blank"
                rel="noreferrer"
                href={`https://wax.atomichub.io/market/sale/${sale.sale_id}`}
              >
                {sale.sale_id}
              </a>
            </div>
          ))}
        </>
      );
    },
  },
];

export default columns;
