import { useQuery, UseQueryResult } from "react-query";
import buildTimeReport from "../data/report.json";
import { Sale as AMSale, Price } from "./atomicmarket";

export type PriceFlat = {
  [K in keyof Price as `price.${K}`]: Price[K];
};

export type SaleSummary = Omit<
  AMSale,
  "assets" | "collection" | "collection_name" | "price"
> &
  PriceFlat & { staking_price_ratio: number; price_wax: number };

export interface IReportRow {
  template_id: string;
  name: string;
  collection: string;
  schema: string;
  max_suply: number;
  issued_supply: number;
  immutable_data: any;
  count: number;
  avg_price_wax: number;
  avg_staking_price_ratio: number;
  min_staking_price_ratio: number;
  max_staking_price_ratio: number;
  aether_hour: number;
  assets: Array<string>;
  sales: Array<SaleSummary>;
}

export interface IReportWrapper {
  report: Array<IReportRow>;
}

export function useGetReport(): UseQueryResult<Array<IReportRow>> {
  const URL =
    "https://lif-runtime.azurewebsites.net/api/report?code=ar6CDy2rR1zglx0jE95/4WsKA90ApIRwatleryR5liTFj7/CGaPVXg==";

  return useQuery<Array<IReportRow>>({
    queryKey: "report",
    queryFn: async () => {
      const res = await fetch(URL);
      const reportWrapper = (await res.json()) as IReportWrapper;
      return normalizeReport(reportWrapper).report;
    },
    initialData: normalizeReport(buildTimeReport as IReportWrapper).report,
  });
}

export function normalizeReport(reportWrapper: IReportWrapper): IReportWrapper {
  const report = reportWrapper.report.map((r) => ({
    ...r,
    avg_price_wax: Number(r.avg_price_wax),
  }));

  return {
    ...reportWrapper,
    report,
  };
}
