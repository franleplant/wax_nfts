import React, { useEffect, useState } from "react"
import { PageProps, Link, graphql } from "gatsby"
import SEO from "../components/seo"
import { useGetMarketAll, IMarketData } from "../dal/market"
import { calcAetherUSDT } from "../domain/market"
import Layout from "../components/Layout"
import Price from "../components/Price"
import RateForm from "../components/RateForm"
import { Card } from "antd"
import AsyncManager from "../components/AsyncManager"

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
      <AsyncManager<[Array<IMarketData>]> queries={[useGetMarketAll()]}>
        {([marketData]) => <Content price={calcAetherUSDT(marketData)} />}
      </AsyncManager>
    </Layout>
  )
}

function Content(props: { price: number }): JSX.Element {
  return (
    <div>
      <Price price={props.price} />
      <Card style={{ maxWidth: "350px" }} title="AETHER USDT pricing" bordered>
        <RateForm rate={1 / props.price} quoteLabel="AETHER" baseLabel="USDT" />
      </Card>
    </div>
  )
}

export const query = graphql`
  query buildTime {
    site {
      buildTime(formatString: "YYYY-MM-DD hh:mm a z")
    }
  }
`
