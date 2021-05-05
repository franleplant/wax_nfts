import React, { useEffect, useMemo, useState } from "react";
import { Table } from "antd";
import { keyBy } from "lodash";
import { IReportRow } from "../../dal/report";
import { calcReportRow } from "../../domain/report";
import columns from "./columns";
import { useGetMarketAll } from "../../dal/currency";
import CurrencyExchangeContext from "./CurrencyExchangeContext";
import { useSales, Sale } from "../../dal/atomicmarket";
import "./styles.css";

export interface IProps {
  data: Array<IReportRow>;
}

const EMPTY_ARRAY: any = [];

export default function Report(props: IProps): JSX.Element {
  const { data: currencyExchange } = useGetMarketAll();

  const report = props.data;
  //console.log("original", report[0]);

  const saleIds = useSaleIds(report);

  // TODO typeinformation is outdated
  const { data: updatedSales } = useSales({
    params: { ids: saleIds },
    queryOptions: {
      refetchInterval: 2 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  });
  //console.log("updatedSales", updatedSales);

  let dataSource = useUpdateSales(report, updatedSales || EMPTY_ARRAY);
  //console.log("updated", dataSource2[0]);
  //const dataSource = dataSource2;
  ////const dataSource = report;
  //console.log("report index");
  ////console.log("updated", dataSource[0]);
  const params = useQueryParams();
  if (params.pure) {
    dataSource = report;
  }

  return (
    <div className="lif-report">
      <CurrencyExchangeContext.Provider value={currencyExchange || []}>
        <Table<IReportRow>
          size={"small"}
          dataSource={dataSource}
          columns={columns}
          style={{ width: "100%" }}
          rowKey={"template_id"}
          pagination={{
            defaultPageSize: 100,
            showTotal: (total, range) => `${total} items`,
          }}
        />
      </CurrencyExchangeContext.Provider>
    </div>
  );
}

export interface IQueryParams {
  pure?: boolean;
}

export function useQueryParams(): IQueryParams {
  const [params, setParams] = useState<IQueryParams>({});

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const newParams = new URLSearchParams(document.location.search);
    const newPure = newParams.get("pure") === "true";
    if (params.pure !== newPure) {
      setParams((prev) => ({ ...prev, pure: newPure }));
    }
  });

  return params;
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

// TODO recalc ratios apy etyc
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
