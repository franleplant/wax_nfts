import React from "react";
import { ColumnsType } from "antd/lib/table";
import { IReportRow, SaleSummary } from "../../dal/report";
import PriceCell from "./PriceCell";

const columns: ColumnsType<IReportRow> = [
  {
    title: "Template",
    dataIndex: "template_id",
    //key: 'name',
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
    dataIndex: "price_wax",
  },
  {
    title: "Yield",
    dataIndex: "avg_staking_price_ratio",
    render: (_value, record) => <PriceCell row={record} />,
  },
  {
    title: "Aether / Hour",
    dataIndex: "aether_hour",
  },
  {
    title: "Buy",
    dataIndex: "sales",
    render: (value: Array<SaleSummary> = [], _record): JSX.Element => {
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
