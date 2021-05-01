import fetch from "cross-fetch";
import {
  Sale,
  SaleParams,
  SaleSort,
  SortOrder,
  SaleState,
  Price,
} from "atomicmarket/build/API/Explorer/Types";
import {
  useQuery,
  UseQueryResult,
  //useQueryClient,
  UseQueryOptions,
} from "react-query";
import { ExplorerApi } from "atomicmarket";

const URL = "https://wax.api.atomicassets.io";
const NAMESPACE = "atomicmarket";
const api = new ExplorerApi(URL, NAMESPACE, { fetch: fetch as any });

export { Sale, SaleParams, SaleSort, SortOrder, SaleState, Price };

const defaultSaleParams = {
  //state: [1],
  symbol: "WAX",
};

export interface IOptions {
  params?: SaleParams & { ids: Array<number> };
  page?: number;
  limit?: number;
  queryOptions?: UseQueryOptions<Array<Sale>, unknown, Array<Sale>>;
}

/**
 * Retrieve atomicmarket sales.
 * For full API documentation go to https://wax.api.atomicassets.io/atomicmarket/docs/swagger/
 * @param options filtering options
 * @returns resulting sales
 */
export function useSales(options?: IOptions): UseQueryResult<Array<Sale>> {
  const params = { ...defaultSaleParams, ...options?.params };
  const { page, limit, queryOptions } = options || {};

  //const queryClient = useQueryClient();
  const queryKey = `sales`;

  // TODO batch
  return useQuery<Array<Sale>>({
    queryKey,
    queryFn: async () => {
      const sales = await api.getSales(params, page, limit);
      return sales;
    },
    // TODO this fucking thing is breaking everything
    /*
    onSuccess: (newSales) => {
      queryClient.setQueryData(
        queryKey,
        produce<Array<Sale>>((oldSales) => {
          for (const newSale of newSales) {
            const index = oldSales.findIndex(
              (sale) => sale.sale_id === newSale.sale_id
            );
            if (!index) {
              continue;
            }
            oldSales[index] = newSale;
          }
        })
      );
    },
     */
    ...queryOptions,
  });
}
