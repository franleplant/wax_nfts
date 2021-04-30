import React, { useEffect, useState } from "react"
import { Card, Row, Col, Table } from "antd"
import { IReportRow } from "../../dal/report"
import columns from "./columns"

export interface IProps {
  data: Array<IReportRow>
}

export default function Report(props: IProps): JSX.Element {
  return <Table<IReportRow> dataSource={props.data} columns={columns} />
}
