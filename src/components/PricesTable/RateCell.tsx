import React, { useContext } from "react";
import { InputNumber } from "antd";
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
      style={{ width: "100%" }}
      value={ctx.form?.[row.label]}
      onChange={ctx.onChange(row.label)}
      precision={9}
    />
  );
}
