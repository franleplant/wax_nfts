import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import { QueryClient, QueryClientProvider } from "react-query"

import "./base.css"
import "./main.css"

import Header from "./Header"

const queryClient = new QueryClient()

export default function Layout({ children }: any) {
  return (
    <>
      <div>
        {/*
        <Header />
          */}
        <QueryClientProvider client={queryClient}>
          <main>{children}</main>
        </QueryClientProvider>
        <footer> </footer>
      </div>
    </>
  )
}
