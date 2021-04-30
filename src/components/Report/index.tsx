import React, { useEffect, useState, createContext } from "react"
import { Card, Row, Col, Table } from "antd"
import { IReportRow } from "../../dal/report"
import columns from "./columns"
import { ICurrencyExchange, useGetMarketAll } from "../../dal/currency"
import CurrencyExchangeContext from "./CurrencyExchangeContext"

export interface IProps {
  data: Array<IReportRow>
}

export default function Report(props: IProps): JSX.Element {
  const { data: currencyExchange } = useGetMarketAll()
  return (
    <CurrencyExchangeContext.Provider value={currencyExchange || []}>
      <Table<IReportRow>
        dataSource={props.data}
        columns={columns}
        style={{ width: "100%" }}
      />
    </CurrencyExchangeContext.Provider>
  )
}
