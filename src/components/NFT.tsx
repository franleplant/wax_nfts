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
        <img src={`https://ipfs.io/ipfs/${asset.data?.img}`} width={270} />
      }
    >
      <Card.Meta
        title={<a href="#">asset.name</a>}
        description={`collection ${asset.collection.name}`}
      ></Card.Meta>
    </Card>
  )
}
