import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { Layout } from "antd"
const { Header, Footer, Sider, Content } = Layout

import "./main.css"

export default function CustomLayout({ children }: any) {
  return (
    <Layout>
      <Header>NFT!</Header>
      <Content className="content">{children}</Content>
      <Footer></Footer>
    </Layout>
  )
}
