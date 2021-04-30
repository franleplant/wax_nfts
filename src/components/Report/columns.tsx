import React from "react"
import { ColumnsType } from "antd/lib/table"
import { IReportRow } from "../../dal/report"
import PriceCell from "./PriceCell"

const columns: ColumnsType<IReportRow> = [
  {
    title: "Template",
    dataIndex: "template",
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
    dataIndex: "avg_price_wax",
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
    dataIndex: "sale_ids",
    render: (value: Array<string> = [], record) => {
      return (
        <>
          {value.map(saleId => (
            <div key={saleId}>
              <a
                target="_blank"
                href={`https://wax.atomichub.io/market/sale/${saleId}`}
              >
                {saleId}
              </a>
            </div>
          ))}
        </>
      )
    },
  },
]

export default columns
