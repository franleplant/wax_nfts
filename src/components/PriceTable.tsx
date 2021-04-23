import React, { useState } from "react"
import { IPrice, EPriceKind, useGetPrice, useGetPriceAll } from "../dal/price"
import DateFromNow from "./DateFromNow"
import Loading from "./Loading"
import "./PriceTable.css"
import TrendIcon from "./TrendIcon"
import { formatPrice } from "../domain/price"

const LABELS: Record<EPriceKind, string> = {
  [EPriceKind.TURISTA]: "Dolar Turista",
  [EPriceKind.BLUE]: "Dolar Blue",
  [EPriceKind.LIQUI]: "Contado con Liqui",
  [EPriceKind.MEP]: "MEP",
  [EPriceKind.MAYORISTA]: "Oficial",
  [EPriceKind.OFICIAL]: "Dolar Futuro",
  [EPriceKind.FUTURO]: "Mayorista",
}

export interface IRow extends Partial<IPrice> {}

export default function PriceTable() {
  const all = useGetPriceAll({
    refetchInterval: 5 * 60 * 1000,
    refetchIntervalInBackground: true,
  })

  const rows = Object.values(EPriceKind)
    .map(kind => ({
      kind,
      label: LABELS[kind],
      ...all[kind].data,
      isLoading: all[kind].isLoading,
    }))
    // some rows should use the "valor" field
    .map(row => {
      if (
        row.kind === EPriceKind.TURISTA ||
        row.kind === EPriceKind.LIQUI ||
        row.kind === EPriceKind.MEP
      ) {
        row.compra = row.valor
        row.venta = row.valor
      }

      return row
    })

  return (
    <table className="price-table">
      <thead>
        <tr>
          <th>tipo</th>
          <th>compra</th>
          <th>venta</th>
          <th>variacion</th>
          <th>fecha</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(row => {
          const sellPrice = formatPrice(row.venta)
          const buyPrice = formatPrice(row.compra)

          let priceElement = (
            <>
              <td>{sellPrice}</td>
              <td>{buyPrice}</td>
            </>
          )
          // special cases for those exchanges that do not
          // have sell and buy price but a single price
          //if (row.valor) {
          //const price = formatPrice(row.valor)
          //priceElement = (
          //<td colSpan={2}>{price}</td>
          //)
          //}

          return (
            <tr key={row.kind}>
              <td className="small">
                {row.label} {row.isLoading && <Loading />}
              </td>
              {priceElement}
              <td>
                {row.variacion}
                <TrendIcon trend={row["class-variacion"]} />
              </td>
              <td className="small">
                {row.isLoading ? <Loading /> : <DateFromNow date={row.fecha} />}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
