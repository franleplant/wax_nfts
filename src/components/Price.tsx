import React from "react";
import { Statistic } from "antd";

export interface IProps {
  price: number;
  quoteLabel: string;
  baseLabel: string;
}

export default function Price(props: IProps): JSX.Element {
  const price = props.price;
  return (
    <Statistic
      title={`${props.quoteLabel} / ${props.baseLabel}`}
      value={price}
      precision={8}
      valueStyle={{ color: "#0000FF" }}
      style={{ maxWidth: "350px", textAlign: "center" }}
    />
  );
}
