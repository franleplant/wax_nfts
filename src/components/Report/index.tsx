import React, { useEffect, useState, createContext, useMemo } from "react";
import { Card, Row, Col, Table } from "antd";
import { IReportRow, SaleSummary } from "../../dal/report";
import columns from "./columns";
import { ICurrencyExchange, useGetMarketAll } from "../../dal/currency";
import CurrencyExchangeContext from "./CurrencyExchangeContext";
import { useQueries } from "react-query";
import { flatten, keyBy, omit } from "lodash";
import produce from "immer";
import { useSales, Sale } from "../../dal/atomicmarket";

export interface IProps {
  data: Array<IReportRow>;
}

export default function Report(props: IProps): JSX.Element {
  const { data: currencyExchange } = useGetMarketAll();

  const saleIds = getSaleIds(props.data);

  // TODO typeinformation is outdated
  // TODO make this query refresh periodically
  const { data: updatedSales } = useSales({ ids: saleIds } as any);

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

export function updateSales(
  report: Array<IReportRow>,
  updatedSales: Array<Sale>
): Array<IReportRow> {
  const newSalesById = useMemo(() => keyBy(updatedSales, "sale_id"), [
    updatedSales,
  ]);

  return useMemo(
    () =>
      produce(report, (report) => {
        for (const row of report) {
          row.sales = row.sales.map((oldSale) => {
            const newSale = newSalesById[oldSale.sale_id];
            // TODO abnstract as saleToSaleSummary
            return omit(newSale, [
              "collection",
              "collection_name",
              "assets",
            ]) as SaleSummary;
          });
        }
      }),
    [report, updatedSales]
  );
}
