import * as React from "react"
import { Skeleton, Empty, notification } from "antd"
import { UseQueryResult } from "react-query"
//import useDeepCompareEffect from "use-deep-compare-effect";

interface IProps<TLoadedData extends Array<unknown>> {
  // Tell AsyncManager whether there isn't any data to show or not
  isEmpty?: (loadedData: TLoadedData) => boolean
  renderLoading?: () => JSX.Element
  renderEmpty?: () => JSX.Element
  queries: { [Index in keyof TLoadedData]: UseQueryResult<TLoadedData[Index]> }
  children: (loadedData: TLoadedData) => JSX.Element
}

// Simple container wrapper that knows how to deal with loading states and such.
// More features can and probably will be added to this such as handling error and
// other states too
export default function AsyncManager<
  T1,
  T2,
  T3,
  TLoadedData extends [T1, T2, T3]
>(props: IProps<TLoadedData>): JSX.Element | null
export default function AsyncManager<T1, T2, TLoadedData extends [T1, T2]>(
  props: IProps<TLoadedData>
): JSX.Element | null
export default function AsyncManager<T1, TLoadedData extends [T1]>(
  props: IProps<TLoadedData>
): JSX.Element | null
export default function AsyncManager<TLoadedData extends Array<unknown>>(
  props: IProps<TLoadedData>
): JSX.Element | null {
  const {
    queries,
    renderLoading = defaultRenderLoading,
    renderEmpty = defaultRenderEmpty,
    isEmpty = defaultIsEmpty,
  } = props

  const { loadedData, isFetching, hasError, errors } = useQueries<TLoadedData>(
    queries
  )

  if (isFetching) {
    return renderLoading()
  }

  if (hasError) {
    console.error("Async Manager errors", errors)
    return null
  }

  if (isEmpty(loadedData)) {
    return renderEmpty()
  }

  return props.children(loadedData)
}

// the default imple will check that every element in the list of
// loaded data is undefined
export function defaultIsEmpty(loadedData: Array<any>): boolean {
  return loadedData.every(element => !element)
}

export function defaultRenderLoading(): JSX.Element {
  return <Skeleton active={true} />
}

export function defaultRenderEmpty(): JSX.Element {
  return <Empty />
}

export interface IUseQueriesResult<TLoadedData> {
  loadedData: TLoadedData
  isFetching: boolean
  hasError: boolean
  errors: Array<unknown>
}

export function useQueries<TLoadedData>(
  queries: Array<UseQueryResult>
): IUseQueriesResult<TLoadedData> {
  // If any of the queries is in a loading status then we consider
  // that this is still loading
  const isFetching = queries.some(q => q.status === "loading")
  const hasError = queries.some(q => q.status === "error")
  const errors = queries.map(q => q.error)
  const loadedData = (queries.map(q => q.data) as any) as TLoadedData

  /*
  useDeepCompareEffect(() => {
    if (hasError) {
      errorMessages.filter(Boolean).forEach((msg) => {
        notification.error({
          message: "Fetching Error",
          description: `${msg.name}: ${msg.message}`,
        });
      });
    }
  }, [hasError, errors]);
       */

  return { loadedData, isFetching, hasError, errors }
}
