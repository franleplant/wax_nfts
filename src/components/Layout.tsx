import React from "react";
import { Layout, Typography } from "antd";
const { Header, Footer, Content } = Layout;
const { Title } = Typography;

import "./main.css";

export interface IProps {
  children: JSX.Element | Array<JSX.Element> | string | null;
}

export default function CustomLayout({ children }: IProps): JSX.Element {
  return (
    <Layout>
      <Header style={{ paddingTop: "10px", paddingBottom: "10px" }}>
        <Title level={2} style={{ color: "white" }}>
          NFT!
        </Title>
      </Header>
      <Content className="content">{children}</Content>
      <Footer></Footer>
    </Layout>
  );
}
