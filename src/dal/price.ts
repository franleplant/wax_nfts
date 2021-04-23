import { useQuery, QueryResult, QueryConfig } from "react-query"

export interface IPrice {
  // "184,00"
  compra: string
  venta: string
  // "26\/10\/2020 - 16:21"
  fecha: string
  // "-2,56%"
  variacion: string
  // this replaces compra y venta when there's no compra o vent
  valor?: string
  "class-variacion": "up" | "down" | "equal"
}

export enum EPriceKind {
  TURISTA = "dolarturista",
  BLUE = "informal",
  LIQUI = "liqui",
  MEP = "mep",
  MAYORISTA = "mayorista",
  OFICIAL = "oficial",
  FUTURO = "dolarfuturo",
}

const URLS: Record<EPriceKind, string> = {
  [EPriceKind.TURISTA]: "https://mercados.ambito.com//dolarturista/variacion",
  [EPriceKind.BLUE]: "https://mercados.ambito.com//dolar/informal/variacion",
  [EPriceKind.LIQUI]: "https://mercados.ambito.com//dolarrava/cl/variacion",
  [EPriceKind.MEP]: "https://mercados.ambito.com//dolarrava/mep/variacion",
  [EPriceKind.MAYORISTA]:
    "https://mercados.ambito.com//dolar/mayorista/variacion",
  [EPriceKind.OFICIAL]: "https://mercados.ambito.com//dolar/oficial/variacion",
  [EPriceKind.FUTURO]: "https://mercados.ambito.com//dolarfuturo/variacion",
}

export function useGetPrice(
  kind: EPriceKind,
  config?: QueryConfig<IPrice>
): QueryResult<IPrice> {
  const url = URLS[kind]

  return useQuery<IPrice>({
    queryKey: `price/${kind}`,
    queryFn: async () => {
      const res = await fetch(url)
      const body = await res.json()
      return body
    },
    config,
  })
}

export function useGetPriceAll(
  config?: QueryConfig<IPrice>
): Record<EPriceKind, QueryResult<IPrice>> {
  const turista = useGetPrice(EPriceKind.TURISTA, config)
  const blue = useGetPrice(EPriceKind.BLUE, config)
  const liqui = useGetPrice(EPriceKind.LIQUI, config)
  const mep = useGetPrice(EPriceKind.MEP, config)
  const mayorista = useGetPrice(EPriceKind.MAYORISTA, config)
  const oficial = useGetPrice(EPriceKind.OFICIAL, config)
  const futuro = useGetPrice(EPriceKind.FUTURO, config)

  return {
    [EPriceKind.TURISTA]: turista,
    [EPriceKind.BLUE]: blue,
    [EPriceKind.LIQUI]: liqui,
    [EPriceKind.MEP]: mep,
    [EPriceKind.MAYORISTA]: mayorista,
    [EPriceKind.OFICIAL]: oficial,
    [EPriceKind.FUTURO]: futuro,
  }
}
