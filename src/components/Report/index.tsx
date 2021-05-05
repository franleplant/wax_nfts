import React, { useEffect, useMemo, useState } from "react";
import { Table, Spin, Switch } from "antd";
import { keyBy } from "lodash";
import { IReportRow, useGetReport } from "../../dal/report";
import { calcReportRow } from "../../domain/report";
import columns from "./columns";
import { useGetMarketAll } from "../../dal/currency";
import CurrencyExchangeContext from "./CurrencyExchangeContext";
import { useSales, Sale } from "../../dal/atomicmarket";
import "./styles.css";

export interface IProps {}

const EMPTY_ARRAY: any = [];

export default function Report(_props: IProps): JSX.Element {
  const [pure, setPure] = useState(false);
  const { data: currencyExchange } = useGetMarketAll();

  const { data: report = [], isLoading: reportIsLoading } = useGetReport();

  const saleIds = useSaleIds(report);

  const { data: updatedSales, isLoading: salesIsLoading } = useSales({
    params: { ids: saleIds },
    queryOptions: {
      refetchInterval: 2 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  });

  let dataSource = useUpdateSales(report, updatedSales || EMPTY_ARRAY);
  if (pure) {
    dataSource = report;
  }

  return (
    <div className="lif-report">
      <div className="report-controls">
        <div className="report-controls__item">
          Pure Report
          <Switch checked={pure} onChange={() => setPure((pure) => !pure)} />
        </div>
        <div className="report-controls__item">
          Report {reportIsLoading ? <Spin /> : null}
        </div>
        <div className="report-controls__item">
          Sales {salesIsLoading ? <Spin /> : null}
        </div>
      </div>
      <CurrencyExchangeContext.Provider value={currencyExchange || []}>
        <Table<IReportRow>
          size={"small"}
          // we want to block the table when sales
          // are loading because that's what going to
          // verify what sales are still open
          loading={salesIsLoading}
          dataSource={dataSource}
          columns={columns}
          style={{ width: "100%" }}
          rowKey={"template_id"}
          pagination={{
            defaultPageSize: 100,
            showTotal: (total, _range) => `${total} items`,
          }}
        />
      </CurrencyExchangeContext.Provider>
    </div>
  );
}

export function useSaleIds(report: Array<IReportRow>): Array<number> {
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

export function useUpdateSales(
  report: Array<IReportRow>,
  updatedSales: Array<Sale>
): Array<IReportRow> {
  const newSalesById = useMemo(() => {
    return keyBy(updatedSales, "sale_id");
  }, [updatedSales]);

  return useMemo(() => {
    return (
      report
        .map((report) => calcReportRow(report, newSalesById))
        // remove sold out templates
        .filter((report) => report.sales.length > 0)
        // resort by highest yield
        .sort(
          (reportA, reportB) =>
            reportB.avg_staking_price_ratio - reportA.avg_staking_price_ratio
        )
    );
  }, [report, newSalesById]);
}
