import React, { useEffect, useState } from "react"
import { PageProps, Link, graphql } from "gatsby"
import SEO from "../components/seo"
import { useGetMarketAll } from "../dal/market"
import { calcAetherUSDT } from "../domain/market"
import Price from "../components/Price"
import RateForm from "../components/RateForm"

export interface IData {
  data: {
    site: {
      buildTime: string
    }
  }
}

export default function Index(props: PageProps<IData>) {
  const { data, isLoading } = useGetMarketAll()

  return (
    <div>
      <SEO />
      {isLoading ? "loading..." : <Content price={calcAetherUSDT(data)} />}
    </div>
  )
}

function Content(props: { price: number }): JSX.Element {
  return (
    <div>
      <Price price={props.price} />
      <RateForm rate={1 / props.price} />
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
