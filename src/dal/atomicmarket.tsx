import fetch from "cross-fetch";
import PQueue from "p-queue";
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
import { chunk, flatten } from "lodash";

const URL = "https://wax.api.atomicassets.io";
const NAMESPACE = "atomicmarket";
const api = new ExplorerApi(URL, NAMESPACE, { fetch: fetch as any });

export { Sale, SaleParams, SaleSort, SortOrder, SaleState, Price };

export function range(to: number): Array<number> {
  return "x"
    .repeat(to)
    .split("")
    .map((_, index) => index);
}

const defaultSaleParams = {
  //state: [1],
  symbol: "WAX",
};

export interface IOptions {
  params?: SaleParams & { ids: Array<number> };
  page?: number;
  limit?: number;
  batchFetchPages?: boolean;
  batchMaxPages?: number;
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
  const { page, limit, queryOptions, batchFetchPages, batchMaxPages = 100 } =
    options || {};

  //const queryClient = useQueryClient();
  const queryKey = `sales`;

  // TODO batch
  return useQuery<Array<Sale>>({
    queryKey,
    queryFn: async () => {
      // TODO probably this should be in another query custom hook
      // and query key, etc
      // TODO use PQueue here too to avoid doing too many requests at the same time
      if (params.ids) {
        // 100 because that is the max amount of results per page the api
        const idsPerPage = chunk(params.ids, 100);
        const salesPages = await Promise.all(
          idsPerPage.map((pageIds) => {
            console.log("pageIds", pageIds);
            return api.getSales({ ...params, ids: pageIds }, 1, 100);
          })
        );

        return flatten(salesPages);
      }

      if (!batchFetchPages) {
        return api.getSales(params, page, limit);
      }

      const queue = new PQueue({ concurrency: 10 });
      let lastPage: number | undefined;

      const fetchPageThunks = range(batchMaxPages).map(
        (pageNumber) => async () => {
          try {
            // IF we already reached the last page then simply skip
            // fetching lastPage + i pages and return an empty array
            if (lastPage === pageNumber) {
              return [];
            }
            const salesPage = await api.getSales(params, pageNumber, limit);
            if (salesPage.length === 0) {
              lastPage = pageNumber;
            }
            return salesPage;
          } catch (err) {
            console.warn(
              `error while fetching sales page ${pageNumber}`,
              params
            );
            return [];
          }
        }
      );

      const salesPages = await queue.addAll(fetchPageThunks);

      return flatten(salesPages);
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
