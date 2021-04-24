import React from "react"
import { Card } from "antd"
import { Sale } from "../dal/atomicmarket"

export interface IProps {
  sale: Sale
}

export default function AssetSale(props: IProps): JSX.Element {
  const { sale } = props

  // TODOs
  // - handle multiple assets in one sale or ignore this type of sales
  // - develop utility function that gets AETH staking value
  // -

  return (
    <Card
      hoverable
      style={{ width: 270 }}
      cover={
        <img
          src={`https://ipfs.io/ipfs/${sale.assets[0].data?.img}`}
          width={270}
        />
      }
    >
      <Card.Meta
        title={
          <a
            target="_blank"
            href={`https://wax.atomichub.io/market/sale/${sale.sale_id}`}
          >
            {sale.assets[0].name}
          </a>
        }
        description={
          <ul>
            <li>
              `Price:{" "}
              {sale.price.amount / Math.pow(10, sale.price.token_precision)}{" "}
              {sale.price.token_symbol}`
            </li>
            <li>`Sale ID: {sale.sale_id}`</li>
            <li>`Collection: {sale.collection.name}`</li>
          </ul>
        }
      ></Card.Meta>
    </Card>
  )
}
