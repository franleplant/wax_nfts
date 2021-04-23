import { useQuery, UseQueryResult } from "react-query"
import fetch from "cross-fetch"
import { ExplorerApi } from "atomicassets"
import { ApiAsset } from "atomicassets/build/API/Explorer/Types"

const URL = "https://wax.api.atomicassets.io"
const NAMESPACE = "atomicassets"
const api = new ExplorerApi(URL, NAMESPACE, { fetch: fetch as any })

export { ApiAsset }

// TODO paging
export function useAssets(): UseQueryResult<Array<ApiAsset>> {
  return useQuery<Array<ApiAsset>>({
    queryKey: `assets`,
    queryFn: async () => {
      const assets = await api.getAssets()
      return assets
    },
  })
}

//export interface IAssetResult {
//success: boolean
//query_time: number
//data: Array<IAsset>
//}
