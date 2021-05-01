import React, { useMemo } from "react";
import { Card, Row, Col, Table } from "antd";
import { keyBy } from "lodash";
import { IReportRow } from "../../dal/report";
import { calcReportRow } from "../../domain/report";
import columns from "./columns";
import { ICurrencyExchange, useGetMarketAll } from "../../dal/currency";
import CurrencyExchangeContext from "./CurrencyExchangeContext";
import { useSales, Sale } from "../../dal/atomicmarket";

export interface IProps {
  data: Array<IReportRow>;
}

export default function Report(props: IProps): JSX.Element {
  const { data: currencyExchange } = useGetMarketAll();

  const saleIds = getSaleIds(props.data);

  // TODO typeinformation is outdated
  // TODO make this query refresh periodically
  const { data: updatedSales } = useSales({
    params: { ids: saleIds },
    queryOptions: {
      refetchInterval: 2 * 60 * 1000,
    },
  });

  const dataSource = updateSales(props.data, updatedSales || []);

  return (
    <CurrencyExchangeContext.Provider value={currencyExchange || []}>
      <Table<IReportRow>
        dataSource={dataSource}
        columns={columns}
        style={{ width: "100%" }}
      />
    </CurrencyExchangeContext.Provider>
  );
}

export function getSaleIds(report: Array<IReportRow>): Array<number> {
  const saleIds = useMemo(() => {
    const ids = [];
    for (const row of report) {
      for (const sale of row.sales) {
        ids.push(sale.sale_id);
      }
    }
    return ids;
  }, [report]);

  return saleIds;
}

// TODO recalc ratios apy etyc
export function updateSales(
  report: Array<IReportRow>,
  updatedSales: Array<Sale>
): Array<IReportRow> {
  const newSalesById = useMemo(() => keyBy(updatedSales, "sale_id"), [
    updatedSales,
  ]);

  return useMemo(
    () => report.map((report) => calcReportRow(report, newSalesById)),
    [report, updatedSales]
  );
}
