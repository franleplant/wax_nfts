import React from "react"
import { Card } from "antd"
import { ApiAsset } from "../dal/atomic"

export interface IProps {
  asset: ApiAsset
}

export default function NFT(props: IProps): JSX.Element {
  const { asset } = props

  return (
    <Card
      hoverable
      style={{ width: 270 }}
      cover={
        <img
          src={`https://resizer.atomichub.io/images/v1/preview?ipfs=${asset.data?.img}&size=370`}
          width={270}
        />
      }
    >
      <Card.Meta
        title={asset.name}
        description={`collection ${asset.collection.name}`}
      ></Card.Meta>
    </Card>
  )
}
