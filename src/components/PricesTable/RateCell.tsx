import React, { useContext } from "react";
import { Button, Form, InputNumber } from "antd";
import { IRow } from "./index";
import RateContext from "./RateContext";

export interface IProps {
  row: IRow;
}

export default function RateCell({ row }: IProps): JSX.Element {
  const ctx = useContext(RateContext);

  return (
    <InputNumber
      size={"small"}
      style={{ width: "200px" }}
      value={ctx.form?.[row.label]}
      onChange={ctx.onChange(row.label)}
      precision={9}
    />
  );
}
