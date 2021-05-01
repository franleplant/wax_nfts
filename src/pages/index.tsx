import React, { useEffect, useState } from "react";
import { PageProps, Link, graphql } from "gatsby";
import { Card, Row, Col, Table } from "antd";
import SEO from "../components/seo";
import { useGetMarketAll, ICurrencyExchange } from "../dal/currency";
import {
  getAetherInUSDT,
  getAllInUSDT,
  getWaxInUSDT,
} from "../domain/currency";
import Layout from "../components/Layout";
import Price from "../components/Price";
import RateForm from "../components/RateForm";
import AsyncManager from "../components/AsyncManager";
import { useAssets, ApiAsset } from "../dal/atomic";
import APY from "../components/APY";
import reportFuck from "../data/report.json";
import { IReportRow } from "../dal/report";
import Report from "../components/Report";

const report = reportFuck.slice(0, 2);

export interface IData {
  data: {
    site: {
      buildTime: string;
    };
  };
}

export default function Index(props: PageProps<IData>) {
  return (
    <Layout>
      <SEO />
      <AsyncManager queries={[useGetMarketAll()]}>
        {([currencyExchange]) => (
          <Content currencyExchange={currencyExchange} />
        )}
      </AsyncManager>
    </Layout>
  );
}

function Content(props: {
  currencyExchange: Array<ICurrencyExchange>;
}): JSX.Element {
  const aether = getAetherInUSDT(props.currencyExchange) || 0;
  const wax = getWaxInUSDT(props.currencyExchange)?.last_price || 0;
  const rates = getAllInUSDT(props.currencyExchange);

  const reportData: Array<IReportRow> = report;
  return (
    <>
      <Row justify="start" gutter={5}>
        <Col>
          <Card bordered style={{ maxWidth: "350px" }} title={"Rates"}>
            <Price price={rates.aether} quoteLabel="AETHER" baseLabel="USDT" />
            <Price price={rates.wax} quoteLabel="WAX" baseLabel="USDT" />
            <Price price={rates.waxon} quoteLabel="WAXON" baseLabel="USDT" />
            <Price price={rates.caponium} quoteLabel="CAPON" baseLabel="USDT" />
            <Price price={rates.wecanite} quoteLabel="WECAN" baseLabel="USDT" />
            <Price
              price={rates.enefterium}
              quoteLabel="ENEFT"
              baseLabel="USDT"
            />
          </Card>
        </Col>
        <Col>
          <Card
            bordered
            style={{ maxWidth: "350px" }}
            title={"Currency Converter"}
          >
            <RateForm currencyExchange={props.currencyExchange} />
          </Card>
        </Col>
        <Col>
          <Card bordered style={{ maxWidth: "350px" }} title={"APY"}>
            <APY currencyExchange={props.currencyExchange} />
          </Card>
        </Col>
      </Row>

      <Row>
        <Report data={reportData} />
      </Row>
    </>
  );
}

export const query = graphql`
  query buildTime {
    site {
      buildTime(formatString: "YYYY-MM-DD hh:mm a z")
    }
  }
`;
