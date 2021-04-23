import React, { useEffect, useState } from "react"

export interface IProps {
  price: number
}

export default function Price(props: IProps): JSX.Element {
  return (
    <div>
      <div title="the price of aether in usdt">{`${props.price} AETHER / USDT`}</div>
      <div title="the price of usdt in aether">{`${
        1 / props.price
      } USDT / AETHER`}</div>
    </div>
  )
}
