import React, { useEffect, useState } from "react"
import moment from "moment"
import "moment/locale/es"
import { useGetPrice, IPrice, EPriceKind } from "../dal/price"
import Loading from "./Loading"
import { QueryResult } from "react-query"
import DateFromNow from "./DateFromNow"
import TrendIcon from "./TrendIcon"
import { formatPrice } from "../domain/price"

export default function PriceLayout(props: any) {
  const queryResult = useGetPrice(EPriceKind.BLUE, {
    refetchInterval: 5 * 60 * 1000,
    refetchIntervalInBackground: true,
  })
  return (
    <div
      className={`[ card ] [ wrapper flow ] [ ${
        queryResult.isLoading ? "card__box_animation" : ""
      } ]`}
    >
      <Price {...queryResult} />
    </div>
  )
}

interface IProps extends QueryResult<IPrice> {}
//TODO brecha!
// TODO otros dolares
export function Price({ data: price, isLoading, error }: IProps) {
  if (isLoading && !price) {
    return (
      <div className="text-center">
        <Loading style={{ fontSize: "3rem" }} />
      </div>
    )
  }

  if (error) {
    return <>error.</>
  }

  const sellPrice = formatPrice(price.venta)
  const buyPrice = formatPrice(price.compra)

  return (
    <>
      <div>
        <h3 className="text-center">
          Dolar Blue <TrendIcon trend={price["class-variacion"]} />
        </h3>
        <div className="price__hero">{sellPrice}</div>
        <div className="[ price__details ] [ flex-box-row ]">
          <div className="[ price__mini ] [ text-center ]">
            <h6>Compra</h6>
            <div className="price__price_item">{sellPrice}</div>
          </div>
          <div className="[ price__mini ] [ text-center ]">
            <h6 className={price["class-variacion"]}>Variacion</h6>
            <div className="price__price_item">{price.variacion}</div>
          </div>
          <div className="[ price__mini ] [ text-center ]">
            <h6>Venta</h6>
            <div className="price__price_item">{buyPrice}</div>
          </div>
        </div>
      </div>

      <div className="card__footer text-center">
        <DateFromNow date={price.fecha} />
      </div>
    </>
  )
}
