import fetch from "cross-fetch"
import {
  Sale,
  SaleSort,
  SortOrder,
} from "atomicmarket/build/API/Explorer/Types"
import { useQuery, UseQueryResult } from "react-query"
import { ExplorerApi } from "atomicmarket"

const URL = "https://wax.api.atomicassets.io"
const NAMESPACE = "atomicmarket"
const api = new ExplorerApi(URL, NAMESPACE, { fetch: fetch as any })

export { Sale }

/**
 * Retrieve atomicmarket sales.
 * For full API documentation go to https://wax.api.atomicassets.io/atomicmarket/docs/swagger/
 * @param options filtering options
 * @returns resulting sales
 */
export function useSales(options: {
  collection: string
  search?: string
  page: 1
  limit: 40
}): UseQueryResult<Array<Sale>> {
  return useQuery<Array<Sale>>({
    queryKey: `sales`,
    queryFn: async () => {
      const sales = await api.getSales(
        {
          state: [1],
          collection_name: options.collection,
          // template_id,
          // schema_name,
          //match: options.search ? options.search : undefined, // FIXME must not be sent when not used
          sort: SaleSort.Price,
          order: SortOrder.Asc,
          symbol: "WAX",
        },
        options.page,
        options.limit
      )
      return sales
    },
  })
}
