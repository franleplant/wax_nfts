import React from "react";
import { Layout } from "antd";
const { Header, Footer, Content } = Layout;

import "./main.css";

export interface IProps {
  children: JSX.Element | Array<JSX.Element> | string | null;
}

export default function CustomLayout({ children }: IProps): JSX.Element {
  return (
    <Layout>
      <Header>NFT!</Header>
      <Content className="content">{children}</Content>
      <Footer></Footer>
    </Layout>
  );
}
