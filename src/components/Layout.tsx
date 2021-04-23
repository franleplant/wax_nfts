import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import { QueryCache, ReactQueryCacheProvider } from "react-query"

import "./base.css"
import "./main.css"

import Header from "./Header"

const queryCache = new QueryCache()

export default function Layout({ children }: any) {
  return (
    <>
      <div>
        <Header />
        <ReactQueryCacheProvider queryCache={queryCache}>
          <main>{children}</main>
        </ReactQueryCacheProvider>
        <footer> </footer>
      </div>
    </>
  )
}
