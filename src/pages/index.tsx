import React from "react";
import { PageProps, graphql } from "gatsby";
import { Card, Row, Col } from "antd";
import SEO from "../components/seo";
import { useGetMarketAll, ICurrencyExchange } from "../dal/currency";
import Layout from "../components/Layout";
import RateForm from "../components/RateForm";
import AsyncManager from "../components/AsyncManager";
import APY from "../components/APY";
import report from "../data/report.json";
import { IReportRow } from "../dal/report";
import Report from "../components/Report";
import PricesTable from "../components/PricesTable";

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
  const reportData: Array<IReportRow> = report;

  return (
    <>
      <Row justify="start" gutter={5}>
        <Col sm={24} lg={12}>
          <PricesTable currencyExchange={props.currencyExchange} />
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
