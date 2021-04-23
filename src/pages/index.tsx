import React, { useEffect, useState } from "react"
import { PageProps, Link, graphql } from "gatsby"
import { Card, Row, Col } from "antd"
import SEO from "../components/seo"
import { useGetMarketAll, IMarketData } from "../dal/market"
import { getAetherInUSDT, getWaxInUSDT } from "../domain/market"
import Layout from "../components/Layout"
import Price from "../components/Price"
import RateForm from "../components/RateForm"
import AsyncManager from "../components/AsyncManager"
import { useAssets, ApiAsset } from "../dal/atomic"
import NFT from "../components/NFT"
import { useSales, Sale } from "../dal/atomicmarket"
import AssetSale from "../components/AssetSale"

export interface IData {
  data: {
    site: {
      buildTime: string
    }
  }
}

export default function Index(props: PageProps<IData>) {
  return (
    <Layout>
      <SEO />
      <AsyncManager queries={[useGetMarketAll(), useAssets(), useSales({
        collection: 'alien.worlds',
        page: 1,
        limit: 40
      })]}>
        {([marketData, assets, sales]) => (
          <Content marketData={marketData} assets={assets} sales={sales} />
        )}
      </AsyncManager>
    </Layout>
  )
}

function Content(props: {
  marketData: Array<IMarketData>
  assets: Array<ApiAsset>
  sales: Array<Sale>
}): JSX.Element {
  const aether = getAetherInUSDT(props.marketData) || 0
  const wax = getWaxInUSDT(props.marketData)?.last_price || 0
  return (
    <>
      <Row justify="start" gutter={5}>
        <Col>
          <Card
            bordered
            style={{ maxWidth: "350px" }}
            title={
              <Price price={aether} quoteLabel="AETHER" baseLabel="USDT" />
            }
          >
            <RateForm rate={aether} quoteLabel="AETHER" baseLabel="USDT" />
          </Card>
        </Col>
        <Col>
          <Card
            bordered
            style={{ maxWidth: "350px" }}
            title={<Price price={wax} quoteLabel="WAX" baseLabel="USDT" />}
          >
            <RateForm rate={wax} quoteLabel="WAX" baseLabel="USDT" />
          </Card>
        </Col>
      </Row>

      <h1>Sales</h1>

      <Row gutter={10}>
        {props.sales.map(sale => (
          <Col>
            <AssetSale key={sale.sale_id} sale={sale} />
          </Col>
        ))}
      </Row>

      {/* <Row gutter={10}>
        {props.assets.map(asset => (
          <Col>
            <NFT key={asset.asset_id} asset={asset} />
          </Col>
        ))}
      </Row> */}
    </>
  )
}

export const query = graphql`
  query buildTime {
    site {
      buildTime(formatString: "YYYY-MM-DD hh:mm a z")
    }
  }
`
