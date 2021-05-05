import React from "react";
import { PageProps, graphql } from "gatsby";
import { Row, Col } from "antd";
import SEO from "../components/seo";
import { useGetMarketAll, ICurrencyExchange } from "../dal/currency";
import { useGetReport } from "../dal/report";
import Layout from "../components/Layout";
//import RateForm from "../components/RateForm";
import AsyncManager from "../components/AsyncManager";
//import APY from "../components/APY";
//import report from "../data/report.json";
//import { IReportRow } from "../dal/report";
import Report from "../components/Report";
import PricesTable from "../components/PricesTable";
import moment from "moment";

export interface IData {
  site: {
    buildTime: string;
  };
}

export default function Index(props: PageProps<IData>): JSX.Element {
  return (
    <Layout>
      <p style={{ fontSize: "10px" }}>
        rendered on{" "}
        {moment(props.data?.site?.buildTime).format("YYYY-MM-DD HH:mm")}
      </p>
      <SEO />
      <AsyncManager queries={[useGetMarketAll(), useGetReport()]}>
        {([currencyExchange]) => (
          <>
            <Row justify="start">
              <Col xs={24} sm={24} lg={9} style={{ width: "100%" }}>
                <PricesTable currencyExchange={currencyExchange} />
              </Col>
            </Row>

            <Row>
              <Report />
            </Row>
          </>
        )}
      </AsyncManager>
    </Layout>
  );
}

export const query = graphql`
  query buildTime {
    site {
      buildTime
    }
  }
`;
