import React, { useEffect, useState } from "react"
import { PageProps, Link, graphql } from "gatsby"
import SEO from "../components/seo"
import { useGetMarketAll } from "../dal/market"
import { calcAetherUSDT } from "../domain/market"

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
      {isLoading ? "loading..." : `${calcAetherUSDT(data)} AETHER / USDT`}
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
